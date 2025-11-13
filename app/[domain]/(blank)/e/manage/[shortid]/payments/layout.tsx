'use client';
import clsx from 'clsx';
import Link from 'next/link';
import React from 'react';

const routers = [
  { label: 'Direct Ledger', path: 'direct-ledger' },
  { label: 'Settings', path: 'settings' },
];

function Layout({ children }: React.PropsWithChildren) {
  return (
    <>
      <div className="bg-card sticky top-28 z-2 backdrop-blur-sm">
        <nav className="page flex gap-4 px-4 md:px-0 pt-2 mx-auto overflow-auto no-scrollbar"></nav>
      </div>

      {children}
    </>
  );
}

export default Layout;

// {routers.map((item) => {
//             const url =
//               item.path === 'display' ? `/e/manage/${shortid}/settings` : `/e/manage/${shortid}/settings/${item.path}`;
//             {
//               /* const isActive = */
//             }
//             {
//               /*   item.path === 'display' ? pathname === `/s/manage/${uid}/settings` || pathname === url : pathname === url; */
//             }
//
//             return (
//               <Link
//                 href={url}
//                 key={item.path}
//                 // className={clsx('min-w-fit', isActive && 'border-b-2 border-b-primary', 'pb-2.5')}
//               >
//                 <span className={clsx(true ? 'text-primary' : 'text-tertiary', 'font-medium')}>{item.label}</span>
//               </Link>
//             );
//           })}
