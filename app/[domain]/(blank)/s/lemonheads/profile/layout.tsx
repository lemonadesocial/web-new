import React from 'react';
import { notFound } from 'next/navigation';
import { Space } from '$lib/graphql/generated/backend/graphql';
import { getSpace } from '$lib/utils/getSpace';
import { LemonHeadsHubRightCol } from '$lib/components/features/lemonheads/LemonHeadsHubRightCol';

import { HeroSectionProfile, ProfileInfoSection } from '../shared';
import { Tabs } from './tabs';

async function Layout({ children }: React.PropsWithChildren) {
  const variables = { slug: 'lemonheads' };
  const space = (await getSpace(variables)) as Space;

  if (!space) return notFound();

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 md:gap-12 pb-28 md:pb-20">
      <div className="flex flex-col gap-5">
        <HeroSectionProfile space={space} />
        <ProfileInfoSection />

        <Tabs />
        {children}
      </div>

      <LemonHeadsHubRightCol spaceId={space._id} options={{ nft: true, upcomingEvents: true, leaderboard: false }} />
    </div>
  );
}

export default Layout;
