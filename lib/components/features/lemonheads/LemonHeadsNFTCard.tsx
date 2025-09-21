'use client';
import { drawer } from '$lib/components/core';
import { useLemonhead } from '$lib/hooks/useLemonhead';
import { SharedLemonheadsPane } from '$lib/components/features/lemonheads/mint/steps/ClaimLemonHead';

export function LemonHeadsNFTCard() {
  const { data } = useLemonhead();
  if (!data || !data?.image) return null;

  return (
    <div className="backdrop-blur-md p-4 rounded-md space-y-3 border">
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
  );
}
