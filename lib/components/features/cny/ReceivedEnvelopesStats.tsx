'use client';

import { useEffect, useState } from 'react';
import { formatUnits } from 'viem';
import { useQuery } from '$lib/graphql/request';
import { coinClient } from '$lib/graphql/request/instances';
import {
  RedEnvelopeReceivedDocument,
  type RedEnvelopeReceivedQuery,
  type RedEnvelopeReceivedQueryVariables,
} from '$lib/graphql/generated/coin/graphql';
import { formatNumber } from '$lib/utils/number';
import { useAppKitAccount } from '@reown/appkit/react';
import { RedEnvelopeClient } from '$lib/services/red-envelope';
import { parseNumeric } from '$lib/utils/number';
import { StatCard } from './StatCard';
import { HorizontalScroll } from '$lib/components/core';

const formatCurrency = (value: number): string => {
  if (value === 0) return '$0';
  return `$${formatNumber(value)}`;
};

export const ReceivedEnvelopesStats = () => {
  const { address } = useAppKitAccount();
  const [decimals, setDecimals] = useState<number>(6);

  useEffect(() => {
    let cancelled = false;
    RedEnvelopeClient.getInstance()
      .getCurrencyDecimals()
      .then((d) => {
        if (!cancelled) setDecimals(d);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const whereReceived = address
    ? { recipient: { _eq: address.toLowerCase() } }
    : undefined;

  const { data, loading } = useQuery<
    RedEnvelopeReceivedQuery,
    RedEnvelopeReceivedQueryVariables
  >(
    RedEnvelopeReceivedDocument,
    { variables: { limit: 1, where: whereReceived }, skip: !address },
    coinClient
  );

  const row = data?.RedEnvelopeReceived?.[0];
  const envelopesReceived = parseNumeric(row?.envelopes_received);
  const envelopesOpened = parseNumeric(row?.envelopes_opened);
  const pendingEnvelopes = Math.max(0, envelopesReceived - envelopesOpened);

  const totalAmountReceivedRaw = row?.total_amount_received;
  const totalAmountReceivedFormatted =
    totalAmountReceivedRaw != null && totalAmountReceivedRaw !== ''
      ? Number(formatUnits(BigInt(String(totalAmountReceivedRaw)), decimals))
      : 0;
  const totalAmountFormatted = formatCurrency(totalAmountReceivedFormatted);

  return (
    <HorizontalScroll>
      <div className="flex gap-4 w-full">
        <StatCard
          label="Envelopes Received"
          value={envelopesReceived.toLocaleString()}
          loading={loading}
        />
        <StatCard
          label="Opened by You"
          value={envelopesOpened.toLocaleString()}
          loading={loading}
        />
        <StatCard
          label="Pending Envelopes"
          value={pendingEnvelopes.toLocaleString()}
          loading={loading}
        />
        <StatCard
          label="Total Amount Received"
          value={totalAmountFormatted}
          loading={loading}
        />
      </div>
    </HorizontalScroll>
  );
};
