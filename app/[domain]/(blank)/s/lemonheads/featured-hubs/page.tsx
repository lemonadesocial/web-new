import { GetSubSpacesDocument, PublicSpace } from '$lib/graphql/generated/backend/graphql';
import { getClient } from '$lib/graphql/request';
import { getSpace } from '$lib/utils/getSpace';
import { Content } from './content';
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
  const subSpaces = (subSpacesData?.getSubSpaces || []) as PublicSpace[];

  return (
    <div className="page mx-auto px-4 xl:px-0 pt-6 w-full max-w-[1080px]">
      <div className="flex flex-col gap-8 pb-20">
        <div className="flex flex-col gap-2">
          <TitleSection className="md:text-3xl">Featured Hubs</TitleSection>
          <SubTitleSection>
            A closer look at all the hubs linked to this community. Discover new events, people, and ideas.
          </SubTitleSection>
        </div>

        <Content subSpaces={subSpaces} />
      </div>
    </div>
  );
}

export default Page;
