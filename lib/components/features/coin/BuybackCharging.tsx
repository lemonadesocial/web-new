import { Card } from '$lib/components/core';

export function BuybackCharging({ className, amount = '0.0061 ETH', progress = 0.17 }: { className?: string; amount?: string; progress?: number }) {
  const progressPercentage = Math.min(100, Math.max(0, progress * 100));

  return (
    <Card.Root className={className}>
      <Card.Content className="py-3 px-4 space-y-2">
        <div className="flex justify-between items-center">
          <p data-label>Buyback Charging</p>
          <p className="text-alert-400">{amount}</p>
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
