'use client';

import { Skeleton } from "$lib/components/core";
import { useFeed } from "$lib/hooks/useLens";
import { sessionClientAtom } from "$lib/jotai";
import { fetchFeed } from "@lens-protocol/client/actions";
import { useAtomValue } from "jotai";
import { useEffect } from "react";
import { PostComposer } from "./PostComposer";

export function LensFeed() {
  const { feed, isLoading, refetch } = useFeed('0xD2384732084eb51504430A4c94cF034e04A1d94D');

  console.log(feed);

  if (isLoading) return (
    <div className="flex flex-col gap-2.5 w-full">
      <Skeleton animate className="h-6 w-2/5" />
      <Skeleton animate className="h-10 w-2/3" />
      <Skeleton animate className="h-8 w-1/2" />
    </div>
  );

  return (
    <div className="w-full">
     <PostComposer feedAddress={feed?.address} />
    </div>
  );
}
