import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { fetchAccount } from '@lens-protocol/client/actions';
import { ethers } from 'ethers';
import { PublicClient, evmAddress, mainnet, testnet } from '@lens-protocol/client';

import { ListChainsDocument } from '$lib/graphql/generated/backend/graphql';
import { LEMONHEAD_CHAIN_ID, LEMONHEAD_COLORS } from '$lib/components/features/lemonheads/mint/utils';
import { ERC721Contract } from '$lib/utils/crypto';
import { getClient } from '$lib/graphql/request';

const fetchFont = (url: string) => {
  return fetch(new URL(url)).then((res) => res.arrayBuffer());
};

const fetchChain = async () => {
  const client = getClient();
  const { data } = await client.query({ query: ListChainsDocument });
  return data?.listChains?.find((i) => i.chain_id === LEMONHEAD_CHAIN_ID);
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
  const searchParams = req.nextUrl.searchParams;
  const tokenId = searchParams.get('tokenId') || '';
  const address = searchParams.get('address') || '';
  const color = searchParams.get('color') || 'violet';
  const portrait = searchParams.get('portrait') === 'true' ? true : false;
  const download = searchParams.get('download') === 'true' ? true : false;

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
    const res = await fetch(tokenUri);
    const data = await res.json();
    image = data.image;

    const client = PublicClient.create({
      environment: process.env.NEXT_PUBLIC_APP_ENV === 'production' ? mainnet : testnet,
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

  const props = { color, image, portrait, username, tokenId, bio };

  return new ImageResponse(download ? <DownloadImageLink {...props} /> : <PreviewImageLink {...props} />, {
    width: download ? 1920 : 1200,
    height: download ? 1080 : 630,
    fonts: [
      {
        name: 'ClashDisplay-Bold',
        data: await fetchFont(`${process.env.NEXT_PUBLIC_ASSET_PREFIX}/assets/fonts/ClashDisplay-Bold.ttf`),
        style: 'normal',
      },
      {
        name: 'GeneralSans-Medium',
        data: await fetchFont(`${process.env.NEXT_PUBLIC_ASSET_PREFIX}/assets/fonts/GeneralSans-Medium.ttf`),
        style: 'normal',
      },
    ],
  });
}

function PreviewImageLink({ color, image, portrait, username, tokenId, bio }: any) {
  return (
    <div
      style={{
        padding: '64px 72px',
        display: 'flex',
        height: '100%',
        width: '100%',
        flexDirection: 'column',
        background: LEMONHEAD_COLORS[color]?.bg,
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          left: 0,
          height: 164,
          background: LEMONHEAD_COLORS[color]?.overlay,
        }}
      />

      <div style={{ display: 'flex', flexDirection: 'row', gap: 96 }}>
        {image ? (
          <div
            style={{
              display: 'flex',
              backgroundImage: `url(${image})`,
              backgroundRepeat: 'no-repeat',
              width: 502,
              height: 502,
              border: '2px solid #000',
              boxShadow: '-6px 9px 0 #000',
              backgroundPosition: portrait ? '-75% -10%' : '',
              backgroundSize: portrait ? '250% 250%' : '502px 502px',
            }}
          ></div>
        ) : (
          <div style={{ width: 502, height: 502, backgroundColor: '#000', boxShadow: '-6px 9px 0 #000' }} />
        )}

        <div style={{ display: 'flex', flexDirection: 'column', width: 466 }}>
          <div style={{ display: 'flex', color: 'white', flexDirection: 'column', gap: 32, flex: 1 }}>
            {!username ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  fontFamily: 'ClashDisplay-Variable',
                  fontSize: 72,
                  textShadow: '-6px 9px 0 #000',
                  fontWeight: 700,
                  WebkitTextStrokeColor: '#000',
                  WebkitTextStrokeWidth: 2,
                  lineHeight: '110%',
                }}
              >
                <span>LemonHead</span>
                <span>#{tokenId}</span>
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <p
                  style={{
                    fontFamily: 'ClashDisplay-Variable',
                    fontSize: 72,
                    textShadow: '-6px 9px 0 #000',
                    fontWeight: 700,
                    WebkitTextStrokeColor: '#000',
                    WebkitTextStrokeWidth: 2,
                    lineHeight: '110%',
                    width: '100%',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {username}
                </p>

                <div style={{ display: 'flex' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '8px 24px',
                      backgroundColor: LEMONHEAD_COLORS[color]?.fg,
                      borderRadius: 9999,
                      fontFamily: 'GeneralSans-Medium',
                      fontSize: 24,
                      fontWeight: 500,
                    }}
                  >
                    LemonHead #{tokenId}
                  </div>
                </div>
              </div>
            )}

            <p
              style={{
                fontSize: 32,
                paddingBlock: 24,
                lineHeight: '140%',
                fontFamily: 'GeneralSans-Medium',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                display: '-webkit-box',
                color: '#000',
                lineClamp: 4,
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 4,
                wordBreak: 'break-all',
                overflowWrap: 'break-word',
              }}
            >
              {bio || 'Citizen of the United Stands of Lemonade - a nation shaped by creators and communities.'}
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <UnitedStandLogo color={LEMONHEAD_COLORS[color]?.fg} />
            <LemonHeadLogo color={LEMONHEAD_COLORS[color]?.fg} />
          </div>
        </div>
      </div>
    </div>
  );
}

function DownloadImageLink({ color, image, portrait, username, tokenId, bio }: any) {
  return (
    <div
      style={{
        padding: '120px 120px 130px 120px',
        display: 'flex',
        height: '100%',
        width: '100%',
        flexDirection: 'column',
        background: LEMONHEAD_COLORS[color]?.bg,
        position: 'relative',
      }}
    >
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          bottom: 0,
          right: 0,
          left: 0,
          height: 288,
          zIndex: 0,
          background: LEMONHEAD_COLORS[color]?.overlay,
          justifyContent: 'flex-end',
          padding: '0px 130px',
        }}
      />

      <div style={{ display: 'flex', gap: 132 }}>
        <div style={{ display: 'flex' }}>
          {image ? (
            <div
              style={{
                display: 'flex',
                backgroundImage: `url(${image})`,
                backgroundRepeat: 'no-repeat',
                width: 840,
                height: 840,
                border: '4px solid #000',
                boxShadow: '-6px 9px 0 #000',
                backgroundPosition: portrait ? '-75% -10%' : '',
                backgroundSize: portrait ? '250% 250%' : '840px 840px',
              }}
            ></div>
          ) : (
            <div style={{ width: 840, height: 840, backgroundColor: '#000', boxShadow: '-6px 9px 0 #000' }} />
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', height: 840, width: 696 }}>
          <div style={{ display: 'flex', flex: 1, flexDirection: 'column', color: 'white', gap: 52 }}>
            {!username ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignSelf: 'flex-start',
                  fontFamily: 'ClashDisplay-Variable',
                  fontSize: 108,
                  textShadow: '-8px 12px 0 #000',
                  fontWeight: 700,
                  WebkitTextStrokeWidth: 4,
                  WebkitTextStrokeColor: '#000',
                  lineHeight: '110%',
                }}
              >
                <span>LemonHead</span>
                <span>#{tokenId}</span>
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <p
                  style={{
                    fontFamily: 'ClashDisplay-Variable',
                    fontSize: 108,
                    // filter: 'drop-shadow(-8px 12px 0 #000)',
                    textShadow: '-8px 12px 0 #000',
                    fontWeight: 700,
                    WebkitTextStrokeWidth: 4,
                    WebkitTextStrokeColor: '#000',
                    lineHeight: '110%',
                    width: '100%',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {username}
                </p>

                <div style={{ display: 'flex' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '14px 32px',
                      backgroundColor: LEMONHEAD_COLORS[color]?.fg,
                      borderRadius: 9999,
                      fontFamily: 'GeneralSans-Medium',
                      fontSize: 36,
                      fontWeight: 500,
                    }}
                  >
                    LemonHead #{tokenId}
                  </div>
                </div>
              </div>
            )}

            <p
              style={{
                fontSize: 52,
                lineHeight: '140%',
                fontFamily: 'GeneralSans-Medium',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                display: '-webkit-box',
                color: '#000',
                lineClamp: 4,
                WebkitLineClamp: 4,
                WebkitBoxOrient: 'vertical',
                wordBreak: 'break-all',
                overflowWrap: 'break-word',
              }}
            >
              {bio || 'Citizen of the United Stands of Lemonade - a nation shaped by creators and communities.'}
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <UnitedStandLogo color={LEMONHEAD_COLORS[color]?.fg} width="168" height="64" />
            <LemonHeadLogo color={LEMONHEAD_COLORS[color]?.fg} width="64" height="64" />
          </div>
        </div>
      </div>
    </div>
  );
}

function UnitedStandLogo({
  color = 'currentColor',
  width = '105',
  height = '40',
}: {
  color?: string;
  width?: string;
  height?: string;
}) {
  return (
    <svg width={width} height={height} viewBox="0 0 105 40" fill={color} xmlns="http://www.w3.org/2000/svg">
      <path d="M3.48841 13.1152C2.29301 13.1152 1.41275 12.7774 0.847651 12.1019C0.28255 11.4209 0 10.4213 0 9.10318V0.131811H2.78747V9.07023C2.78747 9.31188 2.80105 9.5453 2.82822 9.77047C2.85539 9.99016 2.91788 10.1714 3.01568 10.3142C3.11349 10.457 3.27106 10.5284 3.48841 10.5284C3.71119 10.5284 3.87148 10.4597 3.96929 10.3224C4.0671 10.1796 4.12687 9.99565 4.1486 9.77047C4.17577 9.5453 4.18935 9.31188 4.18935 9.07023V0.131811H6.97682V9.10318C6.97682 10.4213 6.69427 11.4209 6.12917 12.1019C5.56407 12.7774 4.68382 13.1152 3.48841 13.1152Z" />
      <path d="M7.74329 12.9834V0.131811H10.6938L12.1772 7.10131V0.131811H14.7853V12.9834H11.9815L10.3841 6.02211V12.9834H7.74329Z" />
      <path d="M15.5925 12.9834V0.131811H18.3637V12.9834H15.5925Z" />
      <path d="M20.4017 12.9834V2.91631H18.6982V0.131811H24.9741V2.91631H23.2706V12.9834H20.4017Z" />
      <path d="M25.439 12.9834V0.131811H31.1769V2.93279H28.3569V5.05824H31.0628V7.78507H28.3569V10.1577H31.3644V12.9834H25.439Z" />
      <path d="M31.9842 12.9834V0.131811H35.9371C36.9695 0.131811 37.7438 0.422893 38.26 1.00506C38.7817 1.58173 39.0425 2.42752 39.0425 3.54242V8.68304C39.0425 10.0561 38.8061 11.116 38.3334 11.863C37.8607 12.6099 37.0293 12.9834 35.8393 12.9834H31.9842ZM34.8694 10.4213H35.3666C35.8937 10.4213 36.1572 10.1632 36.1572 9.6469V3.81427C36.1572 3.33097 36.092 3.02066 35.9616 2.88336C35.8366 2.74057 35.5785 2.66917 35.1873 2.66917H34.8694V10.4213Z" />
      <path d="M46.8676 13.1152C45.5581 13.1152 44.6126 12.7856 44.0312 12.1266C43.4553 11.4675 43.1673 10.4185 43.1673 8.97961V8.51003H46.0037V9.37504C46.0037 9.71006 46.0526 9.97368 46.1504 10.1659C46.2536 10.3526 46.4302 10.446 46.6801 10.446C46.941 10.446 47.1203 10.3774 47.2181 10.2401C47.3213 10.0973 47.3729 9.8913 47.3729 9.62219C47.3729 9.2652 47.2534 8.96313 47.0143 8.71599C46.7807 8.46884 46.3922 8.13382 45.8488 7.71093L44.6099 6.73883C44.0829 6.32692 43.7107 5.87107 43.4933 5.37129C43.276 4.87151 43.1673 4.26463 43.1673 3.55065C43.1673 2.43575 43.4498 1.56525 44.0149 0.939152C44.5855 0.313051 45.4087 0 46.4845 0C47.7995 0 48.7314 0.346003 49.2802 1.03801C49.8344 1.73002 50.1115 2.74606 50.1115 4.08613H47.2018V3.37765C47.2018 2.90533 46.9844 2.66917 46.5497 2.66917C46.3324 2.66917 46.1721 2.73507 46.0689 2.86688C45.9656 2.9932 45.914 3.15797 45.914 3.36118C45.914 3.56438 45.9602 3.75661 46.0526 3.93785C46.1504 4.1136 46.3731 4.34426 46.7209 4.62985L48.3755 5.98915C48.9786 6.48344 49.435 7.00245 49.7447 7.54617C50.0545 8.08989 50.2093 8.79562 50.2093 9.66338C50.2093 10.2675 50.1006 10.8332 49.8833 11.3604C49.6714 11.8877 49.3209 12.3133 48.8319 12.6374C48.3429 12.9559 47.6881 13.1152 46.8676 13.1152Z" />
      <path d="M52.068 12.9834V2.91631H50.3645V0.131811H56.6404V2.91631H54.9369V12.9834H52.068Z" />
      <path d="M56.4043 12.9834L57.7899 0.131811H62.6558L64.0169 12.9834H61.3028L61.1153 10.6437H59.3548L59.1918 12.9834H56.4043ZM60.121 2.4385L59.5912 8.32879H60.8464L60.2514 2.4385H60.121Z" />
      <path d="M64.5633 12.9834V0.131811H67.5138L68.9972 7.10131V0.131811H71.6053V12.9834H68.8016L67.2041 6.02211V12.9834H64.5633Z" />
      <path d="M72.543 12.9834V0.131811H76.496C77.5284 0.131811 78.3026 0.422893 78.8188 1.00506C79.3405 1.58173 79.6013 2.42752 79.6013 3.54242V8.68304C79.6013 10.0561 79.3649 11.116 78.8922 11.863C78.4195 12.6099 77.5881 12.9834 76.3981 12.9834H72.543ZM75.4282 10.4213H75.9254C76.4525 10.4213 76.716 10.1632 76.716 9.6469V3.81427C76.716 3.33097 76.6508 3.02066 76.5204 2.88336C76.3954 2.74057 76.1373 2.66917 75.7461 2.66917H75.4282V10.4213Z" />
      <path d="M83.848 13.1152C82.5385 13.1152 81.5931 12.7856 81.0117 12.1266C80.4357 11.4675 80.1477 10.4185 80.1477 8.97961V8.51003H82.9841V9.37504C82.9841 9.71006 83.033 9.97368 83.1308 10.1659C83.234 10.3526 83.4106 10.446 83.6606 10.446C83.9214 10.446 84.1007 10.3774 84.1985 10.2401C84.3017 10.0973 84.3534 9.8913 84.3534 9.62219C84.3534 9.2652 84.2338 8.96313 83.9947 8.71599C83.7611 8.46884 83.3726 8.13382 82.8292 7.71093L81.5903 6.73883C81.0633 6.32692 80.6911 5.87107 80.4737 5.37129C80.2564 4.87151 80.1477 4.26463 80.1477 3.55065C80.1477 2.43575 80.4302 1.56525 80.9954 0.939152C81.5659 0.313051 82.3891 0 83.4649 0C84.7799 0 85.7118 0.346003 86.2606 1.03801C86.8148 1.73002 87.0919 2.74606 87.0919 4.08613H84.1822V3.37765C84.1822 2.90533 83.9648 2.66917 83.5302 2.66917C83.3128 2.66917 83.1525 2.73507 83.0493 2.86688C82.946 2.9932 82.8944 3.15797 82.8944 3.36118C82.8944 3.56438 82.9406 3.75661 83.033 3.93785C83.1308 4.1136 83.3536 4.34426 83.7013 4.62985L85.3559 5.98915C85.959 6.48344 86.4154 7.00245 86.7251 7.54617C87.0349 8.08989 87.1897 8.79562 87.1897 9.66338C87.1897 10.2675 87.0811 10.8332 86.8637 11.3604C86.6518 11.8877 86.3013 12.3133 85.8123 12.6374C85.3233 12.9559 84.6685 13.1152 83.848 13.1152Z" />
      <path d="M94.8192 13.1152C93.6456 13.1152 92.7626 12.7582 92.1703 12.0442C91.5781 11.3247 91.2819 10.3197 91.2819 9.02904V3.78956C91.2819 2.54285 91.5835 1.60095 92.1866 0.963866C92.7952 0.321289 93.6727 0 94.8192 0C95.9712 0 96.8487 0.321289 97.4518 0.963866C98.055 1.60095 98.3566 2.54285 98.3566 3.78956V9.02904C98.3566 10.3197 98.0604 11.3247 97.4681 12.0442C96.8759 12.7582 95.9929 13.1152 94.8192 13.1152ZM94.8437 10.5284C95.1154 10.5284 95.292 10.4048 95.3735 10.1577C95.455 9.90503 95.4957 9.60297 95.4957 9.25147V3.65775C95.4957 3.39962 95.4604 3.15797 95.3898 2.93279C95.3191 2.70212 95.1425 2.58679 94.86 2.58679C94.5829 2.58679 94.3927 2.69388 94.2895 2.90808C94.1917 3.11678 94.1427 3.37491 94.1427 3.68246V9.26795C94.1427 9.6469 94.1862 9.95171 94.2732 10.1824C94.3601 10.4131 94.5503 10.5284 94.8437 10.5284Z" />
      <path d="M99.1801 12.9834V0.131811H104.918V2.93279H102.098V5.26419H104.804V7.99103H102.098V12.9834H99.1801Z" />
      <path d="M0 39.7819V18.5769H4.82995V35.704H9.79711V39.7819H0Z" />
      <path d="M10.6072 39.7819V18.5769H20.2671V23.1985H15.5195V26.7055H20.075V31.2047H15.5195V35.1195H20.5827V39.7819H10.6072Z" />
      <path d="M21.6261 39.7819V18.5769H28.9808L31.0116 31.2183L33.0286 18.5769H40.4519V39.7819H36.0336V25.1695L33.2619 39.7819H28.9259L25.9895 25.1423V39.7819H21.6261Z" />
      <path d="M47.7935 39.9994C45.8176 39.9994 44.3311 39.4104 43.334 38.2323C42.3369 37.0452 41.8383 35.3869 41.8383 33.2573V24.6121C41.8383 22.5551 42.346 21.0009 43.3614 19.9498C44.386 18.8895 45.8633 18.3594 47.7935 18.3594C49.7327 18.3594 51.2101 18.8895 52.2255 19.9498C53.2409 21.0009 53.7486 22.5551 53.7486 24.6121V33.2573C53.7486 35.3869 53.25 37.0452 52.2529 38.2323C51.2558 39.4104 49.7693 39.9994 47.7935 39.9994ZM47.8346 35.7312C48.292 35.7312 48.5893 35.5273 48.7265 35.1195C48.8637 34.7027 48.9323 34.2043 48.9323 33.6243V24.3947C48.9323 23.9687 48.8729 23.57 48.754 23.1985C48.635 22.8179 48.3377 22.6276 47.8621 22.6276C47.3955 22.6276 47.0754 22.8043 46.9016 23.1577C46.7369 23.5021 46.6546 23.928 46.6546 24.4354V33.6515C46.6546 34.2768 46.7278 34.7797 46.8741 35.1603C47.0205 35.5409 47.3406 35.7312 47.8346 35.7312Z" />
      <path d="M55.135 39.7819V18.5769H60.1021L62.5994 30.0765V18.5769H66.9903V39.7819H62.2701L59.5807 28.2958V39.7819H55.135Z" />
      <path d="M67.9102 39.7819L70.2428 18.5769H78.4345L80.726 39.7819H76.1568L75.8412 35.9215H72.8774L72.6029 39.7819H67.9102ZM74.1672 22.3829L73.2753 32.1019H75.3884L74.3867 22.3829H74.1672Z" />
      <path d="M81.6459 39.7819V18.5769H88.3008C90.0389 18.5769 91.3424 19.0571 92.2114 20.0177C93.0896 20.9692 93.5287 22.3648 93.5287 24.2044V32.6864C93.5287 34.9519 93.1308 36.7008 92.3349 37.9333C91.5391 39.1657 90.1395 39.7819 88.1362 39.7819H81.6459ZM86.5033 35.5545H87.3403C88.2276 35.5545 88.6713 35.1286 88.6713 34.2768V24.6529C88.6713 23.8555 88.5615 23.3435 88.342 23.1169C88.1316 22.8813 87.6971 22.7635 87.0384 22.7635H86.5033V35.5545Z" />
      <path d="M94.9425 39.7819V18.5769H104.602V23.1985H99.8548V26.7055H104.41V31.2047H99.8548V35.1195H104.918V39.7819H94.9425Z" />
    </svg>
  );
}

function LemonHeadLogo({
  color = 'currentColor',
  width = '48',
  height = '48',
}: {
  color?: string;
  width?: string;
  height?: string;
}) {
  return (
    <svg width={width} height={height} viewBox="0 0 48 48" fill={color} xmlns="http://www.w3.org/2000/svg">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M28.1667 34C30.9281 34 33.1667 36.2386 33.1667 39C33.1667 41.7614 30.9281 44 28.1667 44C25.4052 44 23.1667 41.7614 23.1667 39C23.1667 36.2386 25.4052 34 28.1667 34ZM11.5 21.5C15.6421 21.5 19 24.8579 19 29C19 33.1421 15.6421 36.5 11.5 36.5C7.35786 36.5 4 33.1421 4 29C4 24.8579 7.35786 21.5 11.5 21.5ZM32.75 4C38.9632 4 44 9.0368 44 15.25C44 21.4632 38.9632 26.5 32.75 26.5C26.5368 26.5 21.5 21.4632 21.5 15.25C21.5 9.0368 26.5368 4 32.75 4Z"
      />
    </svg>
  );
}
