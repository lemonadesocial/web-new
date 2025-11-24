'use client';
import { Button } from '$lib/components/core';
import { CardTable } from '$lib/components/core/table';
import React from 'react';

const list = [
  {
    symbol: 'ZYN',
    name: 'ZynCoin',
    address: '0x9j2k...p7x9',
    owner: 'alice_wong',
    community: 'Artistry Hub',
    market_cap: '$50M',
    buy_back: 10,
    liquidity: '$20M',
    holder: 75,
    earned: '$45K',
  },
  {
    symbol: 'ZYN',
    name: 'ZynCoin',
    address: '0x9j2k...p7x9',
    owner: 'alice_wong',
    community: 'Artistry Hub',
    market_cap: '$50M',
    buy_back: 10,
    liquidity: '$20M',
    holder: 75,
    earned: '$45K',
  },
];

export function AllCoins() {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="flex flex-col gap-4 relative">
      <p className="text-xl font-semibold">All Coins</p>

      <div className="space-y-3">
        <div className="overflow-y-auto no-scrollbar rounded-md">
          <CardTable.Root loading={loading} data={list} className="table">
            <CardTable.Header>
              <p className="w-[179px]">Ticker</p>
              <p className="w-[144px]">Contract Address</p>
              <p className="w-[144px]">Owner</p>
              <p className="w-[144px]">Community</p>
              <p className="w-[96px]">Marketcap</p>
              <p className="w-[72px]">Buyback</p>
              <p className="w-[80px]">Liquidity</p>
              <p className="w-[80px]">Holders</p>
              <p className="w-[96px]">Fees Earned</p>
              <p className="w-[45px]"></p>
            </CardTable.Header>

            {list.map((item, idx) => (
              <CardTable.Row key={idx}>
                <div className="flex items-center gap-4 text-tertiary px-4 py-3">
                  <div className="flex items-center gap-3 w-[179px]">
                    <div className="size-5 aspect-square rounded-xs bg-gray-500" />
                    <p className="uppercase text-primary">{item.symbol}</p>
                    <p className="text-tertiary">{item.name}</p>
                  </div>

                  <div className="flex gap-2 items-center w-[144px]">
                    <p className="text-tertiary">{item.address}</p>
                    <i className="icon-copy size-4 aspect-square text-quaternary" />
                  </div>

                  <div className="flex gap-2 items-center w-[144px]">
                    <div className="size-5 aspect-square rounded-full bg-gray-500" />
                    <p>{item.owner}</p>
                  </div>

                  <div className="flex gap-2 items-center w-[144px]">
                    <div className="size-5 aspect-square rounded-xs bg-gray-500" />
                    <p>{item.community}</p>
                  </div>

                  <div className="w-[96px] text-accent-400">
                    <p>{item.market_cap}</p>
                  </div>

                  <div className="w-[72px]">
                    <p>buy back</p>
                  </div>

                  <div className="w-[80px]">
                    <p>{item.liquidity}</p>
                  </div>

                  <div className="w-[80px] flex items-center gap-2">
                    <i className="icon-user size-5 aspect-square" />
                    <p>{item.liquidity}</p>
                  </div>

                  <div className="w-[96px] text-success-500">
                    <p>{item.liquidity}</p>
                  </div>

                  <Button variant="tertiary-alt" size="sm">
                    Buy
                  </Button>
                </div>
              </CardTable.Row>
            ))}
          </CardTable.Root>
        </div>
        <CardTable.Pagination limit={10} skip={0} total={100} />
      </div>
    </div>
  );
}
