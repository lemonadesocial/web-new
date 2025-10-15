'use client';
import React from 'react';
import { notFound, useParams } from 'next/navigation';

import { useUserProfile } from '$lib/hooks/useUserProfile';

import { UserProfileHero } from './UserProfileHero';
import { UserProfileTabs } from './UserProfileTabs';
import { isAddress } from 'ethers';
import { UserProfileInfo } from './UserProfileInfo';
import { UpcomingEventsCard } from '$app/[domain]/(blank)/s/lemonheads/shared';
import { WhoToFollow } from '../lens-account/WhoToFollow';
import { LemonadeStandCard } from '../LemonadeStandCard';

function UserProfileLayout({ children }: React.PropsWithChildren) {
  const params = useParams();
  const { uid } = params;

  const { user, loading } = useUserProfile({ username: uid as string, address: uid as string });

  if (loading) return null;

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 md:gap-12 pb-28 md:pb-20 w-full pt-6 max-sm:px-4">
      <div className="flex flex-col gap-5 flex-1">
        <UserProfileHero address={uid as string} user={user} />
        <UserProfileInfo user={user} address={uid as string} />

        <UserProfileTabs
          sticky
          containerClass="[&>.content]:p-0"
          address={isAddress(uid) ? uid : user?.lens_profile_id || ''}
          user={user}
        />
        {children}
      </div>

      <div className="w-[296px]">
        <div className="sticky top-10 flex flex-col gap-4">
          <LemonadeStandCard />
          {user?._id && <UpcomingEventsCard userId={user?._id} />}
          <WhoToFollow />
        </div>
      </div>
    </div>
  );
}

export default UserProfileLayout;
