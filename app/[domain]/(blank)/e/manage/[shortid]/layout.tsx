import { notFound, redirect } from 'next/navigation';

import { Event, GetEventDocument } from '$lib/graphql/generated/backend/graphql';
import { getClient } from '$lib/graphql/request';
import { EventManageLayout } from '$lib/components/features/event-manage/EventManageLayout';

type LayoutProps = React.PropsWithChildren & {
  params: { shortid: string };
};

export default async function Layout({ children, params }: LayoutProps) {
  const shortid = (await params).shortid;

  const client = getClient();
  const { data } = await client.query({ query: GetEventDocument, variables: { shortid } });

  if (!data?.getEvent) return notFound();

  return <EventManageLayout event={data.getEvent as Event}>{children}</EventManageLayout>;
}
