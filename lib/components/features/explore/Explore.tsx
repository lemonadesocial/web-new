'use client';
import { Button } from '$lib/components/core';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CoinList } from '../coins/CoinList';
// import { FeaturedCoins } from './FeaturedCoins';
import { FeaturedCommunityHubs } from './FeaturedCommunityHubs';
import { TopPerformers } from './TopPerformers';
import { isAtlasEnabled } from '$lib/services/atlas-client';

export function ExploreContent() {
  const router = useRouter();
  return (
    <div className="pt-12 px-8 max-sm:px-4 max-sm:pt-16 md:pb-8 overflow-visible">
      <div className="space-y-1 mb-8">
        <h3 className="text-2xl font-semibold">Discover</h3>
        <p className="text-sm text-tertiary">Discover popular communities, events & coins.</p>
      </div>
      <div className="flex flex-col gap-12">
        <FeaturedCommunityHubs />
        {isAtlasEnabled() && (
          <div className="flex flex-col gap-5 relative">
            <div className="flex justify-between items-center">
              <p className="text-xl font-semibold">Atlas Events</p>
              <Link
                href="/explore/atlas"
                className="text-sm text-accent-400 hover:text-accent-400/80 transition-colors"
              >
                View All
              </Link>
            </div>
            <p className="text-sm text-tertiary">
              Discover events across Lemonade, Eventbrite, Lu.ma, Meetup, and more.
            </p>
          </div>
        )}
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
