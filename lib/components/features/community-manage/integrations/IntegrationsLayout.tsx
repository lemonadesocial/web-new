'use client';

import React from 'react';
import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import clsx from 'clsx';

const tabs = [
  { label: 'Mapping', path: 'mapping' },
];

export function IntegrationsLayout({ children }: React.PropsWithChildren) {
  const pathname = usePathname();
  const { uid } = useParams<{ uid: string }>();

  return (
    <>
      <div className="bg-card sticky top-28 z-2 backdrop-blur-sm">
        <nav className="page flex gap-4 px-4 md:px-0 pt-2 mx-auto overflow-auto no-scrollbar">
          {tabs.map((item) => {
            const url = `/s/manage/${uid}/integrations/${item.path}`;
            const isActive =
              item.path === 'mapping'
                ? pathname === `/s/manage/${uid}/integrations` || pathname === url
                : pathname === url;

            return (
              <Link
                href={url}
                key={item.path}
                className={clsx('min-w-fit', isActive && 'border-b-2 border-b-primary', 'pb-2.5')}
              >
                <span className={clsx(isActive ? 'text-primary' : 'text-tertiary', 'font-medium')}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {children}
    </>
  );
}
