"use client";
import React from "react";

import { scrollAtBottomAtom } from "$lib/jotai";
import { useSetAtom } from "jotai";

const LoadMoreWrapper = ({ children }: { children: React.ReactNode; }) => {
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
  return <div ref={mainRef}>{children}</div>;
};

export default LoadMoreWrapper;
