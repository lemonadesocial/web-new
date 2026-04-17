import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

import { getClient } from '$lib/graphql/request';
import {
  ValidatePreviewLinkDocument,
  GetEventDocument,
  GetSpaceDocument,
  Event,
  Space,
} from '$lib/graphql/generated/backend/graphql';
import { EventGuestSide } from '$lib/components/features/event/EventGuestSide';
import { Community } from '$lib/components/features/community';
import { PasswordGate } from '$lib/components/features/preview/PasswordGate';
import { EventThemeProvider, ThemeProvider } from '$lib/components/features/theme-builder/provider';
import { MainEventLayout } from '$lib/components/features/event/MainEventLayout';
import Header, { RootMenu } from '$lib/components/layouts/header';
import { getCommunityThemeData } from '$lib/components/features/community-manage/theme';

type Props = { params: Promise<{ token: string }> };

async function validateToken(token: string, password?: string) {
  const client = getClient();
  const { data } = await client.query({
    query: ValidatePreviewLinkDocument,
    variables: { token, password: password || undefined },
  });

  return data?.validatePreviewLink;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const token = (await params).token;

  // Read password from cookie if set
  const cookieStore = await cookies();
  const passwordCookie = cookieStore.get('preview-pwd')?.value;
  const password = passwordCookie ? decodeURIComponent(passwordCookie) : undefined;

  const result = await validateToken(token, password);

  if (!result || (result.password_protected && !result.valid)) {
    return { title: 'Preview' };
  }

  const client = getClient();

  if (result.resource_type === 'event') {
    const { data } = await client.query({
      query: GetEventDocument,
      variables: { id: result.resource_id },
    });
    const event = data?.getEvent as Event | null;

    return {
      title: event?.title || 'Preview',
      description: event?.description || '',
    };
  }

  if (result.resource_type === 'space') {
    const { data } = await client.query({
      query: GetSpaceDocument,
      variables: { id: result.resource_id },
    });
    const space = data?.getSpace as Space | null;

    return {
      title: space?.title || 'Preview',
      description: space?.description || '',
    };
  }

  return { title: 'Preview' };
}

export default async function Page({ params }: Props) {
  const token = (await params).token;

  // Read password from cookie if set
  const cookieStore = await cookies();
  const passwordCookie = cookieStore.get('preview-pwd')?.value;
  const password = passwordCookie ? decodeURIComponent(passwordCookie) : undefined;

  const result = await validateToken(token, password);

  if (!result) return <PasswordGate isExpired />;

  // Password protected but no password provided yet
  if (result.password_protected && !result.valid) {
    const hasAttemptedPassword = !!password;

    return <PasswordGate error={hasAttemptedPassword} />;
  }

  // Link expired or invalid
  if (!result.valid) return <PasswordGate isExpired />;

  const client = getClient();

  if (result.resource_type === 'event') {
    const { data } = await client.query({
      query: GetEventDocument,
      variables: { id: result.resource_id },
    });
    const event = data?.getEvent as Event;

    if (!event) return notFound();

    return (
      <main className="flex flex-col min-h-dvh w-full overflow-y-auto no-scrollbar">
        <div className="z-10000">
          <Header mainMenu={RootMenu} />
        </div>
        <EventThemeProvider themeData={event.theme_data}>
          <MainEventLayout>
            <EventGuestSide event={event} />
          </MainEventLayout>
        </EventThemeProvider>
      </main>
    );
  }

  if (result.resource_type === 'space') {
    const { data } = await client.query({
      query: GetSpaceDocument,
      variables: { id: result.resource_id },
    });
    const space = data?.getSpace as Space;

    if (!space) return notFound();

    const themeData = getCommunityThemeData(space);

    return (
      <ThemeProvider themeData={themeData}>
        <Community initData={{ space }} />
      </ThemeProvider>
    );
  }

  return notFound();
}
