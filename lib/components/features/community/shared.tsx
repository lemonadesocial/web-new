import { Card, Skeleton, Spacer } from '$lib/components/core';
import clsx from 'clsx';

export function HubCardItem({
  image,
  title,
  subtitle,
  onClick,
  containerClass,
  view = 'card',
}: {
  title: string;
  subtitle?: string;
  image?: { class?: string; src: string };
  containerClass?: string;
  view?: 'card' | 'list-item';
  onClick?: () => void;
}) {
  if (view === 'list-item') {
    return (
      <Card.Root onClick={onClick} className={containerClass}>
        <Card.Content className="flex gap-3 items-center">
          <div className="w-12 h-12">
            <img className={clsx('w-full h-full', image?.class)} src={image?.src} alt={title || ''} />
          </div>
          <div className="flex flex-col gap-1 w-full flex-1">
            <p className="font-title md:text-xl font-semibold">{title}</p>
            {subtitle && <p className="text-sm md:text-base text-tertiary line-clamp-2">{subtitle}</p>}
          </div>
        </Card.Content>
      </Card.Root>
    );
  }

  return (
    <Card.Root onClick={onClick} className={containerClass}>
      <Card.Content className="flex flex-col gap-6">
        <div className="w-8 h-8 md:w-12 md:h-12">
          <img className={clsx('w-full h-full', image?.class)} src={image?.src} alt={title || ''} />
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-title md:text-xl font-semibold">{title}</p>
          {subtitle && <p className="text-tertiary line-clamp-2">{subtitle}</p>}
        </div>
      </Card.Content>
    </Card.Root>
  );
}

export function HubCardItemSkeleton({ view = 'card' }: { view?: 'card' | 'list-item' }) {
  if (view === 'list-item') {
    return (
      <Card.Root>
        <Card.Content className="flex gap-3 items-center">
          <div className="w-12 h-12">
            <Skeleton animate className="w-full h-full" />
          </div>
          <div className="flex flex-col gap-1 w-full flex-1">
            <Skeleton animate className="w-25 h-4.5" />
            <Spacer className="h-1" />
            <Skeleton animate className="w-full h-4.5" />
          </div>
        </Card.Content>
      </Card.Root>
    );
  }

  return (
    <Card.Root className="min-w-36">
      <Card.Content className="flex flex-col gap-6">
        <div className="w-8 h-8 md:w-12 md:h-12">
          <Skeleton animate className="w-full h-full" />
        </div>
        <div className="flex flex-col gap-1">
          <Skeleton animate className="w-25 h-6" />
          <Spacer className="h-2" />
          <Skeleton animate className="w-full h-6" />
        </div>
      </Card.Content>
    </Card.Root>
  );
}
