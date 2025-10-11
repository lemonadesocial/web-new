'use client';
import { useRouter } from 'next/navigation';

import { Button } from '$lib/components/core';
import { useLemonhead } from '$lib/hooks/useLemonhead';
import { ASSET_PREFIX } from '$lib/utils/constants';

export function PassportCard() {
  const router = useRouter();
  const { data } = useLemonhead();

  if (!data || data.tokenId === 0) return null;

  return (
    <div className="hidden md:block backdrop-blur-md p-4 rounded-md space-y-3 border-(length:--card-border-width)">
      <img src={`${ASSET_PREFIX}/assets/images/passport.png`} />
      <div>
        <p>Your Passport Awaits</p>
        <p className="text-sm">Claim your free United Stands of Lemonade Passport, exclusive to LemonHeads.</p>
      </div>
      <Button variant="secondary" className="w-full" onClick={() => router.push('/passport/mint')}>
        Claim Passport
      </Button>
    </div>
  );
}
