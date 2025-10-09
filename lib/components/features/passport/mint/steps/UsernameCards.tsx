
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { mainnet } from 'viem/chains';
import { Button, Skeleton, modal } from '$lib/components/core';
import { useAccount, useLemonadeUsername } from '$lib/hooks/useLens';
import { PassportActionKind, usePassportContext } from '../provider';
import { ConnectWallet } from '$lib/components/features/modals/ConnectWallet';
import { SelectProfileModal } from '$lib/components/features/lens-account/SelectProfileModal';
import { useAppKitAccount } from '@reown/appkit/react';

import { chainsMapAtom } from '$lib/jotai';
import { LENS_CHAIN_ID } from '$lib/utils/lens/constants';
import { useAtomValue } from 'jotai';

export function UsernameCard() {
  const { account } = useAccount();
  const { username, isLoading } = useLemonadeUsername(account);
  const [state, dispatch] = usePassportContext();
  const chainsMap = useAtomValue(chainsMapAtom);

  const handleSelect = () => {
    dispatch({ type: PassportActionKind.SelectUsername });
  };

  const handleClaimUsername = () => {
    modal.open(ConnectWallet, {
      props: {
        onConnect: () => {
          modal.open(SelectProfileModal);
        },
        chain: chainsMap[LENS_CHAIN_ID],
      },
    });
  };

  const isSelected = state.useUsername;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 rounded-md bg-card p-4 transition-all border border-card-border">
        <Skeleton animate className="w-8 h-8 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton animate className="h-4 w-24 rounded-full" />
          <Skeleton animate className="h-3 w-16 rounded-full" />
        </div>
        <Skeleton animate className="h-8 w-full rounded-md" />
      </div>
    );
  }

  if (!username) {
    return (
      <div className="flex flex-col gap-4 rounded-md bg-card p-4 border-dashed border-2 border-card-border">
        <i className="icon-lemonade size-8 text-tertiary" />
        <div>
          <p>Claim Username</p>
          <p className="text-sm text-tertiary">You don&apos;t have a username, yet.</p>
        </div>
        <Button
          variant="secondary"
          className="w-full"
          onClick={handleClaimUsername}
          size="sm"
        >
          Claim Username
        </Button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-4 rounded-md bg-card p-4 transition-all border ${isSelected ? 'border-primary' : 'border-card-border'}`}>
      <i className="icon-lemonade size-8 text-tertiary" />
      <div>
        <p>@{username}</p>
        <p className="text-sm text-tertiary">Username</p>
      </div>
      <Button
        variant={isSelected ? "tertiary" : "secondary"}
        className="w-full"
        onClick={handleSelect}
        iconLeft={isSelected ? 'icon-done' : undefined}
        size="sm"
      >
        {isSelected ? 'Selected' : 'Select'}
      </Button>
    </div>
  );
}

export function ENSDomainCard() {
  const { address } = useAppKitAccount();
  const [state, dispatch] = usePassportContext();
  const [ensName, setEnsName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!address) {
      setEnsName(null);
      return;
    }

    const fetchENSName = async () => {
      setIsLoading(true);
      try {
        const provider = new ethers.JsonRpcProvider(mainnet.rpcUrls.default.http[0]);
        const name = await provider.lookupAddress(address);
        setEnsName(name);
      } catch (error) {
        console.error('Error fetching ENS name:', error);
        setEnsName(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchENSName();
  }, [address]);

  const handleSelect = () => {
    dispatch({ type: PassportActionKind.SelectENS });
  };

  const isSelected = state.useENS;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 rounded-md bg-card p-4 transition-all border border-card-border">
        <Skeleton animate className="w-8 h-8 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton animate className="h-4 w-24 rounded-full" />
          <Skeleton animate className="h-3 w-16 rounded-full" />
        </div>
        <Skeleton animate className="h-8 w-full rounded-md" />
      </div>
    );
  }

  if (!ensName) {
    return (
      <div className="flex flex-col gap-4 rounded-md bg-card p-4 border-dashed border-2 border-card-border">
        <i className="icon-ens size-8 text-tertiary" />
        <div>
          <p>Get ENS Domain</p>
          <p className="text-sm text-tertiary">You don&apos;t have an ENS domain, yet.</p>
        </div>
        <Button
          variant="secondary"
          className="w-full"
          size="sm"
          iconRight="icon-arrow-outward"
          onClick={() => window.open('https://ens.domains/', '_blank')}
        >
          Get ENS Domain
        </Button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-4 rounded-md bg-card p-4 transition-all border ${isSelected ? 'border-primary' : 'border-card-border'}`}>
      <i className="icon-ens size-8 text-tertiary" />
      <div>
        <p>{ensName}</p>
        <p className="text-sm text-tertiary">ENS Domain</p>
      </div>
      <Button
        variant={isSelected ? "tertiary" : "secondary"}
        className="w-full"
        onClick={handleSelect}
        iconLeft={isSelected ? 'icon-done' : undefined}
        size="sm"
      >
        {isSelected ? 'Selected' : 'Select'}
      </Button>
    </div>
  );
}
