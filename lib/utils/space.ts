import { unstable_cache } from 'next/cache';

import { collection } from './mongo';

export interface SpaceHydraKeys {
  _id: string;
  hydra_client_id?: string;
  hydra_client_secret?: string;
}

const getSpaceData = async (hostname: string): Promise<SpaceHydraKeys | null> => {
  const spacesCollection = await collection<SpaceHydraKeys>('spaces');
  const space = await spacesCollection.findOne(
    { hostnames: hostname },
    { projection: { _id: 1, hydra_client_id: 1, hydra_client_secret: 1 } }
  );
  
  if (!space) return null;
  
  return {
    ...space,
    _id: space._id.toString(),
  };
};

export const getSpace = unstable_cache(
  getSpaceData,
  ['get-space'],
  {
    revalidate: 3600, // Cache for 1 hour
    tags: ['space-data']
  }
);
