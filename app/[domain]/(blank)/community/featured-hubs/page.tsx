import { getClient } from "$lib/graphql/request";

import { isObjectId } from '$lib/utils/helpers';
import { GetSpaceDocument, GetSubSpacesDocument, PublicSpace, Space } from '$lib/graphql/generated/backend/graphql';
import SubCommunity from "$lib/components/features/sub-community";


export default async function FeaturedHubs({ params }: { params: Promise<{ uid: string; }>; }) {
  const uid = (await params).uid;
  const variables = isObjectId(uid) ? { id: uid, slug: uid } : { slug: uid };

  const client = getClient();

  const { data: spaceData } = await client.query({ query: GetSpaceDocument, variables });
  const space = spaceData?.getSpace as Space;

  const { data: subSpacesData } = await client.query({ query: GetSubSpacesDocument, variables: { id: space._id } });
  const subSpaces = subSpacesData?.getSubSpaces || [];

  return (
    <SubCommunity subSpaces={subSpaces as PublicSpace[]} />
  );
};
