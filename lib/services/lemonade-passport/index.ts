import { getData } from '$lib/services/lemonhead/admin';
import { getImageFromBuffers } from '$lib/services/nft/image';
import { getUriFromUrl, uploadImage, uploadJSON } from '$lib/services/nft/storage';
import assert from 'assert';
import { createCanvas, Image, registerFont, deregisterAllFonts } from 'canvas';
import fs from 'fs';
import moment from 'moment';
import path from 'path';

import { getApproval } from "./admin";
import { avatarOffset, avatarSize, creationDateOffset, DESCRIPTION, fontSize, outputHeight, outputWidth, passportIdOffset, Point, usernameOffset } from "./common";

const regularFontPath = path.join(process.cwd(), "data", "passport", "regular.otf");
const boldFontPath = path.join(process.cwd(), "data", "passport", "bold.otf");
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
}

const getBoilerplateImageBuffer = async () => {
  const filePath = path.join(process.cwd(), "data", "passport", "lemonade-passport.png");
  return fs.readFileSync(filePath);
}

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
}

const getUsernameImageBuffer = async (username: string) => {
  deregisterAllFonts();
  registerFont(regularFontPath, { family: regularFontFamily });
  return await getTextImageBuffer(`${fontSize}px "${regularFontFamily}"`, username, usernameOffset, '#ffffff');
}

const getPassportIdImageBuffer = async (passportId: string) => {
  deregisterAllFonts();
  registerFont(boldFontPath, { family: boldFontFamily });
  return await getTextImageBuffer(`${fontSize}px "${boldFontFamily}"`, passportId, passportIdOffset, '#000000');
}

const getCreationDateImageBuffer = async (creationDate: string) => {
  deregisterAllFonts();
  registerFont(boldFontPath, { family: boldFontFamily });
  return await getTextImageBuffer(`${fontSize}px "${boldFontFamily}"`, creationDate, creationDateOffset, '#000000');
}

const getLensUsername = async (wallet: string) => {
  //-- TODO: implement
  return 'lens-username';
}

const getEnsUsername = async (wallet: string) => {
  //-- TODO: implement
  return '@ens';
}

const getFlufflesAvatarImageUrl = async (wallet: string) => {
  //-- TODO: implement
  return 'https://fluffles.xyz/api/v1/avatar';
}

export const getMintLemonadePassportData = async (
  wallet: string,
  useLensForUserName: boolean, //-- otherwise use ENS
  useFlufflesForAvatar: boolean, //-- otherwise use Lemonhead
) => {
  const lemonheadData = await getData(wallet);

  assert.ok(lemonheadData && lemonheadData.tokenId && lemonheadData.imageUrl);

  const username = useLensForUserName ? await getLensUsername(wallet) : await getEnsUsername(wallet);
  const avatarImageUrl = useFlufflesForAvatar ? await getFlufflesAvatarImageUrl(wallet) : lemonheadData.imageUrl;

  const passportId = lemonheadData.tokenId.padStart(8, '0');

  const creationDate = moment().format('MM/DD/YYYY');

  const buffers = await Promise.all([
    getAvatarImageBuffer(avatarImageUrl),
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
