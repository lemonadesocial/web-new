'use client';

import React from 'react';
import clsx from 'clsx';
import { ReceivedEnvelopes } from './ReceivedEnvelopes';
import { SentEnvelopes } from './SentEnvelopes';

type TabKey = 'received' | 'sent';

interface Tab {
  key: TabKey;
  label: string;
}

const tabs: Tab[] = [
  { key: 'received', label: 'Received' },
  { key: 'sent', label: 'Sent' },
];

export const EnvelopesTabs = () => {
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
    <div className="w-full">
      <div className="flex gap-4 overflow-auto no-scrollbar border-b border-[#6B2A2A] pt-3">
        {tabs.map((tab) => (
          <div
            key={tab.key}
            className={clsx(
              'text-[#A0A0A0] hover:text-white cursor-pointer pb-2.5 border-b-2 transition-colors',
              activeTab === tab.key
                ? 'text-white border-white'
                : 'border-transparent'
            )}
            onClick={() => setActiveTab(tab.key)}
          >
            <p className="font-medium whitespace-nowrap">{tab.label}</p>
          </div>
        ))}
      </div>
      <div className="mt-6">{renderTabContent()}</div>
    </div>
  );
};
