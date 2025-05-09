import { PublicClient, testnet, mainnet } from "@lens-protocol/client";

import { fragments } from "./fragments";

export const client = PublicClient.create({
  environment: testnet,
  storage: window.localStorage,
  // fragments,
});
