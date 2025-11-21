'use client';
import { type Drift, type ReadWriteAdapter } from '@gud/drift';
import { useCallback, useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import type { Address } from 'viem';
import { parseEther } from 'viem';
import { baseSepolia } from 'viem/chains';

import { Button } from '$lib/components/core/button';
import { useDrift } from '$lib/hooks/useDrift';
import { chainsMapAtom, listChainsAtom } from '$lib/jotai';
import { buyCoin } from '$lib/services/coin/buyCoin';

import { StatItem } from './StatItem';
import { Chain } from '$lib/graphql/generated/backend/graphql';

// const demoPositionManager = '0x7B95457D531a3D7F6848470eC086afedBcD9Afdc' as Address;
const demoPositionManager = '0x8DC3b85e1dc1C846ebf3971179a751896842e5dC' as Address;
const demoAmountLabel = '0.000001 ETH';
const demoAmountIn = parseEther('0.000001');

type CoinPageProps = {
  network?: string;
  address?: string;
};

export function CoinPage({ network, address }: CoinPageProps) {
  const listChains = useAtomValue(listChainsAtom);
  // const chain = listChains.find(item => item.code_name === network)!;
  const chain = {
    "chain_id": "8453" as string,
    "code_name": "base" as string,
    "rpc_url": "https://base-rpc.publicnode.com"
  } as Chain;
  const drift = useDrift(chain);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-5 gap-3">
        <StatItem title="Owner" value="johndoe.eth" />
        <StatItem title="Owner" value="johndoe.eth" />
        <StatItem title="Owner" value="johndoe.eth" />
        <StatItem title="Owner" value="johndoe.eth" />
        <StatItem title="Owner" value="johndoe.eth" />
        <StatItem title="Owner" value="johndoe.eth" />
        <StatItem title="Owner" value="johndoe.eth" />
        <StatItem title="Owner" value="johndoe.eth" />
      </div>
      <BuybackCharging />

      <BuyCoinExample chain={chain} coinAddress={address as Address} drift={drift} />
    </div>
  );
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

type BuyStatus = 'idle' | 'pending' | 'success' | 'error';

type BuyCoinExampleProps = {
  chain: Chain;
  coinAddress: Address;
  drift: Drift | null;
};

function BuyCoinExample({ chain, coinAddress, drift }: BuyCoinExampleProps) {
  const chainId = Number(chain.chain_id)
  const [status, setStatus] = useState<BuyStatus>('idle');
  const [feedback, setFeedback] = useState('');

  const handleBuy = useCallback(async () => {
    if (!drift) {
      setStatus('error');
      setFeedback('Connect a wallet to try buying this coin.');
      return;
    }

    setStatus('pending');
    setFeedback('');

    try {
      const response = await buyCoin(
        {
          coinAddress,
          swapType: 'EXACT_IN',
          amountIn: demoAmountIn,
          slippagePercent: 5,
        },
        demoPositionManager,
        chainId,
        drift as Drift<ReadWriteAdapter>,
      );

      if (typeof response === 'string') {
        setFeedback(response);
      } else if (response && typeof response === 'object' && 'hash' in response) {
        setFeedback((response as { hash?: string }).hash ?? 'Transaction submitted');
      } else {
        setFeedback('Transaction submitted');
      }

      setStatus('success');
    } catch (error) {
      console.log(error)
      setFeedback(error instanceof Error ? error.message : 'Unable to submit transaction');
      setStatus('error');
    }
  }, [chainId, coinAddress, drift]);

  const isLoading = status === 'pending';
  const feedbackColor = status === 'error' ? 'text-danger-500' : 'text-success-500';
  const helperText = feedback || (!drift ? 'Connect a wallet to enable this example.' : '');
  const helperColor = feedback ? feedbackColor : 'text-secondary';

  return (
    <div className="space-y-3 rounded-md border border-card-border bg-card p-4">
      <p className="text-lg font-semibold">Buy Coin Example</p>
      <div className="space-y-1">
        <p className="text-sm text-secondary">Coin</p>
        <p className="text-sm break-all">{coinAddress}</p>
      </div>
      <div className="space-y-1">
        <p className="text-sm text-secondary">Amount</p>
        <p className="text-sm">{demoAmountLabel}</p>
      </div>
      <Button onClick={handleBuy} loading={isLoading} disabled={!drift}>
        Try Buy Coin
      </Button>
      {helperText && (
        <p className={`text-xs ${helperColor} break-all`}>{helperText}</p>
      )}
    </div>
  );
}
