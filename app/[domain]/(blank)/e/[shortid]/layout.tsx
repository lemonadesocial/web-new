import { notFound, redirect } from 'next/navigation';
import Header, { RootMenu } from '$lib/components/layouts/header';

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
    <main className="flex flex-col min-h-dvh w-full overflow-y-auto no-scrollbar">
      <div className="z-10000">
        <Header mainMenu={RootMenu} />
      </div>
      <EventThemeProvider themeData={themeData}>
        <MainEventLayout>{children}</MainEventLayout>
      </EventThemeProvider>
    </main>
  );
}
