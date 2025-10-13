import { client } from '$lib/utils/lens/client';
import { fetchAccount } from '@lens-protocol/client/actions';
import { createCanvas, deregisterAllFonts, Image, registerFont } from 'canvas';
import assert from 'assert';
import { ethers } from 'ethers';
import fs from 'fs';
import { format } from 'date-fns';
import path from 'path';

import { getImageFromBuffers } from '$lib/services/nft/image';
import { getUriFromUrl, uploadImage, uploadJSON } from '$lib/services/nft/storage';

import { getApproval, getData } from "./admin";
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

  //-- calculate font size based on username length
  const scaledFontSize = username.length <= 18
    ? fontSize
    : Math.trunc(19 * fontSize / username.length);

  registerFont(regularFontPath, { family: regularFontFamily });
  return await getTextImageBuffer(`${scaledFontSize}px "${regularFontFamily}"`, username, usernameOffset, '#ffffff');
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

const getEnsUsername = async (wallet: string) => {
  const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_ETHEREUM_PROVIDER);

  // Use lookup to get ENS name from wallet address
  const ensName = await provider.lookupAddress(wallet);

  if (!ensName) {
    throw new Error('Failed to get ENS username');
  }

  return `@${ensName}`;
}

export const getMintLemonadePassportData = async (
  wallet: string,
  ensForUserName?: boolean,
  lemonadeUsername?: string,
  fluffleTokenId?: string,
) => {
  const passportData = await getData(wallet, fluffleTokenId || '');
  // const passportData = {
  //   lemonheadTokenId: '12',
  //   lemonheadImageUrl: 'https://api.grove.storage/e35e3617ecf4b62e7f26aa7fff5ba13c05aea871d4ba2261c35368ade048adfe',
  //   fluffleImageUrl: ''
  // }

  assert.ok(passportData && passportData.lemonheadTokenId);

  let username = wallet.toLowerCase();

  if (lemonadeUsername) {
    username = `@${lemonadeUsername}`;
  } else if (ensForUserName) {
    username = await getEnsUsername(wallet);
  }

  assert.ok(username);

  const avatarImageUrl = fluffleTokenId ? passportData.fluffleImageUrl : passportData.lemonheadImageUrl;

  const passportId = passportData.lemonheadTokenId.padStart(8, '0');

  const creationDate = format(new Date(), 'MM/dd/yyyy');

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
  // const data = {
  //   "signature": "0xa48a809952b3c9e9753c048a7c43b0739256d9d0e40521ac4a4c66ea8bc8051f0102a12b02b420bb9e027e45378aeba8d75f6565972d87fcf8fb8f84e53916e51c",
  //   "price": "0",
  //   "metadata": "7a16f780a1865ccd025afb1945726d8a274de57f04f9da532068d5be046068e6",
  // }

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
