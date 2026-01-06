import { getClient } from '$lib/graphql/request';
import { notFound } from 'next/navigation';

import { GetSubSpacesDocument, PublicSpace } from '$lib/graphql/generated/backend/graphql';
import SubCommunity from '$lib/components/features/sub-community';
import { getSpace } from '$lib/utils/getSpace';

type Props = { params: Promise<{ domain: string }> };

export default async function FeaturedHubs({ params }: Props) {
  const res = await params;
  const domain = decodeURIComponent(res.domain);

  const space = await getSpace({ hostname: domain });

  if (!space) return notFound();

  const client = getClient();
  const { data: subSpacesData } = await client.query({ query: GetSubSpacesDocument, variables: { id: space._id } });
  const subSpaces = subSpacesData?.getSubSpaces || [];

  return (
    <div className="page mx-auto px-4 xl:px-0 pt-6">
      <SubCommunity subSpaces={subSpaces as PublicSpace[]} />
    </div>
  );
}
