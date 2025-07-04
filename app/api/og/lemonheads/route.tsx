import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { ASSET_PREFIX } from '$lib/utils/constants';

const fetchFont = (url: string) => {
  return fetch(new URL(url)).then((res) => res.arrayBuffer());
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const image = searchParams.get('image') || '';
  const username = searchParams.get('username');
  const bio = searchParams.get('bio');

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
          <img src={image} style={{ width: 454, height: 454 }} />

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
                  #18372
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
                    #18372
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
