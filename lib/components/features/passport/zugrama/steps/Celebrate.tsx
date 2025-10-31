'use client';
import React from 'react';
import Player from 'video.js/dist/types/player';
import { isMobile } from 'react-device-detect';
import videojs from 'video.js';
import { twMerge } from 'tailwind-merge';

import { Card, Button, drawer, modal, Divider } from '$lib/components/core';
import { usePassportContext } from '../provider';
import { ETHERSCAN } from '$lib/utils/constants';
import { SharedPassportPane } from '$lib/components/features/passport/SharedPassportPane';

export function PassportCelebrate() {
  const videoRef = React.useRef(null);
  const playerRef = React.useRef<Player>(null);

  const [mute, setMute] = React.useState(true);
  const [state] = usePassportContext();
  const tokenId = state.mintState?.tokenId;

  React.useEffect(() => {
    if (videoRef.current && !playerRef.current) {
      const srcPath = isMobile ? 'lemonhead_mint_mobile' : 'lemonhead_mint_web';
      playerRef.current = videojs(videoRef.current, {
        fill: true,
        loop: true,
        controls: false,
        autoplay: true,
        muted: mute,
        sources: [
          {
            src: `${process.env.NEXT_PUBLIC_LMD_VIDEO}/${srcPath}/video.m3u8`,
            type: 'application/x-mpegURL',
          },
        ],
      });
    }
  }, [videoRef.current, isMobile]);

  const handleShare = () => drawer.open(SharedPassportPane, { props: { tokenId: tokenId! } });

  return (
    <div className="flex-1 h-full relative max-w-[612] md:mx-auto">
      <div className="relative z-10 flex flex-col items-center gap-5 md:gap-11 text-center h-full">
        <div className="flex-1 flex flex-col items-center gap-11 pt-6 pb-11 max-sm:justify-center w-full">
          <Card.Root className="w-full">
            <Card.Content className="aspect-square flex items-center justify-center">
              <img src={`/api/og/passport?tokenId=${tokenId}`} />
            </Card.Content>
          </Card.Root>

          <div className="flex flex-wrap gap-5 w-full justify-center md:justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="tertiary-alt"
                icon={mute ? 'icon-speaker-wave' : 'icon-speaker-x-mark'}
                onClick={() => setMute(!mute)}
              />
              <Button
                iconRight="icon-arrow-outward"
                variant="tertiary-alt"
                onClick={() => window.open(`${ETHERSCAN}/tx/${state.mintState?.txHash}`)}
              >
                View txn.
              </Button>
            </div>

            {/* <div className="flex gap-2">
              <Button iconLeft="icon-share" variant="secondary" onClick={handleShare}>
                Share
              </Button>
            </div> */}
          </div>
        </div>
      </div>

      <div className="fixed inset-0 z-0">
        <div className="fixed inset-0 bg-background/56 z-0" />
        <video
          autoPlay
          loop
          ref={videoRef}
          muted={mute}
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        ></video>
      </div>
    </div>
  );
}
