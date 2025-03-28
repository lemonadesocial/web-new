'use client';
import React from 'react';
import { useSetAtom } from 'jotai';
import { scrollAtBottomAtom } from '$lib/jotai';
import Header from './header';

export function Main({ children }: React.PropsWithChildren) {
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
      <Header />
      <div className="page mx-auto">{children}</div>
    </main>
  );
}
