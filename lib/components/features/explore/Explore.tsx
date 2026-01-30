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
    <div className="pt-6 px-8 max-sm:px-4 pb-20 md:pb-8 overflow-visible">
      <div className="space-y-1 mb-8">
        <h3 className="text-2xl font-semibold">Explore</h3>
        <p className="text-sm text-tertiary">Discover popular communities, events & coins.</p>
      </div>
      <div className="flex flex-col gap-12">
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
    </div>
  );
}
