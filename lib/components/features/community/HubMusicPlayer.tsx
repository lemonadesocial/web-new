'use client';
import React from 'react';

import { Card } from '$lib/components/core';
import { ASSET_PREFIX } from '$lib/utils/constants';

export function HubMusicPlayer() {
  return (
    <div className="p-2 flex gap-4 h-[calc(100dvh-64px)] w-full">
      <Vinyl />
      <div className="w-[397px]">
        <TrackList />
      </div>
    </div>
  );
}

function Vinyl() {
  const [loadedImages, setLoadedImages] = React.useState<HTMLImageElement[]>([]);
  const imageUrls = [
    `${ASSET_PREFIX}/assets/images/vinyl.png`,
    'https://plus.unsplash.com/premium_photo-1673306778968-5aab577a7365?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  ];

  const loadImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.crossOrigin = 'anonymous'; // Necessary for images from different domains
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(`Image failed to load: ${url}, ${err}`);
    });
  };

  React.useEffect(() => {
    Promise.all(imageUrls.map(loadImage))
      .then((images) => {
        setLoadedImages(images);
      })
      .catch((error) => {
        console.error('Error loading images:', error);
      });
  }, []);

  const drawCombinedImages = (ctx: CanvasRenderingContext2D, images: HTMLImageElement[]) => {
    if (images.length === 2) {
      const [bgImage, fgImage] = images;

      // Draw the background image first (full size)
      ctx.drawImage(bgImage, 0, 0, 400, 400);

      // Draw the foreground image on top (positioned and scaled)
      // Example: draw the star at (50, 50) with size 50x50
      const x = 134;
      const y = 134;
      const h = 130;
      const w = 130;

      ctx.beginPath();
      ctx.roundRect(x, y, w, h, h);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(fgImage, x, y, w, h);
    }
  };
  return (
    <Card.Root className="flex-1">
      <Card.Content className="p-0">
        <div className="relative">
          <Canvas
            draw={drawCombinedImages}
            width={400}
            height={400}
            images={loadedImages}
            style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 }}
          />
        </div>
        {/* <div className="relative w-full max-w-xl aspect-square scale-120 -ml-30"> */}
        {/*   <img */}
        {/*     src={`${ASSET_PREFIX}/assets/images/vinyl.png`} */}
        {/*     alt="Vinyl Record" */}
        {/*     className="w-full h-full object-cover" */}
        {/*   /> */}
        {/**/}
        {/*   <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"> */}
        {/*     <img src="" alt="Album Cover" className="size-48 object-cover rounded-full shadow-lg" /> */}
        {/*   </div> */}
        {/* </div> */}
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
