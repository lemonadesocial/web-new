import { Card, Segment } from '$lib/components/core';
import { twMerge } from 'tailwind-merge';

const staticCards = [
  {
    icon: 'icon-vertical-align-top text-warning-400',
    title: 'Newsletters',
    subtitle: 'Claim your LemonHead to access exclusive features & rewards!',
  },
  {
    icon: 'icon-government text-alert-400',
    title: 'Voting Rights',
    subtitle: 'Claim your LemonHead to access exclusive features & rewards!',
  },
  {
    icon: 'icon-globe text-success-400',
    title: 'Host on Your Domain',
    subtitle: 'Claim your LemonHead to access exclusive features & rewards!',
  },
  {
    icon: 'icon-crown text-accent-400',
    title: 'Unlimited Admins',
    subtitle: 'Claim your LemonHead to access exclusive features & rewards!',
  },
  {
    icon: 'icon-swipe text-[#F472B6]',
    title: 'Swipe & Match',
    subtitle: 'Claim your LemonHead to access exclusive features & rewards!',
  },
  {
    icon: 'icon-dark-theme-filled text-warning-400',
    title: 'Premium Themes',
    subtitle: 'Claim your LemonHead to access exclusive features & rewards!',
  },
];

export function LemonHeadGetStarted() {
  return (
    <div className="flex-1 max-w-[588px] flex flex-col gap-8">
      <div className="hidden md:flex flex-col gap-2">
        <h3 className="text-3xl font-semibold">Become a Citizen</h3>
        <p className="text-tertiary">Claim your LemonHead to access exclusive features & rewards!</p>
      </div>

      <div>
        <Segment
          items={[
            { value: 'event', iconLeft: 'icon-ticket', label: 'Events' },
            { value: 'hub', iconLeft: 'icon-community', label: 'Hub' },
            { value: 'social', iconLeft: 'icon-sparkles', label: 'Social' },
          ]}
          selected="event"
          className="bg-transparent"
          size="sm"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {staticCards.map((item, idx) => (
          <Card.Root key={idx}>
            <Card.Content className="flex flex-col gap-4">
              <i className={twMerge('size-8', item.icon)} />
              <div>
                <p>{item.title}</p>
                <p className="text-sm text-tertiary">{item.subtitle}</p>
              </div>
            </Card.Content>
          </Card.Root>
        ))}
      </div>
    </div>
  );
}
