import React from 'react';
import { notFound } from 'next/navigation';
import { Event, GetEventDocument } from '$lib/graphql/generated/backend/graphql';
import { getClient } from '$lib/graphql/request';
import ManageEventGuestSide from '$lib/components/features/event/ManageEventGuestSide';

export default async function Page({ params }: { params: Promise<{ shortid: string }> }) {
  const shortid = (await params).shortid;

  const client = getClient();
  const { data } = await client.query({ query: GetEventDocument, variables: { shortid } });
  const event = data?.getEvent as Event;

  if (!event) return notFound();

  return <ManageEventGuestSide event={event} />;
}
