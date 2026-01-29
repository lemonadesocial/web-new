'use client';

import { useQuery } from '$lib/graphql/request';
import { coinClient } from '$lib/graphql/request/instances';
import {
  EnvelopeDocument,
  type EnvelopeQuery,
  type EnvelopeQueryVariables,
} from '$lib/graphql/generated/coin/graphql';
import { useAppKitAccount } from '@reown/appkit/react';
import { Button } from '$lib/components/core';
import { useRouter } from 'next/navigation';

export const EnvelopesPageHeader = () => {
  const { address } = useAppKitAccount();
  const router = useRouter();

  const { data: receivedData } = useQuery<EnvelopeQuery, EnvelopeQueryVariables>(
    EnvelopeDocument,
    {
      variables: {
        where: {
          _and: [
            { recipient: { _eq: address?.toLowerCase() ?? '' } },
            { claimed: { _eq: false } },
          ],
        },
      },
      skip: !address,
    },
    coinClient
  );

  const receivedCount = receivedData?.Envelope?.length ?? 0;

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl md:text-5xl font-bold text-white">Envelopes</h1>
        <p className="text-[#A0A0A0] text-base md:text-lg">
          Track, send, and open red envelopes all in one place.
        </p>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <Button
          variant="secondary"
          iconLeft="icon-stacked-email"
          onClick={() => {}}
          className="!bg-[#6B2A2A] !border-[#6B2A2A] hover:!bg-[#7A3333] hover:!border-[#7A3333] text-white"
        >
          {receivedCount} +
        </Button>
        <Button
          variant="secondary"
          onClick={() => router.push('/cny/send')}
          className="!bg-[#6B2A2A] !border-[#6B2A2A] hover:!bg-[#7A3333] hover:!border-[#7A3333] text-white"
        >
          Send Envelopes
        </Button>
      </div>
    </div>
  );
};
