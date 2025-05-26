'use client';

import { useFeed } from "$lib/hooks/useLens";
import { Skeleton } from "$lib/components/core";

import { PostComposer } from "./PostComposer";
import { FeedPosts } from "./FeedPosts";

export function LensFeed({ feedAddress }: { feedAddress: string }) {
  const { feed, isLoading: isLoadingFeed } = useFeed(feedAddress);

  if (isLoadingFeed) return (
    <div className="flex flex-col gap-2.5 w-full">
      <Skeleton animate className="h-6 w-2/5" />
      <Skeleton animate className="h-10 w-2/3" />
      <Skeleton animate className="h-8 w-1/2" />
    </div>
  );

  if (!feed) return;

  return (
    <div className="w-full space-y-4">
      <PostComposer feedAddress={feedAddress} />
      <FeedPosts feedAddress={feedAddress} />
    </div>
  );
}
