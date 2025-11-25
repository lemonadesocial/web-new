'use client';

import { useState } from 'react';
import { StatItem } from './StatItem';
import { useAtomValue } from 'jotai';
import { listChainsAtom } from '$lib/jotai';
import { Chain } from '$lib/graphql/generated/backend/graphql';
import { formatWallet } from '$lib/utils/crypto';
import { useFees, useGroup, useOwner } from './useCoin';
import { BuyCoin } from './BuyCoin';
import { notFound } from 'next/navigation';

interface CoinPageProps {
  network: string;
  address: string;
}

export function CoinPage({ network, address }: CoinPageProps) {
  const listChains = useAtomValue(listChainsAtom);
  const chain = listChains.find(chain => chain.code_name === network);

  if (!chain) return notFound();

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-4">
        <Stats chain={chain!} address={address} />
        <BuybackCharging />
      </div>
      <BuyCoin chain={chain} address={address} />
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
        value={isLoading ? "Loading..." : launchpadGroup && implementationAddress ? (launchpadGroup?.name || formatWallet(implementationAddress)) : "N/A"} />
      <StatItem title="Fees Earned" value={formattedFees || (isLoadingFees ? 'Loading...' : 'N/A')} />
      <StatItem title="Treasury" value="Coming Soon" />
      <StatItem title="Volume (24h)" value="Coming Soon" />
      <StatItem title="Marketcap" value="Coming Soon" />
      <StatItem title="Liquidity" value="Coming Soon" />
      <StatItem title="Fair Launch" value="Coming Soon" />
      <StatItem title="Holders" value="Coming Soon" />
    </div>
  )
}

function BuybackCharging({
  amount = "0.0061 ETH",
  progress = 0.17
}: {
  amount?: string;
  progress?: number;
}) {
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