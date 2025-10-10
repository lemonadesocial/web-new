import { getData } from '$lib/services/lemonhead/admin';
import { getImageFromBuffers } from '$lib/services/nft/image';
import { getUriFromUrl, uploadImage, uploadJSON } from '$lib/services/nft/storage';
import assert from 'assert';
import fs from 'fs';
import moment from 'moment';
import path from 'path';
import { Canvas, Image, registerFont } from 'canvas';

import { getApproval } from "./admin";

const DESCRIPTION = 'Lemonade Passport is the enttry point to Lemonade Ecosystem';

const outputWidth = 2160;
const outputHeight = 1350;

const boldFontPath = path.join(process.cwd(), "data", "passport", "MultiTypePixelDisplayBold.otf");
const regularFontPath = path.join(process.cwd(), "data", "passport", "MultiTypePixelRegular.otf");
const fontName = 'MultiTypePixel';

type Point = {
  x: number;
  y: number;
};

const avatarOffset: Point = {
  x: 175,
  y: 367,
};

const avatarSize = 610;
const fontSize = 70;

const usernameOffset: Point = {
  x: 983,
  y: 393,
};

const passportIdOffset: Point = {
  x: 960,
  y: 700,
};

const creationDateOffset: Point = {
  x: 1517,
  y: 700,
};

const createMetadata = (imageUrl: string) => {
  return {
    description: DESCRIPTION,
    image: imageUrl,
  };
};

const getAvatarImageBuffer = async (avatarImageUrl: string) => {
  //-- create a canvas of output size
  const canvas = new Canvas(outputWidth, outputHeight);
  const ctx = canvas.getContext('2d');
  assert.ok(ctx);
  //-- draw the avatar image
  const img = new Image();

  await new Promise<void>((resolve, reject) => {
    img.onload = () => {
      // Scale the image to fit the canvas dimensions
      ctx.drawImage(img, avatarOffset.x, avatarOffset.y, avatarSize, avatarSize);
      resolve();
    };
    img.onerror = (err) => {
      reject(err);
    };
    img.src = avatarImageUrl;
  });

  return canvas.toBuffer('image/png');
}

const getBoilerplateImageBuffer = async () => {
  const filePath = path.join(process.cwd(), "data", "passport", "lemonade-passport.png");
  return fs.readFileSync(filePath);
}

const getTextImageBuffer = async (text: string, offset: Point, textColor: string) => {
  // Create a canvas of output size
  const canvas = new Canvas(outputWidth, outputHeight);
  const ctx = canvas.getContext('2d');
  assert.ok(ctx);

  // Set font properties
  ctx.font = `${fontSize}px "${fontName}"`;
  ctx.fillStyle = textColor; // Black text color
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  // Draw the text at the specified offset
  ctx.fillText(text, offset.x, offset.y);

  return canvas.toBuffer('image/png');
}

const getUsernameImageBuffer = async (username: string) => {
  registerFont(regularFontPath, { family: fontName });
  return getTextImageBuffer(username, usernameOffset, '#ffffff');
}

const getPassportIdImageBuffer = async (passportId: string) => {
  registerFont(boldFontPath, { family: fontName });
  return getTextImageBuffer(passportId, passportIdOffset, '#000000');
}

const getCreationDateImageBuffer = async (creationDate: string) => {
  registerFont(regularFontPath, { family: fontName });
  return getTextImageBuffer(creationDate, creationDateOffset, '#000000');
}

export const getMintLemonadePassportData = async (wallet: string, username: string, avatarNftContractAddress: string) => {
  const lemonheadData = await getData(wallet);

  assert.ok(lemonheadData && lemonheadData.tokenId && lemonheadData.imageUrl);

  const passportId = lemonheadData.tokenId.padStart(8, '0');

  const creationDate = moment().format('MM/DD/YYYY');

  const buffers = await Promise.all([
    getAvatarImageBuffer(lemonheadData.imageUrl),
    getBoilerplateImageBuffer(),
    getUsernameImageBuffer(username),
    getPassportIdImageBuffer(passportId),
    getCreationDateImageBuffer(creationDate),
  ]);

  const finalImage = await getImageFromBuffers(
    buffers,
    outputWidth,
    outputHeight,
    'png',
  );

  const fileId = `lemonade-passport-${passportId}`;
  const imageUrl = await uploadImage(`${fileId}.png`, finalImage);

  //-- create and upload metadata
  const metadata = createMetadata(imageUrl);
  const metadataUrl = await uploadJSON(fileId, { ...metadata });
  const uri = getUriFromUrl(metadataUrl);

  //-- call backend API and obtain the signature
  const data = await getApproval(wallet, uri);

  if (!data) {
    throw new Error('Failed to get minting approval');
  }

  return {
    //-- use these to call the contract minting function
    signature: data.signature,
    price: data.price,
    metadata: getUriFromUrl(metadataUrl),

    //-- for display purposes
    image: imageUrl,
  };
};
