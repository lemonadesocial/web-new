import React from 'react';
import { isMobile } from 'react-device-detect';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import videojs from 'video.js';
import Player from 'video.js/dist/types/player';
import 'video.js/dist/video-js.css';

import { Button, Card, Divider, drawer, modal, Segment } from '$lib/components/core';
import { Pane } from '$lib/components/core/pane/pane';
import { useAccount, useLemonadeUsername, usePost } from '$lib/hooks/useLens';
import { SEPOLIA_ETHERSCAN } from '$lib/utils/constants';

import { SelectProfileModal } from '../../lens-account/SelectProfileModal';
import { ClaimLemonadeUsernameModal } from '../../lens-account/ClaimLemonadeUsernameModal';
import { EditProfileModal } from '../../lens-account/EditProfileModal';
import { PostComposer } from '../../lens-feed/PostComposer';
import { LemonHeadActionKind, useLemonHeadContext } from '../provider';
import { PostComposerModal } from '../../lens-feed/PostComposerModal';
import { LEMONHEAD_COLORS } from '../utils';

const getImage = (args: { address: string; tokenId: string; color: string; portrait?: boolean }) =>
  `/api/og/lemonheads?address=${args.address}&tokenId=${args.tokenId}&color=${args.color}&portrait=${args.portrait || false}`;

export function ClaimLemonHead() {
  const [state, dispatch] = useLemonHeadContext();
  const { account: myAccount } = useAccount();
  const [color, setColor] = React.useState('violet');
  const [portrait, setPortrait] = React.useState(false);

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

  return (
    <div className="p-4 md:px-11 md:pb-11 md:pt-7 w-full max-w-[1440px] h-full">
      <div className="relative z-10 flex flex-col items-center gap-5 md:gap-11 text-center h-full">
        <div>
          <p className="text-secondary md:text-xl">Welcome to</p>
          <p className="font-title text-2xl md:text-3xl font-semibold!">United Stands of Lemonade</p>
        </div>
        <div className="flex-1 flex flex-col items-center gap-5 justify-center w-[70%]">
          <ImageLazyLoad
            src={getImage({ address: myAccount?.address, tokenId: state.mint.tokenId, color, portrait })}
            className="border border-primary"
          />

          <div className="flex flex-wrap gap-5 w-full max-w-[1200px] justify-center md:justify-between">
            <div className="flex items-center gap-2">
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
            </div>

            <div className="flex gap-2">
              <Button
                iconLeft="icon-share"
                variant="secondary"
                onClick={() =>
                  drawer.open(RightPane, {
                    props: {
                      tokenId: state.mint.tokenId,
                      onSelectColor: (_color) => setColor(_color),
                      onSelectPortrait: (value) => setPortrait(value),
                    },
                  })
                }
              >
                Share Your LemonHead
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

function RightPane({
  tokenId,
  onSelectColor,
  onSelectPortrait,
}: {
  tokenId: string;
  onSelectColor: (color: string) => void;
  onSelectPortrait: (value: boolean) => void;
}) {
  const { account: myAccount } = useAccount();
  const { username } = useLemonadeUsername(myAccount);
  const [imageType, setImageType] = React.useState<'body' | 'portrait'>('body');
  const [color, setColor] = React.useState('violet');

  const image = myAccount?.address
    ? getImage({ address: myAccount.address!, tokenId, color, portrait: imageType === 'portrait' })
    : '';

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
          <h3 className="text-xl text-primary font-medium">Share Your LemonHead</h3>
          <p className="text-secondary">
            Your LemonHead share card is ready to download! Update your profile info to make it truly yours.
          </p>
        </div>

        <ImageLazyLoad src={image} />

        <div className="flex flex-col gap-4">
          <p className="text-lg">Personalize Your Card</p>
          <Button variant="tertiary-alt" onClick={handleUpdateProfile}>
            Add Username & Bio
          </Button>

          <Segment
            selected={imageType}
            onSelect={({ value }: { value: 'body' | 'portrait' }) => {
              setImageType(value);
              onSelectPortrait(value === 'portrait');
            }}
            items={[
              { iconLeft: 'icon-human', value: 'body', label: 'Full Body' },
              { iconLeft: 'icon-user-filled', value: 'portrait', label: 'Portrait' },
            ]}
          />

          <div className="flex justify-between">
            {Object.entries(LEMONHEAD_COLORS).map(([key, value]) => (
              <div
                className={clsx('p-0.5 cursor-pointer', color === key && 'outline-2 rounded-full')}
                onClick={() => {
                  setColor(key);
                  onSelectColor(key);
                }}
              >
                <div className="rounded-full aspect-square h-[30px]" style={{ backgroundColor: value.fg }} />
              </div>
            ))}
          </div>

          <a href={image} download className="w-full">
            <Button iconLeft="icon-vertical-align-top rotate-180" className="w-full" variant="secondary">
              Download
            </Button>
          </a>
        </div>

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

function ImageLazyLoad({ src = '', className }: { src?: string; className?: string }) {
  const [imageLoaded, setImageLoaded] = React.useState(false);

  return (
    <img
      src={src}
      onLoad={() => setImageLoaded(true)}
      loading="lazy"
      className={twMerge('rounded-md', className, !imageLoaded ? 'invisible absolute' : 'visible')}
    />
  );
}

export function ShareModal({ content }: { content?: string }) {
  const { createPost } = usePost();

  const onPost = async (metadata: unknown, feedAddress?: string) => {
    await createPost({ metadata, feedAddress });
    modal.close();
  };

  return (
    <Card.Root className="w-xl bg-transparent border-none">
      <Card.Content className="p-0">
        <PostComposer onPost={onPost} showFeedOptions autoFocus defaultValue={content} />
      </Card.Content>
    </Card.Root>
  );
}
