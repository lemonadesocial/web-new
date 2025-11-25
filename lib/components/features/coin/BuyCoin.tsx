import { useState } from 'react';
import { mainnet, sepolia } from 'viem/chains';

import { Button, Spacer } from '$lib/components/core';
import { Chain } from '$lib/graphql/generated/backend/graphql';
import { chainsMapAtom } from '$lib/jotai';
import { useAtomValue } from 'jotai';

const quickAmounts = ['0.01', '0.1', '0.5', '1'];

export function BuyCoin({ chain, address }: { chain: Chain; address: string }) {
  const chainsMap = useAtomValue(chainsMapAtom);
  const ethChainId = process.env.NEXT_PUBLIC_APP_ENV === 'production' ? mainnet.id : sepolia.id;
  const ethChain = chainsMap[ethChainId];
  const [amount, setAmount] = useState('');

  return (
    <div className="w-full max-w-[336px] rounded-md bg-card border border-card-border py-3 px-4">
      <div className="flex items-center justify-between">
        <p className="text-tertiary">1 LSD = 0.00261 ETH</p>
        <i className="icon-settings size-5 text-tertiary" />
      </div>

      <div className="mt-3 py-2 px-3 rounded-sm bg-primary/8 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center py-1.5 px-4.5 justify-center rounded-full bg-primary/8 gap-1.5">
            {
              ethChain.logo_url && <img src={ethChain.logo_url} alt={ethChain.name} className="size-4 rounded-full" />
            }
            <p className="text-secondary font-medium text-sm">ETH</p>
          </div>
          <input
            type="text"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="text-2xl bg-transparent border-none outline-none text-right w-full"
          />
        </div>
        <p className="text-sm text-tertiary">Balance: 18.32 ETH</p>
        <div className="grid grid-cols-4 gap-2">
          {quickAmounts.map(value => (
            <Button
              key={value}
              size="xs"
              variant="tertiary"
              onClick={() => setAmount(value)}
            >
              {value} ETH
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-3 rounded-sm bg-primary/8">
        <div className="flex items-center justify-between py-2.5 px-3">
          <div className="flex items-center gap-2">
            <p className="text-sm text-tertiary">0 ETH</p>
            <i className="icon-arrow-foward-sharp text-tertiary size-4" />
            <p  className="text-sm text-tertiary">0 LSD</p>
          </div>
          <p className="text-sm text-tertiary">~$0</p>
        </div>
        <hr className="border-t border-t-divider" />
        <div className="flex items-center justify-between py-2.5 px-3">
          <p className="text-sm text-tertiary">Slippage</p>
          <p className="text-sm text-tertiary">5%</p>
        </div>
      </div>

      <Button variant="secondary" className="w-full mt-4">
        Buy LSD
      </Button>
    </div>
  );
}

