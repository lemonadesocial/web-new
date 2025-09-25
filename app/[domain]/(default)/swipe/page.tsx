'use client';
import { useRouter } from 'next/navigation';

import { Button } from '$lib/components/core/button';
import { useLemonhead } from '$lib/hooks/useLemonhead';
import { ASSET_PREFIX } from '$lib/utils/constants';

export default function SwipePage() {
  const { data } = useLemonhead();
  const router = useRouter();

  return (
    <div className="max-w-[794] mx-auto pt-11 flex flex-col items-center">
      <div
        className="h-[296] flex items-end justify-center w-full"
        style={{
          backgroundImage: `url(${ASSET_PREFIX}/assets/images/swipe-graphic.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <h1 className="text-3xl font-semibold pt-9">Swipe & Match</h1>
      </div>
      <p className="mt-2 text-tertiary text-center">
        Connect with like-minded creators and collaborators from the Lemonade community. Swipe to discover, match with
        people who inspire you, and start chatting instantly.
      </p>

      <div className="flex items-center justify-center mt-14">
        <div className="flex flex-col items-center justify-center size-[88px] gap-3 rounded-md bg-primary/8">
          <i className="icon-swipe size-8 text-[#FBBF24]" />
          <p className="text-sm text-secondary">Swipe</p>
        </div>
        <hr className="w-5 border border-t-divider" />
        <div className="flex flex-col items-center justify-center size-[88px] gap-3 rounded-md bg-primary/8">
          <i className="icon-heart size-8 text-[#F472B6]" />
          <p className="text-sm text-secondary">Match</p>
        </div>
        <hr className="w-5 border border-t-divider" />
        <div className="flex flex-col items-center justify-center size-[88px] gap-3 rounded-md bg-primary/8">
          <i className="icon-chat size-8 text-[#51A2FF]" />
          <p className="text-sm text-secondary">Chat</p>
        </div>
        <hr className="w-5 border border-t-divider" />
        <div className="flex flex-col items-center justify-center size-[88px] gap-3 rounded-md bg-primary/8">
          <i className="icon-collab size-8 text-[#A684FF]" />
          <p className="text-sm text-secondary">Collab</p>
        </div>
      </div>

      {data && data?.tokenId > 0 ? (
        <div className="mt-14 space-y-4">
          <p className="text-tertiary text-center">Download the Lemonade app & start swiping!</p>
          <div className="flex items-center justify-center gap-2">
            <a href="https://apps.apple.com/us/app/lemonade-social/id6450694884" target="_blank">
              <img src={`${ASSET_PREFIX}/assets/images/app-store-badge.png`} alt="App Store" className="h-12" />
            </a>
            <a href="https://play.google.com/store/apps/details?id=social.lemonade.app" target="_blank">
              <img src={`${ASSET_PREFIX}/assets/images/google-play-badge.png`} alt="Google Play" className="h-12" />
            </a>
          </div>
        </div>
      ) : (
        <Button variant="secondary" className="rounded-full mt-14" onClick={() => router.push('/lemonheads/mint')}>
          Claim Lemonhead to Unlock
        </Button>
      )}
    </div>
  );
}
