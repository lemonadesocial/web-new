import React from 'react';

import { twMerge } from 'tailwind-merge';

import { Card } from '$lib/components/core';
import Image from 'next/image';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { LemonHeadStep, useLemonHeadContext } from '../provider';

const statics = [
  {
    icon: 'icon-ticket text-alert-400',
    title: 'Advanced Event Tools',
    subtitle: 'Unlock premium event tools and features built for creators.',
  },
  {
    icon: 'icon-crown text-accent-400',
    title: 'Unlimited Team Seats',
    subtitle: 'Add unlimited members to your team with no restrictions.',
  },
  {
    icon: 'icon-receipt-outline text-[#38BDF8]',
    title: 'Advanced Newsletters',
    subtitle: 'Reach more people with higher send limits for your community updates.',
  },
  {
    icon: 'icon-dark-theme-filled text-[#FB923C]',
    title: 'Premium Themes',
    subtitle: 'Access exclusive themes for your events and community hubs.',
  },
  {
    icon: 'icon-insights text-[#94A3B8]',
    title: 'Insights Dashboard',
    subtitle: 'Track performance across your events and community hubs.',
  },
  {
    icon: 'icon-globe text-[#A3E635]',
    title: 'Custom Domain Hosting',
    subtitle: 'Turn your hub into a full website on your own domain.',
  },
  {
    icon: 'icon-lock text-[#F87171]',
    title: 'Token-Gated Controls',
    subtitle: 'Easily set up token/NFT gates for events and community access.',
  },
  {
    icon: 'icon-gift-line text-[#F87171]',
    title: 'Rewards Manager',
    subtitle: 'Distribute token rewards permissionlessly to your members.',
  },
  {
    icon: 'icon-newsfeed text-[#60A5FA]',
    title: 'LemonHeads Feed',
    subtitle: 'Join an exclusive feed only for LemonHeads.',
  },
  {
    icon: 'icon-swipe text-[#FB923C]',
    title: 'Swipe & Match',
    subtitle: 'Meet and connect with fellow LemonHeads through matching.',
  },
  {
    icon: 'icon-celebration text-[#C084FC]',
    title: 'Exclusive Meetups & Events',
    subtitle: 'Get access to special experiences only for LemonHeads.',
  },
  {
    icon: 'icon-lemonade text-warning-400',
    title: 'Lemonade Festival',
    subtitle: 'Be part of Lemonade’s flagship community celebration.',
  },
  {
    icon: 'icon-lemon-token text-warning-400',
    title: 'Lemon Tokens',
    subtitle: 'Early minters earn bonus tokens redeemable across the platform.',
  },
  {
    icon: 'icon-plus text-tertiary',
    title: 'And More...',
    subtitle: 'Enjoy new features and perks as LemonHeads keeps growing.',
  },
];

export function LemonHeadGetStarted() {
  const [state] = useLemonHeadContext();

  if (state.currentStep !== LemonHeadStep.getstarted) return null;

  return (
    <div className="flex-1 max-w-[588px] flex flex-col gap-5 md:gap-8">
      <div className="flex flex-col gap-2">
        <h3 className="text-2xl md:text-3xl font-semibold">Lemonheads</h3>
        <p className="text-sm md:text-base text-tertiary">
          Claim your LemonHead to access exclusive features & rewards!
        </p>
      </div>

      <StaticCards data={statics} />
    </div>
  );
}

function StaticCards({ data }: { data: Array<{ icon: string; title: string; subtitle: string }> }) {
  return (
    <div className="grid md:grid-cols-2 gap-3">
      {data.map((item, idx) => (
        <Card.Root key={idx}>
          <Card.Content className="flex flex-col gap-3">
            <i aria-hidden="true" className={twMerge('size-8', item.icon)} />
            <div className="flex-1">
              <p>{item.title}</p>
              <p className="text-sm text-tertiary">{item.subtitle}</p>
            </div>
          </Card.Content>
        </Card.Root>
      ))}
    </div>
  );
}

function LemonHeadToken() {
  return (
    <div className="flex flex-col gap-4">
      <p>Lemon Token is a liquidity protocol to empower creators and reward their community. Launching on GTE.</p>
      <div className="flex gap-4 items-center flex-wrap">
        <Image src={`${ASSET_PREFIX}/assets/images/lemonheads-token/mega_eth.svg`} width={80} height={10} alt="" />
        <Image src={`${ASSET_PREFIX}/assets/images/lemonheads-token/cap.svg`} width={49} height={18} alt="" />
        <Image src={`${ASSET_PREFIX}/assets/images/lemonheads-token/gte.svg`} width={32} height={12} alt="" />
        <Image src={`${ASSET_PREFIX}/assets/images/lemonheads-token/aave.svg`} width={59} height={10} alt="" />
        <Image src={`${ASSET_PREFIX}/assets/images/lemonheads-token/layer_zero.svg`} width={73} height={20} alt="" />
      </div>
    </div>
  );
}
