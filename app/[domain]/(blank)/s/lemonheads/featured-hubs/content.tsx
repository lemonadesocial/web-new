'use client';

import CommunityCard from '$lib/components/features/community/CommunityCard';
import { LemonHeadsLockFeature } from '$lib/components/features/lemonheads/LemonHeadsLockFeature';
import { PublicSpace } from '$lib/graphql/generated/backend/graphql';
import { useLemonhead } from '$lib/hooks/useLemonhead';
import { useAppKitAccount } from '@reown/appkit/react';

export function Content({ subSpaces = [] }: { subSpaces?: PublicSpace[] }) {
  const { data } = useLemonhead();
  const { address } = useAppKitAccount();

  const locked = !address || !data || (data && data.tokenId == 0);

  return (
    <div>
      {locked ? (
        <LemonHeadsLockFeature
          title="Featured Hubs are Locked"
          subtitle="Claim your LemonHead to discover related community hubs."
          icon="icon-workspaces"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subSpaces.map((space) => (
            <CommunityCard key={space?._id} space={space} />
          ))}
        </div>
      )}
    </div>
  );
}
