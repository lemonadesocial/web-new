import { z } from 'zod';
import { getMintNftData } from '$lib/services/lemonhead';
import { calculateLookHash, getFinalTraits, validateTraits, type Trait } from '$lib/services/lemonhead/core';

import { publicProcedure, router } from './trpc';
import lemonheads from './lemonheads';

export const appRouter = router({
  ping: publicProcedure.query(async () => {
    return 'pong';
  }),
  lemonheads: {
    layers: publicProcedure
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
        const { data } = await lemonheads.getLayers(input);
        return data;
      }),
    bodies: publicProcedure.query(async () => {
      const { data } = await lemonheads.getBodies();
      return data;
    }),
    defaultSet: publicProcedure.query(async () => {
      const { data } = await lemonheads.getDefaultSet();
      return data;
    }),
  },
  validateNft: publicProcedure
    .input(z.object({ traits: z.any() }))
    .mutation(async ({ input }) => {
      const { traits } = input;
      
      validateTraits(traits as Trait[]);
      const finalTraits = getFinalTraits(traits as Trait[]);
      const lookHash = calculateLookHash(finalTraits);
      
      return { lookHash };
    }),
  mintNft: publicProcedure
    .input(z.object({ wallet: z.string(), traits: z.any(), sponsor: z.string().optional() }))
    .mutation(async ({ input }) => {
      const { wallet, traits, sponsor } = input;
      return getMintNftData(traits, wallet, sponsor);
    }),
});

export type AppRouter = typeof appRouter;
