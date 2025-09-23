'use client';
import { useRouter } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import { Button, modal } from '$lib/components/core';
import { useLemonhead } from '$lib/hooks/useLemonhead';
import { useAppKitAccount } from '@reown/appkit/react';
import { match } from 'ts-pattern';
import { ConnectWallet } from '../modals/ConnectWallet';

export function LemonHeadsLockFeature({ title, subtitle, icon }: { title: string; subtitle: string; icon?: string }) {
  const router = useRouter();
  const { data } = useLemonhead();
  const { isConnected } = useAppKitAccount();

  return (
    <div className="flex flex-col h-full w-full items-center justify-center gap-8 pt-10 pb-32">
      <div className="flex flex-col justify-center items-center relative">
        {icon && <i className={twMerge('size-[184px] text-quaternary', icon)} />}

        <div className="bg-danger-500 rounded-full p-3 absolute bottom-0">
          <i className="icon-lock text-primary size-8 aspect-square" />
        </div>
      </div>

      <div className="flex flex-col gap-2 text-tertiary text-center">
        <p className="font-title font-semibold! text-xl">{title}</p>
        <p>{subtitle}</p>
      </div>

      {match(isConnected)
        .with(false, ConnectWalletButton)
        .otherwise(
          () =>
            (!data || (data && data.tokenId == 0)) && (
              <ClaimLemonHeadButton onClick={() => router.push('/lemonheads/mint')} />
            ),
        )}
    </div>
  );
}

const ConnectWalletButton = () => (
  <Button variant="secondary" onClick={() => modal.open(ConnectWallet)}>
    Connect Wallet
  </Button>
);

const ClaimLemonHeadButton = ({ onClick }: { onClick: () => void }) => (
  <Button variant="secondary" onClick={onClick}>
    Claim LemonHead
  </Button>
);
