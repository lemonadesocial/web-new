'use client';
import { useLemonhead } from '$lib/hooks/useLemonhead';
import { LockFeature, RightCol } from '../shared';

function Page() {
  const { data } = useLemonhead();
  return (
    <div className="flex max-sm:flex-col-reverse max-sm:gap-5 gap-12">
      <div className="space-y-4 w-full">
        <LockFeature
          title={'Proposals are Locked'}
          subtitle={
            data && data?.tokenId > 0
              ? 'Unlocks at 5,000 LemonHeads to support community requests.'
              : 'Claim your LemonHead to unlock proposals & get support for your projects.'
          }
          icon="icon-lab-profile"
        />
      </div>

      <RightCol options={{ nft: false, invite: true, treasury: true }} />
    </div>
  );
}

export default Page;
