'use client';
import { useRouter } from 'next/navigation';

import { Button, drawer } from '$lib/components/core';
import { useLemonhead } from '$lib/hooks/useLemonhead';
import { usePassport } from '$lib/hooks/usePassport';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { SharedPassportPane } from './SharedPassportPane';

export function PassportCard() {
  const router = useRouter();
  const { data: lemonhead } = useLemonhead();
  const { data: passport } = usePassport();

  if (passport && passport.tokenId > 0) {
    return (
      <div
        className="flex gap-2.5 py-2.5 px-3 md:p-4 border-(length:--card-border-width) backdrop-blur-md rounded-md items-center flex-1 w-full min-w-fit cursor-pointer"
        onClick={() => drawer.open(SharedPassportPane, { props: { tokenId: String(passport.tokenId) } })}
      >
        <img src={passport.image} className="rounded-xs w-8 border" />
        <div className="flex flex-col">
          <p className="text-sm md:text-md">Share</p>
          <p className="text-xs md:text-sm text-tertiary">Passport #{passport.tokenId}</p>
        </div>
      </div>
    );
  }

  if (lemonhead && lemonhead.tokenId > 0) {
    return (
      <div className="hidden md:block backdrop-blur-md p-4 rounded-md space-y-3 border-(length:--card-border-width) border-card-border">
        <img src={`${ASSET_PREFIX}/assets/images/passport-dummy.png`} />
        <div>
          <p>Your Passport Awaits</p>
          <p className="text-sm">Claim your free United Stands of Lemonade Passport, exclusive to LemonHeads.</p>
        </div>
        <Button variant="secondary" className="w-full" size="sm" onClick={() => router.push('/passport/mint')}>
          Claim Passport
        </Button>
      </div>
    );
  }

  return null;
}
