import { getClient } from "$lib/graphql/request";
import { isObjectId } from '$lib/utils/helpers';
import { GetSubSpacesDocument, PublicSpace } from '$lib/graphql/generated/backend/graphql';
import SubCommunity from "$lib/components/features/sub-community";
import { getSpace } from "$lib/utils/getSpace";

export default async function FeaturedHubs({ params }: { params: Promise<{ uid: string; }>; }) {
  const uid = (await params).uid;
  const variables = isObjectId(uid) ? { id: uid, slug: uid } : { slug: uid };


  const space = await getSpace(variables);

  const { data: subSpacesData } = await getClient().query({ query: GetSubSpacesDocument, variables: { id: space._id } });
  const subSpaces = subSpacesData?.getSubSpaces || [];

  return (
    <SubCommunity subSpaces={subSpaces as PublicSpace[]} />
  );
};
