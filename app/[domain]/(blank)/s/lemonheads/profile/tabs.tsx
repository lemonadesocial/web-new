'use client';
import { useLemonhead } from '$lib/hooks/useLemonhead';
import clsx from 'clsx';
import { useRouter, usePathname } from 'next/navigation';

const tabData = [
  { label: 'Posts', path: '' },
  { label: 'Events', path: '/events' },
  { label: 'Communities', path: '/communities' },
  // { label: 'Collectibles', path: '/collectibles' },
];

export function Tabs() {
  const router = useRouter();
  const pathname = usePathname();
  // TODO: will replace lemonheads with uid
  const basePath = '/s/lemonheads/profile';

  const { data } = useLemonhead();

  return (
    <div className="w-full">
      <div className="flex gap-4 overflow-auto no-scrollbar border-b-2 pt-3 px-1">
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
    </div>
  );
}
