'use client';
import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';

import { Pane } from '$lib/components/core/pane/pane';
import { Skeleton, toast } from '$lib/components/core';
import { chainsMapAtom } from '$lib/jotai';
import { LaunchpadGroup } from '$lib/graphql/generated/backend/graphql';
import { StakingManagerClient } from '$lib/services/coin/StakingManagerClient';
import { FlaunchClient } from '$lib/services/coin/FlaunchClient';
import { formatWallet } from '$lib/utils/crypto';
import { copy } from '$lib/utils/helpers';
import { SECONDS_PER_MONTH } from '$lib/services/token-launch-pad';
import { zeroAddress } from 'viem';

interface MembershipSettingsDrawerProps {
  launchpadGroup: LaunchpadGroup;
}

export function MembershipSettingsDrawer({ launchpadGroup }: MembershipSettingsDrawerProps) {
  const chainsMap = useAtomValue(chainsMapAtom);
  const chain = chainsMap[launchpadGroup.chain_id];
  
  const [ownerShare, setOwnerShare] = useState<bigint | null>(null);
  const [creatorShare, setCreatorShare] = useState<bigint | null>(null);
  const [minStakeDuration, setMinStakeDuration] = useState<bigint | null>(null);
  const [stakingToken, setStakingToken] = useState<string | null>(null);
  const [stakingTokenSymbol, setStakingTokenSymbol] = useState<string | null>(null);
  const [permissionsAddress, setPermissionsAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!chain) return;

    const fetchData = async () => {
      setIsLoading(true);
      const client = StakingManagerClient.getInstance(chain, launchpadGroup.address);
      
      const [owner, creator, duration, token, permissions] = await Promise.all([
        client.getOwnerShare().catch(() => null),
        client.getCreatorShare().catch(() => null),
        client.getMinStakeDuration().catch(() => null),
        client.getStakingToken().catch(() => null),
        client.getPermissions().catch(() => null),
      ]);

      setOwnerShare(owner);
      setCreatorShare(creator);
      setMinStakeDuration(duration);
      setStakingToken(token);
      setPermissionsAddress(permissions);

      if (token) {
        const flaunchClient = FlaunchClient.getInstance(chain, token);
        const tokenData = await flaunchClient.getTokenData().catch(() => null);
        if (tokenData) {
          setStakingTokenSymbol(tokenData.symbol);
        }
      }

      setIsLoading(false);
    };

    fetchData();
  }, [chain, launchpadGroup.address]);

  const ownerSharePercent = ownerShare ? Number(ownerShare) / 100000 : 0;
  const creatorSharePercent = creatorShare ? Number(creatorShare) / 100000 : 0;
  const memberSharePercent = 100 - ownerSharePercent - creatorSharePercent;

  const minStakeDurationMonths = minStakeDuration ? Number(minStakeDuration) / SECONDS_PER_MONTH : null;
  const isOpen = permissionsAddress && permissionsAddress.toLowerCase() === zeroAddress.toLowerCase();

  return (
    <Pane.Root>
      <Pane.Header.Root>
        <Pane.Header.Left />
      </Pane.Header.Root>
      <Pane.Content className="p-4 flex flex-col gap-3">
        <div className="size-12 flex justify-center items-center rounded-full bg-primary/8">
          <i className="size-8 text-tertiary icon-settings" />
        </div>

        <div className="space-y-1">
          <h1 className="text-xl font-semibold">Membership Settings</h1>
          {isLoading ? (
            <Skeleton className="h-5 w-64" animate />
          ) : (
            <p className="text-secondary">
              <span className={isOpen ? 'text-success-500' : 'text-error'}>
                {isOpen ? 'Open' : 'Closed'}
              </span>
              {' — '}
              {isOpen ? 'Anyone can join and add subcoins.' : 'Only the creator can add subcoins.'}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-sm text-tertiary">Fee Breakdown</p>
          <div className="flex w-full h-2 rounded-full overflow-hidden bg-card-border gap-0.5">
            {creatorSharePercent > 0 && (
              <div
                className="h-full bg-alert-400"
                style={{ width: `${creatorSharePercent}%` }}
              />
            )}
            {memberSharePercent > 0 && (
              <div
                className="h-full bg-accent-400"
                style={{ width: `${memberSharePercent}%` }}
              />
            )}
            {ownerSharePercent > 0 && (
              <div
                className="h-full bg-warning-300"
                style={{ width: `${ownerSharePercent}%` }}
              />
            )}
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            {creatorSharePercent > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="inline-block size-2 rounded-full bg-alert-400" />
                <p className="text-alert-400">Coin Creators {creatorSharePercent}%</p>
              </div>
            )}
            {memberSharePercent > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="inline-block size-2 rounded-full bg-accent-400" />
                <p className="text-accent-400">Members {memberSharePercent}%</p>
              </div>
            )}
            {ownerSharePercent > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="inline-block size-2 rounded-full bg-warning-300" />
                <p className="text-warning-300">Community Owner {ownerSharePercent}%</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-sm text-tertiary">Community Address</p>
          {isLoading ? (
            <Skeleton className="h-8 w-full" animate />
          ) : (
            <div className="flex items-center gap-1">
              <p>{launchpadGroup.address}</p>
              <i
                className="icon-copy size-4 text-tertiary hover:text-primary cursor-pointer"
                onClick={() => copy(launchpadGroup.address, () => toast.success('Copied address!'))}
              />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-sm text-tertiary">
            Staking Coin {stakingTokenSymbol ? `(${stakingTokenSymbol})` : ''}
          </p>
          {isLoading ? (
            <Skeleton className="h-8 w-full" animate />
          ) : stakingToken ? (
            <div className="flex items-center gap-1">
              <p>{stakingToken}</p>
              <i
                className="icon-copy size-4 text-tertiary hover:text-primary cursor-pointer"
                onClick={() => copy(stakingToken, () => toast.success('Copied address!'))}
              />
            </div>
          ) : (
            <p className="text-sm text-tertiary">N/A</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-sm text-tertiary">Minimum Stake Duration</p>
          {isLoading ? (
            <Skeleton className="h-6 w-32" animate />
          ) : minStakeDurationMonths ? (
            <p className="text-sm">{Math.round(minStakeDurationMonths)} months</p>
          ) : (
            <p className="text-sm text-tertiary">N/A</p>
          )}
        </div>
      </Pane.Content>
    </Pane.Root>
  );
}

