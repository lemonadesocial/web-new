'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAppKitAccount } from '@reown/appkit/react';
import { match } from 'ts-pattern';

import { LEMONADE_FEED_ADDRESS } from '$lib/utils/constants';
import { Button, modal, Segment } from '$lib/components/core';
import { FeedPosts } from '$lib/components/features/lens-feed/FeedPosts';
import { PostComposer, PostLocked } from '$lib/components/features/lens-feed/PostComposer';
import { useAccount, usePost } from '$lib/hooks/useLens';
import { Timeline } from '$lib/components/features/lens-feed/Timeline';
import { useQuery } from '$lib/graphql/request';
import { GetSpaceDocument, Space } from '$lib/graphql/generated/backend/graphql';
import { useLemonhead } from '$lib/hooks/useLemonhead';
import { ConnectWallet } from '$lib/components/features/modals/ConnectWallet';

type Tab = 'Following' | 'Lemonade' | 'LemonHeads' | 'Global';

export function HomePageContent() {
  const router = useRouter();
  const { createPost } = usePost();
  const { account } = useAccount();
  const { isConnected } = useAppKitAccount();
  const { data } = useLemonhead();

  const { data: dataGetSpace } = useQuery(GetSpaceDocument, { variables: { slug: 'lemonheads' } });
  const feedAddress = (dataGetSpace?.getSpace as Space)?.lens_feed_id || LEMONADE_FEED_ADDRESS;

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

      {match(tab)
        .with('LemonHeads', () => (
          <PostComposer
            onPost={onPost}
            showFeedOptions={false}
            renderLock={match(isConnected)
              .with(false, () => (
                <PostLocked title="Posting is Locked" subtitle="Connect wallet to start posting on Lemonade.">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="rounded-full"
                    onClick={() => modal.open(ConnectWallet, { props: { onConnect: () => {} } })}
                  >
                    Connect Wallet
                  </Button>
                </PostLocked>
              ))
              .otherwise(() => {
                if (!data || (data && data.tokenId == 0)) {
                  return (
                    <PostLocked title="Posting is Locked" subtitle="Claim Lemonhead to start posting">
                      <Button
                        variant="secondary"
                        className="rounded-full"
                        onClick={() => router.push('/lemonheads/mint')}
                        size="sm"
                      >
                        Claim Lemonhead
                      </Button>
                    </PostLocked>
                  );
                }
              })}
          />
        ))
        .otherwise(() => (
          <PostComposer onPost={onPost} showFeedOptions />
        ))}

      {match(tab)
        .with('Following', () => <Timeline account={account?.address} onSelectPost={onSelectPost} />)
        .with('Lemonade', () => <FeedPosts feedAddress={LEMONADE_FEED_ADDRESS} onSelectPost={onSelectPost} />)
        .with('LemonHeads', () => <FeedPosts feedAddress={feedAddress} onSelectPost={onSelectPost} />)
        .with('Global', () => <FeedPosts global={true} onSelectPost={onSelectPost} />)
        .exhaustive()}
    </div>
  );
}
