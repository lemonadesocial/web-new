import { FeaturedCoins } from "./FeaturedCoins";
import { FeaturedCommunityHubs } from "./FeaturedCommunityHubs";

export function ExploreContent() {
  return (
    <div className="flex flex-col gap-6 py-8 overflow-visible">
      <FeaturedCommunityHubs />
      <FeaturedCoins />
    </div>
  );
}
