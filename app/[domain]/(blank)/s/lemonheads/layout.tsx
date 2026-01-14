/**
 * this layout and lemonheads community will be merged as white label and theme build after launch
 */
import React from 'react';
import { ResolvingMetadata } from 'next';
import { generateUrl } from '$lib/utils/cnd';
import { getSpace } from '$lib/utils/getSpace';
import { notFound } from 'next/navigation';

import { Space } from '$lib/graphql/generated/backend/graphql';
import { LayoutContent } from './LayoutContent';

type Props = { params: Promise<{ domain: string; uid: string }> };

export async function generateMetadata(_props: Props, parent: ResolvingMetadata) {
  const variables = { slug: 'lemonheads' };

  const space = await getSpace(variables);
  const previousImages = (await parent).openGraph?.images || [];
  let images = [...previousImages];

  if (space?.image_cover_expanded) {
    images = [generateUrl(space?.image_cover_expanded), ...images];
  }

  return {
    title: space?.title,
    description: space?.description,
    openGraph: {
      images,
    },
  };
}

async function Layout({ children }: React.PropsWithChildren) {
  const variables = { slug: 'lemonheads' };
  const space = (await getSpace(variables)) as Space;

  if (!space) return notFound();

  return <LayoutContent space={space}>{children}</LayoutContent>;
}

export default Layout;
