'use client';
import React from 'react';

import { FeedPosts } from '$lib/components/features/lens-feed/FeedPosts';
import { PostComposer } from '$lib/components/features/lens-feed/PostComposer';
import { useLemonhead } from '$lib/hooks/useLemonhead';
import { usePost } from '$lib/hooks/useLens';
import { LEMONADE_FEED_ADDRESS } from '$lib/utils/constants';
import { useRouter } from 'next/navigation';
import { LemonHeadsRightCol } from '$lib/components/features/lemonheads/LemonheadsRightCol';
import { LemonHeadsLockFeature } from '$lib/components/features/lemonheads/LemonHeadsLockFeature';

export function Content() {
  const router = useRouter();
  const { createPost } = usePost();
  const { data } = useLemonhead();

  const onPost = async (metadata: unknown, feedAddress?: string) => {
    createPost({ metadata, feedAddress });
  };

  const onSelectPost = (slug: string) => {
    router.push(`/posts/${slug}`);
  };

  return (
    <div className="flex max-sm:flex-col-reverse max-sm:gap-5 gap-12">
      <div className="space-y-4 w-full">
        {!data || (data && data.tokenId == 0) ? (
          <LemonHeadsLockFeature
            title="Newsfeed is Locked"
            subtitle="Claim your LemonHead & become a part of an exclusive community."
            icon="icon-newspaper"
          />
        ) : (
          <>
            <PostComposer onPost={onPost} showFeedOptions />
            <FeedPosts feedAddress={LEMONADE_FEED_ADDRESS} onSelectPost={onSelectPost} />
          </>
        )}
      </div>

      <LemonHeadsRightCol />
    </div>
  );
}
