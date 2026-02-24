'use client';
import Link from 'next/link';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

import { formatWallet } from '$lib/utils/crypto';
import { Button } from '$lib/components/core';
import { UserMenu } from '$lib/components/layouts/UserMenu';
import { useAppKit, useAppKitAccount } from '$lib/utils/appkit';

interface RedEnvelopesHeaderProps {
  showHomeLogo?: boolean;
  className?: string;
}

export const RedEnvelopesHeader = ({ showHomeLogo = false, className }: RedEnvelopesHeaderProps) => {
  const { address } = useAppKitAccount();
  const { open } = useAppKit();

  return (
    <div className={twMerge(
      'flex items-center p-4 gap-3 justify-between',
      clsx(
        !showHomeLogo && 'md:ml-[89px]',
        showHomeLogo ? 'md:justify-between' : 'md:justify-end'
      ),
      className
    )}>
      <Link href="/cny" className={clsx('block', showHomeLogo ? 'md:block' : 'md:hidden')}>
        <i aria-hidden="true" className="icon-lemonade-logo size-5 text-tertiary" />
      </Link>
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