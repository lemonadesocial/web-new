'use client';

import React, { useState } from 'react';
import { StatItem } from './StatItem';
import { useAtomValue } from 'jotai';
import { listChainsAtom } from '$lib/jotai';
import { Chain } from '$lib/graphql/generated/backend/graphql';
import { formatWallet } from '$lib/utils/crypto';
import { useFees, useGroup, useOwner, useTokenData } from './useCoin';
import { BuyCoin } from './BuyCoin';
import { notFound } from 'next/navigation';
import { Badge, Card, toast } from '$lib/components/core';
import clsx from 'clsx';
import { RegistrationTransactions } from './RegistrationTransactions';
import { RegistrationHolders } from './RegistrationHolders';
import { RegistrationAvanced } from './RegistrationAvanced';
import { copy } from '$lib/utils/helpers';
import { add } from 'date-fns';

interface CoinPageProps {
  network: string;
  address: string;
}

export function CoinPage({ network, address }: CoinPageProps) {
  const listChains = useAtomValue(listChainsAtom);
  const chain = listChains.find((chain) => chain.code_name === network);

  if (!chain) return notFound();

  return (
    <div className="flex gap-4 items-start">
      <div className="flex flex-col gap-4">
        <Stats chain={chain!} address={address} />
        <BuybackCharging />
        <Registration />
      </div>

      <div className="flex flex-col gap-4 max-w-sm">
        <BuyCoin chain={chain} address={address} />
        <CoinInfo />
      </div>
    </div>
  );
}

function Stats({ chain, address }: { chain: Chain; address: string }) {
  const [treasuryValue, setTreasuryValue] = useState<string>('');
  const { launchpadGroup, implementationAddress, isLoading } = useGroup(chain, address);
  const { owner, isLoadingOwner } = useOwner(chain, address);
  const { formattedFees, isLoadingFees } = useFees(chain, address);

  return (
    <div className="grid grid-cols-5 gap-3">
      <StatItem title="Owner" value={owner ? formatWallet(owner) : isLoadingOwner ? 'Loading...' : 'N/A'} />
      <StatItem
        title="Community"
        value={
          isLoading
            ? 'Loading...'
            : launchpadGroup && implementationAddress
              ? launchpadGroup?.name || formatWallet(implementationAddress)
              : 'N/A'
        }
      />
      <StatItem title="Fees Earned" value={formattedFees || (isLoadingFees ? 'Loading...' : 'N/A')} />
      <StatItem title="Treasury" value="Coming Soon" />
      <StatItem title="Volume (24h)" value="Coming Soon" />
      <StatItem title="Marketcap" value="Coming Soon" />
      <StatItem title="Liquidity" value="Coming Soon" />
      <StatItem title="Fair Launch" value="Coming Soon" />
      <StatItem title="Holders" value="Coming Soon" />
    </div>
  );
}

function BuybackCharging({ amount = '0.0061 ETH', progress = 0.17 }: { amount?: string; progress?: number }) {
  const progressPercentage = Math.min(100, Math.max(0, progress * 100));

  return (
    <div className="py-3 px-4 rounded-md border-card-border bg-card space-y-2">
      <div className="flex justify-between items-center">
        <p>Buyback Charging</p>
        <p className="text-alert-400">{amount}</p>
      </div>
      <div className="relative w-full h-2 rounded-full bg-quaternary overflow-hidden">
        <div
          className="h-full rounded-full bg-alert-400 transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
}

function Registration() {
  const tabs: Record<string, React.ReactElement> = {
    transactions: <RegistrationTransactions />,
    holders: <RegistrationHolders />,
    advanced: <RegistrationAvanced />,
  };

  const [selected, setSelected] = React.useState('transactions');
  return (
    <Card.Root>
      <Card.Content className="p-0">
        <ul className="flex gap-4 overflow-auto px-4 pt-1 border-b text-tertiary h-[42px]">
          {Object.entries(tabs).map(([key, _]) => (
            <li
              key={key}
              className={clsx(
                'pb-2.5 cursor-pointer hover:text-primary',
                key === selected && 'border-b-2 border-primary text-primary',
              )}
              onClick={() => setSelected(key)}
            >
              <p className="capitalize">{key}</p>
            </li>
          ))}
        </ul>
        <div className="p-4">{tabs[selected]}</div>
      </Card.Content>
    </Card.Root>
  );
}

function CoinInfo() {
  const percent = 6.28;
  const address = '0x7dg7...f8ws';
  return (
    <Card.Root>
      <Card.Content className="p-0 divide-y divide-(--color-divider)">
        <div className="flex flex-col gap-4 p-4">
          <div className="flex gap-3">
            <div className="size-[76px] aspect-square rounded-sm bg-gray-500" />

            <div className="flex flex-col gap-2 w-full">
              <div className="flex gap-3">
                <div className="flex-1">
                  <p>$LSD</p>
                  <p className="line-clamp-1 text-tertiary text-sm">Lemonade Stable Dollar</p>
                </div>
                <div className="text-right">
                  <p className="text-accent-400">$683.17K</p>
                  <p className={clsx('text-sm', percent > 0 ? 'text-success-500' : 'text-danger-500')}>+6.28%</p>
                </div>
              </div>
              <Badge className="text-tertiary bg-quaternary flex gap-1">
                <p className="text-xs">{address}</p>
                <i
                  className="icon-copy size-4 aspect-square"
                  onClick={() => copy(address, () => toast.success('Copied address!'))}
                />
              </Badge>
            </div>
          </div>

          <p>
            Introducing Lemonade Stable Dollar, the ultimate cryptocurrency designed for seamless transactions and
            vibrant community engagement.
          </p>

          <div className="flex justify-between items-center text-tertiary [&_i]:hover:text-primary [&_i]:cursor-pointer">
            <div className="flex gap-3">
              <i className="size-5 aspect-square icon-globe" />
              <i className="size-5 aspect-square icon-instagram" />
              <i className="size-5 aspect-square icon-telegram" />
              <i className="size-5 aspect-square icon-tiktok" />
              <i className="size-5 aspect-square icon-twitter" />
              <i className="size-5 aspect-square icon-youtube-outline" />
            </div>

            <div className="flex gap-3">
              <i className="size-5 aspect-square icon-basescan-fill" />
              <i className="size-5 aspect-square icon-dexscreener-fill" />
            </div>
          </div>
        </div>

        <div className="p-4 flex gap-10 items-center text-sm text-tertiary">
          <p className="flex-1">Community</p>
          <div className="flex gap-1.5 items-center overflow-hidden">
            <div className="size-4 aspect-square rounded-xs bg-gray-500" />
            <p className='line-clamp-1 truncate'>Culture Fest</p>
          </div>
        </div>

        <div className="p-4 flex gap-10 items-center text-sm text-tertiary">
          <p className="flex-1">Creator</p>
          <div className="flex gap-1.5 items-center overflow-hidden">
            <p className='line-clamp-1 truncate'>johndoe.eth</p>
          </div>
        </div>

        <div className="p-4 flex gap-10 items-center text-sm text-tertiary">
          <p className="flex-1">Launched on Lemonade</p>
          <div className="flex gap-1.5 items-center overflow-hidden">
            <p className='line-clamp-1 truncate'>July 29, 2023</p>
          </div>
        </div>
      </Card.Content>
    </Card.Root>
  );
}
