import assert from 'assert';
import path from 'path';
import { deregisterAllFonts, registerFont, createCanvas } from 'canvas';

import { getImageFromBuffers } from '../../nft/image';
import { getUriFromUrl, uploadImage, uploadJSON } from '../../nft/storage';

import { formatDate } from '../common/format';
import { getFileImageBuffer, getTextImageBuffer, getUrlImageBuffer, Point } from '../common/canvas';

import { getApproval } from './admin';

const regularFontPath = path.join(process.cwd(), 'data', 'drip-nation-passport', 'regular.ttf');
const regularFontFamily = 'drip-nation-passport-font-regular';

const usernameFontSize = 48;
const textFontSize = 32;
const outputWidth = 1080;
const outputHeight = 675;
const avatarSize = 320;

const firstColumnX = 480;
const secondColumnX = 754;
const firstLineY = 385;
const secondLineY = 489;

const avatarOffset: Point = { x: 80, y: 189 };
const usernameOffset: Point = { x: 504, y: 235 };

const passportIdOffset: Point = { x: firstColumnX, y: firstLineY };
const mintDateOffset: Point = { x: secondColumnX, y: firstLineY };
const titleOffset: Point = { x: firstColumnX, y: secondLineY };
const styleOffset: Point = { x: secondColumnX, y: secondLineY };

const DESCRIPTION = [
  'The best way to predict the future is to create it.',
  'You are among the first to shape Drip Nation, villages for those who dream to build a future where humanity is surviving, thriving, and flourishing.',
].join('\n');

const createMetadata = (imageUrl: string, passportId: string) => {
  return {
    description: DESCRIPTION,
    image: imageUrl,
    attributes: [{ trait_type: 'Passport ID', value: passportId }],
  };
};

const regularFont = `${textFontSize}px "${regularFontFamily}"`;

const getAvatarImageBuffer = async (avatarImageUrl: string) => {
  return getUrlImageBuffer(outputWidth, outputHeight, avatarOffset, { x: avatarSize, y: avatarSize }, avatarImageUrl);
};

const getAvatarPlaceholderBuffer = async () => {
  const canvas = createCanvas(outputWidth, outputHeight);
  const ctx = canvas.getContext('2d');
  assert.ok(ctx);

  ctx.fillStyle = '#C7FE42';
  ctx.fillRect(avatarOffset.x, avatarOffset.y, avatarSize, avatarSize);

  return canvas.toBuffer('image/png');
};

const getBoilerplateImageBuffer = async () => {
  return getFileImageBuffer(path.join(process.cwd(), 'data', 'drip-nation-passport', 'boilerplate.png'));
};

const getUsernameImageBuffer = async (username: string) => {
  deregisterAllFonts();
  registerFont(regularFontPath, { family: regularFontFamily });

  //-- calculate font size based on username length
  const scaledFontSize =
    username.length <= 14 ? usernameFontSize : Math.trunc((14 * usernameFontSize) / username.length);

  return getTextImageBuffer(
    outputWidth,
    outputHeight,
    `${scaledFontSize}px "${regularFontFamily}"`,
    username,
    usernameOffset,
    '#9BFF77',
  );
};

const getPassportIdImageBuffer = async (passportId: string) => {
  deregisterAllFonts();
  registerFont(regularFontPath, { family: regularFontFamily });
  return getTextImageBuffer(outputWidth, outputHeight, regularFont, passportId, passportIdOffset, '#FFFFFF');
};

const getMintDateImageBuffer = async (mintDate: string) => {
  deregisterAllFonts();
  registerFont(regularFontPath, { family: regularFontFamily });
  return getTextImageBuffer(outputWidth, outputHeight, regularFont, mintDate, mintDateOffset, '#FFFFFF');
};

const getTitleImageBuffer = async (title: string) => {
  deregisterAllFonts();
  registerFont(regularFontPath, { family: regularFontFamily });
  return getTextImageBuffer(outputWidth, outputHeight, regularFont, title, titleOffset, '#FFFFFF');
};

const getStyleImageBuffer = async (title: string) => {
  deregisterAllFonts();
  registerFont(regularFontPath, { family: regularFontFamily });
  return getTextImageBuffer(outputWidth, outputHeight, regularFont, title, styleOffset, '#FFFFFF');
};

export const getMintDripNationPassportImage = async (avatarImageUrl?: string, username?: string) => {
  const creationDate = formatDate(new Date());

  const layerPromises: Array<Promise<Buffer>> = [
    getBoilerplateImageBuffer(),
    getPassportIdImageBuffer('XXXXXXXX'),
    getMintDateImageBuffer(creationDate),
    getTitleImageBuffer('Citizen'),
    getUsernameImageBuffer(username ? `@${username}` : 'Username'),
    getStyleImageBuffer('Streetwear'),
  ];

  if (avatarImageUrl) {
    layerPromises.unshift(getAvatarImageBuffer(avatarImageUrl));
  } else {
    layerPromises.unshift(getAvatarPlaceholderBuffer());
  }

  const buffers = await Promise.all(layerPromises);

  const finalImage = await getImageFromBuffers(buffers, outputWidth, outputHeight, 'png');

  const base64 = finalImage.toString('base64');
  const dataUrl = `data:image/png;base64,${base64}`;
  return { image: dataUrl };
};

export const getMintDripNationPassportData = async (
  username: string,
  passportNumber: number,
  wallet: string,
  avatarImageUrl: string,
) => {
  const passportId = passportNumber.toString().padStart(8, '0');

  const creationDate = formatDate(new Date());

  const buffers = await Promise.all([
    getAvatarImageBuffer(avatarImageUrl),
    getBoilerplateImageBuffer(),
    getUsernameImageBuffer(`@${username}`),
    getPassportIdImageBuffer(passportId),
    getMintDateImageBuffer(creationDate),
    getTitleImageBuffer('Founding Citizen'),
  ]);

  const finalImage = await getImageFromBuffers(buffers, outputWidth, outputHeight, 'png');

  const fileId = `viynl-nation-passport-${passportId}`;
  const imageUrl = await uploadImage(`${fileId}.png`, finalImage);

  //-- create and upload metadata
  const metadata = createMetadata(imageUrl, passportId);
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
