import React from 'react';
import { Card, toast } from '$lib/components/core';
import { Chain } from '$lib/graphql/generated/backend/graphql';
import { copy } from '$lib/utils/helpers';
import { truncateMiddle } from '$lib/utils/string';
import { BuybackCharging } from './BuybackCharging';
import { RegistrationAvanced } from './RegistrationAvanced';
import { RegistrationHolders } from './RegistrationHolders';
import { RegistrationTransactions } from './RegistrationTransactions';
import { SwapCoin } from './SwapCoin';
import clsx from 'clsx';

interface CoinPageProps {
  chain: Chain;
  address: string;
}

export function CoinDetail({ address, chain }: CoinPageProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-4 items-center">
        <div className="size-20 aspecct-square rounded-sm bg-gray-500" />
        <div className="flex flex-col gap-2">
          <div className="space-y-0.5">
            <p className="text-xl">ZYN</p>
            <div className="flex gap-1 text-sm text-tertiary items-center">
              <p>{truncateMiddle(address, 6, 4)}</p>
              <i
                className="icon-copy size-4.5 aspect-square"
                onClick={() => copy(address, () => toast.success('Copied address!'))}
              />
            </div>
          </div>
          <div className="flex items-end gap-1.5">
            <p className="text-accent-400 text-lg">$2.10M</p>
            <p className="text-success-500 text-sm">+15.20%</p>
          </div>
        </div>
      </div>

      <BuybackCharging className="bg-transparent! border-none **:data-label:text-tertiary" />
      <SwapCoin chain={chain} address={address} />

      <TabSection />
    </div>
  );
}

function TabSection() {
  const tabs: Record<string, React.ReactElement> = {
    transactions: <RegistrationTransactions />,
    holders: <RegistrationHolders />,
    advanced: <RegistrationAvanced />,
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
