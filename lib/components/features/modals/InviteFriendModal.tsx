import { useState } from "react";

import { Event } from '$lib/graphql/generated/backend/graphql';
import { Button, ModalContent } from "$lib/components/core";

export function InviteFriendModal({ event }: { event: Event }) {
  const [copyText, setCopyText] = useState('Copy');
  const shareUrl = `${window.location.origin}/e/${event.shortid}`;
  const shareText = `I am going to ${event.title}. Join me!`;

  const handleShare = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopyText('Copied!');
      });
  };

  const shareOptions = [
    { name: 'Tweet', icon: 'icon-twitter', onClick: () => handleShare(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${shareText}`) },
    { name: 'Cast', icon: 'icon-warpcast', onClick: () => handleShare(`https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}&embeds[]=${encodeURIComponent(shareUrl)}`) },
    { name: 'Post', icon: 'icon-linkedin', onClick: () => handleShare(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`) },
    { name: 'Share', icon: 'icon-facebook', onClick: () => handleShare(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`) },
    { name: 'Email', icon: 'icon-email', onClick: () => handleShare(`mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(shareUrl)}`) },
    ...(navigator.share ? [{
      name: 'Native',
      icon: 'icon-share',
      onClick: () => navigator.share({
        title: event.title,
        text: shareText,
        url: shareUrl
      })
    }] : [])
  ];

  return (
    <ModalContent icon="icon-share" className="w-[480px]">
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-lg">Invite a Friend</p>
          <p className="text-sm text-secondary">It&apos;s always more fun with friends. We&apos;ll let you know when your friends accept your invite.</p>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {shareOptions.map((option) => (
            <ShareButton
              key={option.icon}
              title={option.name}
              icon={option.icon}
              onClick={option.onClick}
            />
          ))}
        </div>
        <hr className="border-t border-divider" />
        <div className="space-y-1.5">
          <p className="text-sm text-secondary">Share the link:</p>
          <div className="flex items-center gap-2">
            <div className="flex-grow rounded-sm border border-primary/8 bg-woodsmoke-950/64 py-2 px-3 overflow-hidden">
              <p className="truncate">{shareUrl}</p>
            </div>
            <Button
              variant="tertiary"
              onClick={handleCopy}
            >
              {copyText}
            </Button>
          </div>
        </div>
      </div>
    </ModalContent>
  );
}

interface ShareButtonProps {
  title: string;
  icon: string;
  onClick: () => void;
}

function ShareButton({ title, icon, onClick }: ShareButtonProps) {
  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-3 px-1 py-4 rounded-sm bg-primary/8 cursor-pointer"
    >
      <i aria-hidden="true" className={`${icon} size-8 text-secondary`} />
      <span className="text-sm text-secondary">{title}</span>
    </div>
  );
}
