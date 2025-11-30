'use client';

import type { ReactNode } from 'react';
import { Chain } from '$lib/graphql/generated/backend/graphql';
import { CardTable } from '$lib/components/core/table';
import { toast, Skeleton } from '$lib/components/core';
import { copy } from '$lib/utils/helpers';
import { formatWallet } from '$lib/utils/crypto';
import { formatNumber } from '$lib/utils/number';
import { FlaunchClient } from '$lib/services/coin/FlaunchClient';
import { useQuery } from '@tanstack/react-query';

interface CoinAdvancedProps {
  chain: Chain;
  address: string;
}

export function CoinAdvanced({ chain, address }: CoinAdvancedProps) {
  const flaunchClient = FlaunchClient.getInstance(chain, address);

  const { data: poolId, isLoading: isLoadingPoolId } = useQuery({
    queryKey: ['pool-id', chain.chain_id, address],
    queryFn: async () => {
      return await flaunchClient.getPoolId();
    },
  });

  const { data: tokenId, isLoading: isLoadingTokenId } = useQuery({
    queryKey: ['token-id', chain.chain_id, address],
    queryFn: async () => {
      return (await flaunchClient.getTokenId()).toString();
    },
  });

  const { data: launchAddress, isLoading: isLoadingLaunchAddress } = useQuery({
    queryKey: ['launch-address', chain.chain_id, address],
    queryFn: async () => {
      return await flaunchClient.getFlaunchAddress();
    },
  });

  const { data: positionManager, isLoading: isLoadingPositionManager } = useQuery({
    queryKey: ['position-manager', chain.chain_id, address],
    queryFn: async () => {
      return await flaunchClient.getPositionManagerAddress();
    },
  });

  return (
    <CardTable.Root data={[]}>
      <AdvancedRow label="Pool ID">
        <AsyncValue isLoading={isLoadingPoolId} value={poolId}>
          {(value) => <LongAddressValue address={value} />}
        </AsyncValue>
      </AdvancedRow>

      <AdvancedRow label="NFT ID">
        <AsyncValue isLoading={isLoadingTokenId} value={tokenId}>
          {(value) => <p>{value}</p>}
        </AsyncValue>
      </AdvancedRow>

      <AdvancedRow label="Launch Address">
        <AsyncValue isLoading={isLoadingLaunchAddress} value={launchAddress}>
          {(value) => <AddressValue address={value} />}
        </AsyncValue>
      </AdvancedRow>

      <AdvancedRow label="Position Manager">
        <AsyncValue isLoading={isLoadingPositionManager} value={positionManager}>
          {(value) => <AddressValue address={value} />}
        </AsyncValue>
      </AdvancedRow>

      <AdvancedRow label="Manager">
        <p className="text-tertiary">Coming Soon</p>
      </AdvancedRow>

      <AdvancedRow label="Bid Wall - Cumulative Swap Fees">
        <p className="text-tertiary">Coming Soon</p>
      </AdvancedRow>

      <AdvancedRow label="Bid Wall - Amount0">
        <p className="text-tertiary">Coming Soon</p>
      </AdvancedRow>

      <AdvancedRow label="Bid Wall - Amount1">
        <p className="text-tertiary">Coming Soon</p>
      </AdvancedRow>

      <AdvancedRow label="Bid Wall - Pending ETH">
        <p className="text-tertiary">Coming Soon</p>
      </AdvancedRow>

      <AdvancedRow label="Internal Swap Pool - Amount0">
        <p className="text-tertiary">Coming Soon</p>
      </AdvancedRow>

      <AdvancedRow label="Internal Swap Pool - Amount1">
        <p className="text-tertiary">Coming Soon</p>
      </AdvancedRow>

      <AdvancedRow label="Claimable Fees">
        <p className="text-tertiary">Coming Soon</p>
      </AdvancedRow>

      <AdvancedRow label="Notifier">
        <p className="text-tertiary">Coming Soon</p>
      </AdvancedRow>

      <AdvancedRow label="Indexer Subscriber">
        <p className="text-tertiary">Coming Soon</p>
      </AdvancedRow>

      <AdvancedRow label="Is Indexed?">
        <p className="text-tertiary">Coming Soon</p>
      </AdvancedRow>
    </CardTable.Root>
  );
}


function AdvancedRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <CardTable.Row>
      <div className="flex gap-4 px-4 py-3">
        <div className="w-[280px] min-w-[280px]">
          <p className="text-tertiary">{label}</p>
        </div>
        <div className="flex-1">
          {children}
        </div>
      </div>
    </CardTable.Row>
  );
}

interface AsyncValueProps<T> {
  isLoading: boolean;
  value: T | null | undefined;
  children: (value: T) => ReactNode;
}

function AsyncValue<T>({ isLoading, value, children }: AsyncValueProps<T>) {
  if (isLoading) {
    return <Skeleton className="h-5 w-[200px]" animate />;
  }

  if (!value) {
    return <p className="text-tertiary">N/A</p>;
  }

  return <>{children(value)}</>;
}

function AddressValue({ address }: { address: string; }) {
  return (
    <div className="flex items-center gap-2">
      <p>{address}</p>
      <i
        className="icon-copy size-4 text-tertiary hover:text-primary cursor-pointer"
        onClick={() => copy(address, () => toast.success('Copied address!'))}
      />
    </div>
  );
}

function LongAddressValue({ address }: { address: string }) {
  return (
    <div className="flex items-center gap-2">
      <p className="break-all">{address}</p>
      <i
        className="icon-copy size-4 text-tertiary hover:text-primary cursor-pointer flex-shrink-0"
        onClick={() => copy(address, () => toast.success('Copied!'))}
      />
    </div>
  );
}
