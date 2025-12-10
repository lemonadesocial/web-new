import { HubMusicPlayer } from '$lib/components/features/community/HubMusicPlayer';
import { Space } from '$lib/graphql/generated/backend/graphql';
import { getClient } from '$lib/graphql/request';
import { isObjectId } from '$lib/utils/helpers';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: Promise<{ uid: string }> }) {
  const uid = (await params).uid;
  const variables = isObjectId(uid) ? { id: uid, slug: uid } : { slug: uid };

  const client = getClient();
  const { data, error } = await client.query({
    query: `query GetSpace($id: MongoID, $slug: String, $hostname: String) {
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
