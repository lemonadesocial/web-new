'use client';
import { LemonHeadsLockFeature } from '$lib/components/features/lemonheads/LemonHeadsLockFeature';
import { LemonHeadsRightCol } from '$lib/components/features/lemonheads/LemonheadsRightCol';
import { useLemonhead } from '$lib/hooks/useLemonhead';

function Page() {
  const { data } = useLemonhead();
  return (
    <div className="flex max-sm:flex-col-reverse max-sm:gap-5 gap-12">
      <div className="space-y-4 w-full">
        <LemonHeadsLockFeature
          title={'Proposals are Locked'}
          subtitle={
            data && data?.tokenId > 0
              ? 'Unlocks at 5,000 LemonHeads to support community requests.'
              : 'Claim your LemonHead to unlock proposals & get support for your projects.'
          }
          icon="icon-lab-profile"
        />
      </div>

      <LemonHeadsRightCol options={{ nft: false, invite: true, treasury: true }} />
    </div>
  );
}

export default Page;
