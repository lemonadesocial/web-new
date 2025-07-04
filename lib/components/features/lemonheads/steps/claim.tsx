import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { isMobile } from 'react-device-detect';
import { useAtom } from 'jotai';

import videojs from 'video.js';
import Player from 'video.js/dist/types/player';
import 'video.js/dist/video-js.css';

import { LemonHeadValues } from '../types';
import { mintAtom } from '../store';
import { Alert, Button, drawer, modal } from '$lib/components/core';
import { Pane } from '$lib/components/core/pane/pane';
import { useAccount, useLemonadeUsername } from '$lib/hooks/useLens';
import { SelectProfileModal } from '../../lens-account/SelectProfileModal';
import { ClaimLemonadeUsernameModal } from '../../lens-account/ClaimLemonadeUsernameModal';
import { EditProfileModal } from '../../lens-account/EditProfileModal';

export function ClaimStep({ form }: { form: UseFormReturn<LemonHeadValues> }) {
  const [mint, setMint] = useAtom(mintAtom);
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
        sources: [
          {
            src: `${process.env.NEXT_PUBLIC_LMD_VIDEO}/${srcPath}/video.m3u8`,
            type: 'application/x-mpegURL',
          },
        ],
      });
    }
  }, [isMobile]);

  const image = 'https://i.seadn.io/s/raw/files/5faf4f74c7f11fcb939cfcb9e738fbae.png?auto=format&dpr=1&w=1000';

  return (
    <div className="px-11 pb-11 pt-7 w-full max-w-[1440px]">
      <div className="relative z-10 flex flex-col items-center gap-11 text-center">
        <div>
          <p className="text-secondary md:text-xl">Welcome to</p>
          <p className="font-title text-2xl md:text-3xl font-semibold!">United Stands of Lemonade</p>
        </div>
        <img
          src={`/api/og/lemonheads?image=${image}&username=${myAccount?.username}&bio=${myAccount?.metadata?.bio}`}
          className="rounded-md border border-primary"
        />

        <div className="flex w-full max-w-[1200px] justify-between">
          <Button variant="secondary" iconLeft="icon-passport">
            Get Another Look
          </Button>

          <div className="flex gap-2">
            <Button
              variant="tertiary-alt"
              icon={mint.mute ? 'icon-speaker-wave' : 'icon-speaker-x-mark'}
              onClick={() => setMint({ ...mint, mute: !mint.mute })}
            />
            <Button iconRight="icon-arrow-outward" variant="tertiary-alt">
              View txn.
            </Button>
            <Button
              iconLeft="icon-share"
              variant="tertiary-alt"
              onClick={() => drawer.open(RightPane, { props: { image } })}
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
          muted={mint.mute}
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'fill' }}
        ></video>
      </div>
    </div>
  );
}

function RightPane({ image }: { image: string }) {
  const { account: myAccount } = useAccount();
  const { username, isLoading } = useLemonadeUsername(myAccount);

  const handleUpdateProfile = () => {
    if (!myAccount) {
      modal.open(SelectProfileModal, { dismissible: true });
    } else {
      if (!username) modal.open(ClaimLemonadeUsernameModal);
      else modal.open(EditProfileModal, { dismissible: true });
    }
  };

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
          <img
            src={`/api/og/lemonheads?image=${image}&username=${myAccount?.username}&bio=${myAccount?.bio}`}
            className="rounded-md"
          />
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
              <Button size="sm" iconLeft="icon-vertical-align-top rotate-180" variant="secondary">
                Download
              </Button>
            </div>
          </div>
        </Alert>

        <div className="py-5 flex flex-col px-4 gap-4">
          <p className="text-lg">Share LemonHeads</p>
          <div>social button here</div>
        </div>
      </Pane.Content>
    </Pane.Root>
  );
}
