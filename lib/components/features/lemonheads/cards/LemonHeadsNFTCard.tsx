'use client';
import { useAppKitAccount } from '@reown/appkit/react';

import { Button, drawer } from '$lib/components/core';
import { useLemonhead } from '$lib/hooks/useLemonhead';
import { SharedLemonheadsPane } from '$lib/components/features/lemonheads/mint/steps/ClaimLemonHead';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { useRouter } from 'next/navigation';

export function LemonHeadsNFTCard() {
  const { address } = useAppKitAccount();
  const { data } = useLemonhead();
  const router = useRouter();

  if (!address || !data || (data && data.tokenId == 0))
    return (
      <div className="backdrop-blur-md p-4 rounded-md space-y-3 border-(length:--card-border-width)">
        <img src={`${ASSET_PREFIX}/assets/images/lemonheads-getstarted.gif`} className="rounded-sm" />
        <div>
          <p>Unlock Access</p>
          <p className="text-sm text-secondary">Claim your unique LemonHead to unlock exclusive content & features!</p>
        </div>

        <Button variant="secondary" className="w-full" size="sm" onClick={() => router.push('/lemonheads/mint')}>
          Claim LemonHead
        </Button>
      </div>
    );

  return (
    <>
      <div
        className="md:hidden flex gap-2.5 py-2.5 px-3 bg-overlay-secondary border-(length:--card-border-width) backdrop-blur-md rounded-md items-center flex-1 w-full min-w-fit"
        onClick={() =>
          drawer.open(SharedLemonheadsPane, {
            props: {
              tokenId: data.tokenId?.toString(),
            },
          })
        }
      >
        <img src={data?.image} className="rounded-sm size-8 aspect-square" />

        <div className="flex flex-col">
          <p className="text-sm">Share</p>
          <p className="text-xs text-quaternary">LemonHead #{data?.tokenId}</p>
        </div>
      </div>

      <div className="hidden md:block backdrop-blur-md p-4 rounded-md space-y-3 border-(length:--card-border-width)">
        <img src={data.image} className="rounded-sm" />
        <div className="flex justify-between">
          <p>LemonHead #{data.tokenId}</p>
          <i
            className="icon-share size-5 aspect-square text-quaternary hover:text-primary cursor-pointer"
            onClick={() =>
              drawer.open(SharedLemonheadsPane, {
                props: {
                  tokenId: data.tokenId?.toString(),
                },
              })
            }
          />
        </div>
      </div>
    </>
  );
}
