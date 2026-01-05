import { createCanvas, deregisterAllFonts, Image, registerFont } from 'canvas';
import assert from 'assert';
import fs from 'fs';
import { format } from 'date-fns';
import path from 'path';

import { getImageFromBuffers } from '$lib/services/nft/image';
import { getUriFromUrl, uploadImage, uploadJSON } from '$lib/services/nft/storage';

import { getApproval, getData } from './admin';
import { Point } from '../common/canvas';
import { getEnsUsername } from '../common/ens';
import { formatDate } from '../common/format';

export const DESCRIPTION = [''].join('\n');

const outputWidth = 2160;
const outputHeight = 1350;

const avatarOffset: Point = {
  x: 175,
  y: 367,
};

const avatarSize = 610;
const fontSize = 70;

const usernameOffset: Point = {
  x: 990,
  y: 439,
};

const passportIdOffset: Point = {
  x: 960,
  y: 720,
};

const creationDateOffset: Point = {
  x: 1517,
  y: 720,
};

const regularFontPath = path.join(process.cwd(), 'data', 'passport', 'regular.otf');
const boldFontPath = path.join(process.cwd(), 'data', 'passport', 'bold.otf');
const regularFontFamily = 'lemonade-passport-font-regular';
const boldFontFamily = 'lemonade-passport-font-bold';

const createMetadata = (imageUrl: string) => {
  return {
    description: DESCRIPTION,
    image: imageUrl,
  };
};

const getAvatarImageBuffer = async (avatarImageUrl: string) => {
  //-- create a canvas of output size
  const canvas = createCanvas(outputWidth, outputHeight);
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
};

const getBoilerplateImageBuffer = async () => {
  const filePath = path.join(process.cwd(), 'data', 'passport', 'lemonade-passport.png');
  return fs.readFileSync(filePath);
};

const getBoilerplatePlaceholderImageBuffer = async () => {
  const filePath = path.join(process.cwd(), 'data', 'passport-placeholder', 'lemonade-passport-placeholder.png');
  return fs.readFileSync(filePath);
};

const getTextImageBuffer = async (font: string, text: string, offset: Point, textColor: string) => {
  // Create a canvas of output size
  const canvas = createCanvas(outputWidth, outputHeight);
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
};

const getUsernameImageBuffer = async (username: string) => {
  deregisterAllFonts();

  //-- calculate font size based on username length
  const scaledFontSize = username.length <= 18 ? fontSize : Math.trunc((19 * fontSize) / username.length);

  registerFont(regularFontPath, { family: regularFontFamily });
  return await getTextImageBuffer(`${scaledFontSize}px "${regularFontFamily}"`, username, usernameOffset, '#ffffff');
};

const getPassportIdImageBuffer = async (passportId: string) => {
  deregisterAllFonts();
  registerFont(boldFontPath, { family: boldFontFamily });
  return await getTextImageBuffer(`${fontSize}px "${boldFontFamily}"`, passportId, passportIdOffset, '#000000');
};

const getCreationDateImageBuffer = async (creationDate: string) => {
  deregisterAllFonts();
  registerFont(boldFontPath, { family: boldFontFamily });
  return await getTextImageBuffer(`${fontSize}px "${boldFontFamily}"`, creationDate, creationDateOffset, '#000000');
};

export const getMintPassportImage = async (avatarImageUrl?: string, username?: string) => {
  const creationDate = formatDate(new Date());

  let layerPromises: Array<Promise<Buffer>> = [
    getBoilerplateImageBuffer(),
    getUsernameImageBuffer(`@${username || 'username'}`),
    getPassportIdImageBuffer('XXXXXXXX'),
    getCreationDateImageBuffer(creationDate),
  ];

  if (avatarImageUrl) {
    layerPromises.splice(1, 0, getAvatarImageBuffer(avatarImageUrl));
  } else {
    layerPromises.unshift(getBoilerplatePlaceholderImageBuffer());
  }
  const buffers = await Promise.all(layerPromises);

  const finalImage = await getImageFromBuffers(buffers, outputWidth, outputHeight, 'png');

  const base64 = finalImage.toString('base64');
  const dataUrl = `data:image/png;base64,${base64}`;
  return { image: dataUrl };
};

export const getMintLemonadePassportData = async (
  wallet: string,
  lemonadeUsername?: string,
  fluffleTokenId?: string,
) => {
  const passportData = await getData(wallet, fluffleTokenId || '');

  if (!passportData?.passportNumber) {
    throw new Error('Failed to get passport data');
  }

  const username = lemonadeUsername ? `@${lemonadeUsername}` : await getEnsUsername(wallet);

  if (!username) {
    throw new Error('Failed to get username');
  }

  const avatarImageUrl = fluffleTokenId ? passportData.fluffleImageUrl : passportData.lemonheadImageUrl;

  const passportId = passportData.passportNumber.toString().padStart(8, '0');

  const creationDate = format(new Date(), 'MM/dd/yyyy');

  const buffers = await Promise.all([
    getAvatarImageBuffer(avatarImageUrl),
    getBoilerplateImageBuffer(),
    getUsernameImageBuffer(username),
    getPassportIdImageBuffer(passportId),
    getCreationDateImageBuffer(creationDate),
  ]);

  const finalImage = await getImageFromBuffers(buffers, outputWidth, outputHeight, 'png');

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
    metadata: uri,

    //-- for display purposes
    image: imageUrl,
  };
};
