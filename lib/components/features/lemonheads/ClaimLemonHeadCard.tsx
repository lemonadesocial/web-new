'use client';
import React from 'react';
import { Button } from '$lib/components/core';
import { useLemonhead } from '$lib/hooks/useLemonhead';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { useRouter } from 'next/navigation';

export function ClaimLemonHeadCard() {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);
  const { hasLemonhead, loading } = useLemonhead();

  if (loading || hasLemonhead) return null;

  return (
    <div className="hidden md:block rounded-sm border border-divider space-y-4 p-4">
      <div className="flex justify-between items-start">
        <div className="size-12 rounded-sm">
          <img src={`${ASSET_PREFIX}/assets/images/lemonheads-montage.gif`} className="rounded-sm w-full h-full" />
        </div>
        <div className="tooltip">
          <div className="tooltip-content">
            <p className="text-md font-medium ">lemonheads.xyz</p>
          </div>
          <i
            className="icon-error text-quaternary cursor-pointer"
            onClick={() => window.open('https://lemonheads.xyz')}
          />
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-lg">Become a Member</p>
        <p className="text-sm text-secondary">Claim your LemonHead to access exclusive features & rewards!</p>
      </div>
      <Button
        variant="secondary"
        className="w-full"
        loading={pending}
        onClick={() => {
          setPending(true);
          router.push('/lemonheads');
        }}
      >
        Claim LemonHead
      </Button>
    </div>
  );
}
