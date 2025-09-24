'use client';
import { useLemonhead } from '$lib/hooks/useLemonhead';
import clsx from 'clsx';
import { useRouter, usePathname } from 'next/navigation';
import { twMerge } from 'tailwind-merge';

const tabData = [
  { label: 'Posts', path: '' },
  { label: 'Events', path: '/events' },
  { label: 'Communities', path: '/communities' },
  // { label: 'Collectibles', path: '/collectibles' },
];

export function Tabs({ className }: { className?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  // TODO: will replace lemonheads with uid
  const basePath = '/s/lemonheads/profile';

  const { data } = useLemonhead();

  return (
    <div className={twMerge('w-full flex gap-4 overflow-auto no-scrollbar border-b-2 pt-3', className)}>
      {tabData.map((tab, i) => {
        if (tab.label === 'LemonHead' && data?.tokenId == 0) return null;
        return (
          <div
            className={clsx(
              'text-tertiary hover:text-primary cursor-pointer pb-2.5 border-b-2',
              pathname.replace(basePath, '') === tab.path
                ? 'text-primary! border-b-(--color-divider)'
                : 'border-b-transparent',
            )}
            key={i}
            onClick={() => router.push(`${basePath}${tab.path}`)}
          >
            <p>{tab.label}</p>
          </div>
        );
      })}
    </div>
  );
}
