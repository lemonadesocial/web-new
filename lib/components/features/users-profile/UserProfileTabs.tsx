'use client';
import { Button } from '$lib/components/core';
import { useRouter, usePathname } from 'next/navigation';

const tabData = [
  { label: 'Feed', path: 'feed', icon: 'icon-newspaper' },
  { label: 'Events', path: 'events', icon: 'icon-ticket' },
  { label: 'Communities', path: 'communities', icon: 'icon-community' },
];

export function UserProfileTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const base = pathname.split('/profile')[0] + '/profile';
  const active = tabData.findIndex((tab) => pathname.startsWith(`${base}/${tab.path}`));

  return (
    <div className="w-full">
      <div className="flex gap-3 overflow-auto no-scrollbar pb-4 pt-2 md:pt-0">
        {tabData.map((tab, i) => (
          <Button
            key={i}
            icon={tab.icon}
            variant={active === i ? 'secondary' : 'tertiary'}
            outlined
            onClick={() => router.push(`${base}/${tab.path}`)}
          />
        ))}
      </div>
    </div>
  );
}
