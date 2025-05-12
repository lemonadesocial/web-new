import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

import { getClient } from '$lib/graphql/request';
import { Event, GetEventDocument } from '$lib/graphql/generated/backend/graphql';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { generateUrl } from '$lib/utils/cnd';

const fetchFont = (url: string) => {
  return fetch(new URL(url)).then((res) => res.arrayBuffer());
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortid: string }> },
) {
  const shortid = (await params).shortid;
  const client = getClient();
  const { data } = await client.query({ query: GetEventDocument, variables: { shortid } });
  const event = data?.getEvent as Event;

  if (!event) return new Response('Event not found');

  const eventCover = event.new_new_photos_expanded?.[0]
    ? generateUrl(event.new_new_photos_expanded[0], { resize: { height: 630, width: 630, fit: 'cover' } })
    : `${ASSET_PREFIX}/assets/images/lemonade-cover.png`;

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          background: 'linear-gradient(180deg, #202022 0%, #141317 100%)',
          padding: '56px 64px',
          gap: 64
        }}
      >
        <div
          style={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '36px'
          }}
        >
          <img 
            src={`${ASSET_PREFIX}/assets/images/lemonade-logo.svg`} 
            width={48} 
            height={48} 
          />
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              flex: 1 
            }}
          >
            <h1 
              style={{ 
                fontFamily: 'General Sans', 
                color: '#FFF', 
                margin: 0, 
                padding: 0, 
                fontSize: '54px' 
              }}
            >
              {event.title}
            </h1>
          </div>
          <div
            style={{
              fontFamily: 'General Sans',
              width: 142,
              height: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#FFF',
              borderRadius: 24,
              fontSize: 24
            }}
          >
            RSVP
          </div>
        </div>
        <div 
          style={{ 
            display: 'flex',
            flex: 1,
            maxWidth: 518,
            maxHeight: 518,
            overflow: 'hidden',
            borderRadius: 24,
            justifyContent: 'center',
            borderWidth: 2,
            borderColor: 'rgba(255, 255, 255, 0.08)',
            borderStyle: 'solid',
            boxShadow: '0px 16px 24px 0px rgba(0, 0, 0, 0.32)'
          }}
        >
          <img src={eventCover} />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'General Sans',
          data: await fetchFont(`${process.env.NEXT_PUBLIC_ASSET_PREFIX}/assets/fonts/GeneralSans-Medium.ttf`),
          style: 'normal',
        },
      ],
    },
  );
}
