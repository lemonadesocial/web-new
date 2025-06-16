import { defaultClient } from "$lib/graphql/request/instances";
import { CreateFileUploadsDocument } from "$lib/graphql/generated/backend/graphql";

export type FileDirectory = 'event' | 'place' | 'store' | 'store_product' | 'user' | 'post' | 'email';

export type MediaFile = {
  url: string;
  type: string;
};

export async function uploadFiles(files: File[], directory: FileDirectory): Promise<MediaFile[]>   {
  const uploadInfos = files.map(file => ({
    extension: file.name.split('.').pop()!.toString(),
  }));

  const createFileUploadsResponse = await defaultClient.query({
    query: CreateFileUploadsDocument,
    variables: {
      uploadInfos,
      directory,
    },
  });

  const uploadPromises = files.map(async (file, index) => {
    const uploadData = createFileUploadsResponse.data?.createFileUploads[index];

    if (!uploadData) {
      throw new Error('Failed to get upload data');
    }

    const { presignedUrl, type, url, _id, bucket, key } = uploadData;

    if (!presignedUrl || !url) {
      throw new Error('Failed to get upload data');
    }
    
    const s3Response = await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
        'x-amz-tagging': 'pending=true',
      },
    });

    if (!s3Response.ok) {
      throw new Error(`Failed to upload file ${file.name}`);
    }

    // NOTE: add extra file for generate url after upload
    return { _id, bucket, key, url, type };
  });

  return Promise.all(uploadPromises);
}
