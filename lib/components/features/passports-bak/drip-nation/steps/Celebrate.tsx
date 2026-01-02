'use client';

import { Card, Button, drawer } from '$lib/components/core';
import { usePassportContext } from '../provider';
import { ETHERSCAN } from '$lib/utils/constants';
import { SharedPassportPane } from '$lib/components/features/passport/SharedPassportPane';

export function PassportCelebrate() {
  const [state] = usePassportContext();
  const tokenId = state.mintState?.tokenId;

  const handleShare = () => drawer.open(SharedPassportPane, { props: { tokenId: tokenId! } });

  return (
    <div className="flex-1 h-full relative max-w-[612] md:mx-auto">
      <div className="relative z-10 flex flex-col items-center gap-5 md:gap-11 text-center h-full">
        <div className="flex-1 flex flex-col items-center gap-11 pt-6 pb-11 max-sm:justify-center w-full">
          <Card.Root className="w-full">
            <Card.Content className="aspect-square flex items-center justify-center">
              <img src={`/api/og/passport/drip-nation/?tokenId=${tokenId}`} />
            </Card.Content>
          </Card.Root>

          <div className="flex flex-wrap gap-5 w-full justify-center">
            <Button
              iconRight="icon-arrow-outward"
              variant="tertiary-alt"
              onClick={() => window.open(`${ETHERSCAN}/tx/${state.mintState?.txHash}`)}
            >
              View txn.
            </Button>

            {/* <div className="flex gap-2">
              <Button iconLeft="icon-share" variant="secondary" onClick={handleShare}>
                Share
              </Button>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
