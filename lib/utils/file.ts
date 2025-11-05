import { defaultClient } from '$lib/graphql/request/instances';
import { ConfirmFileUploadsDocument, CreateFileUploadsDocument } from '$lib/graphql/generated/backend/graphql';
import { toast } from '$lib/components/core/toast';

export type FileDirectory =
  | 'event'
  | 'place'
  | 'store'
  | 'store_product'
  | 'user'
  | 'post'
  | 'email'
  | 'community'
  | 'ticket_type';

export type MediaFile = {
  url: string;
  type: string;
  _id: string;
};

export async function uploadFiles(files: File[], directory: FileDirectory): Promise<MediaFile[]> {
  const uploadInfos = files.map((file) => ({
    extension: file.name.split('.').pop()!.toString().toLowerCase(),
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

    const { data } = await defaultClient.query({ query: ConfirmFileUploadsDocument, variables: { ids: [_id] } });

    if (!data?.confirmFileUploads) {
      throw new Error('Confirm file upload failed');
    }

    // NOTE: add extra file for generate url after upload
    return { _id, bucket, key, url, type };
  });

  return Promise.all(uploadPromises);
}

export const downloadCSVFile = async (endpoint: string, title: string) => {
  toast.success(`Downloading ${title}...`, 1000);

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_LMD_BE}${endpoint}`, {
      method: 'GET',
      credentials: 'include',
    });

    const blob = await response.blob();
    const file = window.URL.createObjectURL(blob);
    const fileName = `${title}.csv`;
    const link = document.createElement('a');
    link.href = file;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(file);
    toast.success(`Downloaded ${title}.`);
  } catch {
    toast.error('Something went wrong when exporting CSV. Please try again.');
  }
};
