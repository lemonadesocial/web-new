import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { ethers } from 'ethers';

import { ListChainsDocument } from '$lib/graphql/generated/backend/graphql';
import { ERC721Contract } from '$lib/utils/crypto';
import { getClient } from '$lib/graphql/request';
import { ASSET_PREFIX } from '$lib/utils/constants';

const fetchFont = (url: string) => {
  return fetch(new URL(url)).then((res) => res.arrayBuffer());
};

const fetchChain = async () => {
  const client = getClient();
  const { data } = await client.query({ query: ListChainsDocument });
  return data?.listChains?.find((i) => i.vinyl_nation_passport_contract_address);
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
    const contractAddress = chain.vinyl_nation_passport_contract_address;

    if (!contractAddress) {
      return new Response('Vinyl nation contract address not set', { status: 400 });
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
          backgroundImage: `url('${ASSET_PREFIX}/assets/images/share-vinyl-nation-passport.png')`,
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

        <div style={{ display: 'flex', position: 'absolute', bottom: 80, left: 150 }}>
          <p style={{ fontSize: 80, fontFamily: 'Bungee Regular', color: '#FFF', margin: 0, padding: 0 }}>{tokenId}</p>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1080,
      fonts: [
        {
          name: 'Bungee Regular',
          data: await fetchFont(`${ASSET_PREFIX}/assets/fonts/Bungee-Regular.ttf`),
          style: 'normal',
        },
      ],
    },
  );
}
