import assert from 'assert';
import path from 'path';
import { deregisterAllFonts, registerFont } from 'canvas';

import { getFileImageBuffer, getTextImageBuffer, getUrlImageBuffer, Point } from '../common/canvas';
import { formatDate } from '../common/format';
import { getImageFromBuffers } from '../../nft/image';
import { getUriFromUrl, uploadImage, uploadJSON } from '../../nft/storage';

import { getApproval } from './admin';

const regularFontPath = path.join(process.cwd(), 'data', 'alzena-world', 'regular.otf');
const regularFontFamily = 'alzena-world-font-regular';

const outputWidth = 1080;
const outputHeight = 675;
const usernameFontSize = 36;

const avatarOffset: Point = { x: 88, y: 184 };
const avatarSize = 304;

const firstColumnX = 480;
const secondColumnX = 760;
const firstLineY = 366;
const secondLineY = 476;

const usernameOffset: Point = { x: 500, y: 225 };
const passportIdOffset: Point = { x: firstColumnX, y: firstLineY };
const walletOffset: Point = { x: secondColumnX, y: firstLineY };
const mintDateOffset: Point = { x: firstColumnX, y: secondLineY };
const titleOffset: Point = { x: secondColumnX, y: secondLineY };

const regularFont = `36px "${regularFontFamily}"`;

const DESCRIPTION = [
  'Alzena World Passport- build with a community that believes in art and culture.',
].join('\n');

const createMetadata = (imageUrl: string, passportId: string) => {
  return {
    description: DESCRIPTION,
    image: imageUrl,
    attributes: [{ trait_type: 'Passport ID', value: passportId }],
  };
};

const getBoilerplateImageBuffer = async () => {
  return getFileImageBuffer(path.join(process.cwd(), 'data', 'alzena-world', 'boilerplate.png'));
};

const getAvatarImageBuffer = async (avatarImageUrl: string) => {
  return getUrlImageBuffer(outputWidth, outputHeight, avatarOffset, { x: avatarSize, y: avatarSize }, avatarImageUrl);
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
    '#000000',
  );
};

const getPassportIdImageBuffer = async (passportId: string) => {
  deregisterAllFonts();
  registerFont(regularFontPath, { family: regularFontFamily });
  return getTextImageBuffer(outputWidth, outputHeight, regularFont, passportId, passportIdOffset, '#ffffff');
};

const getWalletAddressImageBuffer = async (walletAddress: string) => {
  deregisterAllFonts();
  registerFont(regularFontPath, { family: regularFontFamily });
  return getTextImageBuffer(
    outputWidth,
    outputHeight,
    regularFont,
    walletAddress.slice(0, 8) + '...',
    walletOffset,
    '#ffffff',
  );
};

const getMintDateImageBuffer = async (mintDate: string) => {
  deregisterAllFonts();
  registerFont(regularFontPath, { family: regularFontFamily });
  return getTextImageBuffer(outputWidth, outputHeight, regularFont, mintDate, mintDateOffset, '#ffffff');
};

const getTitleImageBuffer = async (title: string) => {
  deregisterAllFonts();
  registerFont(regularFontPath, { family: regularFontFamily });
  return getTextImageBuffer(outputWidth, outputHeight, regularFont, title, titleOffset, '#ffffff');
};

export const getAlzenaWorldPassportImage = async (avatarImageUrl?: string, username?: string) => {
  const creationDate = formatDate(new Date());

  const layerPromises: Array<Promise<Buffer>> = [
    getBoilerplateImageBuffer(),
    getPassportIdImageBuffer('XXXXXXXX'),
    getWalletAddressImageBuffer('XXXXXXXX'),
    getMintDateImageBuffer(creationDate),
    getTitleImageBuffer('Citizen'),
    getUsernameImageBuffer(username ? `@${username}` : '@username'),
  ];

  if (avatarImageUrl) {
    layerPromises.unshift(getAvatarImageBuffer(avatarImageUrl));
  } else {
    layerPromises.unshift(getBoilerplateImageBuffer());
  }

  const buffers = await Promise.all(layerPromises);

  const finalImage = await getImageFromBuffers(buffers, outputWidth, outputHeight, 'png');

  const base64 = finalImage.toString('base64');
  const dataUrl = `data:image/png;base64,${base64}`;
  return { image: dataUrl };
};

export const getMintAlzenaWorldPassportData = async ({
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
  assert.ok(username);
  assert.ok(passportNumber);
  assert.ok(avatarImageUrl);

  const passportId = passportNumber.toString().padStart(8, '0');

  const creationDate = formatDate(new Date());

  const buffers = await Promise.all([
    getAvatarImageBuffer(avatarImageUrl),
    getBoilerplateImageBuffer(),
    getUsernameImageBuffer(`@${username}`),
    getPassportIdImageBuffer(passportId),
    getWalletAddressImageBuffer(wallet),
    getMintDateImageBuffer(creationDate),
    getTitleImageBuffer('Citizen'),
  ]);

  const finalImage = await getImageFromBuffers(buffers, outputWidth, outputHeight, 'png');

  const fileId = `alzena-world-passport-${passportId}`;
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
