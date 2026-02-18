'use client';
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { snakeCase } from 'lodash';

import { Button, Input, Menu, MenuItem } from '$lib/components/core';
import { downloadCSVFile } from '$lib/utils/file';
import { useQuery } from '$lib/graphql/request';
import {
  Event,
  ListEventGuestsDocument,
  ListEventGuestsSortBy,
  SortOrder,
} from '$lib/graphql/generated/backend/graphql';

import { GuestTable } from './common/GuestTable';
import { SELF_VERIFICATION_CONFIG } from '$lib/utils/constants';

type SortOption = {
  key: string;
  value: string;
};

export function GuestList({ event }: { event: Event }) {
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText, setDebouncedSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState<string>('going');
  const [selectedTicketTypes, setSelectedTicketTypes] = useState<string[]>([]);
  const [selectedSort, setSelectedSort] = useState<SortOption | null>(null);
  const pageSize = 25;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchText(searchText);
      setCurrentPage(1);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchText]);

  const ticketTypeFilters =
    event.event_ticket_types?.map((ticketType) => ({
      key: ticketType._id,
      value: ticketType.title,
    })) || [];

  const sortOptions: SortOption[] = [
    { key: 'register_time', value: 'Register Time' },
    { key: 'approval_status', value: 'Approval Status' },
  ];

  const { data, loading, error, refetch } = useQuery(ListEventGuestsDocument, {
    variables: {
      event: event._id,
      search: debouncedSearchText || undefined,
      skip: (currentPage - 1) * pageSize,
      limit: pageSize,
      ticketTypes: selectedTicketTypes.length > 0 ? selectedTicketTypes : undefined,
      going: selectedFilter === 'going' || undefined,
      pendingApproval: selectedFilter === 'pending' || undefined,
      pendingInvite: selectedFilter === 'invited' || undefined,
      declined: selectedFilter === 'not_going' || undefined,
      checkedIn: selectedFilter === 'checked_in' || undefined,
      sortBy:
        selectedSort?.key === 'register_time'
          ? ListEventGuestsSortBy.RegisterTime
              : selectedSort?.key === 'approval_status'
                ? ListEventGuestsSortBy.ApprovalStatus
                : undefined,
      sortOrder: SortOrder.Desc,
    },
  });

  const guests = data?.listEventGuests.items || [];
  const totalCount = data?.listEventGuests.total || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  const exportGuestsCSV = () => {
    downloadCSVFile(
      `/event/${event?._id}/export/guests?self_verification_config=${JSON.stringify(SELF_VERIFICATION_CONFIG)}`,
      snakeCase(`${event.title} Guests ${format(new Date(event.start), 'dd_MM_yyyy')}`),
    );
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (filterKey: string) => {
    setSelectedFilter(filterKey);
    setCurrentPage(1);
  };

  const handleTicketTypeToggle = (ticketTypeKey: string) => {
    setSelectedTicketTypes((prev) =>
      prev.includes(ticketTypeKey) ? prev.filter((key) => key !== ticketTypeKey) : [...prev, ticketTypeKey],
    );
    setCurrentPage(1);
  };

  const handleSortChange = (sort: SortOption | null) => {
    setSelectedSort(sort);
    setCurrentPage(1);
  };

  React.useEffect(() => {
    window.addEventListener('refetch_guest_list', refetch);

    return () => {
      window.removeEventListener('refetch_guest_list', refetch);
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
        <Menu.Root placement="bottom-start">
          <Menu.Trigger>
            <Button variant="tertiary" size="sm" iconLeft="icon-filter-line" iconRight="icon-chevron-down">
              {[
                selectedFilter === 'going'
                  ? 'Going'
                  : selectedFilter === 'pending'
                    ? 'Pending'
                    : selectedFilter === 'invited'
                      ? 'Invited'
                      : selectedFilter === 'not_going'
                        ? 'Not Going'
                        : selectedFilter === 'checked_in'
                          ? 'Checked In'
                          : null,
                ...selectedTicketTypes.map(
                  (typeKey) => ticketTypeFilters.find((t) => t.key === typeKey)?.value || 'Ticket Type',
                ),
              ]
                .filter(Boolean)
                .join(', ')}
            </Button>
          </Menu.Trigger>
          <Menu.Content className="w-48 p-1">
            {({ toggle }) => (
              <>
                <MenuItem
                  title="Going"
                  iconRight={selectedFilter === 'going' ? 'text-primary icon-richtext-check' : undefined}
                  onClick={() => {
                    handleFilterChange('going');
                  }}
                />
                <MenuItem
                  title="Invited"
                  iconRight={selectedFilter === 'invited' ? 'text-primary icon-richtext-check' : undefined}
                  onClick={() => {
                    handleFilterChange('invited');
                  }}
                />
                <MenuItem
                  title="Pending"
                  iconRight={selectedFilter === 'pending' ? 'text-primary icon-richtext-check' : undefined}
                  onClick={() => {
                    handleFilterChange('pending');
                  }}
                />
                <MenuItem
                  title="Not Going"
                  iconRight={selectedFilter === 'not_going' ? 'text-primary icon-richtext-check' : undefined}
                  onClick={() => {
                    handleFilterChange('not_going');
                  }}
                />
                <hr className="border-t border-t-divider my-1 -mx-2" />
                <MenuItem
                  title="Checked In"
                  iconRight={selectedFilter === 'checked_in' ? 'text-primary icon-richtext-check' : undefined}
                  onClick={() => {
                    handleFilterChange('checked_in');
                  }}
                />
                <hr className="border-t border-t-divider my-1 -mx-2" />
                {ticketTypeFilters.map((ticketType) => (
                  <MenuItem
                    key={ticketType.key}
                    iconRight={
                      selectedTicketTypes.includes(ticketType.key) ? 'text-primary icon-richtext-check' : undefined
                    }
                    onClick={() => {
                      handleTicketTypeToggle(ticketType.key);
                    }}
                    className="!flex !text-clip overflow-hidden"
                  >
                    <p className="text-sm text-secondary truncate min-w-0 flex-1">{ticketType.value}</p>
                  </MenuItem>
                ))}
              </>
            )}
          </Menu.Content>
        </Menu.Root>

        <Menu.Root>
          <Menu.Trigger>
            <Button variant="tertiary" size="sm" iconLeft="icon-sort" iconRight="icon-chevron-down">
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
                    iconRight={
                      option.key === selectedSort?.key || (!selectedSort && option.key === 'register_time')
                        ? 'text-primary! icon-richtext-check'
                        : undefined
                    }
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

      <GuestTable event={event} guests={guests} loading={loading} />

      {totalPages > 1 && (
        <div className="flex justify-between items-center gap-4">
          <Button
            variant="tertiary"
            size="sm"
            icon="icon-chevron-left"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            loading={loading}
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
            loading={loading}
          />
        </div>
      )}
    </div>
  );
}
