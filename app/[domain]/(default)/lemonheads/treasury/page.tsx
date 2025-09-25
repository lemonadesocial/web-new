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
          title="Treasury is Locked"
          subtitle={
            data && data?.tokenId > 0
              ? 'Unlocks at 5,000 LemonHeads to support community requests.'
              : 'Claim your LemonHead to unlock treasury & get support for your projects.'
          }
          icon="icon-account-balance-outline"
        />
      </div>

      <LemonHeadsRightCol options={{ nft: false, treasury: false, invite: true }} />
    </div>
  );
}

export default Page;
