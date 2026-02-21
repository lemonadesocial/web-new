'use client';
import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';

import { useStakingAPR, useStakingTVL } from "$lib/hooks/useCoin";
import { LaunchpadGroup } from '$lib/graphql/generated/backend/graphql';
import { StatItem } from '../coin/StatItem';
import { chainsMapAtom } from '$lib/jotai';
import { StakingManagerClient } from '$lib/services/coin/StakingManagerClient';
import { formatWallet } from '$lib/utils/crypto';

export function CoinStats({ launchpadGroup }: { launchpadGroup: LaunchpadGroup }) {
  const chainsMap = useAtomValue(chainsMapAtom);
  const chain = chainsMap[launchpadGroup.chain_id];
  const [owner, setOwner] = useState<string | null>(null);
  const [isLoadingOwner, setIsLoadingOwner] = useState(true);

  const { apr, isLoading: isLoadingAPR } = useStakingAPR(chain as Chain, launchpadGroup.address);
  const { tvl, isLoading: isLoadingTVL } = useStakingTVL(chain as Chain, launchpadGroup.address);

  useEffect(() => {
    if (!chain) return;

    const fetchOwner = async () => {
      setIsLoadingOwner(true);
      const client = StakingManagerClient.getInstance(chain, launchpadGroup.address);
      const ownerAddress = await client.getManagerOwner();
      setOwner(ownerAddress);
      setIsLoadingOwner(false);
    };

    fetchOwner();
  }, [chain, launchpadGroup.address]);

  return (
    <div className="grid grid-cols-5 gap-3">
      <StatItem title="Owner" value={owner ? formatWallet(owner) : 'N/A'} loading={isLoadingOwner} />
      <StatItem title="APR" value={apr !== null ? `${apr}%` : 'N/A'} loading={isLoadingAPR} />
      <StatItem title="TVL" value={tvl || 'N/A'} loading={isLoadingTVL} />
      <StatItem title="Earned" value={'$0'} />
      <StatItem title="Members" value={'0'} />
    </div>
  );
}
