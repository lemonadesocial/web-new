'use client';
import React from 'react';
import { Badge, Card, Divider, Progress, Skeleton } from '$lib/components/core';
import { match } from 'ts-pattern';

const list = [
  {
    id: 1,
    image: '',
    title: '$LSD',
    subtitle: 'United Stands of Lemonade United Stands of Lemonade United Stands of Lemonade',
    total: '$2.10M',
    percent: '+15.20%',
    members: 480,
    cost: '0.0052 ETH',
    process: 50,
  },
  {
    id: 2,
    image: '',
    title: '$LSD',
    subtitle: 'United Stands of Lemonade',
    total: '$2.10M',
    percent: '+15.20%',
    members: 480,
    cost: '0.0052 ETH',
    process: 50,
  },
  {
    id: 3,
    image: '',
    title: '$LSD',
    subtitle: 'United Stands of Lemonade',
    total: '$2.10M',
    percent: '+15.20%',
    members: 480,
    cost: '0.0052 ETH',
    process: 50,
  },
  {
    id: 4,
    image: '',
    title: '$LSD',
    subtitle: 'United Stands of Lemonade',
    total: '$2.10M',
    percent: '+15.20%',
    members: 480,
    cost: '0.0052 ETH',
    process: 50,
  },
];

export function FeaturedCoins() {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="flex flex-col gap-4 relative">
      <p className="text-xl font-semibold">Featured Coins</p>
      {match(loading)
        .with(true, () => (
          <div className="flex gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="min-w-[384px] flex flex-col gap-3 p-4 rounded-md border-card-border bg-card">
                <Skeleton animate className="w-12 h-12 rounded-sm" />
                <Skeleton animate className="h-[28px] w-[200px]" />
                <Skeleton animate className="h-4 w-full" />
              </div>
            ))}
          </div>
        ))
        .otherwise(() => (
          <div className="flex gap-4 overflow-y-auto no-scrollbar">
            {list.map((item, idx) => (
              <FeaturedCoinItem key={idx} data={item} />
            ))}
          </div>
        ))}
    </div>
  );
}

function FeaturedCoinItem({ data }: { data: any }) {
  return (
    <Card.Root className="flex-1 min-w-[384px] max-w-[384px]">
      <Card.Content className="p-0">
        <div className="flex gap-4 p-4">
          <div className="w-[118px] h-[118px] rounded-sm bg-gray-500 aspect-square" />
          <div className="flex flex-col gap-2">
            <div>
              <h3 className="text-xl font-semibold">{data.title}</h3>
              {data.subtitle && <p className="text-sm text-tertiary line-clamp-1">{data.subtitle}</p>}
            </div>
            <div className="flex gap-1.5 items-end">
              <p className="text-lg text-accent-400">{data.total}</p>
              <p className="text-sm text-success-500">{data.percent}</p>
            </div>
            <Badge color="var(--color-tertiary)" className="flex items-center gap-1">
              <i className="icon-user size-4" />
              <span className="text-xs">{data.members}</span>
            </Badge>
          </div>
        </div>
        <Divider className="h-1" />
        <div className="px-4 py-3.5 space-y-3">
          <div className="flex justify-between">
            <p>Buyback Charging</p>
            <p className="text-alert-400">{data.cost}</p>
          </div>
          <Progress value={Math.floor(Math.random() * 1000)} total={1000} className="**:data-color:bg-alert-500!" />
        </div>
      </Card.Content>
    </Card.Root>
  );
}
