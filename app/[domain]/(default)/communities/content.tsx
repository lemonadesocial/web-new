'use client';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { useRouter } from 'next/navigation';
import { isMobile } from 'react-device-detect';

import { Button, Divider } from '$lib/components/core';
import { useQuery } from '$lib/graphql/request';
import { GetSpacesDocument, Space, SpaceRole } from '$lib/graphql/generated/backend/graphql';
import { generateUrl } from '$lib/utils/cnd';
import { useMe } from '$lib/hooks/useMe';
import { userAvatar } from '$lib/utils/user';

import { ASSET_PREFIX } from '$lib/utils/constants';
import { useSession } from '$lib/hooks/useSession';
import { useSignIn } from '$lib/hooks/useSignIn';

import { PageCardItem, PageCardItemSkeleton, PageSection, PageTitle } from '../shared';

export function Content() {
  const session = useSession();
  const me = useMe();
  const signIn = useSignIn();
  const router = useRouter();

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    if (!mounted) setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!me && !session && mounted) signIn(false);
  }, [me, session, mounted]);

  if (!me && !session) return null;

  return (
    <div className="flex flex-col gap-8 mt-6 pb-24 md:my-11">
      <PageTitle
        title="Communities"
        subtitle="Manage your community hubs and stay up-to-date with communities you subscribed to."
      />

      <div className="flex flex-col gap-6 py-8">
        <PageSection
          title="My Hubs"
          toolbar={() => (
            <div className="flex gap-2">
              <Button size="sm" variant="tertiary" icon="icon-explore" onClick={() => router.push('/explore')} />
              <Button size="sm" icon="icon-edit-square" onClick={() => router.push('/create/community')} />
            </div>
          )}
        >
          <MyHubs />
        </PageSection>
        <Divider className="my-2" />
        <PageSection title="Subscribed Hubs">
          <SubscribedHubs />
        </PageSection>
      </div>
    </div>
  );
}

function MyHubs() {
  const me = useMe();
  const { data, loading } = useQuery(GetSpacesDocument, {
    variables: {
      with_my_spaces: true,
      roles: [SpaceRole.Creator, SpaceRole.Admin],
    },
    fetchPolicy: 'cache-and-network',
  });
  const list = (data?.listSpaces || []) as Space[];

  const getImageSrc = (item: Space) => {
    let src = `${ASSET_PREFIX}/assets/images/default-dp.png`;
    if (item.personal) src = userAvatar(me);
    if (item.image_avatar) src = generateUrl(item.image_avatar_expanded);
    return src;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[...Array(5)].map((_, i) => (
          <PageCardItemSkeleton key={i} view={isMobile ? 'list-item' : 'card'} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {list
        .sort((a, _) => (a.personal ? -1 : 1))
        .map((item) => (
          <PageCardItem
            key={item._id}
            title={item.title}
            view={isMobile ? 'list-item' : 'card'}
            onClick={() => (window.location.href = `/manage/community/${item.slug || item._id}`)}
            subtitle={`${item.followers_count || 0} Subscribers`}
            image={{
              src: getImageSrc(item),
              class: twMerge('rounded-sm', item.personal && 'rounded-full'),
            }}
          />
        ))}
    </div>
  );
}

function SubscribedHubs() {
  const router = useRouter();
  const { data, loading } = useQuery(GetSpacesDocument, {
    variables: { with_my_spaces: false, roles: [SpaceRole.Subscriber] },
    fetchPolicy: 'cache-and-network',
  });
  const list = (data?.listSpaces || []) as Space[];

  const getImageSrc = (item: Space) => {
    let src = `${ASSET_PREFIX}/assets/images/default-dp.png`;
    if (item.image_avatar) src = generateUrl(item.image_avatar_expanded);
    return src;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[...Array(4)].map((_, i) => (
          <PageCardItemSkeleton key={i} view={isMobile ? 'list-item' : 'card'} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {list
        .sort((a, _) => (a.personal ? -1 : 1))
        .map((item) => (
          <PageCardItem
            key={item._id}
            view={isMobile ? 'list-item' : 'card'}
            title={item.title}
            image={{ src: getImageSrc(item), class: 'rounded-sm' }}
            onClick={() => router.push(`/s/${item.slug || item._id}`)}
          />
        ))}
    </div>
  );
}
