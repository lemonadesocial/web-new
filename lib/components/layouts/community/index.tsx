import React from 'react';

import { GetSpaceDocument } from '$lib/graphql/generated/backend/graphql';
import { isObjectId } from '$lib/utils/helpers';
import { getClient } from '$lib/graphql/request';
import { Space } from '$lib/graphql/generated/backend/graphql';
import { notFound } from 'next/navigation';
import { CommunityThemeProvider } from '$lib/components/features/theme-builder/provider';
import { CommunityContainer } from './container';

type LayoutProps = {
  children: React.ReactElement;
  params: { uid: string };
};

export default async function CommunityLayout({ children, params }: LayoutProps) {
  const { uid } = await params;
  const variables = isObjectId(uid) ? { id: uid, slug: uid } : { slug: uid };

  const client = getClient();

  const { data } = await client.query({ query: GetSpaceDocument, variables });
  const space = data?.getSpace as Space;

  if (!space) {
    return notFound();
  }

  return (
    <CommunityThemeProvider themeData={space.theme_data}>
      <CommunityContainer space={space} uid={uid}>
        {children}
      </CommunityContainer>
    </CommunityThemeProvider>
  );
}
