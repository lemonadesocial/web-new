import { unstable_cache } from 'next/cache';

import { collection } from './mongo';
import { Space } from '$lib/generated/backend/graphql';


export interface SpaceWithHydraKeys extends Space {
	hydra_client_id?: string;
	hydra_client_secret?: string;
}

const getSpaceData = async (hostname: string): Promise<SpaceWithHydraKeys | null> => {
	const spacesCollection = await collection<SpaceWithHydraKeys>('spaces');
	return spacesCollection.findOne({ hostnames: hostname });
};

export const getSpace = unstable_cache(
	getSpaceData,
	['get-space'],
	{
		revalidate: 3600, // Cache for 1 hour
		tags: ['space-data']
	}
);
