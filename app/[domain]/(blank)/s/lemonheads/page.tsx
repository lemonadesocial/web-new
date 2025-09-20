import { notFound } from 'next/navigation';

import { Space } from '$lib/graphql/generated/backend/graphql';
import { getSpace } from '$lib/utils/getSpace';
import { Divider } from '$lib/components/core';
import { FeatureHubSection, HeroSection, CommunityInfoSection, NewFeedSection, JourneySection } from './shared';

async function Page() {
  const variables = { slug: 'lemonheads' };
  const space = (await getSpace(variables)) as Space;

  if (!space) return notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <HeroSection space={space} />
        <CommunityInfoSection space={space} />
      </div>
      <JourneySection />
      <FeatureHubSection spaceId={space._id} />
      <>
        <Divider className="h-2" />
        <div>
          <NewFeedSection spaceId={space._id} />
        </div>
      </>
    </div>
  );
}

export default Page;
