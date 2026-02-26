'use client';

import { DirectLedger } from '$lib/components/features/event-manage/payments/DirectLedger';
import clsx from 'clsx';
import React from 'react';

const tabs: Record<string, { label: string; component: React.FC }> = {
  'direct-ledger': { label: 'Overview', component: DirectLedger },
};

export function ManageEventPaymentLayout() {
  const [selected, setSelected] = React.useState('direct-ledger');
  const Comp = tabs[selected].component;
  return (
    <>
      <div className="bg-card sticky top-10 z-2 backdrop-blur-sm">
        <nav className="page flex gap-4 px-4 md:px-0 pt-2 mx-auto overflow-auto no-scrollbar">
          {Object.entries(tabs).map(([key, item]) => {
            return (
              <div
                key={key}
                className={clsx('min-w-fit', key === selected && 'border-b-2 border-b-primary', 'pb-2.5')}
                onClick={() => setSelected(key)}
              >
                <span className={clsx(key === selected ? 'text-primary' : 'text-tertiary', 'font-medium')}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </nav>
      </div>

      <Comp />
    </>
  );
}
