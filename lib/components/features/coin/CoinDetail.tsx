import React from 'react';
import { Card, Skeleton, toast } from '$lib/components/core';
import { Chain } from '$lib/graphql/generated/backend/graphql';
import { copy } from '$lib/utils/helpers';
import { truncateMiddle } from '$lib/utils/string';
import { useMarketCap, useMarketCapChange, useTokenData } from '$lib/hooks/useCoin';
import { BuybackCharging } from './BuybackCharging';
import { CoinAdvanced } from './CoinAdvanced';
import { CoinHolders } from './CoinHolders';
import { CoinTransactions } from './CoinTransactions';
import { SwapCoin } from './SwapCoin';
import clsx from 'clsx';

interface CoinPageProps {
  chain: Chain;
  address: string;
}

export function CoinDetail({ address, chain }: CoinPageProps) {
  const { tokenData, isLoadingTokenData } = useTokenData(chain, address);
  const { formattedMarketCap, isLoadingMarketCap } = useMarketCap(chain, address);
  const { percentageChange, isLoadingMarketCapChange } = useMarketCapChange(chain, address);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-4 items-center">
        <div className="size-20 aspecct-square rounded-sm bg-gray-500" />
        <div className="flex flex-col gap-2">
          <div className="space-y-0.5">
            {isLoadingTokenData ? (
              <Skeleton className="h-7 w-20" animate />
            ) : (
              <p className="text-xl">{tokenData?.symbol || 'N/A'}</p>
            )}
            <div className="flex gap-1 text-sm text-tertiary items-center">
              <p>{truncateMiddle(address, 6, 4)}</p>
              <i
                className="icon-copy size-4.5 aspect-square"
                onClick={() => copy(address, () => toast.success('Copied address!'))}
              />
            </div>
          </div>
          <div className="flex items-end gap-1.5">
            {isLoadingMarketCap ? (
              <Skeleton className="h-7 w-20" animate />
            ) : (
              formattedMarketCap && <p className="text-accent-400 text-lg">{formattedMarketCap}</p>
            )}
            {isLoadingMarketCapChange ? (
              <Skeleton className="h-5 w-16" animate />
            ) : (
              percentageChange !== null && (
                <p
                  className={clsx(
                    'text-sm',
                    percentageChange >= 0 ? 'text-success-500' : 'text-error',
                  )}
                >
                  {percentageChange >= 0 ? '+' : '-'}
                  {Math.abs(percentageChange).toFixed(2)}%
                </p>
              )
            )}
          </div>
        </div>
      </div>

      <BuybackCharging chain={chain} address={address} className="bg-transparent! border-none **:data-label:text-tertiary" />
      <SwapCoin chain={chain} address={address} />

      <TabSection chain={chain} address={address} />
    </div>
  );
}

function TabSection({ chain, address }: CoinPageProps) {
  const tabs: Record<string, React.ReactElement> = {
    transactions: <CoinTransactions chain={chain} address={address} />,
    holders: <CoinHolders chain={chain} address={address} />,
    advanced: <CoinAdvanced chain={chain} address={address} />,
  };

  const [selected, setSelected] = React.useState('transactions');

  return (
    <Card.Root className="bg-transparent border-none">
      <Card.Content className="p-0">
        <ul className="flex gap-4 overflow-auto no-scrollbar pt-1 border-b text-tertiary h-[42px]">
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
        {tabs[selected]}
      </Card.Content>
    </Card.Root>
  );
}
