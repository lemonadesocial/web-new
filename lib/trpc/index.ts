import { z } from 'zod';
import orgs from 'open-graph-scraper';
import { match } from 'ts-pattern';
import net from 'net';
import { lookup } from 'dns/promises';
import { isPrivateIP } from 'range_check';

import { getMintNftData } from '$lib/services/lemonhead';
import { calculateLookHash, Filter, getFinalTraits, validateTraits, type Trait } from '$lib/services/lemonhead/core';
import { getMintLemonadePassportData, getMintPassportImage } from '$lib/services/passports/lemonade';
import { getMintZuGramaPassportImage } from '$lib/services/passports/zugrama';

import { publicProcedure, router } from './trpc';
import lemonheads, { BuildQueryParams } from './lemonheads';
import { LemonHeadsLayer } from './lemonheads/types';
import { getMintVinylNationPassportImage } from '$lib/services/passports/vinyl-nation';
import { getMintDripNationPassportImage } from '$lib/services/passports/drip-nation';
import { getMintFestivalNationPassportImage } from '$lib/services/passports/festival-nation';
import { request } from '$lib/services/nft/admin';
import { uploadUsernameMetadata } from '$lib/services/lemonade-username';
import { getAlzenaWorldPassportImage } from '$lib/services/passports/alzena-world';

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
      if (!input.url) return { error: 'Invalid URL', result: null, html: null };

      try {
        const url = new URL(input.url);
        const host = url.hostname;

        const errorMessage = 'The address is not allowed';

        if (net.isIP(host)) {
          console.log('Literal IP addresses are not allowed.');
          return { error: errorMessage, result: null, html: null };
        }

        const { address } = await lookup(host);

        if (isPrivateIP(address)) {
          return { error: errorMessage, result: null, html: null };
        }

        const userAgent = 'MyBot';
        // 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36';

        const { error, result, html } = await orgs({
          url: url.href,
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
  // TODO: check and remove this func after test dynamic mint passport
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
  passport: {
    getImage: publicProcedure
      .input(
        z.object({
          provider: z.string(),
          avatarImageUrl: z.string().optional(),
          username: z.string().optional(),
        }),
      )
      .query(async ({ input }) => {
        const { avatarImageUrl, username, provider } = input;

        return match(provider)
          .with('mint', () => getMintPassportImage(avatarImageUrl, username))
          .with('zugrama', () => getMintZuGramaPassportImage(avatarImageUrl, username))
          .with('vinyl-nation', () => getMintVinylNationPassportImage(avatarImageUrl, username))
          .with('festival-nation', () => getMintFestivalNationPassportImage(avatarImageUrl, username))
          .with('drip-nation', () => getMintDripNationPassportImage(avatarImageUrl, username))
          .with('alzena-world', () => getAlzenaWorldPassportImage(avatarImageUrl, username))
          .otherwise(() => {});
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
      const res = await request<{ signature: string; price: string; currency: string }>(
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

      return await uploadUsernameMetadata(username);
    }),
});

export type AppRouter = typeof appRouter;
