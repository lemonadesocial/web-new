'use client';

import { useAtomValue } from "jotai";

import { useFeed, usePost } from "$lib/hooks/useLens";
import { Skeleton } from "$lib/components/core";
import { accountAtom } from "$lib/jotai";

import { PostComposer } from "./PostComposer";
import { FeedPosts } from "./FeedPosts";

export function LensFeed({ feedAddress }: { feedAddress: string }) {
  const { feed, isLoading: isLoadingFeed } = useFeed(feedAddress);
  const { createPost } = usePost();
  const account = useAtomValue(accountAtom);

  if (isLoadingFeed) return (
    <div className="flex flex-col gap-2.5 w-full">
      <Skeleton animate className="h-6 w-2/5" />
      <Skeleton animate className="h-10 w-2/3" />
      <Skeleton animate className="h-8 w-1/2" />
    </div>
  );

  if (!feed) return;

  const onPost = async (metadata: unknown) => {
    await createPost({ metadata, feedAddress });
  };

  return (
    <div className="w-full space-y-4">
      {account && <PostComposer onPost={onPost} />}
      <FeedPosts feedAddress={feedAddress} />
    </div>
  );
}
