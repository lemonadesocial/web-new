'use client';
import React from 'react';
import { useParams } from 'next/navigation';

import { User } from '$lib/graphql/generated/backend/graphql';
import { useMe } from '$lib/hooks/useMe';
import { useUserProfile } from '$lib/hooks/useUserProfile';

import { UserProfileHero } from './UserProfileHero';
import { UserProfileTabs } from './UserProfileTabs';
import { isAddress } from 'ethers';
import { UserProfileInfo } from './UserProfileInfo';
import { UpcomingEventsCard } from '$app/[domain]/(blank)/s/lemonheads/shared';
import { WhoToFollow } from '../lens-account/WhoToFollow';

function UserProfileLayout({ children }: React.PropsWithChildren) {
  const params = useParams();
  const { uid } = params;

  const me = useMe();
  const { user, loading } = useUserProfile({ username: uid as string, address: uid as string });

  if (loading) return null;

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 md:gap-12 pb-28 md:pb-20 w-full pt-6">
      <div className="flex flex-col gap-5 flex-1">
        <UserProfileHero user={(user || me) as User} containerClass="h-[260px]!" />
        <UserProfileInfo user={user || me} />

        <UserProfileTabs
          containerClass="[&>.content]:p-0"
          address={isAddress(uid) ? uid : user?.lens_profile_id || ''}
          user={user}
        />
        {children}
      </div>

      <div className="w-[336px] flex flex-col gap-4">
        {user?._id && <UpcomingEventsCard userId={user?._id} />}
        {isAddress(uid) && <WhoToFollow />}
      </div>
    </div>
  );
}

export default UserProfileLayout;
