import { storageClient } from '$lib/utils/lens/client';
import { LENS_CHAIN_ID } from '$lib/utils/lens/constants';
import { immutable } from '@lens-chain/storage-client';

const gatewayPrefix = 'https://api.grove.storage/';

const bufferToFile = (buffer: Buffer, filename: string, mimeType: string = 'image/png'): File => {
  // Check if we're in a browser environment where Blob and File are available
  if (typeof Blob !== 'undefined' && typeof File !== 'undefined') {
    const blob = new Blob([buffer], { type: mimeType });
    return new File([blob], filename, { type: mimeType });
  }

  // For Node.js environment, create a minimal File-like object
  return {
    name: filename,
    type: mimeType,
    size: buffer.length,
    arrayBuffer: () => Promise.resolve(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)),
  } as unknown as File;
};

type UploadResponse = {
  resource: {
    gatewayUrl: string;
  };
};

export const getUrlFromUri = (uri: string) => {
  return storageClient.resolve(uri);
};

export const getUriFromUrl = (url: string) => {
  return url.replace(gatewayPrefix, '');
};

export const uploadImage = async (filename: string, image: Buffer) => {
  const file = bufferToFile(image, filename);

  const response = (await storageClient.uploadFile(file, {
    acl: immutable(parseInt(LENS_CHAIN_ID)),
  })) as unknown as UploadResponse;

  return response.resource.gatewayUrl
};

export const uploadJSON = async (filename: string, json: Record<string, unknown>) => {

  const response = await storageClient.uploadAsJson(json, {
    acl: immutable(parseInt(LENS_CHAIN_ID)),
    name: filename,
  }) as unknown as UploadResponse;

  return response.resource.gatewayUrl;
};
