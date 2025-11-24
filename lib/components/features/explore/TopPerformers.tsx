'use client';
import React from 'react';
import { Card } from '$lib/components/core';
import { LemonheadLeaderBoardRank } from '../lemonheads/LemonheadLeaderBoardRank';
import clsx from 'clsx';

const topVolumn = [
  { id: 1, title: 'Tech Growth Token', subtitle: 'TGT', amount: '$4.20M' },
  { id: 2, title: 'Crypto Art Token', subtitle: 'CRYPTOART', amount: '$3.05M' },
  { id: 3, title: 'Solar Power Token', subtitle: 'SOLAR', amount: '$7.60M' },
  { id: 4, title: 'Clean Water Coin', subtitle: 'CCWATER', amount: '$3.85M' },
  { id: 5, title: 'Education Token', subtitle: 'EDUCOIN', amount: '$4.20M' },
];

const topMarket = [
  { id: 1, title: 'Green Energy Coin', subtitle: 'TGT', amount: '$4.20M', percent: -11 },
  { id: 2, title: 'Cybersecurity Coin', subtitle: 'CYBERSEC', amount: '$3.05M', percent: 10.03 },
  { id: 3, title: 'Smart Contract Coin', subtitle: 'SCC', amount: '$7.60M', percent: 13.1 },
  { id: 4, title: 'Digital Identity Coin', subtitle: 'IDENTITY', amount: '$3.85M', percent: -12.75 },
  { id: 5, title: 'Blockchain Real Estate', subtitle: 'ESTATE', amount: '$4.20M', percent: 10.3 },
];

const topTrade = [
  { id: 1, title: 'HealthTech Dollar', subtitle: 'HEALTH', amount: '423' },
  { id: 2, title: 'AgriTech Dollar', subtitle: 'AGRITECH', amount: '325' },
  { id: 3, title: 'AI Development Dollar', subtitle: 'INTELLIGENCE', amount: '300' },
  { id: 4, title: 'Virtual Reality Dollar', subtitle: 'VRD', amount: '290' },
  { id: 5, title: 'Mobility Dollar', subtitle: 'MOBILITY', amount: '127' },
];

export function TopPerformers() {
  const [loadingTopVolumn, setLoadingTopVolumn] = React.useState(true);

  React.useEffect(() => {
    const timer1 = setTimeout(() => setLoadingTopVolumn(false), 1000);
    return () => {
      clearTimeout(timer1);
    };
  }, []);

  return (
    <div className="flex flex-col gap-4 relative">
      <p className="text-xl font-semibold">Top Performers</p>
      <div className="flex flex-col md:flex-row gap-4">
        <CardList title="Top Volume" data={topVolumn} />
        <CardList title="Top Market" data={topMarket} />
        <CardList title="Most Trades (24h)" data={topTrade} />
      </div>
    </div>
  );
}

function CardList({ data, title }: { data: any; title: string }) {
  return (
    <Card.Root className="flex-1 w-full">
      <Card.Header className="border-b">
        <p>{title}</p>
      </Card.Header>
      <Card.Content className="divide-y divide-(--color-divider) p-0">
        {data.map((item: any, idx: number) => (
          <div key={idx} className="flex gap-3 items-center px-4 py-3">
            <LemonheadLeaderBoardRank rank={idx + 1} />
            <div className="size-10 aspect-square rounded-sm bg-gray-500" />
            <div className="flex-1">
              <p className="line-clamp-1">{item.title}</p>
              <p className="text-sm text-tertiary uppercase">{item.subtitle}</p>
            </div>
            <div className="text-right">
              <p>{item.amount}</p>
              {item.percent && (
                <p className={clsx(item.percent > 0 ? 'text-success-500' : 'text-danger-500')}>
                  {item.percent > 0 && '+'}
                  {parseFloat(item.percent).toFixed(2)}%
                </p>
              )}
            </div>
          </div>
        ))}
      </Card.Content>
    </Card.Root>
  );
}
