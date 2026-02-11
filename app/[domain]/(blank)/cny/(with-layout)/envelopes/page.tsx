'use client';

import React from 'react';
import clsx from 'clsx';

import { Button, modal } from '$lib/components/core';
import { BuyRedEnvelopesListModal } from '$lib/components/features/cny/modals/BuyRedEnvelopesListModal';
import { ReceivedEnvelopes } from '$lib/components/features/cny/ReceivedEnvelopes';
import { SentEnvelopes } from '$lib/components/features/cny/SentEnvelopes';

type TabKey = 'received' | 'sent';

const tabs: { key: TabKey; label: string }[] = [
  { key: 'received', label: 'Received' },
  { key: 'sent', label: 'Sent' },
];

export default function Page() {
  const [activeTab, setActiveTab] = React.useState<TabKey>('received');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'received':
        return <ReceivedEnvelopes />;
      case 'sent':
        return <SentEnvelopes />;
    }
  };

  return (
    <div className="md:pt-8 space-y-4">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex items-start justify-between">
          <h1 className="text-2xl font-bold">Envelopes</h1>
          <Button
            variant="tertiary-alt"
            size="sm"
            icon="icon-plus"
            onClick={() => modal.open(BuyRedEnvelopesListModal)}
          />
        </div>
        <p className="text-tertiary">
          Track, send, and open red envelopes all in one place.
        </p>
      </div>

      <div className="w-full">
        <div className="flex gap-4 overflow-auto no-scrollbar pt-3 max-w-[1200px] mx-auto">
          {tabs.map((tab) => (
            <div
              key={tab.key}
              className={clsx(
                'text-tertiary hover:text-white cursor-pointer pb-2.5 border-b-2 transition-colors',
                activeTab === tab.key
                  ? 'text-primary border-white'
                  : 'border-transparent'
              )}
              onClick={() => setActiveTab(tab.key)}
            >
              <p className="font-medium whitespace-nowrap">{tab.label}</p>
            </div>
          ))}
        </div>
        <hr className="border -mx-4" />
        <div className="mt-6 max-w-[1200px] mx-auto">{renderTabContent()}</div>
      </div>
    </div>
  );
}
