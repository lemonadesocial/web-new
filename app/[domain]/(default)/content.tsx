'use client';

import { useAccount } from '$lib/hooks/useLens';
import { LensFeed } from '$lib/components/features/lens-feed/LensFeed';
import { useRouter } from 'next/navigation';
import { LEMONADE_FEED_ADDRESS } from '$lib/utils/constants';
import { PageTitle } from './shared';

export function HomePageContent() {
  const router = useRouter();
  const { account } = useAccount();

  return (
    <div className="flex flex-col gap-5 flex-1 w-full">
      <PageTitle title={`Welcome ${!!account ? `, ${account.username?.localName || account.metadata?.name}` : ''}`} />
      <LensFeed feedAddress={LEMONADE_FEED_ADDRESS} onSelectPost={(slug) => router.push(`/posts/${slug}`)} />
    </div>
  );
}
