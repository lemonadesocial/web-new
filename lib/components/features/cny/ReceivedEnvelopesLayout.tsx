'use client';

import { Button, Menu, MenuItem, Divider } from '$lib/components/core';
import { ReceivedEnvelopesStats } from './ReceivedEnvelopesStats';

type FilterOption = 'all' | 'pending' | 'opened' | 'messages';

type SortOption = 'recently_received' | 'amount' | 'status';

export const ReceivedEnvelopesLayout = ({
  filter,
  sort,
  onFilterChange,
  onSortChange,
  children,
}: {
  filter: FilterOption;
  sort: SortOption;
  onFilterChange: (filter: FilterOption) => void;
  onSortChange: (sort: SortOption) => void;
  children: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <Menu.Root placement="bottom-start">
          <Menu.Trigger>
            <Button
              variant="tertiary"
              size="sm"
              iconLeft="icon-filter-line"
              iconRight="icon-chevron-down"
            >
              {filter === 'all'
                ? 'All Envelopes'
                : filter === 'pending'
                  ? 'Pending'
                  : filter === 'opened'
                    ? 'Opened'
                    : 'Messages'}
            </Button>
          </Menu.Trigger>
          <Menu.Content className="min-w-[180px] p-1">
            {({ toggle }) => (
              <>
                <MenuItem
                  title="All Envelopes"
                  iconRight={filter === 'all' ? 'icon-richtext-check' : undefined}
                  onClick={() => {
                    onFilterChange('all');
                    toggle();
                  }}
                />
                <Divider className="my-1 -mx-2" />
                <MenuItem
                  title="Pending"
                  onClick={() => {
                    onFilterChange('pending');
                    toggle();
                  }}
                  iconRight={filter === 'pending' ? 'icon-richtext-check' : undefined}
                />
                <MenuItem
                  title="Opened"
                  onClick={() => {
                    onFilterChange('opened');
                    toggle();
                  }}
                  iconRight={filter === 'opened' ? 'icon-richtext-check' : undefined}
                />
                <MenuItem
                  title="Messages"
                  onClick={() => {
                    onFilterChange('messages');
                    toggle();
                  }}
                  iconRight={filter === 'messages' ? 'icon-richtext-check' : undefined}
                />
              </>
            )}
          </Menu.Content>
        </Menu.Root>
        <Menu.Root placement="bottom-start">
          <Menu.Trigger>
            <Button
              variant="tertiary"
              size="sm"
              iconLeft="icon-sort"
              iconRight="icon-chevron-down"
            >
              {sort === 'recently_received'
                ? 'Recently Received'
                : sort === 'amount'
                  ? 'Amount'
                  : 'Status'}
            </Button>
          </Menu.Trigger>
          <Menu.Content className="min-w-[180px] p-1">
            {({ toggle }) => (
              <>
                <MenuItem
                  title="Recently Received"
                  iconRight={sort === 'recently_received' ? 'icon-richtext-check' : undefined}
                  onClick={() => {
                    onSortChange('recently_received');
                    toggle();
                  }}
                />
                <MenuItem
                  title="Amount"
                  iconRight={sort === 'amount' ? 'icon-richtext-check' : undefined}
                  onClick={() => {
                    onSortChange('amount');
                    toggle();
                  }}
                />
                <MenuItem
                  title="Status"
                  iconRight={sort === 'status' ? 'icon-richtext-check' : undefined}
                  onClick={() => {
                    onSortChange('status');
                    toggle();
                  }}
                />
              </>
            )}
          </Menu.Content>
        </Menu.Root>
      </div>
      <ReceivedEnvelopesStats />
      {children}
    </div>
  );
};
