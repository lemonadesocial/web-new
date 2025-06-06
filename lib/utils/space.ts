import { unstable_cache } from 'next/cache';

import { collection } from './mongo';

export interface SpaceHydraKeys {
  _id: string;
  hydra_client_id?: string;
  hydra_client_secret?: string;
}

const getSpaceHydraKeysData = async (hostname: string): Promise<SpaceHydraKeys | null> => {
  try {
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
  } catch (_error) {
    return null;
  }
};

export const getSpaceHydraKeys = unstable_cache(
  getSpaceHydraKeysData,
  ['get-space'],
  {
    revalidate: 3600, // Cache for 1 hour
    tags: ['space-data']
  }
);
