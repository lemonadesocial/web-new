import { z } from 'zod';
import orgs from 'open-graph-scraper';

import { getMintNftData } from '$lib/services/lemonhead';
import { calculateLookHash, getFinalTraits, validateTraits, type Trait } from '$lib/services/lemonhead/core';

import { publicProcedure, router } from './trpc';
import lemonheads, { BuildQueryParams } from './lemonheads';

export const appRouter = router({
  ping: publicProcedure.query(async () => {
    return 'pong';
  }),
  lemonheads: {
    layers: publicProcedure
      .input(
        z
          .object({
            limit: z.number().optional(),
            page: z.number().optional(),
            traits: z.any(),
          })
          .optional(),
      )
      .query(async ({ input }) => {
        const { data } = await lemonheads.getLayers(input as BuildQueryParams);
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
    colorSet: publicProcedure.query(async () => {
      const { data } = await lemonheads.getColorSet();
      return data;
    }),
  },
  openGraph: {
    extractUrl: publicProcedure.input(z.object({ url: z.string().optional() })).query(async ({ input }) => {
      if (!input.url) return { error: null, result: null, html: null };

      const userAgent = 'MyBot';
      // 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36';

      try {
        const { error, result, html } = await orgs({
          url: input.url,
          fetchOptions: { headers: { 'user-agent': userAgent } },
        });

        return { error, result, html };
      } catch (error) {
        return { error, result: null, html: null };
      }
    }),
  },
  validateNft: publicProcedure.input(z.object({ traits: z.any() })).mutation(async ({ input }) => {
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
