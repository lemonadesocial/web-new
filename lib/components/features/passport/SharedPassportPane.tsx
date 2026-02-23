'use client';
import { isMobile } from 'react-device-detect';
import { twMerge } from 'tailwind-merge';

import { Card, Button, modal, Divider } from '$lib/components/core';
import { Pane } from '$lib/components/core/pane/pane';
import { PostComposerModal } from '$lib/components/features/lens-feed/PostComposerModal';

const shareText = 'Just claimed my LemonHead Passport Fully onchain, totally me. Yours is waiting—go mint it now → ';

export function SharedPassportPane({ tokenId }: { tokenId: string }) {
  const shareUrl = `${window.location.origin}/api/og/passport?tokenId=${tokenId}`;

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
          `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}&embeds[]=${encodeURIComponent(
            shareUrl,
          )}`,
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
            <img src={shareUrl} />
          </Card.Content>
        </Card.Root>

        <a className="w-full" href={shareUrl} download={`lemonade-passport-${tokenId}.png`}>
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
                <i aria-hidden="true" className={twMerge('size-5 md:size-8', item.icon)} />
                <p className="text-xs md:text-base">{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      </Pane.Content>
    </Pane.Root>
  );
}
