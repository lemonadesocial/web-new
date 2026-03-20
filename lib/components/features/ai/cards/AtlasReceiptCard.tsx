'use client';

import { useState } from 'react';
import { format } from 'date-fns';

import type { AtlasPurchaseReceipt } from '$lib/types/atlas';
import { GetVerifiedModal } from '$lib/components/features/modals/GetVerifiedModal';

interface AtlasReceiptCardProps {
  receipt: AtlasPurchaseReceipt;
}

export function AtlasReceiptCard({ receipt }: AtlasReceiptCardProps) {
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  const purchaseDate = format(new Date(receipt.purchased_at), 'MMM d, yyyy h:mm a');

  return (
    <>
      <div className="rounded-md border border-card-border bg-overlay-secondary p-4 space-y-4">
        <div className="flex items-center gap-2">
          <span className="size-6 rounded-full bg-success-500/16 flex items-center justify-center">
            <i aria-hidden="true" className="icon-check size-3.5 text-success-500" />
          </span>
          <p className="text-success-500 text-sm font-medium">Purchase confirmed</p>
        </div>

        <div className="space-y-2">
          <p className="text-primary text-sm font-medium">{receipt.event.title}</p>
          <div className="flex items-center gap-2 text-tertiary text-xs">
            <span>{receipt.event.start ? format(new Date(receipt.event.start), 'EEE, d MMM') : ''}</span>
            {receipt.event.location && (
              <>
                <span className="text-quaternary">&middot;</span>
                <span>{receipt.event.location}</span>
              </>
            )}
          </div>
        </div>

        <div className="border-t border-card-border pt-3 space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-tertiary">Ticket</span>
            <span className="text-secondary">
              {receipt.quantity}x {receipt.ticket.name}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-tertiary">Total paid</span>
            <span className="text-secondary">
              {receipt.currency} {receipt.total_paid.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-tertiary">Payment</span>
            <span className="text-secondary capitalize">{receipt.payment_method}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-tertiary">Date</span>
            <span className="text-secondary">{purchaseDate}</span>
          </div>
        </div>

        {receipt.attendees.length > 0 && (
          <div className="border-t border-card-border pt-3">
            <p className="text-tertiary text-xs mb-1.5">Attendees</p>
            <div className="space-y-1">
              {receipt.attendees.map((attendee, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs">
                  <span className="size-5 rounded-full bg-accent-400/16 flex items-center justify-center text-[10px] text-accent-400 font-medium">
                    {attendee.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="text-secondary">{attendee.name}</span>
                  <span className="text-quaternary">{attendee.email}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {receipt.reward_info?.cashback_earned && (
          <div className="border-t border-card-border pt-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="size-5 rounded-full bg-accent-400/16 flex items-center justify-center">
                  <i aria-hidden="true" className="icon-gift size-3 text-accent-400" />
                </span>
                <span className="text-xs text-secondary">
                  +{receipt.reward_info.cashback_earned} {receipt.reward_info.cashback_currency} cashback earned
                </span>
              </div>
              <span className="text-quaternary text-[10px] capitalize">{receipt.reward_info.volume_tier} tier</span>
            </div>

            <button
              type="button"
              onClick={() => setShowVerifyModal(true)}
              className="mt-2 text-xs text-accent-400 hover:text-accent-400/80 transition-colors"
            >
              Verify identity to unlock higher rewards
            </button>
          </div>
        )}

        {receipt.confirmation_url && (
          <a
            href={receipt.confirmation_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center py-1.5 text-xs text-accent-400 hover:text-accent-400/80 transition-colors"
          >
            View confirmation
          </a>
        )}
      </div>

      {showVerifyModal && <GetVerifiedModal />}
    </>
  );
}
