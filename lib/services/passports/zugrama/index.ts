import assert from 'assert';
import path from 'path';
import { deregisterAllFonts, registerFont, createCanvas } from 'canvas';

import { getImageFromBuffers } from '../../nft/image';
import { getUriFromUrl, uploadImage, uploadJSON } from '../../nft/storage';

import { getEnsUsername } from '../common/ens';
import { formatDate } from '../common/format';
import { getFileImageBuffer, getTextImageBuffer, getUrlImageBuffer, Point } from '../common/canvas';

import { getApproval } from './admin';

const regularFontPath = path.join(process.cwd(), 'data', 'zugrama-passport', 'Orbitron-Medium.ttf');
const boldFontPath = path.join(process.cwd(), 'data', 'zugrama-passport', 'Orbitron-ExtraBold.ttf');
const regularFontFamily = 'zugrama-passport-font-regular';
const boldFontFamily = 'zugrama-passport-font-semibold';

const usernameFontSize = 32;
const textFontSize = 32;
const textColor = '#5F665A';
const outputWidth = 1080;
const outputHeight = 675;
const avatarSize = 340;

// const firstColumnX = 480;
// const secondColumnX = 757;
// const firstLineY = 373;
// const secondLineY = 476;

const avatarOffset: Point = { x: 68, y: 183 };
const usernameOffset: Point = { x: 489, y: 415 };

const passportIdOffset: Point = { x: 632, y: 255 };
const mintDateOffset: Point = { x: 489, y: 518 };
// const titleOffset: Point = { x: firstColumnX, y: secondLineY };
// const verifiedDateOffset: Point = { x: 490, y: 500 };
const issueOnOffset: Point = { x: 729, y: 518 };

const DESCRIPTION = [
  'The best way to predict the future is to create it.',
  'You are among the first to shape ZuGrama, villages for those who dream to build a future where humanity is surviving, thriving, and flourishing.',
].join('\n');

const createMetadata = (imageUrl: string, passportId: string) => {
  return {
    description: DESCRIPTION,
    image: imageUrl,
    attributes: [{ trait_type: 'Passport ID', value: passportId }],
  };
};

const regularFont = `${textFontSize}px "${regularFontFamily}"`;
const boldFont = `${textFontSize}px "${boldFontFamily}"`;

const getAvatarImageBuffer = async (avatarImageUrl: string) => {
  return getUrlImageBuffer(outputWidth, outputHeight, avatarOffset, { x: avatarSize, y: avatarSize }, avatarImageUrl);
};

const getBoilerplateImageBuffer = async () => {
  return getFileImageBuffer(path.join(process.cwd(), 'data', 'zugrama-passport', 'boilerplate.png'));
};

const getBoilerplatePlaceholderImageBuffer = async () => {
  return getFileImageBuffer(path.join(process.cwd(), 'data', 'zugrama-passport', 'boilerplate-placeholder.png'));
};

const getUsernameImageBuffer = async (username: string) => {
  deregisterAllFonts();
  registerFont(boldFontPath, { family: boldFontFamily });

  //-- calculate font size based on username length
  const scaledFontSize =
    username.length <= 14 ? usernameFontSize : Math.trunc((14 * usernameFontSize) / username.length);

  return getTextImageBuffer(
    outputWidth,
    outputHeight,
    `${scaledFontSize}px "${boldFontFamily}"`,
    username,
    usernameOffset,
    textColor,
  );
};

const getPassportIdImageBuffer = async (passportId: string) => {
  deregisterAllFonts();
  registerFont(boldFontPath, { family: boldFontFamily });
  return getTextImageBuffer(outputWidth, outputHeight, boldFont, passportId, passportIdOffset, textColor);
};

const getMintDateImageBuffer = async (mintDate: string) => {
  deregisterAllFonts();
  registerFont(boldFontPath, { family: boldFontFamily });
  return getTextImageBuffer(
    outputWidth,
    outputHeight,
    `${24}px ${boldFontFamily}`,
    mintDate,
    mintDateOffset,
    textColor,
  );
};

// const getTitleImageBuffer = async (title: string) => {
//   deregisterAllFonts();
//   registerFont(regularFontPath, { family: regularFontFamily });
//   return getTextImageBuffer(outputWidth, outputHeight, regularFont, title, titleOffset, textColor);
// };

// const getVerifiedDateImageBuffer = async (verifiedDate: string) => {
//   deregisterAllFonts();
//   registerFont(regularFontPath, { family: regularFontFamily });
//   return getTextImageBuffer(outputWidth, outputHeight, regularFont, verifiedDate, verifiedDateOffset, textColor);
// };

const getIssueOnImageBuffer = async (chain: string) => {
  deregisterAllFonts();
  registerFont(boldFontPath, { family: boldFontFamily });
  return getTextImageBuffer(outputWidth, outputHeight, `${24}px ${boldFontFamily}`, chain, issueOnOffset, textColor);
};

export const getMintZuGramaPassportImage = async (avatarImageUrl?: string, username?: string) => {
  const creationDate = formatDate(new Date(), 'yyy-MM-dd');

  const layerPromises: Array<Promise<Buffer>> = [
    getBoilerplateImageBuffer(),
    getUsernameImageBuffer(username || '@USERNAME'),
    getPassportIdImageBuffer('00000000'),
    getMintDateImageBuffer(creationDate),
    // getTitleImageBuffer('Founding Citizen'),
    // getVerifiedDateImageBuffer('00000000'),
    getIssueOnImageBuffer('Etherum'),
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

export const getMintZuGramaPassportData = async (
  userId: string,
  passportNumber: number,
  selfVerifiedTimestamp: number,
  wallet: string,
  avatarImageUrl: string,
) => {
  const username = await getEnsUsername(wallet);

  assert.ok(username);

  const passportId = passportNumber.toString().padStart(8, '0');

  const creationDate = formatDate(new Date(), 'yyyy-MM-dd');
  // const verifiedDate = formatDate(new Date(selfVerifiedTimestamp), 'yyyy/MM/dd');

  const buffers = await Promise.all([
    getAvatarImageBuffer(avatarImageUrl),
    getBoilerplateImageBuffer(),
    getUsernameImageBuffer(username),
    getPassportIdImageBuffer(passportId),
    getMintDateImageBuffer(creationDate),
    // getTitleImageBuffer('Founding Citizen'),
    // getVerifiedDateImageBuffer(verifiedDate),
    getIssueOnImageBuffer('Etherum'),
  ]);

  const finalImage = await getImageFromBuffers(buffers, outputWidth, outputHeight, 'png');

  const fileId = `zugrama-passport-${passportId}`;
  const imageUrl = await uploadImage(`${fileId}.png`, finalImage);

  //-- create and upload metadata
  const metadata = createMetadata(imageUrl, passportId);
  const metadataUrl = await uploadJSON(fileId, { ...metadata });
  const uri = getUriFromUrl(metadataUrl);

  //-- call backend API and obtain the signature
  const data = await getApproval(wallet, userId, uri);

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
