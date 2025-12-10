'use client';
import React from 'react';

import { Button, Card, modal, ModalContent, Skeleton, toast } from '$lib/components/core';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { twMerge } from 'tailwind-merge';
import { formatNumberWithCommas } from '$lib/utils/string';
import { match } from 'ts-pattern';
import { useQuery } from '$lib/graphql/request';
import { GetSpaceNfTsDocument, SpaceNft, SpaceNftContract, SpaceNftKind } from '$lib/graphql/generated/backend/graphql';
import { RadialProgress } from '$lib/components/core/progress/radial';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { ConnectWallet } from '../modals/ConnectWallet';
import { chainsMapAtom } from '$lib/jotai';
import { Eip1193Provider, ethers } from 'ethers';
import { ConfirmTransaction } from '../modals/ConfirmTransaction';
import { SignTransactionModal } from '../modals/SignTransaction';
import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';
import { formatError, MusicNftContract, writeContract } from '$lib/utils/crypto';
import * as Sentry from '@sentry/nextjs';
import { appKit } from '$lib/utils/appkit';
import { useMusicNft } from '$lib/hooks/useMusicNft';
import { mainnet } from 'viem/chains';
import { useGetEns } from '$lib/hooks/useGetEnsName';
import { delay } from 'lodash';
import { useQueryClient } from '@tanstack/react-query';

const musicState = atom({ playing: false, _id: '' });

export function HubMusicPlayer({ spaceId }: { spaceId: string }) {
  const [track, setTrack] = React.useState<SpaceNft>();
  const [mounted, setMounted] = React.useState(false);

  const { data, loading, fetchMore } = useQuery(GetSpaceNfTsDocument, {
    variables: { space: spaceId, skip: 0, limit: 100, kind: SpaceNftKind.MusicTrack },
  });
  const list = (data?.listSpaceNFTs?.items || []) as SpaceNft[];
  const vinylRef = React.useRef<any>(null);

  React.useEffect(() => {
    if (list.length && !track) {
      setTrack(list[0]);
      setMounted(true);
    }
  }, [list.length, track]);

  return (
    <div className="px-4 md:px-2 pb-28 md:p-2 flex flex-col md:flex-row gap-4 md:h-[calc(100dvh-64px)] w-full overflow-auto">
      <Vinyl
        ref={vinylRef}
        track={track}
        onNext={async () => {
          const idx = list.findIndex((i) => i._id === track?._id);
          if (idx + 1 <= list.length) {
            await setTrack(list[idx + 1]);
            vinylRef.current?.onChangeTrack();
          }
        }}
        onPrev={async () => {
          const idx = list.findIndex((i) => i._id === track?._id);
          if (idx - 1 >= 0) {
            await setTrack(list[idx - 1]);
            vinylRef.current?.onChangeTrack();
          }
        }}
      />

      <div className="w-full md:w-[397px]">
        <TrackList
          data={list}
          loading={!mounted && loading}
          selected={track}
          onSelect={async (t, played) => {
            await setTrack(t);
            if (played) vinylRef.current?.onChangeTrack();
          }}
          onLoadMore={() => {
            if (data?.listSpaceNFTs && list.length < data.listSpaceNFTs.total) {
              fetchMore({ variables: { skip: data?.listSpaceNFTs.items.length } });
            }
          }}
        />
      </div>
    </div>
  );
}

interface VinylProps {
  track?: SpaceNft;
  onNext?: React.MouseEventHandler<HTMLButtonElement>;
  onPrev?: React.MouseEventHandler<HTMLButtonElement>;
}

// eslint-disable-next-line react/display-name
const Vinyl = React.forwardRef(({ track, onNext, onPrev }: VinylProps, ref) => {
  const contract = track?.contracts?.[0];
  const { handleMint, status } = useMintMusicNft({
    network_id: contract?.network_id,
    contract,
  });

  const { data } = useMusicNft({
    network_id: contract?.network_id,
    contractAddress: contract?.deployed_contract_address,
  });

  const ensData = useGetEns(data?.owner);

  const audioRef = React.useRef<HTMLAudioElement>(null);
  const setMusicState = useSetAtom(musicState);

  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
      setMusicState((prev) => ({ ...prev, playing: !isPlaying }));
    }
  };

  // Update state during playback (using useCallback for stability)
  const handleTimeUpdate = React.useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }, []);

  // Set duration once metadata loads
  const handleLoadedMetadata = React.useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  }, []);

  // Sync React state with the audio element's events
  React.useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      // Add event listeners
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setMusicState({ playing: false, _id: track?._id });
      });

      // Cleanup listeners when component unmounts
      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, [handleTimeUpdate, handleLoadedMetadata]);

  React.useImperativeHandle(
    ref,
    () => ({
      onChangeTrack: () => {
        if (track && audioRef.current) {
          audioRef.current?.pause();
          audioRef.current?.load();
          audioRef.current?.play();
          setIsPlaying(true);
          setMusicState((prev) => ({ ...prev, playing: true }));
        }
      },
    }),
    [track],
  );

  // Handle seeking via the progress bar
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = Number(e.currentTarget.value);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Helper function to format time (MM:SS)
  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const progress = (currentTime * 100) / duration;

  return (
    <>
      <Card.Root className="flex-1 h-full max-sm:border-transparent! max-sm:bg-transparent">
        <Card.Content className="p-0 h-full">
          <div
            className={twMerge(
              'absolute hidden md:block z-0 h-[110%] -top-[5%] -left-75 [animation-duration:5s] aspect-square',
              isPlaying && 'animate-spin',
            )}
          >
            <img
              src={`${ASSET_PREFIX}/assets/images/vinyl.png`}
              alt="Vinyl Record"
              className="w-full h-full object-cover"
            />

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              {track?.cover_image_url && (
                <img
                  src={track.cover_image_url}
                  alt="Album Cover"
                  className="size-[360px] aspect-square object-cover rounded-full shadow-lg"
                />
              )}
            </div>
          </div>

          {track?.cover_image_url && (
            <img src={track.cover_image_url} className="md:hidden aspect-square w-full object-cover rounded-lg" />
          )}
          <Button icon="icon-share" variant="tertiary-alt" size="sm" className="absolute right-4 top-4" />

          <div className="flex flex-col justify-between md:p-4 h-full">
            <div className="flex-1" />

            <Card.Root className="bg-transparent max-sm:backdrop-blur-none max-sm:border-transparent md:bg-page-background-overlay!">
              <Card.Content className="px-0 pb-0 md:p-6 flex-col flex gap-4">
                <div className="flex flex-col gap-1">
                  <h3 className="text-xl">{track?.name || '--'}</h3>
                  <div className="flex gap-2 items-center">
                    <div className="size-5 aspect-square rounded-xs bg-gray-500" />
                    <p>{ensData.username || '--'}</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <RadialProgress
                      color="text-accent-400"
                      size="size-5"
                      value={track?.token_limit ? ((data?.totalMinted || 0) / track?.token_limit) * 100 : 0}
                    />

                    <p className="text-tertiary">
                      {formatNumberWithCommas(data?.totalMinted)} / {formatNumberWithCommas(track?.token_limit)} left
                    </p>
                  </div>
                </div>

                <div>
                  <audio ref={audioRef} src={track?.content_url as string} preload="auto"></audio>
                  <div className="space-y-2">
                    <input
                      className="transition-all range range-primary"
                      type="range"
                      step="0.01"
                      style={{
                        background: `linear-gradient(to right, var(--color-primary) ${progress}%, var(--color-divider) ${progress}%)`,
                      }}
                      value={currentTime}
                      onChange={handleSeek}
                      min="0"
                      max={duration}
                    />
                    <div className="flex justify-between text-sm text-tertiary">
                      <p>{formatTime(currentTime)}</p>
                      <p>{formatTime(duration)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      icon="icon-skip-previous"
                      className="hidden md:block"
                      variant="tertiary-alt"
                      onClick={onPrev}
                    />
                    <Button icon="icon-skip-previous" className="md:hidden" variant="tertiary-alt" onClick={onPrev} />

                    <Button
                      size="sm"
                      icon={!isPlaying ? 'icon-play-arrow' : 'icon-pause'}
                      className="hidden md:block"
                      variant="tertiary-alt"
                      onClick={togglePlayPause}
                    />
                    <Button
                      icon={!isPlaying ? 'icon-play-arrow' : 'icon-pause'}
                      className="md:hidden"
                      variant="tertiary-alt"
                      onClick={togglePlayPause}
                    />

                    <Button
                      size="sm"
                      icon="icon-skip-next"
                      className="hidden md:block"
                      variant="tertiary-alt"
                      onClick={onNext}
                    />
                    <Button icon="icon-skip-next" className="md:hidden" variant="tertiary-alt" onClick={onNext} />
                  </div>

                  {contract && (
                    <Button
                      variant="primary"
                      loading={!['success', 'none'].includes(status)}
                      size="sm"
                      onClick={handleMint}
                    >
                      Mint ‣ ${ethers.formatEther(contract?.mint_price || 0)} ETH
                    </Button>
                  )}
                </div>
              </Card.Content>
            </Card.Root>
          </div>
        </Card.Content>
      </Card.Root>
    </>
  );
});

function TrackList({
  loading,
  data,
  selected,
  onSelect,
  onLoadMore,
}: {
  loading?: boolean;
  data: SpaceNft[];
  selected?: SpaceNft;
  onLoadMore?: () => void;
  onSelect?: (track: SpaceNft, shouldPlay: boolean) => void;
}) {
  const { ref } = useScrollable(onLoadMore);

  return (
    <Card.Root className="max-sm:max-h-[500px] md:h-full flex-1 flex flex-col">
      <Card.Header>Up Next</Card.Header>
      <div ref={ref} className=" overflow-auto! no-scrollbar">
        <Card.Content className="flex flex-1 flex-col gap-2">
          {match(loading)
            .with(true, () =>
              Array.from({ length: 10 }).map((_, idx) => (
                <Card.Root key={idx}>
                  <Card.Content className="px-4 py-2 flex items-center gap-3">
                    <Skeleton className="size-[52px]" animate />

                    <div className="space-y-1.5 flex-1">
                      <Skeleton className="h-5 w-20 rounded-xs" animate />
                      <Skeleton className="h-3 w-40" />
                      <Skeleton className="h-3 w-25" />
                    </div>
                  </Card.Content>
                </Card.Root>
              )),
            )
            .otherwise(() =>
              data.map((item: SpaceNft) => (
                <TrackListItem key={item._id} track={item} onSelect={onSelect} active={selected?._id === item._id} />
              )),
            )}
        </Card.Content>
      </div>
    </Card.Root>
  );
}

function TrackListItem({
  track,
  onSelect,
  active,
}: {
  track: SpaceNft;
  onSelect?: (track: SpaceNft, shouldPlay: boolean) => void;
  active?: boolean;
}) {
  const contract = track.contracts?.[0];
  const { data } = useMusicNft({
    network_id: contract?.network_id,
    contractAddress: contract?.deployed_contract_address,
  });
  const ensData = useGetEns(data?.owner);

  return (
    <Card.Root className="overflow-visible!" onClick={() => onSelect?.(track, false)}>
      <Card.Content className="px-4 py-2 flex items-center gap-3">
        <div className="size-[52px] aspect-square rounded-sm bg-tertiary overflow-hidden">
          <img src={track.cover_image_url} className="w-full h-full" />
        </div>

        <div className="space-y-0.5 flex-1">
          <p className="line-clamp-1">{track.name}</p>
          <p className="text-tertiary line-clamp-1">{ensData.username || '--'}</p>

          <p className="text-sm text-tertiary">
            {formatNumberWithCommas(data?.totalMinted || 0)} / {formatNumberWithCommas(track.token_limit)} left
          </p>
        </div>

        <div className="flex gap-2 items-center">
          <Button
            icon="icon-add-check-sharp"
            size="sm"
            variant="tertiary-alt"
            className="rounded-full bg-transparent!"
          />

          {match(active)
            .with(true, () => (
              <Button
                icon="icon-bar-chart-rounded text-accent-400"
                variant="flat"
                className="rounded-full bg-transparent!"
                size="sm"
              />
            ))
            .otherwise(() => (
              <Button
                icon="icon-play-arrow"
                size="sm"
                variant="tertiary-alt"
                className="rounded-full bg-transparent!"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect?.(track, true);
                }}
              />
            ))}
        </div>
      </Card.Content>
    </Card.Root>
  );
}

function useScrollable(callback?: () => void) {
  const container = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const divElement = container.current;
    if (divElement) {
      divElement.addEventListener('scroll', handleScroll);
      handleScroll();
    }

    return () => {
      if (divElement) {
        divElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const handleScroll = () => {
    if (container.current) {
      const { scrollTop, clientHeight, scrollHeight } = container.current;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 10;
      if (atBottom) callback?.();
    }
  };

  return { ref: container };
}

function useMintMusicNft({ contract, network_id }: { contract?: SpaceNftContract; network_id?: string }) {
  const queryClient = useQueryClient();
  const { walletProvider } = useAppKitProvider('eip155');
  const { address } = useAppKitAccount();

  const chainsMap = useAtomValue(chainsMapAtom);
  const { isConnected } = useAppKitAccount();
  const [status, setStatus] = React.useState<'signing' | 'confirming' | 'success' | 'none'>('none');

  const handleMint = () => {
    if (!network_id) {
      toast.error('Missing network_id');
      return;
    }

    if (isConnected) {
      mintMusicNft();
      return;
    }

    modal.open(ConnectWallet, {
      props: {
        onConnect: () => {
          handleMint();
        },
        chain: chainsMap[network_id],
      },
    });
  };

  const mintMusicNft = async () => {
    const contractAddress = contract?.deployed_contract_address;
    if (!contractAddress) {
      toast.error('Missing contract address');
      return;
    }

    try {
      setStatus('signing');
      modal.open(MintModal, { props: { onSign: handleMint, status: 'signing' } });

      const transaction = await writeContract(
        MusicNftContract,
        contractAddress,
        walletProvider as Eip1193Provider,
        'mint',
        [address],
        { value: contract.mint_price },
      );
      modal.close();
      setStatus('confirming');
      modal.open(MintModal, { props: { onSign: handleMint, status: 'confirming' } });

      await transaction.wait();
      setStatus('success');
      delay(() => {
        modal.close();
        toast.success('Mint success');
        queryClient.invalidateQueries({ queryKey: ['music_nft', contract.deployed_contract_address] });
      }, 500);
    } catch (error: any) {
      Sentry.captureException(error, {
        extra: {
          walletInfo: appKit.getWalletInfo(),
        },
      });
      modal.close();
      toast.error(formatError(error));
      setStatus('none');
    }
  };

  return { status, handleMint };
}

function MintModal({ status, onSign }: { status: 'confirming' | 'signing' | 'success' | 'none'; onSign: () => void }) {
  return (
    <ModalContent>
      {match(status)
        .with('confirming', () => (
          <ConfirmTransaction
            title="Confirming Transaction"
            description="Please wait while your transaction is being confirmed on the blockchain."
          />
        ))
        .with('signing', () => (
          <SignTransactionModal
            onClose={() => modal.close()}
            description="Please sign the transaction to pay gas fees & claim your music nft."
            onSign={onSign}
            loading={true}
          />
        ))
        .otherwise(() => null)}
    </ModalContent>
  );
}
