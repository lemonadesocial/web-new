'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Event, GetEventGuestsStatisticsDocument, ListEventGuestsDocument } from '$lib/graphql/generated/backend/graphql';
import { Button, InputField, Spacer, modal } from '$lib/components/core';
import { CardTable } from '$lib/components/core/table';
import { useQuery } from '$lib/graphql/request';
import { formatWithTimezone } from '$lib/utils/date';
import { GuestTable } from './common/GuestTable';
import { EventProtected } from './EventProtected';
import { TicketCheckInModal } from './modals/TicketCheckInModal';

type TabType = 'all' | 'going' | 'checked_in' | 'invited';

export function EventCheckIn({ shortid }: { shortid: string }) {
  return (
    <EventProtected shortid={shortid}>
      {(event: Event) => <EventCheckInContent event={event} />}
    </EventProtected>
  );
}

const PAGE_SIZE = 50;

function EventCheckInContent({ event }: { event: Event }) {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<TabType>('all');
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText, setDebouncedSearchText] = useState('');
  const [skip, setSkip] = useState(0);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchText(searchText);
      setSkip(0);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchText]);

  const { data: statsData } = useQuery(GetEventGuestsStatisticsDocument, {
    variables: {
      event: event._id,
    },
  });

  const stats = statsData?.getEventGuestsStatistics;

  const { data, loading } = useQuery(ListEventGuestsDocument, {
    variables: {
      event: event._id,
      search: debouncedSearchText || undefined,
      going: selectedTab === 'going' ? true : undefined,
      checkedIn: selectedTab === 'checked_in' ? true : undefined,
      pendingInvite: selectedTab === 'invited' ? true : undefined,
      pendingApproval: false,
      skip,
      limit: PAGE_SIZE,
    },
  });

  const guests = data?.listEventGuests.items || [];
  const totalCount = data?.listEventGuests.total || 0;

  const eventDate = event.start
    ? formatWithTimezone(event.start, 'MMM d, h:mm a OOO', event.timezone as string)
    : '';

  const handleTabChange = (tab: TabType) => {
    setSelectedTab(tab);
    setSkip(0);
  };

  const tabs = [
    { key: 'all' as TabType, label: 'All Guests', count: selectedTab === 'all' ? totalCount : undefined },
    { key: 'going' as TabType, label: 'Going', count: stats?.going },
    { key: 'checked_in' as TabType, label: 'Checked In', count: stats?.checked_in },
    { key: 'invited' as TabType, label: 'Invited', count: stats?.pending_invite },
  ];

  const handleGuestClick = (guest: any) => {
    if (guest.ticket?.shortid) {
      modal.open(TicketCheckInModal, {
        props: {
          event,
          shortId: guest.ticket.shortid,
          onClose: () => modal.close(),
        },
      });
    }
  };

  return (
    <div className="page mx-auto py-4 px-4 md:px-0">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <p>{event.title}</p>
          {eventDate && <p className="text-tertiary text-sm">{eventDate}</p>}
        </div>
        <Button
          variant="tertiary"
          iconLeft="icon-qr"
          size="sm"
          onClick={() => router.push(`/e/scan/${event.shortid}`)}
        >
          Scan
        </Button>
      </div>

      <Spacer size="md" />

      <InputField
        placeholder="Search for a guest..."
        value={searchText}
        onChangeText={setSearchText}
        iconLeft="icon-search"
      />

      <Spacer size="md" />

      <div className="flex gap-4 overflow-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`pb-2 px-1 whitespace-nowrap border-b-2 transition-colors font-medium cursor-pointer ${selectedTab === tab.key
                ? 'border-primary text-primary'
                : 'border-transparent text-tertiary hover:text-primary'
              }`}
          >
            {tab.count !== undefined ? `${tab.label} ${tab.count}` : tab.label}
          </button>
        ))}
      </div>
      <hr className="w-screen -mx-[50vw] ml-[calc(-50vw+50%)] border-t border-t-divider" />

      <Spacer className="h-6" />

      <GuestTable event={event} guests={guests} loading={loading} onGuestClick={handleGuestClick} />

      <Spacer size="md" />

      <CardTable.Pagination
        total={totalCount}
        skip={skip}
        limit={PAGE_SIZE}
        onPrev={() => setSkip(skip - PAGE_SIZE)}
        onNext={() => setSkip(skip + PAGE_SIZE)}
      />
    </div>
  );
}
