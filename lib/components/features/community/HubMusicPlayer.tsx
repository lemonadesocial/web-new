'use client';
import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Button, Card } from '$lib/components/core';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { twMerge } from 'tailwind-merge';
import { formatNumberWithCommas } from '$lib/utils/string';
import { match } from 'ts-pattern';
import { audio } from '@lens-protocol/metadata';

const data = [
  {
    id: 1,
    image:
      'https://plus.unsplash.com/premium_photo-1673306778968-5aab577a7365?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Going The Distance 1',
    username: 'vinylnation.eth',
    totalMint: 9999,
    minted: 3880,
    url: `${ASSET_PREFIX}/assets/audio/example.mp3`,
  },

  {
    id: 2,
    image:
      'https://images.unsplash.com/photo-1762112800005-a61bacb1d15c?q=80&w=1586&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Going The Distance 2',
    username: 'vinylnation.eth',
    totalMint: 9999,
    minted: 3880,
    url: `${ASSET_PREFIX}/assets/audio/example_1.mp3`,
  },

  {
    id: 3,

    image:
      'https://images.unsplash.com/photo-1762715461167-69eaae9758d6?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Going The Distance 3',
    username: 'vinylnation.eth',
    totalMint: 9999,
    minted: 3880,
    url: `${ASSET_PREFIX}/assets/audio/example_2.mp3`,
  },

  {
    id: 4,
    image:
      'https://images.unsplash.com/photo-1763996313498-8c60ed0610ac?q=80&w=3269&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Going The Distance 4',
    username: 'vinylnation.eth',
    totalMint: 9999,
    minted: 3880,
    url: `${ASSET_PREFIX}/assets/audio/example_3.mp3`,
  },

  {
    id: 5,

    image:
      'https://plus.unsplash.com/premium_photo-1722018576626-dc10f32a86f4?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Going The Distance 5',
    username: 'vinylnation.eth',
    totalMint: 9999,
    minted: 3880,
    url: `${ASSET_PREFIX}/assets/audio/example_4.mp3`,
  },
];

export function HubMusicPlayer() {
  const [loading, setLoading] = React.useState(true);
  const [list, setList] = React.useState([]);
  const [track, setTrack] = React.useState();

  const vinylRef = React.useRef<any>(null);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setList(data);
      setTrack(data[0]);
      setLoading(false);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  if (loading) return null;

  return (
    <div className="p-2 flex gap-4 h-[calc(100dvh-64px)] w-full">
      <Vinyl track={track} ref={vinylRef} />
      <div className="w-[397px]">
        <TrackList
          data={list}
          selected={track}
          onPlay={async (t) => {
            await setTrack(t);
            vinylRef.current?.onChangeTrack();
          }}
        />
      </div>
    </div>
  );
}

interface VinylProps {
  track: {
    image: string;
    title: string;
    username: string;
    totalMint: number;
    minted: number;
    url: string;
  };
}

const Vinyl = React.forwardRef(({ track }: VinylProps, ref) => {
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
      console.log(newTime);
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
    <Card.Root className="flex-1 h-full">
      <Card.Content className="p-0 h-full">
        <div
          className={twMerge(
            'absolute z-0 h-[110%] -top-[5%] -left-75 [animation-duration:5s] aspect-square',
            isPlaying && 'animate-spin',
          )}
        >
          <img
            src={`${ASSET_PREFIX}/assets/images/vinyl.png`}
            alt="Vinyl Record"
            className="w-full h-full object-cover"
          />

          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <img
              src={track.image}
              alt="Album Cover"
              className="size-[360px] aspect-square object-cover rounded-full shadow-lg"
            />
          </div>
        </div>

        <div className="flex flex-col justify-between p-4 h-full">
          <div className="flex-1 flex justify-end w-full">
            <Button icon="icon-share" variant="tertiary-alt" size="sm" />
          </div>

          <Card.Root className="bg-page-background-overlay!">
            <Card.Content className="p-6 flex-col flex gap-4">
              <div>
                <h3 className="text-xl">{track.title}</h3>
                <div className="flex gap-2 items-center">
                  <div className="size-5 aspect-square rounded-xs bg-gray-500" />
                  <p>{track.username}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="size-5 aspect-square rounded-full bg-gray-500" />
                  <p className="text-tertiary">
                    {formatNumberWithCommas(track.minted)} / {formatNumberWithCommas(track.totalMint)} left
                  </p>
                </div>
              </div>

              <div>
                <audio ref={audioRef} src={track.url} preload="auto"></audio>
                <div className="space-y-2">
                  <input
                    className="range range-primary"
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
                  <Button icon="icon-skip-previous" size="sm" variant="tertiary-alt" onClick={togglePlayPause} />
                  <Button
                    icon={!isPlaying ? 'icon-play-arrow' : 'icon-pause'}
                    size="sm"
                    variant="tertiary-alt"
                    onClick={togglePlayPause}
                  />
                  <Button icon="icon-skip-next" size="sm" variant="tertiary-alt" onClick={togglePlayPause} />
                </div>

                <Button variant="primary" size="sm">
                  Mint $5
                </Button>
              </div>
            </Card.Content>
          </Card.Root>
        </div>
      </Card.Content>
    </Card.Root>
  );
});

function TrackList({ data, selected, onPlay }: any) {
  return (
    <Card.Root>
      <Card.Header>Up Next</Card.Header>
      <Card.Content className="flex flex-col gap-2">
        {data.map((item: any, idx: number) => (
          <Card.Root key={idx}>
            <Card.Content className="flex items-center gap-3">
              <div className="size-[52px] aspect-square rounded-sm bg-tertiary overflow-hidden">
                <img src={item.image} className="w-full h-full" />
              </div>

              <div className="space-y-0.5 flex-1">
                <p>{item.title}</p>
                <p className="text-tertiary">{item.username}</p>

                <p className="text-sm text-tertiary">
                  {formatNumberWithCommas(item.minted)} / {formatNumberWithCommas(item.totalMint)} left
                </p>
              </div>

              <div className="flex gap-2 items-center">
                <Button
                  icon="icon-add-check-sharp"
                  size="sm"
                  variant="tertiary-alt"
                  className="rounded-full bg-transparent!"
                />
                {match(selected?.id === item.id)
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
        ))}
      </Card.Content>
    </Card.Root>
  );
}
