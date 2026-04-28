'use client';

import { QRCodeSVG } from 'qrcode.react';

import { Button } from '$lib/components/core/button/button';

interface TicketActionsProps {
  mapUrl?: string | null;
  appleWalletUrl?: string;
  googleWalletUrl?: string;
}

function openExternal(url?: string | null) {
  if (!url) return;

  window.open(url, '_blank', 'noopener,noreferrer');
}

export function TicketQrCode({ shortid }: { shortid: string }) {
  return (
    <div className="flex justify-center p-6 sm:p-8">
      <div className="size-[180px] sm:size-[244px]">
        <QRCodeSVG
          value={shortid}
          size={244}
          bgColor="transparent"
          fgColor="#FFFFFF"
          className="size-full"
          aria-label={`QR code for ticket ${shortid}`}
        />
      </div>
    </div>
  );
}

export function TicketActions({ mapUrl, appleWalletUrl, googleWalletUrl }: TicketActionsProps) {
  const hasWalletUrl = Boolean(appleWalletUrl && googleWalletUrl);

  const handleAddToWallet = () => {
    const isAppleDevice = /iPad|iPhone|iPod/.test(window.navigator.userAgent);
    openExternal(isAppleDevice ? appleWalletUrl : googleWalletUrl);
  };

  return (
    <div className="flex flex-col gap-3 p-6 sm:flex-row">
      {mapUrl ? (
        <Button
          variant="tertiary"
          size="lg"
          iconLeft="icon-location-outline"
          className="max-h-none w-full py-3"
          onClick={() => openExternal(mapUrl)}
        >
          Get Directions
        </Button>
      ) : null}
      <Button
        variant="secondary"
        size="lg"
        iconLeft="icon-pass"
        className="max-h-none w-full py-3"
        disabled={!hasWalletUrl}
        onClick={handleAddToWallet}
      >
        Add to Wallet
      </Button>
    </div>
  );
}
