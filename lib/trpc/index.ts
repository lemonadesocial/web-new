import { z } from 'zod';
import lemonheads from './lemonheads';

import { publicProcedure, router } from './trpc';

export const appRouter = router({
  ping: publicProcedure.query(async () => {
    return 'pong';
  }),
  bodyBase: publicProcedure
    .input(
      z
        .object({ offset: z.number().optional(), limit: z.number().optional(), where: z.string().optional() })
        .optional(),
    )
    .query(async (params) => {
      const { data } = await lemonheads.getBody({
        limit: params?.input?.limit || 100,
        offset: params.input?.offset || 0,
        where: params.input?.where,
      });

      return data;
    }),
  accessories: publicProcedure
    .input(
      z
        .object({ offset: z.number().optional(), limit: z.number().optional(), where: z.string().optional() })
        .optional(),
    )
    .query(async (params) => {
      const { data } = await lemonheads.getAccessories({
        limit: params?.input?.limit || 100,
        offset: params.input?.offset || 0,
        where: params.input?.where,
      });

      return data;
    }),
});

export type AppRouter = typeof appRouter;
