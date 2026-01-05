import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { ethers } from 'ethers';

import { ListChainsDocument } from '$lib/graphql/generated/backend/graphql';
import { ERC721Contract } from '$lib/utils/crypto';
import { getClient } from '$lib/graphql/request';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { PASSPORT_CHAIN_ID } from '$lib/components/features/passports/utils';

const fetchFont = (url: string) => {
  return fetch(new URL(url)).then((res) => res.arrayBuffer());
};

const fetchChain = async () => {
  const client = getClient();
  const { data } = await client.query({ query: ListChainsDocument });
  return data?.listChains?.find((i) => i.chain_id === PASSPORT_CHAIN_ID);
};

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const tokenId = searchParams.get('tokenId');

  if (!tokenId) {
    return new Response(`Bad Request: Token ID not provided`, { status: 400 });
  }

  const chain = await fetchChain();

  if (!chain) {
    return new Response(`Error: Chain does not support!`, { status: 400 });
  }

  let image;

  try {
    const contractAddress = chain.zugrama_passport_contract_address;

    if (!contractAddress) {
      return new Response('LemonheadPassort contract address not set', { status: 400 });
    }

    const provider = new ethers.JsonRpcProvider(chain.rpc_url);
    const contract = ERC721Contract.attach(contractAddress).connect(provider);

    const tokenUri = await contract.getFunction('tokenURI')(tokenId);
    const res = await fetch(tokenUri);
    const data = await res.json();
    image = data.image;
  } catch (err: any) {
    return new Response(err.message || 'Error: Something went wrong!', { status: 500 });
  }

  if (!image) {
    return new Response('Passport image not found', { status: 404 });
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundImage: `url('${ASSET_PREFIX}/assets/images/share-zugrama-passport.png')`,
          padding: '86px',
          width: '100%',
          height: '100%',
          borderRadius: '24px',
          borderTop: '2px solid rgba(255, 255, 255, 0.56)',
          borderRight: '2px solid rgba(255, 255, 255, 0.56)',
          borderBottom: '4px solid rgba(255, 255, 255, 0.56)',
          borderLeft: '2px solid rgba(255, 255, 255, 0.56)',
          overflow: 'hidden',
        }}
      >
        <img src={image} style={{ marginTop: 100 }} />

        <div style={{ display: 'flex', position: 'absolute', bottom: 90, left: 160 }}>
          <p style={{ fontSize: 90, fontFamily: 'Syne Bold', color: '#FFF', margin: 0, padding: 0 }}>{tokenId}123</p>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1080,
      fonts: [
        {
          name: 'Syne SemiBold',
          data: await fetchFont(`${ASSET_PREFIX}/assets/fonts/Syne-SemiBold.ttf`),
          style: 'normal',
        },
        {
          name: 'Syne Regular',
          data: await fetchFont(`${ASSET_PREFIX}/assets/fonts/Syne-Regular.ttf`),
          style: 'normal',
        },
        // {
        //   name: 'Syne Tactile',
        //   data: await fetchFont(`${ASSET_PREFIX}/assets/fonts/SyneTactile-Regular.ttf`),
        //   style: 'normal',
        // },
      ],
    },
  );

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundImage: `url(${ASSET_PREFIX}/assets/images/share-zugrama-passport-bg.png)`,
          padding: '64px',
          width: '100%',
          height: '100%',
          borderRadius: '24px',
          borderTop: '2px solid rgba(255, 255, 255, 0.56)',
          borderRight: '2px solid rgba(255, 255, 255, 0.56)',
          borderBottom: '4px solid rgba(255, 255, 255, 0.56)',
          borderLeft: '2px solid rgba(255, 255, 255, 0.56)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex' }}>
            <p
              style={{ fontSize: 40, fontFamily: 'Syne Tactile', color: 'rgba(255, 255, 255)', margin: 0, padding: 0 }}
            >
              Zu-Grāma
            </p>
          </div>
          <LemonadeLogo />
        </div>

        <img src={image} />

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <p
            style={{
              fontSize: 56,
              fontFamily: 'Syne Regular',
              color: 'rgba(255, 255, 255, 0.80)',
              margin: 0,
              padding: 0,
            }}
          >
            Citizen
          </p>
          <p style={{ fontSize: 80, fontFamily: 'Syne SemiBold', color: '#FFF', margin: 0, padding: 0 }}>#{tokenId}</p>
        </div>
      </div>
    ),
    {
      width: 1032,
      height: 1032,
      fonts: [
        {
          name: 'Syne SemiBold',
          data: await fetchFont(`${ASSET_PREFIX}/assets/fonts/Syne-SemiBold.ttf`),
          style: 'normal',
        },
        {
          name: 'Syne Regular',
          data: await fetchFont(`${ASSET_PREFIX}/assets/fonts/Syne-Regular.ttf`),
          style: 'normal',
        },
        {
          name: 'Syne Tactile',
          data: await fetchFont(`${ASSET_PREFIX}/assets/fonts/SyneTactile-Regular.ttf`),
          style: 'normal',
        },
      ],
    },
  );
}
