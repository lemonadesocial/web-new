import React from 'react';
import { isMobile } from 'react-device-detect';
import { twMerge } from 'tailwind-merge';

import videojs from 'video.js';
import Player from 'video.js/dist/types/player';
import 'video.js/dist/video-js.css';

import { Alert, Button, drawer, modal, Skeleton } from '$lib/components/core';
import { Pane } from '$lib/components/core/pane/pane';
import { useAccount, useLemonadeUsername } from '$lib/hooks/useLens';
import { ASSET_PREFIX, SEPOLIA_ETHERSCAN } from '$lib/utils/constants';

import { SelectProfileModal } from '../../lens-account/SelectProfileModal';
import { ClaimLemonadeUsernameModal } from '../../lens-account/ClaimLemonadeUsernameModal';
import { EditProfileModal } from '../../lens-account/EditProfileModal';
import { LemonHeadActionKind, useLemonHeadContext } from '../provider';

export function ClaimLemonHead() {
  const [state, dispatch] = useLemonHeadContext();
  const { account: myAccount } = useAccount();

  const videoRef = React.useRef(null);
  const playerRef = React.useRef<Player>(null);

  React.useEffect(() => dispatch({ type: LemonHeadActionKind.set_mint, payload: { minted: true, video: true } }), []);

  React.useEffect(() => {
    if (videoRef.current && !playerRef.current) {
      const srcPath = isMobile ? 'lemonhead_mint_mobile' : 'lemonhead_mint_web';
      playerRef.current = videojs(videoRef.current, {
        fill: true,
        loop: true,
        controls: false,
        autoplay: true,
        sources: [
          {
            src: `${process.env.NEXT_PUBLIC_LMD_VIDEO}/${srcPath}/video.m3u8`,
            type: 'application/x-mpegURL',
          },
        ],
      });
    }
  }, [isMobile]);

  const getSrc = () => {
    let src = `/api/og/lemonheads?image=${state.mint.image}&tokenId=${state.mint.tokenId}`;
    if (myAccount?.username) src += `&username=${myAccount?.username.value.replace('lens/', '')}`;
    if (myAccount?.metadata?.bio) src += `&bio=${myAccount?.metadata.bio}`;

    return src;
  };

  return (
    <div className="px-11 pb-11 pt-7 w-full max-w-[1440px]">
      <div className="relative z-10 flex flex-col items-center gap-11 text-center">
        <div>
          <p className="text-secondary md:text-xl">Welcome to</p>
          <p className="font-title text-2xl md:text-3xl font-semibold!">United Stands of Lemonade</p>
        </div>
        <ImageLazyLoad src={getSrc()} className="border border-primary w-[1200px]" />

        <div className="flex w-full max-w-[1200px] justify-between">
          <Button
            variant="secondary"
            iconLeft="icon-passport"
            onClick={() => dispatch({ type: LemonHeadActionKind.reset_mint })}
          >
            Get Another Look
          </Button>

          <div className="flex gap-2">
            <Button
              variant="tertiary-alt"
              icon={state.mint.mute ? 'icon-speaker-wave' : 'icon-speaker-x-mark'}
              onClick={() => dispatch({ type: LemonHeadActionKind.set_mint, payload: { mute: !state.mint.mute } })}
            />
            <Button
              iconRight="icon-arrow-outward"
              variant="tertiary-alt"
              onClick={() => window.open(`${SEPOLIA_ETHERSCAN}/tx/${state.mint.txHash}`)}
            >
              View txn.
            </Button>
            <Button
              iconLeft="icon-share"
              variant="tertiary-alt"
              onClick={() => drawer.open(RightPane, { props: { image: state.mint.image } })}
            >
              Share
            </Button>
          </div>
        </div>
      </div>

      <div className="fixed inset-0 z-0">
        <div className="fixed inset-0 bg-background/56 z-0" />
        <video
          autoPlay
          loop
          ref={videoRef}
          muted={state.mint.mute}
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'fill' }}
        ></video>
      </div>
    </div>
  );
}

function RightPane({ image }: { image: string }) {
  const { account: myAccount } = useAccount();
  const { username } = useLemonadeUsername(myAccount);

  const handleUpdateProfile = () => {
    if (!myAccount) {
      modal.open(SelectProfileModal, { dismissible: true });
    } else {
      if (!username) modal.open(ClaimLemonadeUsernameModal);
      else modal.open(EditProfileModal, { dismissible: true });
    }
  };

  const getSrc = () => {
    let src = `/api/og/lemonheads?image=${image}`;
    if (myAccount?.username) src += `&username=${myAccount?.username.value.replace('lens/', '')}`;
    if (myAccount?.metadata?.bio) src += `&bio=${myAccount?.metadata.bio}`;

    return src;
  };

  const shareUrl = '';
  const shareText = '';
  const handleShare = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const shareOptions = [
    {
      name: 'Tweet',
      icon: 'icon-twitter',
      onClick: () =>
        handleShare(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${shareText}`),
    },
    {
      name: 'Cast',
      icon: 'icon-farcaster',
      onClick: () =>
        handleShare(
          `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}&embeds[]=${encodeURIComponent(shareUrl)}`,
        ),
    },
    {
      name: 'Post',
      icon: 'icon-lemonade',
      onClick: () => alert('Comming soon'),
      // onClick: () => handleShare(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`),
    },
    {
      name: 'Share',
      icon: 'icon-instagram',
      onClick: () => alert('Comming soon'),
      // onClick: () => handleShare(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`),
    },
    {
      name: 'Post',
      icon: 'icon-linkedin',
      onClick: () => handleShare(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`),
    },
  ];

  return (
    <Pane.Root>
      <Pane.Header.Root>
        <Pane.Header.Left showBackButton />
      </Pane.Header.Root>
      <Pane.Content className="flex-col">
        <div className="flex flex-col p-4 gap-5">
          <div className="flex flex-col gap-1">
            <h3 className="text-xl text-primary font-medium">Download Your Card</h3>
            <p className="text-secondary">
              Your personalized LemonHead card is ready! Update your profile info to make it truly yours.
            </p>
          </div>
          <ImageLazyLoad src={getSrc()} />
        </div>
        <Alert className="justify-start">
          <div className="flex flex-col gap-3">
            <div>
              <div className="flex items-center gap-2 text-accent-400">
                <i className="icon-sparkles size-4" />
                <p>Personalize Share Card</p>
              </div>
              <p className="text-sm text-secondary">Claim username & update your bio to personalize your share card!</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" iconLeft="icon-user-edit-outline" variant="tertiary" onClick={handleUpdateProfile}>
                Update Profile
              </Button>
              <a href={getSrc()} download>
                <Button size="sm" iconLeft="icon-vertical-align-top rotate-180" variant="secondary">
                  Download
                </Button>
              </a>
            </div>
          </div>
        </Alert>

        <div className="py-5 flex flex-col px-4 gap-4">
          <p className="text-lg">Share LemonHeads</p>
          <div className="grid grid-cols-5 gap-2">
            {shareOptions.map((item, idx) => (
              <div
                key={idx}
                onClick={item.onClick}
                className="flex flex-col items-center gap-3 pt-4 pb-2 px-1 bg-(--btn-tertiary) text-tertiary hover:(--btn-tertiary-hover) hover:text-primary rounded-sm cursor-pointer"
              >
                <i className={twMerge('size-8', item.icon)} />
                <p>{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      </Pane.Content>
    </Pane.Root>
  );
}

function ImageLazyLoad({ src = '', className }: { src?: string; className?: string }) {
  const [imageLoaded, setImageLoaded] = React.useState(false);

  return (
    <>
      {!imageLoaded && (
        <div
          style={{ background: `url(${ASSET_PREFIX}/assets/images/mint-cover.png)`, backgroundSize: 'contain' }}
          className={twMerge('w-full max-w-[1200px] aspect-[40/21] rounded-md', className)}
        >
          <div className="flex-1 items-center justify-center flex w-[52.3%] h-full">
            <Skeleton className="w-3/4 max-w-[456px] aspect-square animte rounded-none rounded-md" animate />
          </div>
        </div>
      )}
      <img
        src={src}
        onLoad={() => setImageLoaded(true)}
        loading="lazy"
        className={twMerge('rounded-md', className, !imageLoaded ? 'invisible absolute' : 'visible')}
      />
    </>
  );
}
