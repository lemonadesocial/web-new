import { HubMusicPlayer } from '$lib/components/features/community/HubMusicPlayer';
import { Space } from '$lib/graphql/generated/backend/graphql';
import { getClient } from '$lib/graphql/request';
import { notFound } from 'next/navigation';

export default async function Page() {
  // const uid = (await params).uid;
  // const variables = isObjectId(uid) ? { id: uid, slug: uid } : { slug: uid };
  const variables = { slug: 'lemonheads' };

  const client = getClient();
  const { data, error } = await client.query({
    query: `query GetSpaceNft($id: MongoID, $slug: String, $hostname: String) {
      getSpace(_id: $id, slug: $slug, hostname: $hostname) {
        _id
        nft_enabled
      }
    }`,
    variables,
  });

  const space = data?.getSpace as Space;

  if (!space?._id || !space?.nft_enabled) return notFound();

  return <HubMusicPlayer spaceId={space._id} />;
}
