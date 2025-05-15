import React from "react";

import Header from "$lib/components/layouts/header";
import Sidebar from "./sidebar";
import LoadMoreWrapper from "./loadMoreWrapper";
import ThemeGenerator from "./theme";

export default async function CommunityLayout({ children, params }: { children: React.ReactNode; params: { uid: string; }; }) {
  const { uid } = await params;

  return (
    <main className="relative flex flex-col h-dvh w-full z-100 overflow-auto">
      <ThemeGenerator />
      <LoadMoreWrapper>
        <div className="fixed top-0 left-0 w-screen h-[64px] z-[9] border-b backdrop-blur-md">
          <Header />
        </div>
        <Sidebar uid={uid} />
        <div className="page flex-1 mx-auto px-4 xl:px-0 lg:pl-[97px] pt-[64px]">{children}</div>
      </LoadMoreWrapper>
    </main>
  );
}
