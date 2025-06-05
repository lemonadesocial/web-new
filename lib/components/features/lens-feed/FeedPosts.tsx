
import { useAtomValue } from "jotai";

import { useFeedPosts } from "$lib/hooks/useLens";
import { Skeleton } from "$lib/components/core";
import { accountAtom } from "$lib/jotai";

import { FeedPost } from "./FeedPost";

export function FeedPosts({ feedAddress, authorId, showReposts }: { feedAddress?: string; authorId?: string; showReposts?: boolean; }) {
  const { posts, isLoading } = useFeedPosts({ feedAddress, authorId });
  const account = useAtomValue(accountAtom);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-card rounded-md p-4 space-y-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex pt-12 pb-18 flex-col items-center justify-center rounded-md border gap-5">
        <i className="icon-dashboard size-[184] text-tertiary" />
        <div className="space-y-2">
          <h1 className="text-xl font-semibold text-center">No Posts</h1>
          <p className="text-tertiary text-center">
            {account ? "Nothing here yet. Be the first to post something!" : "Want to share something? Connect your wallet to get started."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <FeedPost key={post.slug} post={post} showRepost={showReposts} />
      ))}
    </div>
  );
}
