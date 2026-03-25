'use client';
import { twMerge } from 'tailwind-merge';

import { Button, Card } from '$lib/components/core';
import { useSignIn } from '$lib/hooks/useSignIn';
import { ASSET_PREFIX } from '$lib/utils/constants';

const cards = [
  {
    icon: 'icon-ticket',
    color: 'bg-[#2B7FFF]',
    highlight: 'text-[#51A2FF]',
    prefix: 'Run ',
    accent: 'events',
    suffix: ' that power your community.',
    subtitle: "Create & manage events that your community won't forget.",
  },
  {
    icon: 'icon-community',
    color: 'bg-[#CA8A04]',
    highlight: 'text-[#FDE047]',
    prefix: 'Create ',
    accent: 'hubs',
    suffix: ' where people come together.',
    subtitle: 'Bring members together in spaces that grow with you.',
  },
  {
    icon: 'icon-farcaster',
    color: 'bg-[#8E51FF]',
    highlight: 'text-[#A684FF]',
    prefix: 'Bring your Farcaster ',
    accent: 'channels',
    suffix: ' to life.',
    subtitle: 'Import them, link to your hubs, and host events seamlessly.',
  },
  {
    icon: 'icon-lens',
    color: 'bg-[#009966]',
    highlight: 'text-[#00BC7D]',
    prefix: 'Deploy Lens ',
    accent: 'feeds',
    suffix: ' for your hubs.',
    subtitle: 'Give your community a live social layer that keeps them connected.',
  },
];

export function NonLoginContent() {
  const signIn = useSignIn();

  return (
    <div className="w-full pb-10 md:pb-20">
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] gap-4">
        <Card.Root className="rounded-xl border-card-border bg-background overflow-hidden">
          <Card.Content
            className="h-full min-h-75 md:min-h-120 p-7 md:p-14 flex flex-col justify-between gap-10"
          >
            <div className="flex flex-col gap-4">
              <h3 className="font-title text-4xl md:text-[60px] font-semibold leading-[1.15] md:leading-[72px] max-w-105">
                Create your Lemonade Stand
              </h3>
              <p className="text-lg md:text-[24px] md:leading-9 text-secondary max-w-105">
                Your space for events, communities, and everything in between.
              </p>
            </div>

            <div className="flex items-end justify-between gap-4">
              <Button size="lg" variant="secondary" onClick={() => signIn()}>
                Get Started
              </Button>
              <img
                alt=""
                aria-hidden
                src={`${ASSET_PREFIX}/assets/images/waving-hand.svg`}
                className="size-14 md:size-24 aspect-square shrink-0"
              />
            </div>
          </Card.Content>
        </Card.Root>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cards.map((item, idx) => (
            <Card.Root key={idx} className="rounded-xl border-card-border bg-background">
              <Card.Content className="p-7 flex flex-col gap-6 h-full">
                <div className={twMerge('size-14 flex items-center justify-center rounded-sm', item.color)}>
                  <i aria-hidden className={twMerge('size-8 text-white', item.icon)} />
                </div>

                <div className="flex flex-col gap-2">
                  <p className="text-lg leading-6 text-primary">
                    <span>{item.prefix}</span>
                    <span className={item.highlight}>{item.accent}</span>
                    <span>{item.suffix}</span>
                  </p>
                  <p className="text-sm leading-5 text-tertiary">{item.subtitle}</p>
                </div>
              </Card.Content>
            </Card.Root>
          ))}
        </div>
      </div>
    </div>
  );
}
