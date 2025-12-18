import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
// import { ethers } from 'ethers';

import { ListChainsDocument } from '$lib/graphql/generated/backend/graphql';
// import { ERC721Contract } from '$lib/utils/crypto';
import { getClient } from '$lib/graphql/request';
import { PASSPORT_CHAIN_ID } from '$lib/components/features/passport/mint/utils';
import { ASSET_PREFIX } from '$lib/utils/constants';

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

  // if (!tokenId) {
  //   return new Response(`Bad Request: Token ID not provided`, { status: 400 });
  // }
  //
  // const chain = await fetchChain();
  //
  // if (!chain) {
  //   return new Response(`Error: Chain does not support!`, { status: 400 });
  // }
  //
  // let image;
  //
  // try {
  //   const contractAddress = chain.festival_nation_passport_contract_address;
  //
  //   if (!contractAddress) {
  //     return new Response('Festival nation contract address not set', { status: 400 });
  //   }
  //
  //   const provider = new ethers.JsonRpcProvider(chain.rpc_url);
  //   const contract = ERC721Contract.attach(contractAddress).connect(provider);
  //
  //   const tokenUri = await contract.getFunction('tokenURI')(tokenId);
  //   const res = await fetch(tokenUri);
  //   const data = await res.json();
  //   image = data.image;
  // } catch (err: any) {
  //   return new Response(err.message || 'Error: Something went wrong!', { status: 500 });
  // }

  // if (!image) {
  //   return new Response('Passport image not found', { status: 404 });
  // }
  //

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundImage: `url('${ASSET_PREFIX}/assets/images/share-passport-bg.png')`,
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
              style={{
                fontSize: 40,
                fontFamily: 'Bungee Regular',
                color: 'rgba(255, 255, 255)',
                margin: 0,
                padding: 0,
              }}
            >
              Festival NATION
            </p>
          </div>
          <LemonadeLogo />
        </div>

        {/* <img src={image} /> */}

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <p
            style={{
              fontSize: 56,
              fontFamily: 'Bungee Regular',
              color: 'rgba(255, 255, 255, 0.80)',
              margin: 0,
              padding: 0,
            }}
          >
            Citizen
          </p>
          <p style={{ fontSize: 80, fontFamily: 'Bungee Regular', color: '#FFF', margin: 0, padding: 0 }}>#{tokenId}</p>
        </div>
      </div>
    ),
    {
      width: 1032,
      height: 1032,
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

function LemonadeLogo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M28.1667 34C30.9281 34 33.1667 36.2386 33.1667 39C33.1667 41.7614 30.9281 44 28.1667 44C25.4052 44 23.1667 41.7614 23.1667 39C23.1667 36.2386 25.4052 34 28.1667 34ZM11.5 21.5C15.6421 21.5 19 24.8579 19 29C19 33.1421 15.6421 36.5 11.5 36.5C7.35786 36.5 4 33.1421 4 29C4 24.8579 7.35786 21.5 11.5 21.5ZM32.75 4C38.9632 4 44 9.0368 44 15.25C44 21.4632 38.9632 26.5 32.75 26.5C26.5368 26.5 21.5 21.4632 21.5 15.25C21.5 9.0368 26.5368 4 32.75 4Z"
        fill="white"
      />
    </svg>
  );
}
