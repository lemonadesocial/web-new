import { Card, Skeleton } from '$lib/components/core';
import { TraitOrders } from '$lib/services/lemonhead/core';
import { TraitExtends } from '$lib/trpc/lemonheads/types';
import { CanvasImageRenderer } from './shared';

export function LemonHeadPreview({ traits = [] }: { traits?: TraitExtends[]; className?: string }) {
  return (
    <Card.Root className="w-full">
      <Card.Content className="p-0 max-w-[692px] aspect-square relative">
        <Skeleton className="w-full h-full rounded-sm" animate />
        {TraitOrders.map((traitType) => {
          const trait = traits?.find((i) => i?.type === traitType);
          if (!trait?.image) return null;

          return (
            <CanvasImageRenderer
              src={trait.image}
              key={traitType}
              style={{ zIndex: TraitOrders.indexOf(traitType), position: 'absolute', top: 0 }}
            />
          );
        })}
      </Card.Content>
    </Card.Root>
  );
}
