import { useState } from "react";
import clsx from "clsx";

import { Chain } from "$lib/graphql/generated/backend/graphql";
import { BuyCoin } from "./BuyCoin";
import { SellCoin } from "./SellCoin";

export function SwapCoin ({ chain, address }: { chain: Chain; address: string }) {
  const [tab, setTab] = useState<'buy' | 'sell'>('buy');

  return (
    <div className="w-full rounded-md bg-card border border-card-border">
      <div className="grid grid-cols-2 border-b border-b-divider">
        <div className={clsx('cursor-pointer pt-1.5 pb-2.5', tab === 'buy' && 'border-b-2 border-primary')} onClick={() => setTab('buy')}>
          <p className={clsx('text-center', tab === 'buy' ? 'text-primary' : 'text-tertiary')}>Buy</p>
        </div>
        <div className={clsx('cursor-pointer pt-1.5 pb-2.5', tab === 'sell' && 'border-b-2 border-primary')}  onClick={() => setTab('sell')}>
          <p className={clsx('text-center', tab === 'sell' ? 'text-primary' : 'text-tertiary')}>Sell</p>
        </div>
      </div>
      {
        tab === 'buy' && (
          <BuyCoin chain={chain} address={address} />
        )
      }
      {
        tab === 'sell' && (
          <SellCoin chain={chain} address={address} />
        )
      }
    </div>
  );
}
