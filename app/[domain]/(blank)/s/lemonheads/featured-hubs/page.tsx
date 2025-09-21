import CommunityCard from '$lib/components/features/community/CommunityCard';
import { GetSubSpacesDocument, PublicSpace } from '$lib/graphql/generated/backend/graphql';
import { getClient } from '$lib/graphql/request';
import { getSpace } from '$lib/utils/getSpace';
import { SubTitleSection, TitleSection } from '../shared';

async function Page() {
  // const uid = (await params).uid;
  // const variables = isObjectId(uid) ? { id: uid, slug: uid } : { slug: uid };
  const variables = { slug: 'lemonheads' };

  const space = await getSpace(variables);

  const { data: subSpacesData } = await getClient().query({
    query: GetSubSpacesDocument,
    variables: { id: space._id },
  });
  const subSpaces = subSpacesData?.getSubSpaces || [];

  return (
    <div className="flex flex-col gap-8 pb-20">
      <div className="flex flex-col gap-2">
        <TitleSection className="md:text-3xl">Featured Hubs</TitleSection>
        <SubTitleSection>
          A closer look at all the hubs linked to this community. Discover new events, people, and ideas.
        </SubTitleSection>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subSpaces.map((space) => (
          <CommunityCard key={space._id} space={space as PublicSpace} />
        ))}
      </div>
    </div>
  );
}

export default Page;
