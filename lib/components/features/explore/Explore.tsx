import { Button } from '$lib/components/core';
import { CoinList } from '../coins/CoinList';
import { FeaturedCoins } from './FeaturedCoins';
import { FeaturedCommunityHubs } from './FeaturedCommunityHubs';
import { TopPerformers } from './TopPerformers';

export function ExploreContent() {
  return (
    <div className="flex flex-col gap-12 py-8 pb-32 md:pb-8 overflow-visible">
      <FeaturedCommunityHubs />
      {/* <FeaturedCoins /> */}
      <TopPerformers />
      <div className="flex flex-col gap-4 relative">
        <div className='flex justify-between items-center'>
          <p className="text-xl font-semibold">All Coins</p>
          <Button iconLeft="icon-plus" variant='secondary' size="sm">Create Coin</Button>
        </div>
        <CoinList />
      </div>
    </div>
  );
}
