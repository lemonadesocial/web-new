import assert from "assert";
import { createCanvas, Image } from "canvas";
import fs from "fs";

export type Point = {
  x: number;
  y: number;
};

export const getTextImageBuffer = async (width: number, height: number, font: string, text: string, offset: Point, textColor: string) => {
  // Create a canvas of output size
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  assert.ok(ctx);

  // Set font properties

  ctx.font = font;
  ctx.fillStyle = textColor;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  // Draw the text at the specified offset
  ctx.fillText(text, offset.x, offset.y);

  return canvas.toBuffer('image/png');
}

export const getUrlImageBuffer = async (width: number, height: number, offset: Point, size: Point, avatarImageUrl: string) => {
  //-- create a canvas of output size
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  assert.ok(ctx);
  //-- draw the avatar image
  const img = new Image();

  await new Promise<void>((resolve, reject) => {
    img.onload = () => {
      // Scale the image to fit the canvas dimensions
      ctx.drawImage(img, offset.x, offset.y, size.x, size.y);
      resolve();
    };
    img.onerror = (err) => {
      reject(err);
    };
    img.src = avatarImageUrl;
  });

  return canvas.toBuffer('image/png');
}

export const getFileImageBuffer = async (filePath: string) => {
    return fs.readFileSync(filePath);
}
