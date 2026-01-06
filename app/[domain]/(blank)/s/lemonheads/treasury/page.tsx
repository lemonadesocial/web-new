import { CouncilMembers } from '$lib/components/features/lemonheads/CouncilMembers';
import { LemonHeadsTreasury } from '$lib/components/features/lemonheads/LemonHeadsTreasury';
import { JourneySection, SubTitleSection, TitleSection } from '../shared';

function Page() {
  return (
    <div className="page mx-auto px-4 xl:px-0 pt-6 w-full max-w-[1080px]">
      <div className="flex flex-col gap-2">
        <TitleSection className="text-3xl">Treasury</TitleSection>
        <SubTitleSection>Shared vault for the community. Create & vote on proposals to access funds.</SubTitleSection>
      </div>

      <JourneySection />
      <div className="h-9" />

      <div className="flex flex-col gap-6">
        <hr className="border border-divider" />
        <CouncilMembers />
        <hr className="border border-divider" />
      </div>

      <div className="h-6" />
      <LemonHeadsTreasury />
    </div>
  );
}

export default Page;
