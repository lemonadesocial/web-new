
import { evmAddress } from "@lens-protocol/client";

import { useFeedPosts } from "$lib/hooks/useLens";
import { Skeleton } from "$lib/components/core";

import { FeedPost } from "./FeedPost";

export function FeedPosts({ feedAddress }: { feedAddress: string; }) {
  const { posts, isLoading } = useFeedPosts(evmAddress(feedAddress));

  if (isLoading && posts.length === 0) {
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

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <FeedPost key={post.slug} post={post} />
      ))}

      {isLoading && posts.length > 0 && (
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-card rounded-md p-4 space-y-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
