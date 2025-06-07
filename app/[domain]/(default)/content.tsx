'use client';

import { useAccount } from '$lib/hooks/useLens';
import { LensFeed } from '$lib/components/features/lens-feed/LensFeed';
import { useRouter } from 'next/navigation';
import { LEMONADE_FEED_ADDRESS } from '$lib/utils/constants';

export function HomePageContent() {
  const router = useRouter();
  const { account } = useAccount();

  return (
    <div className="flex flex-col gap-5 flex-1 w-full">
      <h1 className="text-2xl md:text-3xl leading-none font-semibold">
        Welcome {account && `, ${account?.username?.localName}`}
      </h1>
      <LensFeed feedAddress={LEMONADE_FEED_ADDRESS} onSelectPost={(slug) => router.push(`/posts/${slug}`)} />
    </div>
  );
}
