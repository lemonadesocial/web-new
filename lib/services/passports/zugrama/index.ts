import assert from "assert";
import path from "path";
import { deregisterAllFonts, registerFont } from "canvas";

import { getImageFromBuffers } from "../../nft/image";
import { getUriFromUrl, uploadImage, uploadJSON } from "../../nft/storage";

import { getEnsUsername } from "../common/ens";
import { formatDate } from "../common/format";
import { getFileImageBuffer, getTextImageBuffer, getUrlImageBuffer, Point } from "../common/canvas";

import { getApproval } from "./admin";

const regularFontPath = path.join(process.cwd(), "data", "zugrama-passport", "regular.ttf");
const boldFontPath = path.join(process.cwd(), "data", "zugrama-passport", "semibold.ttf");
const regularFontFamily = 'zugrama-passport-font-regular';
const boldFontFamily = 'zugrama-passport-font-semibold';

const usernameFontSize = 50;
const textFontSize = 30;
const outputWidth = 1080;
const outputHeight = 675;
const avatarSize = 310;

const firstColumnX = 480;
const secondColumnX = 757;
const firstLineY = 373;
const secondLineY = 476;

const avatarOffset: Point = { x: 88, y: 193 };
const usernameOffset: Point = { x: 495, y: 236 };

const passportIdOffset: Point = { x: firstColumnX, y: firstLineY };
const mintDateOffset: Point = { x: secondColumnX, y: firstLineY };
const titleOffset: Point = { x: firstColumnX, y: secondLineY };
const verifiedDateOffset: Point = { x: secondColumnX, y: secondLineY };

const createMetadata = (imageUrl: string, passportId: string) => {
  return {
    image: imageUrl,
    attributes: [
      { trait_type: 'Passport ID', value: passportId },
    ]
  };
};

const regularFont = `${textFontSize}px "${regularFontFamily}"`;

const getAvatarImageBuffer = async (avatarImageUrl: string) => {
  return getUrlImageBuffer(outputWidth, outputHeight, avatarOffset, { x: avatarSize, y: avatarSize }, avatarImageUrl);
}

const getBoilerplateImageBuffer = async () => {
  return getFileImageBuffer(path.join(process.cwd(), "data", "zugrama-passport", "boilerplate.png"));
}

const getUsernameImageBuffer = async (username: string) => {
  deregisterAllFonts();
  registerFont(boldFontPath, { family: boldFontFamily });

  //-- calculate font size based on username length
  const scaledFontSize = username.length <= 14
    ? usernameFontSize
    : Math.trunc(14 * usernameFontSize / username.length);

  return getTextImageBuffer(outputWidth, outputHeight, `${scaledFontSize}px "${boldFontFamily}"`, username, usernameOffset, '#000000');
}

const getPassportIdImageBuffer = async (passportId: string) => {
  deregisterAllFonts();
  registerFont(regularFontPath, { family: regularFontFamily });
  return getTextImageBuffer(outputWidth, outputHeight, regularFont, passportId, passportIdOffset, '#ffffff');
}

const getMintDateImageBuffer = async (mintDate: string) => {
  deregisterAllFonts();
  registerFont(regularFontPath, { family: regularFontFamily });
  return getTextImageBuffer(outputWidth, outputHeight, regularFont, mintDate, mintDateOffset, '#ffffff');
}

const getTitleImageBuffer = async (title: string) => {
  deregisterAllFonts();
  registerFont(regularFontPath, { family: regularFontFamily });
  return getTextImageBuffer(outputWidth, outputHeight, regularFont, title, titleOffset, '#ffffff');
}

const getVerifiedDateImageBuffer = async (verifiedDate: string) => {
  deregisterAllFonts();
  registerFont(regularFontPath, { family: regularFontFamily });
  return getTextImageBuffer(outputWidth, outputHeight, regularFont, verifiedDate, verifiedDateOffset, '#ffffff');
}

export const getMintZuGramaPassportData = async (
  userId: string,
  passportNumber: number,
  selfVerifiedTimestamp: number,
  wallet: string,
  avatarImageUrl: string,
  ensForUserName?: boolean, //-- this should always be true, use false for testing
) => {
  // const passportData = await getData(wallet, userId);

  // assert.ok(passportData && passportData.passportId && passportData.selfVerifiedTimestamp > 0);

  let username = wallet.toLowerCase();

  if (ensForUserName) {
    username = await getEnsUsername(wallet);
  }

  assert.ok(username);

  const passportId = passportNumber.toString().padStart(8, '0');

  const creationDate = formatDate(new Date());
  const verifiedDate = formatDate(new Date(selfVerifiedTimestamp));

  const buffers = await Promise.all([
    getAvatarImageBuffer(avatarImageUrl),
    getBoilerplateImageBuffer(),
    getUsernameImageBuffer(username),
    getPassportIdImageBuffer(passportId),
    getMintDateImageBuffer(creationDate),
    getTitleImageBuffer('Founding Citizen'),
    getVerifiedDateImageBuffer(verifiedDate),
  ]);

  const finalImage = await getImageFromBuffers(
    buffers,
    outputWidth,
    outputHeight,
    'png',
  );

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
