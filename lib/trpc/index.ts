import { z } from 'zod';
import orgs from 'open-graph-scraper';

import { getMintNftData } from '$lib/services/lemonhead';
import { calculateLookHash, Filter, getFinalTraits, validateTraits, type Trait } from '$lib/services/lemonhead/core';
import { getMintLemonadePassportData } from '$lib/services/passports/lemonade';
import { getMintZuGramaPassportImage } from '$lib/services/passports/zugrama';

import { publicProcedure, router } from './trpc';
import lemonheads, { BuildQueryParams } from './lemonheads';
import { LemonHeadsLayer } from './lemonheads/types';
import { request } from '$lib/services/nft/admin';
import { pinata } from '$lib/utils/pinata';

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
    random: publicProcedure.input(z.any()).mutation(async ({ input }) => {
      return lemonheads.getRandomLayers(input as Filter[]) as unknown as LemonHeadsLayer[];
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
  mintPassport: publicProcedure
    .input(
      z.object({
        wallet: z.string(),
        lemonadeUsername: z.string().optional(),
        fluffleTokenId: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { wallet, lemonadeUsername, fluffleTokenId } = input;
      return getMintLemonadePassportData(wallet, lemonadeUsername, fluffleTokenId);
    }),
  zugrama: {
    getImage: publicProcedure
      .input(
        z.object({
          avatarImageUrl: z.string().optional(),
          username: z.string().optional(),
        }),
      )
      .mutation(async ({ input }) => {
        const { avatarImageUrl, username } = input;
        return getMintZuGramaPassportImage(avatarImageUrl, username);
      }),
  },
  usernameApproval: publicProcedure
    .input(z.object({ username: z.string(), tokenUri: z.string(), wallet: z.string() }))
    .output(
      z.object({
        signature: z.string(),
        price: z.string(),
        currency: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const res = await request<{ signature: string; price: string; currency: string; }>(
        `/lemonade-username/approval`,
        'POST',
        input,
      );

      if (!res) throw new Error('An error occurred while fetching the approval signature.');

      return res;
    }),
  uploadUsernameMetadata: publicProcedure
    .input(z.object({ username: z.string() }))
    .output(z.object({ tokenUri: z.string() }))
    .mutation(async ({ input }) => {
      const { username } = input;
      const metadata = {
        name: username,
        description: 'Lemonade Username',
        attributes: [
          {
            trait_type: 'Created Date',
            display_type: 'date',
            value: Date.now(),
          },
          {
            trait_type: 'Length',
            display_type: 'number',
            value: username.length,
          },
        ],
      };

      const metadataBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
      const metadataFile = new File([metadataBlob], 'metadata.json', { type: 'application/json' });

      const { cid: metadataCid } = await pinata.upload.public.file(metadataFile);
      const tokenUri = `ipfs://${metadataCid}`;

      return { tokenUri };
    }),
});

export type AppRouter = typeof appRouter;
