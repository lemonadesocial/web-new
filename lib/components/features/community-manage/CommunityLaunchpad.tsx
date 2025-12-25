'use client';
import { useEffect, useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { Button } from "$lib/components/core";
import { drawer } from "$lib/components/core/dialog";
import { CoinList } from "../coins/CoinList";
import { ActivateLaunchpad } from "./drawers/ActivateLaunchpad";
import { MembershipSettingsDrawer } from "./drawers/MembershipSettingsDrawer";
import { useLaunchpadGroup, useTokenIds, useStakingAPR, useStakingTVL } from "$lib/hooks/useCoin";
import { useSpace } from "$lib/hooks/useSpace";
import type { PoolCreated_Bool_Exp } from "$lib/graphql/generated/coin/graphql";
import { LaunchpadGroup } from '$lib/graphql/generated/backend/graphql';
import { StatItem } from '../coin/StatItem';
import { chainsMapAtom } from '$lib/jotai';
import { StakingManagerClient } from '$lib/services/coin/StakingManagerClient';
import { formatWallet } from '$lib/utils/crypto';

export function CommunityLaunchpad() {
  const space = useSpace();

  const { launchpadGroup } = useLaunchpadGroup(space?._id || '');
  const { tokenIds } = useTokenIds(launchpadGroup?.address || '');

  const filter = useMemo<PoolCreated_Bool_Exp | undefined>(() => {
    if (!tokenIds || tokenIds.length === 0) {
      return undefined;
    }
    return {
      tokenId: {
        _in: tokenIds,
      },
    };
  }, [tokenIds]);

  return (
    <div className="page mx-auto py-7 px-4 md:px-0 flex flex-col gap-8">
      {
        launchpadGroup ? (
          <Stats launchpadGroup={launchpadGroup as LaunchpadGroup} />
        ) : (
          <div className="flex py-2.5 px-4 items-center gap-3 bg-warning-300/16 rounded-sm">
            <i className="icon-rocket size-5 text-warning-300" />
            <div className="flex-1">
              <p className="text-warning-300">Please activate your Launchpad.</p>
              <p className="text-secondary text-sm">You can activate your Launchpad by clicking the button below.</p>
            </div>
            <Button
              size="sm"
              variant="tertiary"
              iconRight="icon-arrow-foward-sharp"
              onClick={() => drawer.open(ActivateLaunchpad, { dismissible: false })}
            >
              Activate
            </Button>
          </div>
        )
      }

      <hr className="border-t" />

      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-4">
          <h3 className="text-xl font-semibold">Coins</h3>
          <div className="flex gap-2">
            <Button
              icon="icon-settings"
              variant='tertiary'
              size="sm"
              onClick={() => {
                if (launchpadGroup) {
                  drawer.open(MembershipSettingsDrawer, {
                    props: { launchpadGroup: launchpadGroup as LaunchpadGroup },
                  });
                }
              }}
            />
            <Button iconLeft="icon-plus" variant='tertiary' size="sm">Add Coin</Button>
          </div>
        </div>

        {tokenIds && tokenIds.length > 0 ? (
          <CoinList filter={filter} hiddenColumns={['community', 'buy']} />
        ) : (
          <div className="flex flex-col justify-center items-center py-10">
            <i className="icon-token size-[184px] text-quaternary" />
            <div className="text-center mt-5 space-y-2">
              <h3 className="text-xl text-tertiary font-semibold">No Coins</h3>
              <p className="text-tertiary">Activate Launchpad to allow members to launch their own coins.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Stats({ launchpadGroup }: { launchpadGroup: LaunchpadGroup }) {
  const chainsMap = useAtomValue(chainsMapAtom);
  const chain = chainsMap[launchpadGroup.chain_id];
  const [owner, setOwner] = useState<string | null>(null);
  const [isLoadingOwner, setIsLoadingOwner] = useState(true);

  const { apr, isLoading: isLoadingAPR } = useStakingAPR(chain!, launchpadGroup.address);
  const { tvl, isLoading: isLoadingTVL } = useStakingTVL(chain!, launchpadGroup.address);

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
    </div>
  );
}
