import assert from 'assert';
import { Canvas, Image } from 'canvas';

export const readUrlToBuffer = async (url: string) => {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  return Buffer.from(buffer);
};

export const getImageFromBuffers = async (buffers: Buffer[], outputWidth: number, outputHeight: number, outputFormat: 'png' | 'jpeg') => {
  //-- this is run in nodejs, please use a library to create a canvas
  const canvas = new Canvas(outputWidth, outputHeight);

  //-- merge all images into a single image
  const ctx = canvas.getContext('2d');
  assert.ok(ctx);

  // Load and draw all images sequentially
  for (let i = 0; i < buffers.length; i++) {
    const buffer = buffers[i];
    const img = new Image();

    await new Promise<void>((resolve, reject) => {
      img.onload = () => {
        // Scale the image to fit the canvas dimensions
        ctx.drawImage(img, 0, 0, outputWidth, outputHeight);
        resolve();
      };
      img.onerror = (err) => {
        reject(err);
      };
      img.src = buffer;
    });
  }

  // Return the final merged image as buffer
  if (outputFormat === 'png') {
    return canvas.toBuffer('image/png');
  }
  else {
    return canvas.toBuffer('image/jpeg');
  }
};

export const getImageFromUrls = async (imageUrls: string[], outputWidth: number, outputHeight: number, outputFormat: 'png' | 'jpeg') => {
  const buffers = await Promise.all(imageUrls.map(readUrlToBuffer));

  return getImageFromBuffers(buffers, outputWidth, outputHeight, outputFormat);
};
