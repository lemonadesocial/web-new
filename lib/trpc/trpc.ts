import { initTRPC, TRPCError } from '@trpc/server';

export interface TRPCContext {
  user: { kratosId: string; email?: string } | null;
}

const t = initTRPC.context<TRPCContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.user?.kratosId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({ ctx: { user: ctx.user as { kratosId: string; email?: string } } });
});

export async function createContext({ req }: { req: Request }): Promise<TRPCContext> {
  const cookie = req.headers.get('cookie') ?? '';

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_KRATOS_PUBLIC_URL}/sessions/whoami`, {
      headers: { cookie },
    });

    if (!response.ok) return { user: null };

    const session = await response.json();
    return {
      user: {
        kratosId: session.identity?.id,
        email: session.identity?.traits?.email,
      },
    };
  } catch {
    return { user: null };
  }
}
