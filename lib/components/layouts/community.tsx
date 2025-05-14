"use client";
import React from "react";
import { useSetAtom } from "jotai";

import { scrollAtBottomAtom } from "$lib/jotai";

import Header from "$lib/components/layouts/header";


export default function CommunityLayout({ children, }: { children: React.ReactNode; }) {
  const mainRef = React.useRef<HTMLDivElement>(null);
  const setShouldLoadMore = useSetAtom(scrollAtBottomAtom);

  const handleScroll = () => {
    if (mainRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = mainRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 20) {
        setShouldLoadMore(true);
      }
    }
  };

  React.useEffect(() => {
    if (mainRef.current) {
      mainRef.current.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (mainRef.current) {
        mainRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <main ref={mainRef} className="relative flex flex-col h-dvh w-full z-100 overflow-auto">
      <div className="fixed top-0 left-0 w-screen h-[64px] z-[9] border-b backdrop-blur-md bg-overlay-backdrop">
        <Header />
      </div>
      <div className="fixed left-0 top-[64px] w-[97px] h-screen p-4 border-r z-[9] backdrop-blur-md"> sidebar</div>
      <div className="page flex-1 mx-auto px-4 xl:px-0 md:pl-[97px] pt-[64px]">{children}</div>
    </main>
  );
}
