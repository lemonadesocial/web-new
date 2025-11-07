'use client';

import { useState, useRef } from 'react';
import { useAtomValue } from 'jotai';
import { JsonRpcProvider, Contract, ethers } from 'ethers';

import { InputField } from '$lib/components/core/input/input-field';
import { chainsMapAtom } from '$lib/jotai';
import { LAUNCH_CHAIN_ID } from '$lib/utils/constants';
import StakingManagerABI from '$lib/abis/token-launch-pad/StakingManager.json';

export type CommunityData = {
  groupAddress: string;
  ownerShare: bigint;
  creatorShare: bigint;
};

type CommunitySearchProps = {
  onSuccess?: (data: CommunityData) => void;
};

export function CommunitySearch({ onSuccess }: CommunitySearchProps) {
  const chainsMap = useAtomValue(chainsMapAtom);
  const launchChain = chainsMap[LAUNCH_CHAIN_ID];

  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const searchCommunity = async (groupAddress: string): Promise<CommunityData | null> => {
    if (!launchChain?.rpc_url) {
      return null;
    }

    const provider = new JsonRpcProvider(launchChain.rpc_url);
    const contract = new Contract(groupAddress, StakingManagerABI.abi, provider);

    const [ownerShare, creatorShare] = await Promise.all([
      contract.ownerShare().catch(() => null),
      contract.creatorShare().catch(() => null),
    ]);

    if (!ownerShare || !creatorShare) {
      return null;
    }

    if (ownerShare === BigInt(0) && creatorShare === BigInt(0)) {
      return null;
    }

    return {
      groupAddress,
      ownerShare: ownerShare / BigInt(100000),
      creatorShare: creatorShare / BigInt(100000),
    };
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const trimmedValue = value.trim();

    if (!trimmedValue) {
      setIsLoading(false);
      setIsSuccess(false);
      setIsCompleted(false);
      return;
    }

    if (!ethers.isAddress(trimmedValue)) {
      setIsLoading(false);
      setIsSuccess(false);
      setIsCompleted(false);
      return;
    }

    setIsLoading(true);
    setIsSuccess(false);
    setIsCompleted(false);

    timeoutRef.current = setTimeout(async () => {
      const result = await searchCommunity(trimmedValue);
      
      if (result) {
        setIsSuccess(true);
        onSuccess?.(result);
      } else {
        setIsSuccess(false);
      }
      
      setIsCompleted(true);
      setIsLoading(false);
    }, 300);
  };

  return (
    <div className="relative">
      <InputField
        placeholder="Search Communities"
        value={searchValue}
        onChangeText={handleSearch}
        iconLeft="icon-search"
        right={
          isLoading
            ? { icon: 'icon-loader animate-spin text-tertiary' }
            : isSuccess
            ? { icon: 'icon-done text-success-500' }
            : isCompleted
            ? { icon: 'icon-cancel text-error' }
            : undefined
        }
      />
    </div>
  );
}
