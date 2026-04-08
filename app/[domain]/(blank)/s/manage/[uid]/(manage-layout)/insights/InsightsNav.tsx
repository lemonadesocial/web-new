'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

const tabs = [
  { label: 'Overview', path: 'overview' },
  { label: 'Events', path: 'events' },
];

export function InsightsNav() {
  const pathname = usePathname();
  const { uid } = useParams<{ uid: string }>();

  return (
    <div className="bg-card sticky top-28 z-2 backdrop-blur-sm">
      <nav className="page flex gap-4 px-4 md:px-0 pt-2 mx-auto overflow-auto no-scrollbar">
        {tabs.map((item) => {
          const url = item.path === 'overview' ? `/s/manage/${uid}/insights` : `/s/manage/${uid}/insights/${item.path}`;
          const isActive =
            item.path === 'overview' ? pathname === `/s/manage/${uid}/insights` || pathname === url : pathname === url;

          return (
            <Link href={url} key={item.path} className={clsx('min-w-fit', isActive && 'border-b-2 border-b-primary', 'pb-2.5')}>
              <span className={clsx(isActive ? 'text-primary' : 'text-tertiary', 'font-medium')}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
