import React from 'react';

import { Space } from '$lib/graphql/generated/backend/graphql';
import { getSpace } from '$lib/utils/getSpace';
import { notFound } from 'next/navigation';
import { HeroSectionProfile, ProfileInfoSection, UpcomingEventsCard } from '../shared';
import { LemonHeadsNFTCard } from '$lib/components/features/lemonheads/cards/LemonHeadsNFTCard';
import { Tabs } from './tabs';

async function Layout({ children }: React.PropsWithChildren) {
  const variables = { slug: 'lemonheads' };
  const space = (await getSpace(variables)) as Space;

  if (!space) return notFound();

  return (
    <div className="flex gap-12">
      <div className="flex flex-col gap-5">
        <HeroSectionProfile space={space} />
        <ProfileInfoSection />

        <Tabs />
        {children}
      </div>

      <div className="hidden md:block w-full max-w-[296px] space-y-4">
        <LemonHeadsNFTCard />
        <UpcomingEventsCard />
      </div>
    </div>
  );
}

export default Layout;
