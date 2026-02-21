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
import { modal } from '$lib/components/core';
import { ClaimRedEnvelopeModal } from './modals/ClaimRedEnvelopeModal';
import { ConnectWallet } from '$lib/components/features/modals/ConnectWallet';
import { formatWallet, getListChains } from '$lib/utils/crypto';
import { RedEnvelopeClient } from '$lib/services/red-envelope';
import { ASSET_PREFIX, MEGAETH_CHAIN_ID } from '$lib/utils/constants';
import { CardTable } from '$lib/components/core/table';
import { QueryError } from '$lib/components/core/query-error';
import { ReceivedEnvelopesLayout } from './ReceivedEnvelopesLayout';

type Envelope = NonNullable<EnvelopeQuery['Envelope']>[number];

type FilterOption = 'all' | 'pending' | 'opened' | 'messages';

type SortOption = 'recently_received' | 'amount' | 'status';

const SORT_ORDER_BY: Record<SortOption, NonNullable<EnvelopeQueryVariables['orderBy']>> = {
  recently_received: [{ created_at: Order_By.Desc }],
  amount: [{ amount: Order_By.Desc }],
  status: [{ claimed: Order_By.Desc }],
};

const UnclaimedCard = ({
  envelope,
  decimals,
  symbol,
  onClaimed,
}: {
  envelope: Envelope;
  decimals: number;
  symbol: string;
  onClaimed: () => void;
}) => {
  const handleClick = () => {
    const chains = getListChains();
    const megaEthChain = chains.find((chain) => chain.chain_id === MEGAETH_CHAIN_ID.toString());

    modal.open(ConnectWallet, {
      props: {
        chain: megaEthChain,
        onConnect: () => {
          modal.open(ClaimRedEnvelopeModal, {
            props: {
              envelope,
              decimals,
              symbol,
              onComplete: onClaimed,
            },
          });
        },
      },
    });
  };

  const date = envelope.created_at ? format(Number(envelope.created_at) * 1000, 'MMM d') : '';

  return (
    <div
      className="relative flex flex-col items-center gap-2 px-4 p-4 aspect-square rounded-md overflow-hidden cursor-pointer"
      onClick={handleClick}
    >
      <div
        className="absolute inset-0 bg-cover bg-center bg-repeat"
        style={{ backgroundImage: `url(${ASSET_PREFIX}/assets/images/red-envelope-packs/empty-bg.png)` }}
      />
      <div className="relative flex-1 flex items-center justify-center">
        <img
          src={`${ASSET_PREFIX}/assets/images/red-envelope-packs/unclaimed.png`}
          alt="Red Envelope"
          className="w-[100px] md:w-[184px] h-auto object-contain"
        />
      </div>
      <div className="relative space-y-1 text-center">
        <p className="text-primary">Red Envelope</p>
        <p className="text-sm text-tertiary">
          {formatWallet(envelope.owner)}
          <span className="mx-1">·</span>
          {date}
        </p>
      </div>
    </div>
  );
};

const ClaimedCard = ({
  envelope,
  decimals,
  symbol,
}: {
  envelope: Envelope;
  decimals: number;
  symbol: string;
}) => {
  const date = envelope.claimed_at
    ? format(Number(envelope.claimed_at) * 1000, 'MMM d')
    : envelope.created_at
      ? format(Number(envelope.created_at) * 1000, 'MMM d')
      : '';
  const sender = envelope.owner.includes('.eth') ? envelope.owner : truncateMiddle(envelope.owner, 6, 4);
  const amountLabel = envelope.amount
    ? `${formatNumber(Number(formatUnits(envelope.amount, decimals)))} ${symbol}`
    : '—';

  return (
    <div className="relative flex flex-col items-center gap-2 px-4 p-4 bg-primary/8 aspect-square rounded-md overflow-hidden">
      <div className="relative flex-1 flex items-center justify-center">
        <img
          src={`${ASSET_PREFIX}/assets/images/red-envelope-packs/claimed.png`}
          alt="Red Envelope"
          className="w-[100px] md:w-[184px] h-auto object-contain"
        />
      </div>
      <div className="space-y-1 text-center">
        <p className="text-primary font-semibold">{amountLabel}</p>
        <p className="text-sm text-tertiary">
          {sender}
          <span className="mx-1">·</span>
          {date}
        </p>
      </div>
    </div>
  );
};

export const ReceivedEnvelopes = () => {
  const { address } = useAppKitAccount();
  const [decimals, setDecimals] = useState<number>(6);
  const [symbol, setSymbol] = useState<string>('USDm');
  const [filter, setFilter] = useState<FilterOption>('all');
  const [sort, setSort] = useState<SortOption>('recently_received');

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
    recipient: { _eq: address?.toLowerCase() ?? '' },
  };

  const { data, loading, error, refetch } = useQuery<EnvelopeQuery, EnvelopeQueryVariables>(
    EnvelopeDocument,
    {
      variables: {
        where:
          filter === 'all'
            ? baseWhere
            : filter === 'pending'
              ? { ...baseWhere, claimed: { _eq: false } }
              : filter === 'opened'
                ? { ...baseWhere, claimed: { _eq: true } }
                : { ...baseWhere, message: { _is_null: false } },
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
        <p className="text-tertiary text-lg">Connect your wallet to view received envelopes</p>
      </div>
    );
  }

  if (loading) {
    return (
      <ReceivedEnvelopesLayout
        filter={filter}
        sort={sort}
        onFilterChange={setFilter}
        onSortChange={setSort}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-square rounded-lg bg-primary/8 animate-pulse" />
          ))}
        </div>
      </ReceivedEnvelopesLayout>
    );
  }

  if (error) {
    return (
      <ReceivedEnvelopesLayout filter={filter} sort={sort} onFilterChange={setFilter} onSortChange={setSort}>
        <QueryError message="Failed to load envelopes" onRetry={refetch} />
      </ReceivedEnvelopesLayout>
    );
  }

  if (envelopes.length === 0) {
    return (
      <ReceivedEnvelopesLayout
        filter={filter}
        sort={sort}
        onFilterChange={setFilter}
        onSortChange={setSort}
      >
        <CardTable.Root data={[]}>
          <CardTable.EmptyState
            icon="icon-stacked-email"
            title="No envelopes yet"
            subtile="When someone sends you a red envelope, it will show up here."
          />
        </CardTable.Root>
      </ReceivedEnvelopesLayout>
    );
  }

  return (
    <ReceivedEnvelopesLayout
      filter={filter}
      sort={sort}
      onFilterChange={setFilter}
      onSortChange={setSort}
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {envelopes.map((envelope) =>
          envelope.claimed ? (
            <ClaimedCard key={envelope.id} envelope={envelope} decimals={decimals} symbol={symbol} />
          ) : (
            <UnclaimedCard
              key={envelope.id}
              envelope={envelope}
              decimals={decimals}
              symbol={symbol}
              onClaimed={refetch}
            />
          )
        )}
      </div>
    </ReceivedEnvelopesLayout>
  );
};
