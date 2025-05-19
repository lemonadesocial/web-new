import React from "react";

import Header from "$lib/components/layouts/header";
import Sidebar from "./sidebar";
import LoadMoreWrapper from "./loadMoreWrapper";
import ThemeGenerator from "./theme";
import { GetSpaceDocument } from "$lib/graphql/generated/backend/graphql";
import { isObjectId } from "$lib/utils/helpers";
import { getClient } from "$lib/graphql/request";
import { Space } from "$lib/graphql/generated/backend/graphql";


type LayoutProps = {
  children: React.ReactElement;
  params: { uid: string; };
};

export default async function CommunityLayout({ children, params }: LayoutProps) {
  const { uid } = await params;
  const variables = isObjectId(uid) ? { id: uid, slug: uid } : { slug: uid };

  const client = getClient();

  const { data } = await client.query({ query: GetSpaceDocument, variables });
  const space = data?.getSpace as Space;

  return (
    <main className="relative flex flex-col h-dvh w-full z-100 overflow-auto">
      <ThemeGenerator space={space} />
      <LoadMoreWrapper>
        <div className="fixed top-0 left-0 w-screen h-[64px] z-[9] border-b backdrop-blur-md">
          <Header title={space?.title} />
        </div>
        <Sidebar uid={uid} space={space} />
        <div id={space._id} className={space.theme_data?.config?.mode || 'dark'}>
          <div className="lg:pl-[97px] pt-[64px]">
            <div className="page mx-auto px-4 xl:px-0">
              {children}
            </div>
          </div>
        </div>
      </LoadMoreWrapper>
    </main >
  );
}
