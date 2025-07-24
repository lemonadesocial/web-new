'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { ASSET_PREFIX, LEMONADE_FEED_ADDRESS } from '$lib/utils/constants';
import { Segment } from '$lib/components/core';
import { FeedPosts } from '$lib/components/features/lens-feed/FeedPosts';
import { PostComposer } from '$lib/components/features/lens-feed/PostComposer';
import { useAccount, usePost } from '$lib/hooks/useLens';
import { Timeline } from '$lib/components/features/lens-feed/Timeline';

type Tab = 'Following' | 'Lemonade' | 'LemonHeads' | 'Global';

export function HomePageContent() {
  const router = useRouter();
  const { createPost } = usePost();
  const { account } = useAccount();

  const [tab, setTab] = useState<Tab>('Lemonade');

  const onSelectPost = (slug: string) => {
    router.push(`/posts/${slug}`);
  };

  const onPost = async (metadata: unknown, feedAddress?: string) => {
    createPost({ metadata, feedAddress });
  };

  const segmentItems = [
    ...(account ? [{ value: 'Following', label: 'Following', iconLeft: 'icon-person-check' }] : []),
    { value: 'Lemonade', label: 'Lemonade', iconLeft: 'icon-sparkles' },
    { value: 'LemonHeads', label: 'LemonHeads', iconLeft: 'icon-passport' },
    { value: 'Global', label: 'Global', iconLeft: 'icon-globe' },
  ];

  return (
    <div className="space-y-5 w-full">
      <Segment
        size="sm"
        selected={tab}
        onSelect={(item) => setTab(item.value as Tab)}
        items={segmentItems}
        className="bg-transparent w-full md:w-fit overflow-auto no-scrollbar"
      />

      {tab !== 'LemonHeads' && <PostComposer onPost={onPost} showFeedOptions />}

      {tab === 'Following' && <Timeline account={account?.address} onSelectPost={onSelectPost} />}

      {tab === 'Lemonade' && <FeedPosts feedAddress={LEMONADE_FEED_ADDRESS} onSelectPost={onSelectPost} />}

      {tab === 'LemonHeads' && (
        <div className="flex gap-6 items-center flex-col mt-[108px]">
          <div
            className="size-[184px] p-2 rounded-lg"
            style={{
              background: `url(${ASSET_PREFIX}/assets/images/lemonheads-bg.png)`,
            }}
          >
            <img src={`${ASSET_PREFIX}/assets/images/lemonheads.gif`} alt="LemonHeads" className="rounded-md" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-semibold text-center">LemonHeads Social Feed</h1>
            <p className="text-accent-400 text-center">Coming Soon!</p>
            <div>
              <p className="text-secondary text-center">
                An exclusive space for LemonHeads to post, connect & socialize.
              </p>
              <p className="text-secondary text-center">Only LemonHead owners get access.</p>
            </div>
          </div>
        </div>
      )}

      {tab === 'Global' && <FeedPosts global={true} onSelectPost={onSelectPost} />}
    </div>
  );
}
