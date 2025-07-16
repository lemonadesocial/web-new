import { Card } from '$lib/components/core';
import { TraitOrders } from '$lib/services/lemonhead/core';
import { TraitExtends } from '$lib/trpc/lemonheads/types';
import { twMerge } from 'tailwind-merge';
import { CanvasImageRenderer } from './shared';

export function LemonHeadPreview({ traits = [], className }: { traits?: TraitExtends[]; className?: string }) {
  return (
    <Card.Root className={twMerge('w-full', className)}>
      <Card.Content className="p-0 max-w-[692px] aspect-square relative">
        {TraitOrders.map((traitType) => {
          const trait = traits?.find((i) => i?.type === traitType);
          if (!trait?.image) return null;

          return (
            <CanvasImageRenderer
              file={trait.image}
              key={traitType}
              style={{ zIndex: TraitOrders.indexOf(traitType), position: 'absolute', top: 0 }}
            />
          );
        })}
      </Card.Content>
    </Card.Root>
  );
}
