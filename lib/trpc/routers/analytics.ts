import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { router, protectedProcedure } from '../trpc';
import { prisma } from '$lib/prisma';
import type { Prisma } from '../../../src/generated/prisma/client';

/** MongoDB ObjectId: 24-char lowercase hex */
const mongoId = z.string().regex(/^[a-f0-9]{24}$/, 'Invalid ObjectId format');

async function assertSpaceAdmin(kratosId: string, spaceId: string) {
  const admin = await prisma.spaceAdmin.findUnique({
    where: { mongoSpaceId_kratosId: { mongoSpaceId: spaceId, kratosId } },
  });
  if (!admin) throw new TRPCError({ code: 'FORBIDDEN' });
}

async function assertEventOrganizer(kratosId: string, eventId: string) {
  const org = await prisma.eventOrganizer.findUnique({
    where: { mongoEventId_kratosId: { mongoEventId: eventId, kratosId } },
  });
  if (!org) throw new TRPCError({ code: 'FORBIDDEN' });
}

export const analyticsRouter = router({
  // AI Usage Analytics — queries partitioned table via $queryRaw (@@ignore model)
  getStandUsage: protectedProcedure
    .input(
      z.object({
        standId: mongoId,
        startDate: z.string().datetime(),
        endDate: z.string().datetime(),
        limit: z.number().min(1).max(1000).default(100),
        offset: z.number().min(0).default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      await assertSpaceAdmin(ctx.user.kratosId, input.standId);
      return prisma.$queryRaw`
        SELECT
          id, stand_id, user_id, request_id, model,
          input_tokens, output_tokens, total_tokens,
          total_cost_usd, credits_used, feature,
          latency_ms, created_at
        FROM ai.usage_logs
        WHERE stand_id = ${input.standId}
          AND created_at >= ${new Date(input.startDate)}::timestamptz
          AND created_at <= ${new Date(input.endDate)}::timestamptz
        ORDER BY created_at DESC
        LIMIT ${input.limit} OFFSET ${input.offset}
      `;
    }),

  // Credit Transactions — uses Prisma model (not partitioned)
  getCreditTransactions: protectedProcedure
    .input(
      z.object({
        standId: mongoId,
        limit: z.number().min(1).max(100).default(50),
        cursor: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      await assertSpaceAdmin(ctx.user.kratosId, input.standId);
      const items = await prisma.aiCreditTransaction.findMany({
        where: { standId: input.standId },
        orderBy: { createdAt: 'desc' },
        take: input.limit + 1,
        ...(input.cursor ? { cursor: { id: input.cursor }, skip: 1 } : {}),
      });

      let nextCursor: string | undefined;
      if (items.length > input.limit) {
        const nextItem = items.pop();
        nextCursor = nextItem?.id;
      }

      return { items, nextCursor };
    }),

  // Event Guest List — JOIN with annotations
  getEventGuests: protectedProcedure
    .input(
      z.object({
        eventId: mongoId,
        search: z.string().optional(),
        status: z.enum(['approved', 'declined', 'pending']).optional(),
        limit: z.number().min(1).max(200).default(50),
        offset: z.number().min(0).default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      await assertEventOrganizer(ctx.user.kratosId, input.eventId);

      const where: Prisma.EventGuestWhereInput = {
        mongoEventId: input.eventId,
      };

      if (input.status) {
        where.rsvpStatus = input.status;
      }

      if (input.search) {
        where.OR = [
          { guestName: { contains: input.search, mode: 'insensitive' } },
          { guestEmail: { contains: input.search, mode: 'insensitive' } },
        ];
      }

      const [items, total] = await Promise.all([
        prisma.eventGuest.findMany({
          where,
          include: { annotation: true },
          orderBy: { createdAt: 'desc' },
          take: input.limit,
          skip: input.offset,
        }),
        prisma.eventGuest.count({ where }),
      ]);

      return { items, total };
    }),

  // Space Subscribers — JOIN with annotations
  getSpaceSubscribers: protectedProcedure
    .input(
      z.object({
        spaceId: mongoId,
        search: z.string().optional(),
        limit: z.number().min(1).max(200).default(50),
        offset: z.number().min(0).default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      await assertSpaceAdmin(ctx.user.kratosId, input.spaceId);

      const where: Prisma.SpaceSubscriberWhereInput = {
        mongoSpaceId: input.spaceId,
      };

      if (input.search) {
        where.OR = [
          { memberName: { contains: input.search, mode: 'insensitive' } },
          { memberEmail: { contains: input.search, mode: 'insensitive' } },
        ];
      }

      const [items, total] = await Promise.all([
        prisma.spaceSubscriber.findMany({
          where,
          include: { annotation: true },
          orderBy: { joinedAt: 'desc' },
          take: input.limit,
          skip: input.offset,
        }),
        prisma.spaceSubscriber.count({ where }),
      ]);

      return { items, total };
    }),

  // Guest Annotation (write — organizer-owned)
  annotateGuest: protectedProcedure
    .input(
      z.object({
        guestId: z.string().uuid(),
        eventId: mongoId,
        tags: z.array(z.string()).optional(),
        notes: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await assertEventOrganizer(ctx.user.kratosId, input.eventId);

      // Verify the guest belongs to this event (prevents IDOR)
      const guest = await prisma.eventGuest.findUnique({
        where: { id: input.guestId },
        select: { mongoEventId: true },
      });
      if (!guest || guest.mongoEventId !== input.eventId) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Guest not found for this event' });
      }

      return prisma.guestAnnotation.upsert({
        where: { eventGuestId: input.guestId },
        create: {
          eventGuestId: input.guestId,
          tags: input.tags ?? [],
          notes: input.notes,
          updatedBy: ctx.user.kratosId,
        },
        update: {
          ...(input.tags !== undefined && { tags: input.tags }),
          ...(input.notes !== undefined && { notes: input.notes }),
          updatedBy: ctx.user.kratosId,
        },
      });
    }),

  // Event Analytics (materialized view)
  getEventAnalytics: protectedProcedure
    .input(z.object({ eventId: mongoId }))
    .query(async ({ ctx, input }) => {
      await assertEventOrganizer(ctx.user.kratosId, input.eventId);
      const rows = await prisma.$queryRaw<Record<string, unknown>[]>`
        SELECT * FROM public.event_analytics
        WHERE mongo_event_id = ${input.eventId}
      `;
      return rows[0] ?? null;
    }),

  // Space Analytics (materialized view)
  getSpaceAnalytics: protectedProcedure
    .input(z.object({ spaceId: mongoId }))
    .query(async ({ ctx, input }) => {
      await assertSpaceAdmin(ctx.user.kratosId, input.spaceId);
      const rows = await prisma.$queryRaw<Record<string, unknown>[]>`
        SELECT * FROM public.space_analytics
        WHERE mongo_space_id = ${input.spaceId}
      `;
      return rows[0] ?? null;
    }),

  // API Daily Usage (materialized view)
  getApiUsage: protectedProcedure
    .input(z.object({ spaceId: mongoId }))
    .query(async ({ ctx, input }) => {
      await assertSpaceAdmin(ctx.user.kratosId, input.spaceId);
      return prisma.$queryRaw<Record<string, unknown>[]>`
        SELECT * FROM api.daily_api_usage
        WHERE space_id = ${input.spaceId}
        ORDER BY day DESC
        LIMIT 90
      `;
    }),

  // API Quota
  getApiQuota: protectedProcedure
    .input(z.object({ spaceId: mongoId, period: z.string() }))
    .query(async ({ ctx, input }) => {
      await assertSpaceAdmin(ctx.user.kratosId, input.spaceId);
      return prisma.apiQuotaUsage.findUnique({
        where: { spaceId_period: { spaceId: input.spaceId, period: input.period } },
      });
    }),
});
