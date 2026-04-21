'use client';

import { DirectLedger } from '$lib/components/features/event-manage/payments/DirectLedger';
import { Settings } from '$lib/components/features/event-manage/payments/Settings';
import clsx from 'clsx';
import React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  defaultEventManagePaymentTab,
  EventManagePaymentTab,
  getEventManagePaymentTab,
} from './routing';

const tabs: Record<EventManagePaymentTab, { label: string; component: React.FC }> = {
  'direct-ledger': { label: 'Overview', component: DirectLedger },
  settings: { label: 'Settings', component: Settings },
};
const tabEntries = Object.entries(tabs) as [EventManagePaymentTab, (typeof tabs)[EventManagePaymentTab]][];

export function ManageEventPaymentLayout() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const selected = getEventManagePaymentTab(searchParams.get('paymentsTab'));
  const updateTab = (tab: EventManagePaymentTab) => {
    if (tab === selected) return;

    const nextSearchParams = new URLSearchParams(searchParams.toString());

    if (tab === defaultEventManagePaymentTab) {
      nextSearchParams.delete('paymentsTab');
    } else {
      nextSearchParams.set('paymentsTab', tab);
    }

    nextSearchParams.set('tab', 'payments');

    const query = nextSearchParams.toString();
    const nextUrl = query ? `${pathname}?${query}` : pathname;

    React.startTransition(() => {
      router.replace(nextUrl, { scroll: false });
    });
  };

  const Comp = tabs[selected].component;

  return (
    <>
      <div className="bg-card sticky top-10 z-2 backdrop-blur-sm">
        <nav className="page flex gap-4 px-4 md:px-0 pt-2 mx-auto overflow-auto no-scrollbar">
          {tabEntries.map(([key, item]) => {
            return (
              <div
                key={key}
                className={clsx('min-w-fit cursor-pointer', key === selected && 'border-b-2 border-b-primary', 'pb-2.5')}
                onClick={() => updateTab(key)}
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
