import React from 'react';
import { notFound } from 'next/navigation';

import { isObjectId } from '$lib/utils/helpers';

import { CommunityThemeProvider } from '$lib/components/features/theme-builder/provider';
import { defaultTheme } from '$lib/components/features/theme-builder/store';
import { getClient } from '$lib/graphql/request';
import { GetSpaceDocument, Space } from '$lib/graphql/generated/backend/graphql';
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

  const client = getClient();

  const { data } = await client.query({ query: GetSpaceDocument, variables });
  const space = data?.getSpace as Space;

  if (!space) {
    return notFound();
  }

  const themeData = defaultTheme;
  // NOTE: adapt existing config
  if (space.theme_data) {
    themeData.theme = space.theme_data.theme;
    themeData.font_title = space.theme_data.font_title;
    themeData.font_body = space.theme_data.font_body;
    themeData.variables = { ...themeData.variables, ...space.theme_data.variables };
    themeData.config = {
      ...themeData.config,
      mode: space.theme_data.mode || space.theme_data.config?.mode,
      color: space.theme_data.foreground?.key || space.theme_data.config?.fg || space.theme_data.config?.color,
      class: space.theme_data.class,
      name: space.theme_data.config?.name,
      effect: space.theme_data.config?.effect,
    };
  }

  return (
    <CommunityThemeProvider themeData={!space.theme_data ? space.theme_data : themeData}>
      <CommunityContainer space={space}>{children}</CommunityContainer>
    </CommunityThemeProvider>
  );
}
