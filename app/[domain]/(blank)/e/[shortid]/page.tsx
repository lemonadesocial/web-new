import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { htmlToText } from 'html-to-text';

import { Event, GetEventDocument } from '$lib/graphql/generated/backend/graphql';
import { getClient } from '$lib/graphql/request';
import { EventGuestSide } from '$lib/components/features/event/EventGuestSide';

export async function generateMetadata({ params }: { params: Promise<{ shortid: string }> }) {
  const shortid = (await params).shortid;

  const client = getClient();

  const { data } = await client.query({ query: GetEventDocument, variables: { shortid } });
  const event = data?.getEvent as Event;
  const fileId = event.new_new_photos_expanded?.[0] ? event.new_new_photos_expanded?.[0]._id : 'default';

  const miniapp = {
    version: '1',
    imageUrl: `${process.env.NEXT_PUBLIC_HOST_URL}/api/fc/event/${event.shortid}`,
    button: {
      title: 'Get Tickets',
      action: {
        type: 'launch_miniapp',
      }
    }
  }

  return {
    metadataBase: null,
    title: event?.title,
    description: event?.description
      ? htmlToText(event.description, {
          selectors: [
            { selector: 'img', format: 'skip' },
            { selector: 'hr', format: 'skip' },
            { selector: 'h1', format: 'skip' },
            { selector: 'h2', format: 'skip' },
          ],
        })
      : '',
    openGraph: {
      images: `${process.env.NEXT_PUBLIC_HOST_URL}/api/og/event/${event.shortid}?file=${fileId}`,
    },
    other: {
      'fc:miniapp': JSON.stringify(miniapp),
    }
  };
}

export default async function Page({ params }: { params: Promise<{ shortid: string }> }) {
  const shortid = (await params).shortid;

  const client = getClient();
  const { data } = await client.query({ query: GetEventDocument, variables: { shortid } });
  const event = data?.getEvent as Event;

  if (!event) return notFound();

  if (event.external_url) redirect(event.external_url);

  return <EventGuestSide event={event} />;
}
