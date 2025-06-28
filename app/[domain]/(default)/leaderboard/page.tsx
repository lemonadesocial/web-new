import { Button } from "$lib/components/core";
import { ASSET_PREFIX } from "$lib/utils/constants";

export default function SwipePage() {
  return (
    <div className="max-w-[794] mx-auto pt-11 flex flex-col items-center gap-14">
      <img src={`${ASSET_PREFIX}/assets/images/leaderboard-graphic.png`} alt="Leaderboard" className="w-full h-full" />

      <div className="space-y-2 max-w-[600px]">
        <h1 className="text-3xl font-semibold text-center">Leaderboard</h1>
        <p className="text-sm text-tertiary text-center">
          See how you stack up against the rest of Lemonade! Track your rank across events, XP, collectibles, followers, and more.
        </p>
      </div>

      <div className="py-2.5 px-4 rounded-full border-2 border-dashed border-tertiary">
        <p className="text-lg text-tertiary">Coming Soon!</p>
      </div>
    </div>
  );
}
