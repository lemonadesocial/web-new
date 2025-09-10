'use client';
import React from 'react';

import { FeedPosts } from '$lib/components/features/lens-feed/FeedPosts';
import { PostComposer } from '$lib/components/features/lens-feed/PostComposer';
import { useLemonhead } from '$lib/hooks/useLemonhead';
import { usePost } from '$lib/hooks/useLens';
import { LEMONADE_FEED_ADDRESS } from '$lib/utils/constants';
import { useRouter } from 'next/navigation';
import { Button } from '$lib/components/core';
import clsx from 'clsx';

export function Content() {
  const router = useRouter();
  const { createPost } = usePost();
  const { data } = useLemonhead();

  const invited = 2;

  const onPost = async (metadata: unknown, feedAddress?: string) => {
    createPost({ metadata, feedAddress });
  };

  const onSelectPost = (slug: string) => {
    router.push(`/posts/${slug}`);
  };

  return (
    <div className="flex gap-12">
      <div className="space-y-4 w-full">
        <PostComposer onPost={onPost} showFeedOptions />
        <FeedPosts feedAddress={LEMONADE_FEED_ADDRESS} onSelectPost={onSelectPost} />
      </div>

      <div className="w-full max-w-[296px]">
        <div className="sticky top-0  flex flex-col gap-4">
          <div className="bg-overlay-secondary backdrop-blur-md p-4 rounded-md space-y-3">
            <img src={data?.image} className="rounded-sm" />
            <div className="flex justify-between">
              <p>LemonHead #{data?.tokenId}</p>
              <i className="icon-share size-5 aspect-square text-quaternary" />
            </div>
          </div>

          <div className="p-4 border rounded-md flex flex-col gap-3">
            <div className="flex justify-between">
              <div className="flex justify-center items-center rounded-full bg-success-500/16 size-[48px] aspect-square">
                <i className="icon-account-balance-outline text-success-500" />
              </div>

              <div className="tooltip">
                <div className="tooltip-content backdrop-blur-md border-card text-left! p-3">
                  <p>
                    The LemonHeads treasury is building up. Once 5,000 LemonHeads are minted, it will unlock for
                    proposals and voting—funding requests by the community, for the community.
                  </p>
                </div>
                <i className="icon-info size-5 aspect-square text-quaternary" />
              </div>
            </div>

            <div className="flex flex-col gpa-1.5">
              <p>Treasury</p>
              <p className="text-secondary text-sm">Unlocks at 5,000 LemonHeads.</p>
            </div>
          </div>

          <div className="p-4 border rounded-md flex flex-col gap-3">
            <div className="flex justify-between">
              <div className="flex justify-center items-center rounded-full bg-alert-500/16 size-[48px] aspect-square">
                <i className="icon-account-balance-outline text-alert-500" />
              </div>

              <div className="tooltip">
                <div className="tooltip-content backdrop-blur-md border-card text-left! p-3">
                  <p>
                    LemonHeads are currently invite-only. Each LemonHead can invite up to 5 wallets to mint their own.
                  </p>
                </div>
                <i className="icon-info size-5 aspect-square text-quaternary" />
              </div>
            </div>

            <div className="flex flex-col gpa-1.5">
              <p>Invite a Friend</p>
              <p className="text-secondary text-sm">You have 2/5 invites left.</p>
            </div>

            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div
                  key={idx}
                  className={clsx(
                    'h-2 flex-1 first:rounded-l-full last:rounded-r-full',
                    idx < invited ? 'bg-alert-400' : 'bg-quaternary',
                  )}
                />
              ))}
            </div>

            <Button variant="secondary">Invite</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
