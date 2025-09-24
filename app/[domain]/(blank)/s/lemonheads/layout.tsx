/**
 * this layout and lemonheads community will be merged as white label and theme build after launch
 */
import React from 'react';
import { ResolvingMetadata } from 'next';
import { generateUrl } from '$lib/utils/cnd';
import { getSpace } from '$lib/utils/getSpace';
import { notFound } from 'next/navigation';

import Header from '$lib/components/layouts/header';
import { Footer } from '$lib/components/layouts/community/footer';
import clsx from 'clsx';
import { Space } from '$lib/graphql/generated/backend/graphql';
import Sidebar from './sidebar';
import { ThemeProvider } from '$lib/components/features/theme-builder/provider';
import { defaultTheme } from '$lib/components/features/theme-builder/store';
// import { isObjectId } from '$lib/utils/helpers';

type Props = { params: Promise<{ domain: string; uid: string }> };

export async function generateMetadata(_props: Props, parent: ResolvingMetadata) {
  // const res = await params;
  // const uid = res.uid;
  // const variables = isObjectId(uid) ? { id: uid, slug: uid } : { slug: uid };
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

  return (
    <ThemeProvider themeData={defaultTheme}>
      <main
        id={space._id}
        className={clsx(
          'lemonheads relative flex flex-col h-dvh w-full z-100 overflow-auto',
          // state.theme !== 'default' && [state.config.color, state.config.mode],
        )}
      >
        {/* <LoadMoreWrapper> */}
        <Sidebar space={space} />
        <div>
          <Header hideLogo className="h-[64px]" />
          <div className="lg:pl-[97px]">
            <div className="page mx-auto px-4 xl:px-0 pt-6">{children}</div>
          </div>
        </div>
        <Footer space={space} />
        {/* </LoadMoreWrapper> */}
      </main>
    </ThemeProvider>
  );
}

export default Layout;
