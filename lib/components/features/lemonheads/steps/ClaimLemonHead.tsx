import React from 'react';
import { isMobile } from 'react-device-detect';
import { twMerge } from 'tailwind-merge';

import videojs from 'video.js';
import Player from 'video.js/dist/types/player';
import 'video.js/dist/video-js.css';

import { Alert, Button, Card, drawer, modal, Skeleton } from '$lib/components/core';
import { Pane } from '$lib/components/core/pane/pane';
import { useAccount, useLemonadeUsername, usePost } from '$lib/hooks/useLens';
import { ASSET_PREFIX, SEPOLIA_ETHERSCAN } from '$lib/utils/constants';

import { SelectProfileModal } from '../../lens-account/SelectProfileModal';
import { ClaimLemonadeUsernameModal } from '../../lens-account/ClaimLemonadeUsernameModal';
import { EditProfileModal } from '../../lens-account/EditProfileModal';
import { PostComposer } from '../../lens-feed/PostComposer';
import { LemonHeadActionKind, useLemonHeadContext } from '../provider';

export function ClaimLemonHead() {
  const [state, dispatch] = useLemonHeadContext();
  const { account: myAccount } = useAccount();

  const videoRef = React.useRef(null);
  const playerRef = React.useRef<Player>(null);

  React.useEffect(() => {
    if (videoRef.current && !playerRef.current) {
      const srcPath = isMobile ? 'lemonhead_mint_mobile' : 'lemonhead_mint_web';
      playerRef.current = videojs(videoRef.current, {
        fill: true,
        loop: true,
        controls: false,
        autoplay: true,
        muted: true,
        sources: [
          {
            src: `${process.env.NEXT_PUBLIC_LMD_VIDEO}/${srcPath}/video.m3u8`,
            type: 'application/x-mpegURL',
          },
        ],
      });
    }
  }, [videoRef.current, isMobile]);

  const getImage = () => `/api/og/lemonheads?address=${myAccount?.address}&tokenId=${state.mint.tokenId}`;

  return (
    <div className="p-4 md:px-11 md:pb-11 md:pt-7 w-full max-w-[1440px] h-full">
      <div className="relative z-10 flex flex-col items-center gap-5 md:gap-11 text-center h-full">
        <div>
          <p className="text-secondary md:text-xl">Welcome to</p>
          <p className="font-title text-2xl md:text-3xl font-semibold!">United Stands of Lemonade</p>
        </div>
        <div className="flex-1 flex flex-col items-center gap-5 justify-center w-full">
          <ImageLazyLoad src={getImage()} className="border border-primary" />

          <div className="flex flex-wrap gap-5 w-full max-w-[1200px] justify-center md:justify-between">
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
                variant="secondary"
                onClick={() => drawer.open(RightPane, { props: { image: getImage() } })}
              >
                Share
              </Button>
            </div>
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
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        ></video>
      </div>
    </div>
  );
}

const shareUrl = 'https://lemonade.social/lemonheads';
const shareText = 'Just claimed my LemonHead 🍋 Fully onchain, totally me. Yours is waiting—go mint it now → ';

function RightPane({ image }: { image: string }) {
  const { account: myAccount } = useAccount();
  const { username } = useLemonadeUsername(myAccount);

  const handleUpdateProfile = () => {
    if (!myAccount) {
      modal.open(SelectProfileModal);
    } else {
      if (!username) modal.open(ClaimLemonadeUsernameModal);
      else modal.open(EditProfileModal);
    }
  };

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
      onClick: () => modal.open(ShareModal, { dismissible: true }),
    },
    {
      name: 'Share',
      icon: 'icon-instagram',
      onClick: () => alert('Comming soon'),
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
          <ImageLazyLoad src={image} />
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
              <a href={image} download>
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
                className="flex flex-col items-center gap-1 md:gap-3 pt-4 pb-2 px-1 bg-(--btn-tertiary) text-tertiary hover:(--btn-tertiary-hover) hover:text-primary rounded-sm cursor-pointer"
              >
                <i className={twMerge('size-5 md:size-8', item.icon)} />
                <p className="text-xs md:text-base">{item.name}</p>
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

function ShareModal() {
  const { createPost } = usePost();

  const onPost = async (metadata: unknown, feedAddress?: string) => {
    await createPost({ metadata, feedAddress });
    modal.close()
  };

  return (
    <Card.Root className="w-xl bg-transparent">
      <Card.Content className="p-0">
        <PostComposer
          onPost={onPost}
          showFeedOptions
          autoFocus
          defaultValue="Just claimed my LemonHead 🍋 Fully onchain, totally me. Yours is waiting—go mint it now → https://lemonade.social/lemonheads"
        />
      </Card.Content>
    </Card.Root>
  );
}
