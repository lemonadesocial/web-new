import { notFound } from 'next/navigation';

import { Space } from '$lib/graphql/generated/backend/graphql';
import { getSpace } from '$lib/utils/getSpace';
import { Divider } from '$lib/components/core';
import { FeatureHubSection, HeroSection, CommunityInfoSection, NewFeedSection, JourneySection } from './shared';
import { LemonheadsGallery } from '$lib/components/features/lemonheads/LemonheadsGallery';

async function Page() {
  const variables = { slug: 'lemonheads' };
  const space = (await getSpace(variables)) as Space;

  if (!space) return notFound();

  return (
    <div className="flex flex-col gap-6 pb-20">
      <div>
        <HeroSection space={space} />
        <CommunityInfoSection space={space} />
      </div>
      <JourneySection />
      <LemonheadsGallery />
      <FeatureHubSection spaceId={space._id} />
      <Divider className="h-2" />
      <NewFeedSection space={space} />
    </div>
  );
}

export default Page;
