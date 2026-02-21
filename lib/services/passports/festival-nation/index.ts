import assert from 'assert';
import path from 'path';
import { deregisterAllFonts, registerFont, createCanvas } from 'canvas';

import { getImageFromBuffers } from '../../nft/image';
import { getUriFromUrl, uploadImage, uploadJSON } from '../../nft/storage';

import { formatDate } from '../common/format';
import { getFileImageBuffer, getTextImageBuffer, getUrlImageBuffer, Point } from '../common/canvas';

import { getApproval } from './admin';

const regularFontPath = path.join(process.cwd(), 'data', 'festival-nation-passport', 'regular.ttf');
const regularFontFamily = 'festival-nation-passport-font-regular';

const usernameFontSize = 28;
const textFontSize = 28;
const outputWidth = 1080;
const outputHeight = 675;
const avatarSize = 410;

const firstColumnX = 552;
const secondColumnX = 804;
const firstLineY = 202;
// const secondLineY = 476;

const avatarOffset: Point = { x: 64, y: 78 };
const usernameOffset: Point = { x: 552, y: 312 };

const passportIdOffset: Point = { x: 376, y: 613 };
const mintDateOffset: Point = { x: firstColumnX, y: firstLineY };
const titleOffset: Point = { x: secondColumnX, y: firstLineY };

const DESCRIPTION = [
  'The best way to predict the future is to create it.',
  'You are among the first to shape Festival Nation, villages for those who dream to build a future where humanity is surviving, thriving, and flourishing.',
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

  ctx.fillRect(avatarOffset.x, avatarOffset.y, avatarSize, avatarSize);

  return canvas.toBuffer('image/png');
};

const getBoilerplateImageBuffer = async () => {
  return getFileImageBuffer(path.join(process.cwd(), 'data', 'festival-nation-passport', 'boilerplate.png'));
};

const getBoilerplatePlaceholderImageBuffer = async () => {
  return getFileImageBuffer(
    path.join(process.cwd(), 'data', 'festival-nation-passport-placeholder', 'boilerplate-placeholder.png'),
  );
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
    '#E1CE27',
  );
};

const getPassportIdImageBuffer = async (passportId: string) => {
  deregisterAllFonts();
  registerFont(regularFontPath, { family: regularFontFamily });
  return getTextImageBuffer(
    outputWidth,
    outputHeight,
    `32px "${regularFontFamily}"`,
    passportId,
    passportIdOffset,
    '#E5E5E5',
  );
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

export const getMintFestivalNationPassportImage = async (avatarImageUrl?: string, username?: string) => {
  const creationDate = formatDate(new Date());

  const layerPromises: Array<Promise<Buffer>> = [
    getBoilerplateImageBuffer(),
    getPassportIdImageBuffer('00000000'),
    getMintDateImageBuffer(creationDate),
    getTitleImageBuffer('Citizen'),
    getUsernameImageBuffer(username ? `@${username}` : '@username'),
  ];

  if (avatarImageUrl) {
    layerPromises.unshift(getAvatarImageBuffer(avatarImageUrl));
  } else {
    layerPromises.unshift(getBoilerplatePlaceholderImageBuffer());
  }

  const buffers = await Promise.all(layerPromises);

  const finalImage = await getImageFromBuffers(buffers, outputWidth, outputHeight, 'png');

  const base64 = finalImage.toString('base64');
  const dataUrl = `data:image/png;base64,${base64}`;
  return { image: dataUrl };
};

export const getMintFestivalNationPassportData = async ({
  username,
  passportNumber,
  wallet,
  avatarImageUrl,
}: {
  username: string;
  passportNumber?: number;
  wallet: string;
  avatarImageUrl?: string;
}) => {
  const passportId = passportNumber.toString().padStart(8, '0');

  const creationDate = formatDate(new Date());

  const buffers = await Promise.all([
    getAvatarImageBuffer(avatarImageUrl),
    getBoilerplateImageBuffer(),
    getUsernameImageBuffer(`@${username}`),
    getPassportIdImageBuffer(passportId),
    getMintDateImageBuffer(creationDate),
    getTitleImageBuffer('Citizen'),
  ]);

  const finalImage = await getImageFromBuffers(buffers, outputWidth, outputHeight, 'png');

  const fileId = `festival-nation-passport-${passportId}`;
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
