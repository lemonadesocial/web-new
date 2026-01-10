'use client';
import React from 'react';
import { twMerge } from 'tailwind-merge';

import { Button, Card } from '$lib/components/core';
import { useMe } from '$lib/hooks/useMe';
import { useSignIn } from '$lib/hooks/useSignIn';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { AIChat } from '$lib/components/features/ai/AIChat';
import { AIChatProvider } from '$lib/components/features/ai/provider';

export function Content() {
  const me = useMe();
  if (!me) return <NonLoginContent />;
  return (
    <AIChatProvider>
      <AIChat />
    </AIChatProvider>
  );
}

const cards = [
  {
    icon: 'icon-ticket',
    color: 'bg-alert-500',
    title: () => (
      <p className="md:text-lg">
        Run <span className="text-alert-400!">events</span> that power your community.
      </p>
    ),
    subtitle: 'Create & manage events that your community won’t forget.',
  },
  {
    icon: 'icon-community',
    color: 'bg-warning-600',
    title: () => (
      <p className="md:text-lg">
        Create <span className="text-warning-400">hubs</span> where people come together.
      </p>
    ),
    subtitle: 'Bring members together in spaces that grow with you.',
  },
  {
    icon: 'icon-farcaster',
    color: 'bg-accent-500',
    title: () => (
      <p className="md:text-lg">
        Bring your Farcaster <span className="text-accent-400">channels</span> to life.
      </p>
    ),
    subtitle: 'Import them, link to your hubs, and host events seamlessly.',
  },
  {
    icon: 'icon-lens',
    color: 'bg-success-600',
    title: () => (
      <p className="md:text-lg">
        Deploy Lens <span className="text-success-400">feeds</span> for your hubs.
      </p>
    ),
    subtitle: 'Give your community a live social layer that keeps them connected.',
  },
];

function NonLoginContent() {
  const signIn = useSignIn();

  return (
    <div className="flex flex-col gap-2 mb-20">
      <div className="rounded-md outline-2 outline-card-border overflow-hidden">
        <div
          className="w-full aspect-video max-h-[548px] p-5 md:p-16 flex flex-col justify-between"
          style={{ background: `url(${ASSET_PREFIX}/assets/images/home-bg.png) lightgray 50% / cover no-repeat` }}
        >
          <div className="flex flex-col gap-2 md:gap-4">
            <h3 className="text-xl md:text-[60px] font-semibold md:leading-[72px] max-w-2/3">
              Create your Lemonade Stand
            </h3>
            <p className="text-sm md:text-[24px] md:leading-9 text-secondary max-w-5/6 md:max-w-1/2">
              Your space for events, communities, and everything in between.
            </p>
          </div>

          <div className="hidden md:flex justify-between items-end">
            <Button size="lg" onClick={() => signIn()}>
              Get Started
            </Button>
            <img src={`${ASSET_PREFIX}/assets/images/waving-hand.svg`} className="size-24 aspect-square" />
          </div>

          <div className="flex md:hidden justify-between items-end">
            <Button size="sm" onClick={() => signIn()}>
              Get Started
            </Button>
            <img src={`${ASSET_PREFIX}/assets/images/waving-hand.svg`} className="size-12 aspect-square" />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 py-2">
        {cards.map((item, idx) => (
          <Card.Root key={idx}>
            <Card.Content className="p-5 flex flex-row md:flex-col gap-4">
              <div className={twMerge('size-14 aspect-square flex items-center justify-center rounded-sm', item.color)}>
                <i className={twMerge('size-8', item.icon)} />
              </div>

              <div className="flex flex-col gap-1">
                {item.title()}
                <p className="text-sm text-tertiary">{item.subtitle}</p>
              </div>
            </Card.Content>
          </Card.Root>
        ))}
      </div>
    </div>
  );
}
