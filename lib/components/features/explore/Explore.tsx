import { FeaturedCoins } from './FeaturedCoins';
import { FeaturedCommunityHubs } from './FeaturedCommunityHubs';
import { TopPerformers } from './TopPerformers';

export function ExploreContent() {
  return (
    <div className="flex flex-col gap-12 py-8 overflow-visible">
      <FeaturedCommunityHubs />
      <FeaturedCoins />
      <TopPerformers />
    </div>
  );
}
