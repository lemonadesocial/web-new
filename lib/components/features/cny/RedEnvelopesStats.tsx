'use client';

import { useEffect, useState } from 'react';
import { formatUnits } from 'ethers';
import { useQuery } from '$lib/graphql/request';
import { coinClient } from '$lib/graphql/request/instances';
import {
  RedEnvelopeSentDocument,
  RedEnvelopeReceivedDocument,
  type RedEnvelopeSentQuery,
  type RedEnvelopeSentQueryVariables,
  type RedEnvelopeReceivedQuery,
  type RedEnvelopeReceivedQueryVariables,
} from '$lib/graphql/generated/coin/graphql';
import { formatNumber, parseNumeric } from '$lib/utils/number';
import { useAppKitAccount } from '@reown/appkit/react';
import { RedEnvelopeClient } from '$lib/services/red-envelope';
import { ASSET_PREFIX } from '$lib/utils/constants';

const formatCurrency = (value: number): string => {
  if (value === 0) return '$0';
  return `$${formatNumber(value)}`;
};

export const RedEnvelopesStats = () => {
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
  const whereReceived = address
    ? { recipient: { _eq: address.toLowerCase() } }
    : undefined;

  const { data: sentData, loading: sentLoading } = useQuery<
    RedEnvelopeSentQuery,
    RedEnvelopeSentQueryVariables
  >(
    RedEnvelopeSentDocument,
    { variables: { limit: 1, where: whereSent }, skip: !address },
    coinClient
  );

  const { data: receivedData, loading: receivedLoading } = useQuery<
    RedEnvelopeReceivedQuery,
    RedEnvelopeReceivedQueryVariables
  >(
    RedEnvelopeReceivedDocument,
    { variables: { limit: 1, where: whereReceived }, skip: !address },
    coinClient
  );

  const loading = sentLoading || receivedLoading;

  const sentRow = sentData?.RedEnvelopeSent?.[0];
  const receivedRow = receivedData?.RedEnvelopeReceived?.[0];

  const envelopesSent = parseNumeric(sentRow?.envelopes_sent);
  const envelopesReceived = parseNumeric(receivedRow?.envelopes_received);
  const totalAmountSentRaw = sentRow?.total_amount_sent;
  const totalAmountSentFormatted =
    totalAmountSentRaw != null && totalAmountSentRaw !== ''
      ? Number(formatUnits(BigInt(String(totalAmountSentRaw)), decimals))
      : 0;
  const totalGiftedFormatted = formatCurrency(totalAmountSentFormatted);

  return (
    <div className="space-y-5">
      <p className="text-xl">Fortune Shared</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <BackgroundStatCard
          label="Envelopes Sent"
          value={envelopesSent.toLocaleString()}
          loading={loading}
          backgroundImage={`${ASSET_PREFIX}/assets/images/red-envelope-packs/envelopes-sent.png`}
        />
        <BackgroundStatCard
          label="Envelopes Received"
          value={envelopesReceived.toLocaleString()}
          loading={loading}
          backgroundImage={`${ASSET_PREFIX}/assets/images/red-envelope-packs/envelopes-received.png`}
        />
        <BackgroundStatCard
          label="Total Gifted"
          value={totalGiftedFormatted}
          loading={loading}
          backgroundImage={`${ASSET_PREFIX}/assets/images/red-envelope-packs/total-gifted.png`}
        />
        <BackgroundStatCard
          label="Leaderboard Rank"
          value="—"
          loading={false}
          backgroundImage={`${ASSET_PREFIX}/assets/images/red-envelope-packs/leaderboard-rank.png`}
        />
      </div>
    </div>
  );
};

const BackgroundStatCard = ({
  label,
  value,
  loading: isLoading,
  backgroundImage,
}: {
  label: string;
  value: string;
  loading: boolean;
  backgroundImage: string;
}) => (
  <div
    className="relative overflow-hidden rounded-md h-[216px] flex flex-col justify-end items-center p-2 bg-cover bg-center bg-no-repeat"
    style={{ backgroundImage: `url(${backgroundImage})` }}
  >
    <div
      className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"
      aria-hidden
    />
    <div className="relative text-center">
      {isLoading ? (
        <div className="h-5 w-16 rounded bg-primary/12 animate-pulse mx-auto" />
      ) : (
        <p>{value}</p>
      )}
      <p className="text-secondary text-sm">{label}</p>
    </div>
  </div>
);
