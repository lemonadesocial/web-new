'use client';
import React from 'react';
import { useSetAtom } from 'jotai';
import { scrollAtBottomAtom } from '$lib/jotai';

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
    <div ref={mainRef} className="w-full p-4 overflow-auto flex-1">
      <div className="page mx-auto">{children}</div>
    </div>
  );
}
