'use client';

import { LensFeed } from '$lib/components/features/lens-feed/LensFeed';
import { useAccount } from '$lib/hooks/useLens';
import { LEMONADE_FEED_ADDRESS } from '$lib/utils/constants';

export function UserFeed() {
  const { account } = useAccount();

  if (!account) return <LensFeed feedAddress={LEMONADE_FEED_ADDRESS} />;

  return <LensFeed authorId={account?.address} showReposts />;
}
