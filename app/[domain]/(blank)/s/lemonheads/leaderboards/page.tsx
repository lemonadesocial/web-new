import { LemonHeadsLeaderboard } from '$lib/components/features/lemonheads/LemonHeadsLeaderboard';
import { LemonHeadsProgressBar } from '$lib/components/features/lemonheads/LemonHeadsProgressBar';
import { SubTitleSection, TitleSection } from '../shared';

function Page() {
  return (
    <div className="page mx-auto px-4 xl:px-0 pt-6 w-full max-w-[1080px]">
      <div className="flex flex-col gap-2 pb-20">
        <div className="flex flex-col gap-2">
          <TitleSection className="md:text-3xl">Leaderboard</TitleSection>
          <SubTitleSection>
            Celebrate the top inviters. See who’s growing the community and climbing the ranks.
          </SubTitleSection>
        </div>

        <div className="pt-6 md:pt-7 pb-1">
          <LemonHeadsProgressBar />
        </div>

        <div className="py-3 md:py-6">
          <LemonHeadsLeaderboard />
        </div>
      </div>
    </div>
  );
}

export default Page;
