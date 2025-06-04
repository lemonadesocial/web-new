import { PublicClient, testnet, mainnet } from "@lens-protocol/client";
import { StorageClient } from '@lens-chain/storage-client';
import { PostMetadataFragment } from "./fragments/posts";

export const client = PublicClient.create({
  environment: process.env.NEXT_PUBLIC_APP_ENV === 'production' ? mainnet : testnet,
  storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  fragments: [PostMetadataFragment]
});

export const storageClient = StorageClient.create();
