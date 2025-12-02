'use client';
import React from 'react';

import { Button, Card, Skeleton } from '$lib/components/core';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { twMerge } from 'tailwind-merge';
import { formatNumberWithCommas } from '$lib/utils/string';
import { match } from 'ts-pattern';
import { useQuery } from '$lib/graphql/request';
import { GetSpaceNfTsDocument, SpaceNft } from '$lib/graphql/generated/backend/graphql';
import { RadialProgress } from '$lib/components/core/progress/radial';

const mockData = [
  {
    _id: 1,
    cover_image_url:
      'https://plus.unsplash.com/premium_photo-1673306778968-5aab577a7365?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    name: 'Going The Distance 1',
    username: 'vinylnation.eth',
    totalMint: 9999,
    minted: 3880,
    content_url: `${ASSET_PREFIX}/assets/audio/example.mp3`,
  },

  {
    _id: 2,
    cover_image_url:
      'https://images.unsplash.com/photo-1762112800005-a61bacb1d15c?q=80&w=1586&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    name: 'Going The Distance 2',
    username: 'vinylnation.eth',
    totalMint: 9999,
    minted: 3880,
    content_url: `${ASSET_PREFIX}/assets/audio/example_1.mp3`,
  },

  {
    _id: 3,
    cover_image_url:
      'https://images.unsplash.com/photo-1762715461167-69eaae9758d6?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    name: 'Going The Distance 3',
    username: 'vinylnation.eth',
    totalMint: 9999,
    minted: 3880,
    content_url: `${ASSET_PREFIX}/assets/audio/example_2.mp3`,
  },

  {
    _id: 4,
    cover_image_url:
      'https://images.unsplash.com/photo-1763996313498-8c60ed0610ac?q=80&w=3269&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    name: 'Going The Distance 4',
    username: 'vinylnation.eth',
    totalMint: 9999,
    minted: 3880,
    content_url: `${ASSET_PREFIX}/assets/audio/example_3.mp3`,
  },

  {
    _id: 5,
    cover_image_url:
      'https://plus.unsplash.com/premium_photo-1722018576626-dc10f32a86f4?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    name: 'Going The Distance 5',
    username: 'vinylnation.eth',
    totalMint: 9999,
    minted: 3880,
    content_url: `${ASSET_PREFIX}/assets/audio/example_4.mp3`,
  },
] as SpaceNft[];

export function HubMusicPlayer({ spaceId }: { spaceId: string }) {
  const [track, setTrack] = React.useState<SpaceNft>();
  const [mounted, setMounted] = React.useState(false);

  const { data, loading, fetchMore } = useQuery(GetSpaceNfTsDocument, {
    variables: { space: spaceId, skip: 0, limit: 100 },
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
        track={track}
        ref={vinylRef}
        onNext={async () => {
          const idx = list.findIndex((i) => i._id === track?._id);
          if (idx + 1 < list.length) {
            await setTrack(list[idx + 1]);
            vinylRef.current?.onChangeTrack();
          }
        }}
        onPrev={async () => {
          const idx = list.findIndex((i) => i._id === track?._id);
          if (idx - 1 > 0) {
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
          onPlay={async (t) => {
            await setTrack(t);
            vinylRef.current?.onChangeTrack();
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
  const audioRef = React.useRef<HTMLAudioElement>(null);

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
      audio.addEventListener('ended', () => setIsPlaying(false));

      // Cleanup listeners when component unmounts
      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, [handleTimeUpdate, handleLoadedMetadata]);

  React.useImperativeHandle(ref, () => ({
    onChangeTrack: () => {
      if (audioRef.current) {
        audioRef.current?.pause();
        audioRef.current?.load();
        audioRef.current?.play();
        setIsPlaying(true);
      }
    },
  }));

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
                  <p>USERNAME COMMING SOON</p>
                </div>
                <div className="flex gap-2 items-center">
                  <RadialProgress color="text-accent-400" size="size-5" value={75} />

                  <p className="text-tertiary">
                    MINT INFO COMMING SOON / {formatNumberWithCommas(track?.token_limit)} left
                    {/* {formatNumberWithCommas(track.minted)} / {formatNumberWithCommas(track.totalMint)} left */}
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

                {!!track?.token_limit && (
                  <Button variant="primary" size="sm">
                    Mint $5
                  </Button>
                )}
              </div>
            </Card.Content>
          </Card.Root>
        </div>
      </Card.Content>
    </Card.Root>
  );
});

function TrackList({
  loading,
  data,
  selected,
  onPlay,
  onLoadMore,
}: {
  loading?: boolean;
  data: SpaceNft[];
  selected?: SpaceNft;
  onPlay: (track: SpaceNft) => void;
  onLoadMore?: () => void;
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
              data.map((item: SpaceNft, idx: number) => (
                <Card.Root key={idx} className="overflow-visible!">
                  <Card.Content className="px-4 py-2 flex items-center gap-3">
                    <div className="size-[52px] aspect-square rounded-sm bg-tertiary overflow-hidden">
                      <img src={item.cover_image_url} className="w-full h-full" />
                    </div>

                    <div className="space-y-0.5 flex-1">
                      <p className="line-clamp-1">{item.name}</p>
                      <p className="text-tertiary line-clamp-1">USERNAME COMMING SOON</p>

                      <p className="text-sm text-tertiary">
                        DATA COMMING SOON
                        {/* {formatNumberWithCommas(item.minted)} / {formatNumberWithCommas(item.totalMint)} left */}
                      </p>
                    </div>

                    <div className="flex gap-2 items-center">
                      <Button
                        icon="icon-add-check-sharp"
                        size="sm"
                        variant="tertiary-alt"
                        className="rounded-full bg-transparent!"
                      />
                      {match(selected?._id === item._id)
                        .with(true, () => (
                          <Button
                            icon="icon-bar-chart-rounded text-accent-400"
                            variant="flat"
                            className="rounded-full"
                            size="sm"
                          />
                        ))
                        .otherwise(() => (
                          <Button
                            icon="icon-play-arrow"
                            size="sm"
                            variant="tertiary-alt"
                            className="rounded-full"
                            onClick={() => onPlay(item)}
                          />
                        ))}
                    </div>
                  </Card.Content>
                </Card.Root>
              )),
            )}
        </Card.Content>
      </div>
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
