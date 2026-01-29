'use client';

import { useEffect, useState } from 'react';
import { formatUnits } from 'ethers';
import { useQuery } from '$lib/graphql/request';
import { coinClient } from '$lib/graphql/request/instances';
import {
  RedEnvelopeSentDocument,
  EnvelopeDocument,
  type RedEnvelopeSentQuery,
  type RedEnvelopeSentQueryVariables,
  type EnvelopeQuery,
  type EnvelopeQueryVariables,
} from '$lib/graphql/generated/coin/graphql';
import { formatNumber } from '$lib/utils/number';
import { useAppKitAccount } from '@reown/appkit/react';
import { RedEnvelopeClient } from '$lib/services/red-envelope';
import { parseNumeric } from '$lib/utils/number';
import { StatCard } from './StatCard';

const formatCurrency = (value: number): string => {
  if (value === 0) return '$0';
  return `$${formatNumber(value)}`;
};

export const SentEnvelopesStats = () => {
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

  const whereSent = address
    ? { sender: { _eq: address.toLowerCase() } }
    : undefined;
  const whereEnvelopes: EnvelopeQueryVariables['where'] = address
    ? {
        owner: { _eq: address.toLowerCase() },
        recipient: { _is_null: false },
      }
    : undefined;

  const { data: sentData, loading: sentLoading } = useQuery<
    RedEnvelopeSentQuery,
    RedEnvelopeSentQueryVariables
  >(
    RedEnvelopeSentDocument,
    { variables: { limit: 1, where: whereSent }, skip: !address },
    coinClient
  );

  const { data: envelopeData, loading: envelopeLoading } = useQuery<
    EnvelopeQuery,
    EnvelopeQueryVariables
  >(
    EnvelopeDocument,
    { variables: { where: whereEnvelopes }, skip: !address },
    coinClient
  );

  const loading = sentLoading || envelopeLoading;

  const sentRow = sentData?.RedEnvelopeSent?.[0];
  const envelopes = envelopeData?.Envelope ?? [];

  const envelopesSent = parseNumeric(sentRow?.envelopes_sent);
  const openedByRecipients = envelopes.filter((e) => e.claimed).length;
  const notYetOpened = envelopes.filter((e) => !e.claimed).length;

  const totalAmountSentRaw = sentRow?.total_amount_sent;
  const totalAmountSentFormatted =
    totalAmountSentRaw != null && totalAmountSentRaw !== ''
      ? Number(formatUnits(BigInt(String(totalAmountSentRaw)), decimals))
      : 0;
  const totalAmountFormatted = formatCurrency(totalAmountSentFormatted);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Envelopes Sent"
        value={envelopesSent.toLocaleString()}
        loading={loading}
      />
      <StatCard
        label="Opened by Recipients"
        value={openedByRecipients.toLocaleString()}
        loading={loading}
      />
      <StatCard
        label="Not Yet Opened"
        value={notYetOpened.toLocaleString()}
        loading={loading}
      />
      <StatCard
        label="Total Amount Sent"
        value={totalAmountFormatted}
        loading={loading}
      />
    </div>
  );
};
