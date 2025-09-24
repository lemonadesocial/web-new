import { Spacer } from '$lib/components/core';
import { CouncilMembers } from '$lib/components/features/lemonheads/CouncilMembers';
import { LemonHeadsTreasury } from '$lib/components/features/lemonheads/LemonHeadsTreasury';
import { JourneySection, SubTitleSection, TitleSection } from '../shared';

function Page() {
  return (
    <div>
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
