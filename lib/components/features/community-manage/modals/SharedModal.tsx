'use client';
import React from 'react';
import { isMobile } from 'react-device-detect';

import { Button, Card, InputField, modal, ModalContent } from '$lib/components/core';
import { PostComposerModal } from '../../lens-feed/PostComposerModal';
import { twMerge } from 'tailwind-merge';
import { copy } from '$lib/utils/helpers';

export function SharedModal({ hostname = '' }: { hostname?: string }) {
  const [copied, setCopied] = React.useState(false);
  const shareOptions = [
    {
      name: 'Tweet',
      icon: 'icon-twitter',
      onClick: () => handleShare(`https://twitter.com/intent/tweet?url=${encodeURIComponent(hostname)}`),
    },
    {
      name: 'Cast',
      icon: 'icon-farcaster',
      onClick: () =>
        handleShare(
          `https://warpcast.com/~/compose?text=${encodeURIComponent(hostname)}&embeds[]=${encodeURIComponent(hostname)}`,
        ),
    },
    {
      name: 'Post',
      icon: 'icon-lemonade',
      onClick: () =>
        modal.open(PostComposerModal, {
          dismissible: true,
          fullscreen: isMobile,
          props: { defaultValue: hostname },
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
      onClick: () => handleShare(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(hostname)}`),
    },
  ];

  const handleShare = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <ModalContent icon="icon-share" className="w-sm md:w-[448px]">
      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <p className="text-lg">Share Community</p>
          <p className="text-sm text-secondary">
            It’s always better with friends. Invite others to join your community and help it grow.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {shareOptions.map((item, idx) => (
            <Card.Root key={idx} onClick={item.onClick}>
              <Card.Content className="flex flex-col items-center gap-3 px-1 pb-2 pt-3">
                <i className={twMerge('size-8 aspect-square', item.icon)} />
                <p>{item.name}</p>
              </Card.Content>
            </Card.Root>
          ))}
        </div>

        <div className="flex gap-2 items-end">
          <div className="flex-1">
            <InputField label="Share the link:" readOnly value={hostname} />
          </div>
          <Button
            variant="tertiary-alt"
            onClick={() => {
              copy(hostname);
              setCopied(true);
            }}
          >
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>
      </div>
    </ModalContent>
  );
}
