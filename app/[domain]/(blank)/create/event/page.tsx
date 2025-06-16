import { cookies } from 'next/headers';

import { GetSpacesDocument, Space, SpaceRole } from '$lib/graphql/generated/backend/graphql';
import { getClient } from '$lib/graphql/request';
import { EventThemeProvider } from '$lib/components/features/theme-builder/provider';

import { MainEventLayout } from './main';
import { Content } from './content';

export default async function Page() {
  const client = getClient();
  const cookieStore = await cookies();
  const { data } = await client.query({
    query: GetSpacesDocument,
    variables: { with_my_spaces: true, roles: [SpaceRole.Admin, SpaceRole.Creator, SpaceRole.Ambassador] },
    headers: { Cookie: decodeURIComponent(cookieStore.toString()) },
  });
  const spaces = (data?.listSpaces || []) as Space[];

  return (
    <EventThemeProvider>
      <MainEventLayout>
        <Content initData={{ spaces }} />
      </MainEventLayout>
    </EventThemeProvider>
  );
}
