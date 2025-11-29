import { Card, Skeleton } from '$lib/components/core';
import { Chain } from '$lib/graphql/generated/backend/graphql';
import { useBuybackCharging } from '$lib/hooks/useCoin';

export function BuybackCharging({ className, chain, address }: { className?: string; chain: Chain; address: string }) {
  const { formattedCurrent, progress, isLoadingBuybackCharging } = useBuybackCharging(chain, address);

  const progressPercentage = progress !== null ? Math.min(100, Math.max(0, progress * 100)) : 0;
  const displayAmount = formattedCurrent || '0 ETH';

  return (
    <Card.Root className={className}>
      <Card.Content className="py-3 px-4 space-y-2">
        <div className="flex justify-between items-center">
          <p data-label>Buyback Charging</p>
          {isLoadingBuybackCharging ? (
            <Skeleton className="h-5 w-20" animate />
          ) : (
            <p className="text-alert-400">{displayAmount}</p>
          )}
        </div>
        <div className="relative w-full h-2 rounded-full bg-quaternary overflow-hidden">
          <div
            className="h-full rounded-full bg-alert-400 transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </Card.Content>
    </Card.Root>
  );
}
