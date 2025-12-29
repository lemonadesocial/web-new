'use client';
import React from 'react';

import { Button, Card, Skeleton } from '$lib/components/core';
import { match } from 'ts-pattern';


export function FeaturedCoins() {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="flex flex-col gap-4 relative">
      <div className="flex justify-between items-center">
        <p className="text-xl font-semibold">Featured Coins</p>
        <Button variant="tertiary-alt" size="sm" iconRight="icon-arrow-back-sharp rotate-180">
          View All
        </Button>
      </div>
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
            {/* {pools.map((item, idx) => (
              <FeaturedCoinItem key={idx} pool={item} />
            ))} */}
          </div>
        ))}
    </div>
  );
}

