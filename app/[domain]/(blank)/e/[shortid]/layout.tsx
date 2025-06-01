import { notFound, redirect } from 'next/navigation';

import { EventThemeProvider } from '$lib/components/features/theme-builder/provider';
import { GetEventDocument } from '$lib/graphql/generated/backend/graphql';
import { getClient } from '$lib/graphql/request';
import { MainEventLayout } from './main';

type LayoutProps = React.PropsWithChildren & {
  params: { shortid: string };
};

export default async function EventLayout({ children, params }: LayoutProps) {
  const shortid = (await params).shortid;

  const client = getClient();
  const { data } = await client.query({ query: GetEventDocument, variables: { shortid } });

  if (!data?.getEvent) return notFound();

  if (data.getEvent.external_url) redirect(data.getEvent.external_url);

  const themeData = data?.getEvent?.theme_data;

  return (
    <EventThemeProvider themeData={themeData}>
      <MainEventLayout>{children}</MainEventLayout>
    </EventThemeProvider>
  );
}
