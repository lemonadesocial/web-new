'use client';

import { drawer } from '$lib/components/core';
import { useLemonhead } from '$lib/hooks/useLemonhead';
import { PassportCard } from '../passport/PassportCard';
import { InviteFriend } from './cards/InviteCard';
import { LemonHeadsNFTCard } from './cards/LemonHeadsNFTCard';
import { LemonHeadsTreasuryCard } from './cards/TreasuryCard';
import { SharedLemonheadsPane } from './mint/steps/ClaimLemonHead';

export function LemonHeadsRightCol({
  options = { nft: true, treasury: true, invite: true, passport: true },
}: {
  options?: { nft?: boolean; treasury?: boolean; invite?: boolean; passport?: boolean };
}) {
  const { data } = useLemonhead();

  return (
    <>
      <div className="md:hidden flex max-w-full overflow-y-auto no-scrollbar gap-2">
        {options.passport && <PassportCard />}
        {options.nft && <LemonHeadsNFTCard />}

        {options.treasury && <LemonHeadsTreasuryCard />}
        {options.invite && <InviteFriend locked={!data || (data && data.tokenId == 0)} />}
      </div>

      <div className="hidden md:block w-full max-w-[296px]">
        <div className="sticky top-0 flex flex-col gap-4">
          {options.passport && <PassportCard />}
          {options.nft && <LemonHeadsNFTCard />}

          {options.treasury && <LemonHeadsTreasuryCard />}
          {options.invite && <InviteFriend locked={!data || (data && data.tokenId == 0)} />}
        </div>
      </div>
    </>
  );
}

// {options.nft && data && data.tokenId > 0 && (
//          <div className="flex gap-2.5 py-2.5 px-3 bg-overlay-secondary backdrop-blur-md rounded-md items-center flex-1 w-full min-w-fit">
//            <img src={data?.image} className="rounded-sm size-8 aspect-square" />
//
//            <div className="flex flex-col">
//              <p
//                className="text-sm"
//                onClick={() =>
//                  drawer.open(SharedLemonheadsPane, {
//                    props: {
//                      tokenId: data.tokenId?.toString(),
//                    },
//                  })
//                }
//              >
//                Share
//              </p>
//              <p className="text-xs text-quaternary">LemonHead #{data?.tokenId}</p>
//            </div>
//          </div>
//        )}
