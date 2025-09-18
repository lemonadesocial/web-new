'use client';
import React, { useState } from 'react';
import { format } from 'date-fns';
import { snakeCase } from 'lodash';

import { Button, Input, Menu, MenuItem } from '$lib/components/core';
import { downloadCSVFile } from '$lib/utils/file';
import { useQuery } from '$lib/graphql/request';
import { Event, ListEventGuestsDocument, ListEventGuestsSortBy, SortOrder } from '$lib/graphql/generated/backend/graphql';

import { GuestTable } from './common/GuestTable';

type FilterOption = {
  key: string;
  value: string;
  count?: number;
};

type SortOption = {
  key: string;
  value: string;
};

export function GuestList({ event }: { event: Event }) {
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedTicketTypes, setSelectedTicketTypes] = useState<string[]>([]);
  const [selectedSort, setSelectedSort] = useState<SortOption | null>(null);
  const pageSize = 100;

  const ticketTypeFilters = event.event_ticket_types?.map((ticketType) => ({
    key: ticketType._id,
    value: ticketType.title,
  })) || [];

  const sortOptions: SortOption[] = [
    { key: 'register_time', value: 'Register Time' },
    { key: 'name', value: 'Name' },
    { key: 'email', value: 'Email' },
    { key: 'approval_status', value: 'Approval Status' },
  ];

  const [mounted, setMounted] = React.useState(false);

  const { data, loading, error, refetch } = useQuery(ListEventGuestsDocument, {
    variables: {
      event: event._id,
      search: searchText || undefined,
      skip: (currentPage - 1) * pageSize,
      limit: pageSize,
      ticketTypes: selectedTicketTypes.length > 0 ? selectedTicketTypes : undefined,
      going: selectedFilters.includes('going') || undefined,
      pendingApproval: selectedFilters.includes('pending') || undefined,
      pendingInvite: selectedFilters.includes('invited') || undefined,
      declined: selectedFilters.includes('not_going') || undefined,
      checkedIn: selectedFilters.includes('checked_in') || undefined,
      sortBy: selectedSort?.key === 'register_time' ? ListEventGuestsSortBy.RegisterTime : 
              selectedSort?.key === 'name' ? ListEventGuestsSortBy.Name :
              selectedSort?.key === 'email' ? ListEventGuestsSortBy.Email :
              selectedSort?.key === 'approval_status' ? ListEventGuestsSortBy.ApprovalStatus :
              undefined,
      sortOrder: SortOrder.Desc,
    },
  });

  const guests = data?.listEventGuests.items || [];
  const totalCount = data?.listEventGuests.total || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const exportGuestsCSV = () => {
    downloadCSVFile(
      `/event/${event?._id}/export/guests`,
      snakeCase(`${event.title} Guests ${format(new Date(event.start), 'dd_MM_yyyy')}`),
    );
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterToggle = (filterKey: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterKey) 
        ? prev.filter(key => key !== filterKey)
        : [...prev, filterKey]
    );
    setCurrentPage(1);
  };

  const handleTicketTypeToggle = (ticketTypeKey: string) => {
    setSelectedTicketTypes(prev => 
      prev.includes(ticketTypeKey) 
        ? prev.filter(key => key !== ticketTypeKey)
        : [...prev, ticketTypeKey]
    );
    setCurrentPage(1);
  };

  const handleSortChange = (sort: SortOption | null) => {
    setSelectedSort(sort);
    setCurrentPage(1);
  };

  const handleRefetch = () => {
    refetch();
  };

  React.useEffect(() => {
    window.addEventListener('refetch_guest_list', handleRefetch);
    if (!mounted) {
      setMounted(true);
    }

    return () => {
      window.removeEventListener('refetch_guest_list', handleRefetch);
    };
  }, []);

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading guest list</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Guest List</h1>
        <Button icon="icon-download" variant="tertiary" size="sm" onClick={exportGuestsCSV} />
      </div>

      <Input
        placeholder="Search"
        value={searchText}
        onChange={(e) => handleSearch(e.target.value)}
        variant="outlined"
      />

      <div className="flex items-center justify-between">
        <Menu.Root>
          <Menu.Trigger>
            <Button
              variant="tertiary"
              size="sm"
              iconLeft="icon-filter-line"
              iconRight="icon-chevron-down"
            >
              {selectedFilters.length === 0 && selectedTicketTypes.length === 0
                ? 'All Guests' 
                : [
                    ...selectedFilters.map(filter => 
                      filter === 'going' ? 'Going' :
                      filter === 'pending' ? 'Pending' :
                      filter === 'invited' ? 'Invited' :
                      filter === 'not_going' ? 'Not Going' :
                      filter === 'checked_in' ? 'Checked In' : filter
                    ),
                    ...selectedTicketTypes.map(typeKey => 
                      ticketTypeFilters.find(t => t.key === typeKey)?.value || 'Ticket Type'
                    )
                  ].join(', ')
              }
            </Button>
          </Menu.Trigger>
          <Menu.Content className="w-48 p-1">
            {({ toggle }) => (
              <>
                <MenuItem
                  title="All Guests"
                  iconRight={selectedFilters.length === 0 && selectedTicketTypes.length === 0 ? 'text-primary icon-richtext-check' : undefined}
                  onClick={() => {
                    setSelectedFilters([]);
                    setSelectedTicketTypes([]);
                  }}
                />
                <hr className="border-t border-t-divider my-1 -mx-2" />
                <MenuItem
                  title="Going"
                  iconRight={selectedFilters.includes('going') ? 'text-primary icon-richtext-check' : undefined}
                  onClick={() => {
                    handleFilterToggle('going');
                  }}
                />
                <MenuItem
                  title="Invited"
                  iconRight={selectedFilters.includes('invited') ? 'text-primary icon-richtext-check' : undefined}
                  onClick={() => {
                    handleFilterToggle('invited');
                  }}
                />
                <MenuItem
                  title="Pending"
                  iconRight={selectedFilters.includes('pending') ? 'text-primary icon-richtext-check' : undefined}
                  onClick={() => {
                    handleFilterToggle('pending');
                  }}
                />
                <MenuItem
                  title="Not Going"
                  iconRight={selectedFilters.includes('not_going') ? 'text-primary icon-richtext-check' : undefined}
                  onClick={() => {
                    handleFilterToggle('not_going');
                  }}
                />
                <hr className="border-t border-t-divider my-1 -mx-2" />
                <MenuItem
                  title="Checked In"
                  iconRight={selectedFilters.includes('checked_in') ? 'text-primary icon-richtext-check' : undefined}
                  onClick={() => {
                    handleFilterToggle('checked_in');
                  }}
                />
                <hr className="border-t border-t-divider my-1 -mx-2" />
                {ticketTypeFilters.map((ticketType) => (
                  <MenuItem
                    key={ticketType.key}
                    title={ticketType.value}
                    iconRight={selectedTicketTypes.includes(ticketType.key) ? 'text-primary icon-richtext-check' : undefined}
                    onClick={() => {
                      handleTicketTypeToggle(ticketType.key);
                    }}
                  />
                ))}
              </>
            )}
          </Menu.Content>
        </Menu.Root>

        <Menu.Root>
          <Menu.Trigger>
            <Button
              variant="tertiary"
              size="sm"
              iconLeft="icon-sort"
              iconRight="icon-chevron-down"
            >
              {selectedSort?.value || 'Register Time'}
            </Button>
          </Menu.Trigger>
          <Menu.Content className="w-40 p-2">
            {({ toggle }) => (
              <>
                {sortOptions.map((option) => (
                  <MenuItem
                    key={option.key}
                    title={option.value}
                    iconRight={option.key === selectedSort?.key || (!selectedSort && option.key === 'register_time') ? 'text-primary! icon-richtext-check' : undefined}
                    onClick={() => {
                      handleSortChange(option);
                      toggle();
                    }}
                  />
                ))}
              </>
            )}
          </Menu.Content>
        </Menu.Root>
      </div>

      <GuestTable
        event={event}
        guests={guests}
        loading={(!mounted || (mounted && currentPage > 1)) && loading}
      />

      {totalPages > 1 && (
        <div className="flex justify-between items-center gap-4">
          <Button
            variant="tertiary"
            size="sm"
            icon="icon-chevron-left"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="rounded-full"
          />
          <p className="text-sm text-tertiary">
            Page {currentPage} of {totalPages}
          </p>
          <Button
            variant="tertiary"
            size="sm"
            icon="icon-chevron-right"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="rounded-full"
          />
        </div>
      )}
    </div>
  );
}
