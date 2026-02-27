'use client';

import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { ethers } from 'ethers';

import { InputField } from '$lib/components/core';
import { StakingManagerClient } from '$lib/services/coin/StakingManagerClient';
import { chainsMapAtom } from '$lib/jotai';
import { LAUNCH_CHAIN_ID } from '$lib/utils/constants';
import { useQuery } from '$lib/graphql/request';
import {
  ListLaunchpadGroupsDocument,
  type ListLaunchpadGroupsQuery,
  type ListLaunchpadGroupsQueryVariables,
} from '$lib/graphql/generated/backend/graphql';
import { Menu, MenuItem } from '$lib/components/core';
import { randomCommunityImage } from '$lib/utils/community';

export type CommunityData = {
  groupAddress: string;
  ownerShare: bigint;
  creatorShare: bigint;
};

type LaunchpadGroupItem = ListLaunchpadGroupsQuery['listLaunchpadGroups']['items'][number];

type CommunitySearchProps = {
  onSuccess?: (data: CommunityData) => void;
};

export function CommunitySearch({ onSuccess }: CommunitySearchProps) {
  const chainsMap = useAtomValue(chainsMapAtom);
  const launchChain = chainsMap[LAUNCH_CHAIN_ID];
  const [searchValue, setSearchValue] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<LaunchpadGroupItem | null>(null);
  const [isLoadingContract, setIsLoadingContract] = useState(false);
  const [contractError, setContractError] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchValue.trim());
    }, 300);

    return () => clearTimeout(handler);
  }, [searchValue]);

  type ListLaunchpadGroupsWithSearchVariables = ListLaunchpadGroupsQueryVariables & { search?: string };

  const normalizedSearch = debouncedSearch || undefined;
  const queryVariables = normalizedSearch
    ? (ethers.isAddress(normalizedSearch)
      ? { address: normalizedSearch }
      : { search: normalizedSearch })
    : {};

  const { data, loading: isSearching }: { data: ListLaunchpadGroupsQuery | null; loading: boolean } =
    useQuery<ListLaunchpadGroupsQuery, ListLaunchpadGroupsWithSearchVariables>(ListLaunchpadGroupsDocument, {
      variables: queryVariables as ListLaunchpadGroupsWithSearchVariables,
      skip: !debouncedSearch,
      fetchPolicy: 'network-only',
    });

  const groups = data?.listLaunchpadGroups?.items || [];

  const handleSelect = async (group: LaunchpadGroupItem) => {
    setIsLoadingContract(true);
    setContractError(false);

    try {
      if (!launchChain) {
        throw new Error('Missing launch chain');
      }

      const client = StakingManagerClient.getInstance(launchChain, group.address);

      const [ownerShare, creatorShare] = await Promise.all([
        client.getOwnerShare().catch(() => null),
        client.getCreatorShare().catch(() => null),
      ]);

      if (ownerShare === null || creatorShare === null) {
        throw new Error('Missing share data');
      }

      onSuccess?.({
        groupAddress: group.address,
        ownerShare: ownerShare / BigInt(100000),
        creatorShare: creatorShare / BigInt(100000),
      });
      setSelectedGroup(group);
    } catch {
      setContractError(true);
      setSelectedGroup(null);
    } finally {
      setIsLoadingContract(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
    setSelectedGroup(null);
    setContractError(false);
    if (!value.trim()) {
      return;
    }
  };

  if (selectedGroup) return (
    <div className="flex items-center gap-3 rounded-md border border-card-border bg-card px-3 py-2">
      <img src={randomCommunityImage(selectedGroup.address)} alt={selectedGroup.name} className="size-[38px] rounded-sm object-cover" />
      <div className="flex-1">
        <p>{selectedGroup.name}</p>
        <p className="text-sm text-tertiary">{selectedGroup.address}</p>
      </div>
      <button type="button" aria-label="Clear selection" className="cursor-pointer" onClick={() => setSelectedGroup(null)}>
        <i className="icon-x size-4 text-tertiary" />
      </button>
    </div>
  );

  return (
    <Menu.Root
      isOpen={Boolean(groups.length && !selectedGroup)}
      placement="bottom-start"

    >
      <Menu.Trigger className="w-full">
        <InputField
          placeholder="Search Communities"
          value={searchValue}
          onChangeText={handleSearch}
          right={
            isLoadingContract
              ? { icon: 'icon-loader animate-spin text-tertiary' }
              : isSearching
                ? { icon: 'icon-loader animate-spin text-tertiary' }
                : contractError
                  ? { icon: 'icon-cancel text-error' }
                  : selectedGroup
                    ? { icon: 'icon-done text-success-500' }
                    : undefined
          }
        />
      </Menu.Trigger>

      <Menu.Content className="p-0 w-full max-h-52 overflow-y-auto">
        {groups.map((group) => (
          <MenuItem
            key={group.address}
            onClick={() => handleSelect(group)}
            className="flex items-center gap-3 px-3 py-2 text-left w-full hover:bg-background/64 transition-colors"
          >
            <img src={randomCommunityImage(group.address)} alt={group.name} className="size-[38px] rounded-sm object-cover" />
            <div className="flex flex-col">
              <p>{group.name}</p>
              <p className="text-sm text-tertiary">{group.address}</p>
            </div>
          </MenuItem>
        ))}
      </Menu.Content>
    </Menu.Root>
  );
}
