'use client';

import { formatUnits } from 'ethers';
import { format } from 'date-fns';

import { ModalContent, modal } from '$lib/components/core';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { formatNumber } from '$lib/utils/number';
import { formatWallet } from '$lib/utils/crypto';

import type { Envelope } from '$lib/graphql/generated/coin/graphql';

type SentEnvelopeDetailModalProps = {
  envelope: Envelope;
  decimals: number;
  symbol: string;
};

export function SentEnvelopeDetailModal({
  envelope,
  decimals,
  symbol,
}: SentEnvelopeDetailModalProps) {
  const amount = envelope.amount
    ? formatNumber(Number(formatUnits(envelope.amount, decimals)))
    : '—';
  const amountLabel = envelope.amount
    ? `${amount} ${symbol}`
    : '—';
  const recipient = envelope.recipient ? formatWallet(envelope.recipient) : '—';
  const hasMessage = Boolean(envelope.message?.trim());
  const sentOn = envelope.created_at
    ? format(Number(envelope.created_at) * 1000, 'MMM d')
    : '—';
  const openedOn = envelope.claimed_at
    ? format(Number(envelope.claimed_at) * 1000, 'MMM d')
    : null;

  const description = hasMessage
    ? `You shared a red envelope with ${recipient} containing ${amountLabel}, along with a personal New Year wish.`
    : `You shared a red envelope with ${recipient} containing ${amountLabel}.`;

  return (
    <ModalContent onClose={() => modal.close()} className="w-[480px]">
      <div className="relative flex justify-center">
        <img
          src={`${ASSET_PREFIX}/assets/images/red-envelope-packs/red-envelope.png`}
          alt="Red Envelope"
          className="w-[300px] h-auto object-contain"
        />
        {envelope.amount && (
          <div
            className="absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 flex justify-center items-center gap-2 py-4 px-5 rounded-full border bg-woodsmoke-950/64 backdrop-blur-[12px]"
          >
            <p className="text-2xl">${amount}</p>
          </div>
        )}
      </div>

      {hasMessage && (
        <div className="relative flex justify-center mt-6">
          <div className="max-w=[320px] lex justify-center items-center gap-2 py-2 px-3 rounded-md bg-[var(--btn-secondary)] relative before:content-[''] before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2 before:-translate-y-full before:w-0 before:h-0 before:border-l-[10px] before:border-l-transparent before:border-r-[10px] before:border-r-transparent before:border-b-[10px] before:border-b-[var(--btn-secondary)]">
            <p className="text-[var(--btn-secondary-content)]">{envelope.message}</p>
          </div>
        </div>
      )}

      <div className="space-y-2 text-center w-full mt-12">
        <p className="text-lg">Red Envelope</p>
        <p className="text-sm text-secondary">{description}</p>
      </div>
      
      <p className="text-sm text-tertiary text-center mt-3">
        Sent on {sentOn}
        {openedOn && <> · Opened on {openedOn}</>}
      </p>
    </ModalContent>
  );
}
