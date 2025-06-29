import { z } from 'zod';

import { publicProcedure, router } from './trpc';
import lemonheads from './lemonheads';
import { getPreSelect } from './lemonheads/preselect';

export const appRouter = router({
  ping: publicProcedure.query(async () => {
    return 'pong';
  }),
  bodyBase: publicProcedure
    .input(
      z
        .object({
          offset: z.number().optional(),
          limit: z.number().optional(),
          where: z.string().optional(),
          viewId: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      const { data } = await lemonheads.getBody({
        limit: input?.limit || 100,
        offset: input?.offset || 0,
        where: input?.where,
        viewId: input?.viewId,
      });

      return data;
    }),
  accessories: publicProcedure
    .input(
      z
        .object({
          offset: z.number().optional(),
          limit: z.number().optional(),
          where: z.string().optional(),
          viewId: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ input }) => {
      const { data } = await lemonheads.getAccessories({
        limit: input?.limit || 100,
        offset: input?.offset || 0,
        where: input?.where,
        viewId: input?.viewId,
      });

      return data;
    }),
  preselect: publicProcedure.input(z.object({ gender: z.string(), size: z.string() })).query(async ({ input }) => {
    const { data: dataPreSelect } = await lemonheads.getAccessories({ viewId: 'vwziaxm5nfh9652q', limit: 100 });
    return dataPreSelect.list;
    // const preselect = dataPreSelect.list;
    // return getPreSelect({ preselect, ...input });
  }),
});

export type AppRouter = typeof appRouter;
