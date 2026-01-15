'use client';
import { Button } from '$lib/components/core';
import { useRouter } from 'next/navigation';
import { CoinList } from '../coins/CoinList';
// import { FeaturedCoins } from './FeaturedCoins';
import { FeaturedCommunityHubs } from './FeaturedCommunityHubs';
import { TopPerformers } from './TopPerformers';

export function ExploreContent() {
  const router = useRouter();
  return (
    <div className="flex flex-col gap-12 pt-6 px-8 max-sm:px-0 pb-32 md:pb-8 overflow-visible">
      <FeaturedCommunityHubs />
      {/* <FeaturedCoins /> */}
      <TopPerformers />
      <div className="flex flex-col gap-5 relative">
        <div className="flex justify-between items-center">
          <p className="text-xl font-semibold">All Coins</p>
          <Button iconLeft="icon-plus" variant="secondary" size="sm" onClick={() => router.push('/create/coin')}>
            Create Coin
          </Button>
        </div>
        <CoinList />
      </div>
    </div>
  );
}
