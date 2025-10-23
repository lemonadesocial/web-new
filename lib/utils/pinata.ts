"server only";

import { PinataSDK } from "pinata";

if (!process.env.PINATA_JWT) {
  throw new Error('PINATA_JWT environment variable is required');
}

export const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
});
