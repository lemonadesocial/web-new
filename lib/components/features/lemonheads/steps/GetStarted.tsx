import React from 'react';

import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';

import { Card, Segment } from '$lib/components/core';
import { LemonHeadStep, useLemonHeadContext } from '../provider';
import Image from 'next/image';
import { ASSET_PREFIX } from '$lib/utils/constants';

const lemonheadStaticCards = [
  {
    icon: 'icon-sparkles text-warning-400',
    title: 'Unique',
    subtitle: 'You are a snowflake, and so is your LemonHead. No two are alike.',
  },
  {
    icon: 'icon-globe text-success-400',
    title: 'Ethnicities',
    subtitle: 'Clothes & accessories that represent cultures from across the world.',
  },
  {
    icon: 'icon-globe text-success-400',
    title: 'Host on Your Domain',
    subtitle: 'Claim your LemonHead to access exclusive features & rewards!',
  },
  {
    icon: 'icon-crown text-accent-400',
    title: 'Complexions',
    subtitle: 'No randomization- choose what represents you.',
  },
  {
    icon: 'icon-swipe text-[#F472B6]',
    title: 'Body Types',
    subtitle: 'Diverse body types that celebrates uniqueness and self-expression.',
  },
];

const hubCards = [
  {
    icon: 'icon-ticket text-alert-400',
    title: 'Events',
    subtitle: 'Claim your LemonHead to access exclusive features & rewards!',
  },
  {
    icon: 'icon-crown text-accent-400',
    title: 'Team Management',
    subtitle: 'Claim your LemonHead to access exclusive features & rewards!',
  },
  {
    icon: 'icon-vertical-align-top text-warning-400',
    title: 'Newsletters',
    subtitle: 'Claim your LemonHead to access exclusive features & rewards!',
  },
  {
    icon: 'icon-dark-theme-filled text-warning-400',
    title: 'Premium Themes',
    subtitle: 'Claim your LemonHead to access exclusive features & rewards!',
  },
  {
    icon: 'icon-bar-chart text-alert-400',
    title: 'Insights Dashboard',
    subtitle: 'Claim your LemonHead to access exclusive features & rewards!',
  },
  {
    icon: 'icon-globe text-success-400',
    title: 'Host on Your Own Domain',
    subtitle: 'Claim your LemonHead to access exclusive features & rewards!',
  },
  {
    icon: 'icon-gift-line text-alert-400',
    title: 'Community Rewards Manager',
    subtitle: 'Claim your LemonHead to access exclusive features & rewards!',
  },
  {
    icon: 'icon-swipe text-[#F472B6]',
    title: 'Token Gated Management',
    subtitle: 'Claim your LemonHead to access exclusive features & rewards!',
  },
  {
    icon: 'icon-subdirectory-arrow-right text-[#F472B6]',
    title: 'And More...',
    subtitle: 'Claim your LemonHead to access exclusive features & rewards!',
  },
];

const socialCards = [
  {
    icon: 'icon-swipe text-[#F472B6]',
    title: 'Swipe & Match',
    subtitle: 'Claim your LemonHead to access exclusive features & rewards!',
  },
  {
    icon: 'icon-vertical-align-top text-warning-400',
    title: 'Exclusive Meetups & Events',
    subtitle: 'Claim your LemonHead to access exclusive features & rewards!',
  },
  {
    icon: 'icon-globe text-success-400',
    title: 'Lemonade Festival',
    subtitle: 'Claim your LemonHead to access exclusive features & rewards!',
  },
  {
    icon: 'icon-crown text-accent-400',
    title: 'Swipe & Match',
    subtitle: 'Claim your LemonHead to access exclusive features & rewards!',
  },
];

const governanceCards = [
  {
    icon: 'icon-vertical-align-top text-warning-400',
    title: 'Ecosystem Fund',
    subtitle: 'Claim your LemonHead to access exclusive features & rewards!',
  },
  {
    icon: 'icon-government text-alert-400',
    title: 'Creator Fund',
    subtitle: 'Claim your LemonHead to access exclusive features & rewards!',
  },
  {
    icon: 'icon-globe text-success-400',
    title: 'Aragon DAO',
    subtitle: 'Claim your LemonHead to access exclusive features & rewards!',
  },
  {
    icon: 'icon-crown text-acent-400',
    title: 'Community Incubator',
    subtitle: 'Claim your LemonHead to access exclusive features & rewards!',
  },
  {
    icon: 'icon-globe text-success-400',
    title: 'Platform Development',
    subtitle: 'Claim your LemonHead to access exclusive features & rewards!',
  },
  {
    icon: 'icon-crown text-accent-400',
    title: 'Protocol Development',
    subtitle: 'Claim your LemonHead to access exclusive features & rewards!',
  },
];

const tabs = [
  {
    value: 'lemonhead',
    iconLeft: 'icon-passport',
    label: 'LemonHead',
    component: () => <StaticCards data={lemonheadStaticCards} />,
  },
  { value: 'lemon', iconLeft: 'icon-lemon-token', label: '$LEMON', component: () => <LemonHeadToken /> },
  {
    value: 'hub',
    iconLeft: 'icon-community',
    label: 'Creator Hub',
    component: () => <StaticCards data={hubCards} />,
  },
  { value: 'social', iconLeft: 'icon-sparkles', label: 'Social', component: () => <StaticCards data={socialCards} /> },
  {
    value: 'governance',
    iconLeft: 'icon-government',
    label: 'Governance',
    component: () => <StaticCards data={governanceCards} />,
  },
];

export function LemonHeadGetStarted() {
  const [state] = useLemonHeadContext();
  const [selected, setSelected] = React.useState('lemonhead');

  if (state.currentStep !== LemonHeadStep.getstarted) return null;

  return (
    <div className="flex-1 max-w-[588px] flex flex-col gap-5 md:gap-8">
      <div className="flex flex-col gap-2">
        <h3 className="text-2xl md:text-3xl font-semibold">Become a Resident</h3>
        <p className="text-sm md:text-base text-tertiary">
          Claim your LemonHead to access exclusive features & rewards!
        </p>
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <Segment
          items={tabs.map(({ component, ...rest }) => rest)}
          selected={selected}
          onSelect={(item) => setSelected(item.value)}
          className="bg-transparent"
          size="sm"
        />
      </div>

      <AnimatePresence mode="wait">
        {tabs.map((item) => {
          if (item.value === selected)
            return (
              <motion.div
                key={item.value}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.3 } }}
                exit={{ opacity: 0, transition: { duration: 0.3 } }}
              >
                <div className="">{item.component()}</div>
              </motion.div>
            );
        })}
      </AnimatePresence>
    </div>
  );
}

function StaticCards({ data }: { data: Array<{ icon: string; title: string; subtitle: string }> }) {
  return (
    <div className="grid md:grid-cols-2 gap-3">
      {data.map((item, idx) => (
        <Card.Root key={idx}>
          <Card.Content className="flex gap-4 items-center">
            <i className={twMerge('size-8', item.icon)} />
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
