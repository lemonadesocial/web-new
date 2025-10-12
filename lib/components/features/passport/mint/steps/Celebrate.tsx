'use client';
import React from 'react';
import { useAppKitAccount } from '@reown/appkit/react';
import Player from 'video.js/dist/types/player';
import { isMobile } from 'react-device-detect';
import videojs from 'video.js';

import { Card, Button, drawer, modal, Divider } from '$lib/components/core';
import { PassportActionKind, PassportStep, usePassportContext } from '../provider';
import { ETHERSCAN } from '$lib/utils/constants';
import { Pane } from '$lib/components/core/pane/pane';
import { PostComposerModal } from '$lib/components/features/lens-feed/PostComposerModal';
import { twMerge } from 'tailwind-merge';

export function PassportCelebrate() {
  const [state, dispatch] = usePassportContext();

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

  const handleShare = () => drawer.open(SharedPassportPane);

  return (
    <div className="flex-1 h-full relative max-w-[612] md:mx-auto">
      <div className="relative z-10 flex flex-col items-center gap-5 md:gap-11 text-center h-full">
        <div className="flex-1 flex flex-col items-center gap-11 pt-6 pb-11 max-sm:justify-center w-full">
          <Card.Root className="w-full">
            <Card.Content className="aspect-square flex items-center justify-center">
              <p className="text-lg md:text-2xl">REPLACE IMAGE FROM BE HERE</p>
            </Card.Content>
          </Card.Root>

          <div className="flex flex-wrap gap-5 w-full justify-center md:justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="tertiary-alt"
                icon={state.mint.mute ? 'icon-speaker-wave' : 'icon-speaker-x-mark'}
                onClick={() => dispatch({ type: PassportActionKind.SetMint, payload: { mute: !state.mint.mute } })}
              />
              <Button
                iconRight="icon-arrow-outward"
                variant="tertiary-alt"
                onClick={() => window.open(`${ETHERSCAN}/tx/${state.mint.txHash}`)}
              >
                View txn.
              </Button>
            </div>

            <div className="flex gap-2">
              <Button iconLeft="icon-share" variant="secondary" onClick={handleShare}>
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

const shareUrl = 'https://lemonade.social/passport/mint';
const shareText = 'Just claimed my LemonHead Passport Fully onchain, totally me. Yours is waiting—go mint it now → ';

function SharedPassportPane() {
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
      onClick: () =>
        modal.open(PostComposerModal, {
          dismissible: true,
          fullscreen: isMobile,
          props: { defaultValue: shareText + shareUrl },
        }),
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
      <Pane.Content className="flex-col p-4 gap-5">
        <div className="flex flex-col gap-1">
          <h3 className="text-xl text-primary font-medium">Share Your Passport</h3>
          <p className="text-secondary">Your Passport share card is ready to download!</p>
        </div>

        <Card.Root className="w-full">
          <Card.Content className="aspect-square flex items-center justify-center">
            <p className="text-md">REPLACE IMAGE FROM BE HERE</p>
          </Card.Content>
        </Card.Root>

        <a className="w-full" download>
          <Button iconLeft="icon-vertical-align-top rotate-180" className="w-full" variant="secondary">
            Download Share Card
          </Button>
        </a>

        <Divider />

        <div className="flex flex-col gap-4">
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

export function PassportCelebrateOld() {
  const [state] = usePassportContext();
  const { address } = useAppKitAccount();

  if (state.currentStep !== PassportStep.celebrate) return null;

  const shareText = encodeURIComponent(`Just claimed my Lemonade Passport 🎉 Join me on-chain!`);
  const shareUrl = encodeURIComponent(`${window.location.origin}/passport`);

  return (
    <div className="flex-1 flex flex-col gap-8 items-center justify-center text-center px-4">
      <div className="flex flex-col gap-6 max-w-md">
        <div className="flex justify-center">
          <div className="relative">
            <div className="size-32 rounded-full bg-gradient-to-br from-accent-500 to-primary flex items-center justify-center animate-pulse">
              <i className="icon-celebration size-20 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 size-10 rounded-full bg-success-400 flex items-center justify-center border-4 border-background">
              <i className="icon-verified size-6 text-white" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-3xl md:text-4xl font-semibold">Congratulations!</h3>
          <p className="text-lg text-tertiary">You've successfully claimed your Lemonade Passport</p>
        </div>

        {state.photo && (
          <Card.Root>
            <Card.Content className="flex flex-col items-center gap-4">
              <img
                src={state.photo}
                alt="Passport"
                className="size-24 rounded-full object-cover border-4 border-primary/20"
              />
              <div>
                <p className="font-medium">Your Verified Identity</p>
                {state.mint.tokenId && <p className="text-sm text-tertiary">Token ID: #{state.mint.tokenId}</p>}
              </div>
            </Card.Content>
          </Card.Root>
        )}

        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium">Share Your Achievement</p>
          <div className="flex gap-2 justify-center">
            <Button
              variant="tertiary"
              icon="icon-x-twitter"
              size="sm"
              onClick={() =>
                window.open(`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`, '_blank')
              }
            >
              Share on X
            </Button>
            <Button
              variant="tertiary"
              icon="icon-farcaster"
              size="sm"
              onClick={() => window.open(`https://warpcast.com/~/compose?text=${shareText}`, '_blank')}
            >
              Share on Farcaster
            </Button>
          </div>
        </div>

        <Card.Root className="border-primary/20 bg-primary/5">
          <Card.Content className="flex flex-col gap-3 text-left">
            <div className="flex items-center gap-2">
              <i className="icon-sparkles size-5 text-accent-400" />
              <p className="font-medium">What's Next?</p>
            </div>
            <ul className="text-sm text-tertiary space-y-2">
              <li className="flex items-start gap-2">
                <i className="icon-check size-4 text-success-400 mt-0.5" />
                <span>Explore exclusive features unlocked by your passport</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="icon-check size-4 text-success-400 mt-0.5" />
                <span>Join verified-only events and communities</span>
              </li>
              <li className="flex items-start gap-2">
                <i className="icon-check size-4 text-success-400 mt-0.5" />
                <span>Start earning achievements and rewards</span>
              </li>
            </ul>
          </Card.Content>
        </Card.Root>
      </div>
    </div>
  );
}
