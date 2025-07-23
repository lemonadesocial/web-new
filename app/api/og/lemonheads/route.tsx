import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { fetchAccount } from '@lens-protocol/client/actions';
import { ethers } from 'ethers';
import { PublicClient, evmAddress, mainnet, testnet } from '@lens-protocol/client';
import request from 'graphql-request';

import { ASSET_PREFIX } from '$lib/utils/constants';
import { ListChainsDocument } from '$lib/graphql/generated/backend/graphql';
import { LEMONHEAD_CHAIN_ID } from '$lib/components/features/lemonheads/utils';
import { ERC721Contract } from '$lib/utils/crypto';

const fetchFont = (url: string) => {
  return fetch(new URL(url)).then((res) => res.arrayBuffer());
};

const APP_ENV = process.env.APP_ENV;
const url =
  APP_ENV === 'production'
    ? 'https://backend.lemonade.social/graphql'
    : 'https://backend.staging.lemonade.social/graphql';
const fetchChain = async () => {
  const res = await request({ url, document: ListChainsDocument });
  return res.listChains?.find((i) => i.chain_id === LEMONHEAD_CHAIN_ID);
};

/**
 * WARN: all params are required
 * @description api support generate image after mint
 *
 * 1. fetch and find chain
 * 2. fetch contract address - extract image data from uri
 * 3. fetch lens account - username, bio, etc.
 * 4. generate final image
 *
 */
export async function GET(req: NextRequest) {
  console.log(process.env.APP_ENV);

  const searchParams = req.nextUrl.searchParams;
  const tokenId = searchParams.get('tokenId') || '';
  const address = searchParams.get('address') || '';

  if (!tokenId || !address) {
    return new Response(`Error: Bad Request!`, { status: 400 });
  }

  const chain = await fetchChain();

  if (!chain) {
    return new Response(`Error: Chain does not support!`, { status: 400 });
  }

  let username, bio, image;

  try {
    const contractAddress = chain.lemonhead_contract_address;

    if (!contractAddress) {
      return new Response('LemonheadNFT contract address not set', { status: 400 });
    }

    const provider = new ethers.JsonRpcProvider(chain.rpc_url);
    const contract = ERC721Contract.attach(contractAddress).connect(provider);

    const tokenUri = await contract.getFunction('tokenURI')(tokenId);
    console.log(tokenId);
    const res = await fetch(tokenUri);
    const data = await res.json();
    image = data.image;

    const client = PublicClient.create({
      environment: process.env.APP_ENV === 'production' ? mainnet : testnet,
    });

    const result = await fetchAccount(client, { address: evmAddress(address) });

    if (result.isErr()) {
      return new Response(`Error: Not found!`, { status: 404 });
    }

    const account = result.value;
    username = account?.username?.localName;
    bio = account?.metadata?.bio;
  } catch (err) {
    console.log(err);
    return new Response(`Error: Something went wrong!`, { status: 500 });
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          height: '100%',
          width: '100%',
          flexDirection: 'column',
        }}
      >
        <img src={`${ASSET_PREFIX}/assets/images/mint-cover.png`} style={{ position: 'absolute', inset: 0 }} />

        <div style={{ display: 'flex', flex: 1, justifyContent: 'center', gap: 105, paddingTop: 88 }}>
          {image ? (
            <img src={image} style={{ width: 454, height: 454 }} />
          ) : (
            <div style={{ width: 454, height: 454 }} />
          )}

          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, color: 'white', maxWidth: 466 }}>
            {!username ? (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <img src={`${ASSET_PREFIX}/assets/images/logo-lemonheads.svg`} width={466} />
                <p
                  style={{
                    fontSize: 48,
                    lineHeight: '60px',
                    letterSpacing: 3,
                    color: '#BCFA24',
                    fontFamily: 'SpaceGrotesk-Bold',
                  }}
                >
                  #{tokenId}
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                <p
                  style={{
                    fontSize: 48,
                    alignSelf: 'stretch',
                    lineHeight: '120%',
                    fontFamily: 'SpaceGrotesk-Bold',
                    marginBottom: 0,
                    marginTop: 0,
                  }}
                >
                  {username}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img src={`${ASSET_PREFIX}/assets/images/logo-lemonheads.svg`} height={20} />
                  <p
                    style={{
                      fontSize: 29,
                      lineHeight: '120%',
                      letterSpacing: 3,
                      color: '#BCFA24',
                      fontFamily: 'SpaceGrotesk-Bold',
                    }}
                  >
                    #{tokenId}
                  </p>
                </div>
              </div>
            )}

            <p
              style={{
                fontSize: 36,
                paddingBlock: 24,
                fontFamily: 'SpaceGrotesk-Regular',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                display: '-webkit-box',
                lineClamp: 5,
                '-webkit-line-clamp': 5,
                '-webkit-box-orient': 'vertical',
              }}
            >
              {bio || 'A customizable onchain identity made for creators, by creators.'}
            </p>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'SpaceGrotesk-Regular',
          data: await fetchFont(`${process.env.NEXT_PUBLIC_ASSET_PREFIX}/assets/fonts/SpaceGrotesk-Regular.otf`),
          style: 'normal',
        },
        {
          name: 'SpaceGrotesk-Bold',
          data: await fetchFont(`${process.env.NEXT_PUBLIC_ASSET_PREFIX}/assets/fonts/SpaceGrotesk-Bold.otf`),
          style: 'normal',
        },
      ],
    },
  );
}
