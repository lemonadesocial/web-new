'use client';
import Link from 'next/link';

import { formatWallet } from '$lib/utils/crypto';
import { Button } from '$lib/components/core';
import { UserMenu } from '$lib/components/layouts/UserMenu';
import { useAppKit, useAppKitAccount } from '$lib/utils/appkit';

interface RedEnvelopesHeaderProps {
  showHomeLogo?: boolean;
}

export const RedEnvelopesHeader = ({ showHomeLogo = false }: RedEnvelopesHeaderProps) => {
  const { address } = useAppKitAccount();
  const { open } = useAppKit();

  return (
    <div className={`flex items-center p-4 gap-3 ${showHomeLogo ? 'justify-between' : 'justify-end'}`}>
      {showHomeLogo && (
        <Link href="/cny">
          <i className="icon-lemonade-logo size-5 text-tertiary" />
        </Link>
      )}
      <div className="flex items-center gap-3">
        <Button
          iconLeft="icon-wallet"
          variant="tertiary"
          onClick={() => open()}
          size="sm"
        >
          {address ? formatWallet(address) : 'Connect Wallet'}
        </Button>
        <UserMenu />
      </div>
    </div>
  );
};