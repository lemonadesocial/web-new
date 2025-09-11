import { LockFeature, RightCol } from '../shared';

function Page() {
  return (
    <div className="flex max-sm:flex-col-reverse max-sm:gap-5 gap-12">
      <div className="space-y-4 w-full">
        <LockFeature
          title="Treasury is Locked"
          subtitle="Claim your LemonHead to unlock treasury & get support for your projects."
          icon="icon-account-balance-outline"
        />
      </div>

      <RightCol options={{ nft: false, treasury: false, invite: true }} />
    </div>
  );
}

export default Page;
