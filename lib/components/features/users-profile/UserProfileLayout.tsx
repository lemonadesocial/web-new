'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import { GetUserDocument, Space, User } from '$lib/graphql/generated/backend/graphql';
import { getSpace } from '$lib/utils/getSpace';
import { UserProfileHero } from './UserProfileHero';
import { UserProfileTabs } from './UserProfileTabs';
import { useMe } from '$lib/hooks/useMe';
import { useQuery } from '$lib/graphql/request';
import { isObjectId } from '$lib/utils/helpers';
import { match } from 'ts-pattern';

function Layout({ children }: React.PropsWithChildren) {
  const params = useParams();
  const { uid } = params;

  const me = useMe();
  const variables = typeof uid === 'string' ? (isObjectId(uid) ? { id: uid } : { username: uid }) : undefined;
  const { data, loading } = useQuery(GetUserDocument, { variables, skip: !uid });

  if (!loading) return null;
  if (data?.getUser && me) return null;

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 md:gap-12 pb-28 md:pb-20 w-full">
      <div className="flex flex-col gap-5 flex-1">
        <UserProfileHero user={(data?.getUser || me) as User} />
        {/* <ProfileInfoSection /> */}

        <UserProfileTabs />
        {children}
      </div>

      {/* <LemonHeadsHubRightCol spaceId={space._id} options={{ nft: true, upcomingEvents: true, leaderboard: false }} /> */}
    </div>
  );
}

export default Layout;
