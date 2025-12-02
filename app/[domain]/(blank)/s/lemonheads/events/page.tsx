import { notFound } from 'next/navigation';

import { getClient } from '$lib/graphql/request/client';
import { isObjectId } from '$lib/utils/helpers';
import {
  GetSpaceTagsDocument,
  GetSubSpacesDocument,
  Space,
  PublicSpace,
  SpaceTag,
} from '$lib/graphql/generated/backend/graphql';
import { Community } from '$lib/components/features/community';
import { getSpace } from '$lib/utils/getSpace';
import { SubTitleSection, TitleSection } from '../shared';
import { Content } from './content';

export default async function Page(_props: { params: Promise<{ uid: string }> }) {
  // const uid = (await params).uid;
  // const variables = isObjectId(uid) ? { id: uid, slug: uid } : { slug: uid };
  const variables = { slug: 'lemonheads' };
  const space = await getSpace(variables);

  if (!space) return notFound();

  const { subSpaces, spaceTags } = await prefetchData(space);

  return (
    <div className="page mx-auto px-4 xl:px-0 pt-6 w-full max-w-[1080px]">
      <div className="flex flex-col gap-6 pb-28 md:pb-20">
        <div>
          <div className="flex flex-col gap-2">
            <TitleSection className="md:text-3xl">Events</TitleSection>
            <SubTitleSection>
              Discover gatherings, meetups, and more from this community. Jump into what excites you.
            </SubTitleSection>
          </div>
        </div>

        <Content space={space} subSpaces={subSpaces} spaceTags={spaceTags} />
      </div>
    </div>
  );
}

const prefetchData = async (space: Space) => {
  const client = getClient();

  const [subSpaces, spaceTags] = await Promise.all([
    client.query({ query: GetSubSpacesDocument, variables: { id: space._id } }),
    client.query({ query: GetSpaceTagsDocument, variables: { space: space._id } }),
  ]);

  return {
    subSpaces: (subSpaces.data?.getSubSpaces || []) as PublicSpace[],
    spaceTags: (spaceTags.data?.listSpaceTags || []) as SpaceTag[],
  };
};
