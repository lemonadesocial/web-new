'use client';

import { useStakingCoin } from '$lib/hooks/useCoin';
import { CoinPage } from '$lib/components/features/coin/CoinPage';
import { Skeleton } from '$lib/components/core';

export function CoinPageClient({ spaceId }: { spaceId: string }) {
  const { stakingToken, chain, isLoading } = useStakingCoin(spaceId);

  if (isLoading) {
    return (
      <div className="max-w-[1256px] mx-auto">
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!chain || !stakingToken) return null;

  return <CoinPage network={chain.code_name} address={stakingToken} />;
}
