import { PinataSDK } from 'pinata';

export const getUserNameMetadata = (username: string) => {
  const metadata = {
    name: username,
    description: 'Lemonade usernames powered by MegaETH! #makelemonade',
    attributes: [
      {
        trait_type: 'Created Date',
        display_type: 'date',
        value: Math.trunc(Date.now()/1000),
      },
      {
        trait_type: 'Length',
        display_type: 'number',
        value: username.length,
      },
    ],
  };

  return metadata;
}

export const uploadUsernameMetadata = async (username: string) => {
  const metadata = getUserNameMetadata(username);

  const metadataBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
  const metadataFile = new File([metadataBlob], 'metadata.json', { type: 'application/json' });

  const pinata = new PinataSDK({
    pinataJwt: process.env.USERNAME_PINATA_JWT,
  });

  const { cid: metadataCid } = await pinata.upload.public.file(metadataFile);
  const tokenUri = `ipfs://${metadataCid}`;

  return { tokenUri };
}
