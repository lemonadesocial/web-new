import React from 'react';
import { notFound } from 'next/navigation';

import { isObjectId } from '$lib/utils/helpers';
import { getSpace } from '$lib/utils/getSpace';

import { CommunityThemeProvider } from '$lib/components/features/theme-builder/provider';
import { CommunityContainer } from './container';

type LayoutProps = {
  children: React.ReactElement;
  params: { uid: string; domain: string };
};

export default async function CommunityLayout({ children, params }: LayoutProps) {
  const { uid, domain } = await params;
  let variables = {};

  if (uid) {
    variables = isObjectId(uid) ? { id: uid, slug: uid } : { slug: uid };
  } else {
    if (domain) variables = { hostname: decodeURIComponent(domain) };
  }

  const space = await getSpace(variables);

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
