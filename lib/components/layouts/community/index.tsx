import React from 'react';
import clsx from 'clsx';
import { notFound } from 'next/navigation';

import Header from '$lib/components/layouts/header';
import { isObjectId } from '$lib/utils/helpers';
import { getSpace } from '$lib/utils/getSpace';

import Sidebar from './sidebar';
import LoadMoreWrapper from './loadMoreWrapper';
import ThemeGenerator from './theme';

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
    <main
      id={space._id}
      className={clsx(
        'relative flex flex-col h-dvh w-full z-100 overflow-auto',
        space.theme_data?.config?.mode || 'dark',
      )}
    >
      <ThemeGenerator space={space} />
      <LoadMoreWrapper>
        <div className="fixed top-0 left-0 w-screen h-[64px] z-[9] border-b backdrop-blur-md">
          <Header title={space?.title} />
        </div>
        <Sidebar space={space} />
        <div>
          <div className="lg:pl-[97px] pt-[64px]">
            <div className="page mx-auto px-4 xl:px-0 pt-6">{children}</div>
          </div>
        </div>
      </LoadMoreWrapper>
    </main>
  );
}
