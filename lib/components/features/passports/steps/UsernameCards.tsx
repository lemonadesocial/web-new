'use client';
import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { ethers } from 'ethers';
import { mainnet } from 'viem/chains';
import { useAppKitAccount } from '@reown/appkit/react';
import * as Sentry from '@sentry/nextjs';

import { Button, Card, Skeleton } from '$lib/components/core';
import { useClaimUsername, useLemonadeUsername } from '$lib/hooks/useUsername';

import { usePassportContext } from '../provider';
import { PassportActionKind } from '../types';
import { disconnect } from 'process';

export function UsernameCard() {
  const handleClaimUsername = useClaimUsername();
  const { username, isLoading } = useLemonadeUsername();
  const [state, dispatch] = usePassportContext();

  const handleSelect = () => {
    if (username) {
      dispatch({ type: PassportActionKind.SetLemonadeUsername, payload: username });
    }
  };

  useEffect(() => {
    if (username && !state.lemonadeUsername && !state.useENS) {
      dispatch({ type: PassportActionKind.SetLemonadeUsername, payload: username });
    }
  }, [username, state.lemonadeUsername, state.useENS]);

  const isSelected = state.lemonadeUsername;

  if (isLoading) {
    return <CardIndicator />;
  }

  if (!username) {
    return (
      <CardDetail
        icon="icon-lemonade"
        constainerClass="border-2 border-dashed"
        title="No Username Found"
        subtitle="You don't have a username, yet."
      >
        <Button variant="secondary" onClick={handleClaimUsername} size="sm">
          Claim Username
        </Button>
      </CardDetail>
    );
  }

  return (
    <CardDetail
      icon="icon-lemonade"
      title={`@${username}`}
      subtitle="Username"
      constainerClass={isSelected ? 'border-primary' : 'border-card-border'}
    >
      <Button
        variant={isSelected ? 'tertiary' : 'secondary'}
        onClick={handleSelect}
        iconLeft={isSelected ? 'icon-done' : undefined}
        size="sm"
      >
        {isSelected ? 'Selected' : 'Select'}
      </Button>
    </CardDetail>
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
        dispatch({ type: PassportActionKind.SetEnsName, payload: name });
      } catch (error) {
        Sentry.captureException(error);
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
    return <CardIndicator />;
  }

  if (!ensName) {
    return (
      <Card.Root className="border-2 border-dashed">
        <Card.Content className="text-tertiary flex flex-col gap-5 justify-center items-center py-12 px-0">
          <i aria-hidden="true" className="icon-ens w-[128px] h-[128px] aspect-square" />
          <div className="flex flex-col gap-2 items-center">
            <p>No ENS Found</p>
            <p className="text-sm">Get your ENS domain to use as your passport name.</p>
          </div>
          <Button
            variant="secondary"
            iconRight="icon-arrow-outward"
            onClick={() => window.open('https://ens.domains/', '_blank')}
          >
            Get ENS Domain
          </Button>
        </Card.Content>
      </Card.Root>
    );
  }

  return (
    <CardDetail
      icon="icon-ens"
      title={`@${ensName}`}
      subtitle="ENS Domain"
      containerClass={isSelected ? 'border-primary' : 'border-card-border'}
    >
      <Button variant="flat" onClick={handleSelect} icon={isSelected ? 'icon-check' : undefined} />
    </CardDetail>
  );
}

function CardIndicator() {
  return (
    <Card.Root className="border-2">
      <Card.Content className="flex gap-4">
        <Skeleton animate className="w-8 h-8 rounded-full" />
        <div className="flex flex-col gap-3 flex-1">
          <Skeleton animate className="h-4.5 w-24 rounded-full" />
          <Skeleton animate className="hidden md:block h-3.5 w-16 rounded-full" />
        </div>
        <Skeleton animate className="h-8 w-8 rounded-md" />
      </Card.Content>
    </Card.Root>
  );
}

function CardDetail({
  icon,
  title,
  subtitle,
  containerClass,
  children,
}: React.PropsWithChildren & {
  icon: string;
  title: string;
  subtitle: string;
  containerClass?: string;
}) {
  return (
    <Card.Root className={containerClass}>
      <Card.Content className="flex gap-4 items-center py-3">
        <div className="size-[38px] flex items-center justify-center rounded-sm bg-primary/8">
          <i aria-hidden="true" className={twMerge('text-tertiary', icon)} />
        </div>
        <div className="flex-1">
          <p>{title}</p>
          <p className="hidden md:block text-sm text-tertiary">{subtitle}</p>
        </div>
        {children}
      </Card.Content>
    </Card.Root>
  );
}
