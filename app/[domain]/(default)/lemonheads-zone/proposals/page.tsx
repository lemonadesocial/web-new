import { LockFeature, RightCol } from '../shared';

function Page() {
  return (
    <div className="flex max-sm:flex-col-reverse max-sm:gap-5 gap-12">
      <div className="space-y-4 w-full">
        <LockFeature
          title="Proposals are Locked"
          subtitle="Claim your LemonHead to unlock proposals & get support for your projects."
          icon="icon-lab-profile"
        />
      </div>

      <RightCol options={{ nft: false, invite: true, treasury: true }} />
    </div>
  );
}

export default Page;
