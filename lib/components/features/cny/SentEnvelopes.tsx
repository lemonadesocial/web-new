'use client';

import { useEffect, useState } from 'react';
import { formatUnits } from 'ethers';
import { format } from 'date-fns';

import { useQuery } from '$lib/graphql/request';
import { coinClient } from '$lib/graphql/request/instances';
import {
  EnvelopeDocument,
  type EnvelopeQuery,
  type EnvelopeQueryVariables,
  Order_By,
} from '$lib/graphql/generated/coin/graphql';
import { useAppKitAccount } from '@reown/appkit/react';
import { truncateMiddle } from '$lib/utils/string';
import { formatNumber } from '$lib/utils/number';
import { randomUserImage } from '$lib/utils/user';
import { CardTable } from '$lib/components/core/table';
import { Avatar, Skeleton, Button, Menu, MenuItem, Divider, Chip } from '$lib/components/core';
import { RedEnvelopeClient } from '$lib/services/red-envelope';
import { SentEnvelopesStats } from './SentEnvelopesStats';

type Envelope = NonNullable<EnvelopeQuery['Envelope']>[number];

type FilterOption = 'all' | 'pending' | 'opened';

type SortOption = 'recently_sent' | 'amount' | 'status';

const SORT_ORDER_BY: Record<SortOption, NonNullable<EnvelopeQueryVariables['orderBy']>> = {
  recently_sent: [{ created_at: Order_By.Desc }],
  amount: [{ amount: Order_By.Desc }],
  status: [{ claimed: Order_By.Desc }],
};

function formatRecipientDisplay(recipient: string | null | undefined): string {
  if (!recipient) return '—';
  if (recipient.includes('@')) return recipient;
  if (recipient.endsWith('.eth')) return recipient;
  return truncateMiddle(recipient, 6, 4);
}

function SentEnvelopeRow({
  envelope,
  decimals,
  symbol,
}: {
  envelope: Envelope;
  decimals: number;
  symbol: string;
}) {
  const recipientDisplay = formatRecipientDisplay(envelope.recipient ?? undefined);
  const sentOn = envelope.created_at
    ? format(Number(envelope.created_at) * 1000, 'MMM d, h:mm a')
    : '—';
  const amount = envelope.amount
    ? `${formatNumber(Number(formatUnits(envelope.amount, decimals)))} ${symbol}`
    : '—';
  const status = envelope.claimed ? 'Opened' : 'Pending';

  return (
    <CardTable.Row>
      <div className="flex items-center gap-4 text-tertiary px-4 py-3">
        <div className="flex-[2] min-w-0 flex items-center gap-3">
          <Avatar
            src={randomUserImage(envelope.recipient ?? envelope.id)}
            size="sm"
            className="flex-shrink-0"
          />
          <div className="flex flex-col min-w-0">
            <p className="truncate">{recipientDisplay}</p>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-tertiary">{sentOn}</p>
        </div>
        <div className="flex-1 min-w-0 text-right">
          <p className="text-tertiary">{amount}</p>
        </div>
        <div className="flex-[0.8] min-w-0 flex justify-end">
          <Chip variant={envelope.claimed ? 'secondary' : 'warning'} size="xxs" className="rounded-full">
            {status}
          </Chip>
        </div>
      </div>
    </CardTable.Row>
  );
}

export const SentEnvelopes = () => {
  const { address } = useAppKitAccount();
  const [decimals, setDecimals] = useState<number>(6);
  const [symbol, setSymbol] = useState<string>('USDm');
  const [filter, setFilter] = useState<FilterOption>('all');
  const [sort, setSort] = useState<SortOption>('recently_sent');

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const client = RedEnvelopeClient.getInstance();
        const [d, s] = await Promise.all([
          client.getCurrencyDecimals(),
          client.getCurrencySymbol(),
        ]);
        if (!cancelled) {
          setDecimals(d);
          setSymbol(s);
        }
      } catch {
        if (!cancelled) {
          setDecimals(6);
          setSymbol('USDm');
        }
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const baseWhere = {
    owner: { _eq: address?.toLowerCase() ?? '' },
    recipient: { _is_null: false },
  };

  const { data, loading } = useQuery<EnvelopeQuery, EnvelopeQueryVariables>(
    EnvelopeDocument,
    {
      variables: {
        where:
          filter === 'all'
            ? baseWhere
            : {
                ...baseWhere,
                claimed: { _eq: filter === 'opened' },
              },
        orderBy: SORT_ORDER_BY[sort],
      },
      skip: !address,
    },
    coinClient
  );

  const envelopes = data?.Envelope ?? [];

  if (!address) {
    return (
      <div className="py-12 text-center">
        <p className="text-tertiary text-lg">Connect your wallet to view sent envelopes</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <SentEnvelopesStats />
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
                  : 'Opened'}
            </Button>
          </Menu.Trigger>
          <Menu.Content className="min-w-[180px] p-1">
            {({ toggle }) => (
              <>
                <MenuItem
                  title="All Envelopes"
                  iconRight={filter === 'all' ? 'icon-richtext-check' : undefined}
                  onClick={() => {
                    setFilter('all');
                    toggle();
                  }}
                />
                <Divider className="my-1 -mx-2" />
                <MenuItem
                  title="Pending"
                  onClick={() => {
                    setFilter('pending');
                    toggle();
                  }}
                  iconRight={filter === 'pending' ? 'icon-richtext-check' : undefined}
                />
                <MenuItem
                  title="Opened"
                  onClick={() => {
                    setFilter('opened');
                    toggle();
                  }}
                  iconRight={filter === 'opened' ? 'icon-richtext-check' : undefined}
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
              {sort === 'recently_sent'
                ? 'Recently Sent'
                : sort === 'amount'
                  ? 'Amount'
                  : 'Status'}
            </Button>
          </Menu.Trigger>
          <Menu.Content className="min-w-[180px] p-1">
            {({ toggle }) => (
              <>
                <MenuItem
                  title="Recently Sent"
                  iconRight={sort === 'recently_sent' ? 'icon-richtext-check' : undefined}
                  onClick={() => {
                    setSort('recently_sent');
                    toggle();
                  }}
                />
                <MenuItem
                  title="Amount"
                  iconRight={sort === 'amount' ? 'icon-richtext-check' : undefined}
                  onClick={() => {
                    setSort('amount');
                    toggle();
                  }}
                />
                <MenuItem
                  title="Status"
                  iconRight={sort === 'status' ? 'icon-richtext-check' : undefined}
                  onClick={() => {
                    setSort('status');
                    toggle();
                  }}
                />
              </>
            )}
          </Menu.Content>
        </Menu.Root>
      </div>
      <CardTable.Root loading={loading} data={envelopes}>
        <CardTable.Header className="px-4 py-3">
          <div className="flex-[2] min-w-0">
            <p>Recipient</p>
          </div>
          <div className="flex-1 min-w-0">
            <p>Sent On</p>
          </div>
          <div className="flex-1 min-w-0 text-right">
            <p>Amount</p>
          </div>
          <div className="flex-[0.8] min-w-0 flex justify-end">
            <p>Status</p>
          </div>
        </CardTable.Header>

        <CardTable.Loading rows={8}>
          <Skeleton className="h-5 flex-[2]" animate />
          <Skeleton className="h-5 flex-1" animate />
          <Skeleton className="h-5 flex-1" animate />
          <Skeleton className="h-5 flex-[0.8]" animate />
        </CardTable.Loading>

        <CardTable.EmptyState
          icon="icon-token"
          title="No envelopes sent yet"
          subtile="When you send red envelopes to others, they will show up here."
        />

        {envelopes.map((envelope) => (
          <SentEnvelopeRow
            key={envelope.id}
            envelope={envelope}
            decimals={decimals}
            symbol={symbol}
          />
        ))}
      </CardTable.Root>
    </div>
  );
};
