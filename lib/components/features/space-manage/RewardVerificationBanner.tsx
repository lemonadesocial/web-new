'use client';

import { useState } from 'react';

import { GetVerifiedModal } from '$lib/components/features/modals/GetVerifiedModal';

interface RewardVerificationBannerProps {
  isVerified: boolean;
}

export function RewardVerificationBanner({ isVerified }: RewardVerificationBannerProps) {
  const [showModal, setShowModal] = useState(false);

  if (isVerified) return null;

  return (
    <>
      <div className="flex items-center justify-between p-4 rounded-md border border-accent-400/30 bg-accent-400/5">
        <div className="flex items-center gap-3">
          <span className="size-9 rounded-full bg-accent-400/16 flex items-center justify-center shrink-0">
            <i aria-hidden="true" className="icon-shield-check size-5 text-accent-400" />
          </span>
          <div>
            <p className="text-primary text-sm font-medium">Verify your identity</p>
            <p className="text-tertiary text-xs">
              Complete Self.xyz verification to unlock higher cashback tiers and faster payouts.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="shrink-0 px-4 py-1.5 rounded-md bg-accent-400 text-white text-sm font-medium hover:bg-accent-400/90 transition-colors"
        >
          Verify
        </button>
      </div>

      {showModal && <GetVerifiedModal />}
    </>
  );
}
