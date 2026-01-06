'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Button, ModalContent, modal, Skeleton } from '$lib/components/core';
import { formatWallet } from '$lib/utils/crypto';
import { useAppKit, useAppKitAccount } from '$lib/utils/appkit';
import { usePassport } from '$lib/hooks/usePassport';
import { useLemonhead } from '$lib/hooks/useLemonhead';
import { ASSET_PREFIX } from '$lib/utils/constants';

export function CheckMintedLemonheadModal({ onContinue }: { onContinue: () => void }) {
  const router = useRouter();
  const { data: passport, loading: loadingPassport } = usePassport();
  const { data: lemonhead, loading: loadingLemonhead } = useLemonhead();
  const { address } = useAppKitAccount();
  const { open } = useAppKit();

  useEffect(() => {
    if (loadingPassport || loadingLemonhead) return;
    if (passport && passport.tokenId > 0) return;
    if (lemonhead && lemonhead.tokenId > 0) {
      modal.close();
      onContinue();
    }
  }, [passport, lemonhead, loadingPassport, loadingLemonhead]);

  const handleEditWallet = () => open();

  if (loadingPassport || loadingLemonhead) {
    return (
      <ModalContent>
        <div className="flex flex-col gap-4">
          <Skeleton animate className="size-14 rounded-sm" />
          <div className="space-y-2">
            <Skeleton animate className="h-5 w-3/4" />
            <Skeleton animate className="h-4 w-full" />
          </div>
          <Skeleton animate className="h-10 w-full rounded-sm" />
        </div>
      </ModalContent>
    );
  }

  if (passport && passport.tokenId > 0) {
    return (
      <ModalContent>
        <div className="flex flex-col gap-4">
          <img src={passport.image} className="rounded-sm w-[90px]" alt="Passport" />

          <div>
            <p className="text-lg">Passport already claimed!</p>
            <p className="text-sm text-secondary">
              This wallet has its passport locked in. Each wallet can only hold one, so switch wallets if you'd like to
              claim another.
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full px-3.5 py-2 rounded-sm bg-primary/8 border border-card-border">
            <i className="icon-wallet text-tertiary size-5" />
            <p className="flex-1 text-sm">{address ? formatWallet(address) : 'No wallet connected'}</p>
            <i className="icon-edit-sharp cursor-pointer text-tertiary size-5" onClick={handleEditWallet} />
          </div>

          <Button variant="secondary" className="w-full" onClick={() => modal.close()}>
            Done
          </Button>
        </div>
      </ModalContent>
    );
  }

  return (
    <ModalContent>
      <div className="flex flex-col gap-4">
        <img
          src={`${ASSET_PREFIX}/assets/images/lemonheads-getstarted.gif`}
          className="rounded-sm size-14"
          alt="LemonHead"
        />

        <div>
          <p className="text-lg">Claim Your LemonHead</p>
          <p className="text-sm text-secondary">
            Passports are only available to LemonHead holders. Claim yours or switch wallets.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full px-3.5 py-2 rounded-sm bg-primary/8 border border-card-border">
          <i className="icon-wallet text-tertiary size-5" />
          <p className="flex-1 text-sm">{address ? formatWallet(address) : 'No wallet connected'}</p>
          <i className="icon-edit-sharp cursor-pointer text-tertiary size-5" onClick={handleEditWallet} />
        </div>

        <Button variant="secondary" className="w-full" onClick={() => router.push('/lemonheads/mint')}>
          Claim LemonHead
        </Button>
      </div>
    </ModalContent>
  );
}
