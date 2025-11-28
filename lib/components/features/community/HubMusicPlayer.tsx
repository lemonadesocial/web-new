'use client';
import React from 'react';

import { Button, Card } from '$lib/components/core';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { twMerge } from 'tailwind-merge';

const mockData = {
  image:
    'https://plus.unsplash.com/premium_photo-1673306778968-5aab577a7365?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  title: 'Going The Distance',
  username: 'vinylnation.eth',
  totalMint: 9999,
  minted: 3880,
  url: 'https://file-examples.com/storage/fe5bf135b769294e8a11379/2017/11/file_example_MP3_5MG.mp3',
};

export function HubMusicPlayer() {
  return (
    <div className="p-2 flex gap-4 h-[calc(100dvh-64px)] w-full">
      <Vinyl track={mockData} />
      <div className="w-[397px]">
        <TrackList />
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

function Vinyl({ track }: VinylProps) {
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

  // Handle seeking via the progress bar
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = Number(e.target.value);
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

  return (
    <Card.Root className="flex-1 h-full">
      <Card.Content className="p-0 h-full">
        <div
          className={twMerge(
            'absolute z-0 w-[1080px] [animation-duration:5s] aspect-square -top-[30%] -left-[30%]',
            isPlaying && 'animate-spin',
          )}
        >
          <img
            src={`${ASSET_PREFIX}/assets/images/vinyl.png`}
            alt="Vinyl Record"
            className="w-full h-full object-cover"
          />

          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <img src={track.image} alt="Album Cover" className="size-[360px] object-cover rounded-full shadow-lg" />
          </div>
        </div>
        <div className="flex flex-col justify-between p-4 h-full">
          <div className="flex-1 flex justify-end w-full">
            <Button icon="icon-share" variant="tertiary-alt" size="sm" />
          </div>

          <Card.Root>
            <Card.Content className="p-6 flex-col flex gap-6">
              <div>
                <h3 className="text-xl">{track.title}</h3>
                <div className="flex gap-2 items-center">
                  <div className="size-5 aspect-square rounded-xs bg-gray-500" />
                  <p>{track.username}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <div className="size-5 aspect-square rounded-full bg-gray-500" />
                  <p className="text-tertiary">
                    {track.minted} / {track.totalMint} left
                  </p>
                </div>
              </div>
              <div>
                <audio ref={audioRef} src={track.url} preload="auto"></audio>
                <input type="range" className="w-full" min="0" max="100" value="0" />
                <div className="flex justify-between text-sm ">
                  <p>{currentTime}</p>
                  <p>{duration}</p>
                </div>

                <div className="flex justify-between">
                  <div className="flex gap-2">
                    <Button icon="icon" size="sm" variant="tertiary-alt" onClick={togglePlayPause} />
                    <Button icon="icon" size="sm" variant="tertiary-alt" onClick={togglePlayPause} />
                    <Button icon="icon" size="sm" variant="tertiary-alt" onClick={togglePlayPause} />
                  </div>

                  <Button variant='primary' size="sm">Mint $5</Button>
                </div>
              </div>
            </Card.Content>
          </Card.Root>
        </div>
      </Card.Content>
    </Card.Root>
  );
}

function TrackList() {
  return (
    <Card.Root>
      <Card.Header>Up Next</Card.Header>
      <Card.Content>Track List</Card.Content>
    </Card.Root>
  );
}

type DrawFunction = (ctx: CanvasRenderingContext2D, images: HTMLImageElement[]) => void;

interface CanvasProps extends React.CanvasHTMLAttributes<HTMLCanvasElement> {
  draw: DrawFunction;
  images: HTMLImageElement[]; // Pass the array of loaded images as a prop
}

function Canvas({ draw, images, ...rest }: CanvasProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Call the draw function with the context and the loaded images
    draw(ctx, images);
  }, [draw, images]); // Rerun when draw function or images array changes

  return <canvas ref={canvasRef} {...rest} />;
}
