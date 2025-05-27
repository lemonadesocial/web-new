import { PublicClient, testnet, mainnet } from "@lens-protocol/client";
import { StorageClient } from '@lens-chain/storage-client';

export const client = PublicClient.create({
  environment: process.env.NEXT_PUBLIC_APP_ENV === 'production' ? mainnet : testnet,
  storage: window.localStorage,
});

export const storageClient = StorageClient.create();
