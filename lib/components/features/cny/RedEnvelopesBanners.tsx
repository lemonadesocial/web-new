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
import { ASSET_PREFIX } from '$lib/utils/constants';

export const RedEnvelopesBanners = () => {
  const { address } = useAppKitAccount();
  const router = useRouter();

  const { data: emptyData } = useQuery<EnvelopeQuery, EnvelopeQueryVariables>(
    EnvelopeDocument,
    {
      variables: {
        where: {
          _and: [
            { owner: { _eq: address?.toLowerCase() ?? '' } },
            { sealed_at: { _is_null: true } },
          ],
        },
      },
      skip: !address,
    },
    coinClient
  );

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

  const emptyCount = emptyData?.Envelope?.length ?? 0;
  const receivedCount = receivedData?.Envelope?.length ?? 0;

  const getEnvelopeLabel = (count: number) => {
    if (count === 1) return '1 Red Envelope';
    return `${count} Red Envelopes`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        className="relative rounded-md overflow-hidden"
      >
        <div className="absolute inset-0">
          <img
            src={`${ASSET_PREFIX}/assets/images/red-envelope-packs/received-bg.png`}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative p-6 md:p-12 flex flex-col items-center gap-4 md:gap-6 h-full min-h-[200px]">
          <div className="flex-1 flex items-center justify-center">
            <img
              src={`${ASSET_PREFIX}/assets/images/red-envelope-packs/received-fg.png`}
              alt=""
              className="w-[131px] md:w-[224px] h-auto object-contain"
            />
          </div>
          <div className="space-y-2 text-white">
            <div>
              <p className="text-center">You have received</p>
              <h4 className="text-xl md:text-2xl font-semibold text-center">{getEnvelopeLabel(receivedCount)}</h4>
            </div>
            <p className="text-secondary text-center max-w-[400px]">
              Good fortune is waiting for you. Open your red envelopes to see what's inside.
            </p>
          </div>
          <Button
            variant="secondary"
            className="rounded-full"
            onClick={() => router.push('/cny/envelopes')}
          >
            Open Envelopes
          </Button>
        </div>
      </div>

      <div className="relative rounded-md overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={`${ASSET_PREFIX}/assets/images/red-envelope-packs/empty-bg.png`}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative p-6 md:p-12 flex flex-col items-center gap-4 md:gap-6 h-full min-h-[200px]">
          <div className="flex-1 flex items-center justify-center">
            <img
              src={`${ASSET_PREFIX}/assets/images/red-envelope-packs/empty-fg.png`}
              alt=""
              className="w-[131px] md:w-[224px] h-auto object-contain"
            />
          </div>
          <div className="space-y-2 text-white">
            <div>
              <p className="text-center">You have</p>
              <h4 className="text-xl md:text-2xl font-semibold text-center">{getEnvelopeLabel(emptyCount)}</h4>
            </div>
            <p className="text-secondary text-center max-w-[400px]">
              Fill them with wishes, luck, and gifts to share with the people you care about.
            </p>
          </div>
          <Button
            variant="secondary"
            className="rounded-full"
            onClick={() => router.push('/cny/send')}
          >
            Fill & Send
          </Button>
        </div>
      </div>
    </div>
  );
};
