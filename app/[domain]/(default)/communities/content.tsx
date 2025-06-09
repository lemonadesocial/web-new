'use client';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { useRouter } from 'next/navigation';

import { Button, Divider } from '$lib/components/core';
import { useQuery } from '$lib/graphql/request';
import { GetSpacesDocument, Space, SpaceRole } from '$lib/graphql/generated/backend/graphql';
import { generateUrl } from '$lib/utils/cnd';
import { useMe } from '$lib/hooks/useMe';
import { userAvatar } from '$lib/utils/user';

import { PageCardItem, PageSection } from '../shared';
import { ASSET_PREFIX } from '$lib/utils/constants';

export function Content() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-6 my-8">
      <PageSection
        title="My Hubs"
        toolbar={() => (
          <div className="flex gap-2">
            <Button size="sm" variant="tertiary" icon="icon-explore" onClick={() => router.push('/explore')} />
            <Button size="sm" icon="icon-edit-square" onClick={() => (window.location.href = '/create/community')} />
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
  );
}

function MyHubs() {
  const me = useMe();
  const { data } = useQuery(GetSpacesDocument, {
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {list
        .sort((a, _) => (a.personal ? -1 : 1))
        .map((item) => (
          <PageCardItem
            key={item._id}
            title={item.title}
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
  const { data } = useQuery(GetSpacesDocument, {
    variables: { with_my_spaces: false, roles: [SpaceRole.Subscriber] },
    fetchPolicy: 'cache-and-network',
  });
  const list = (data?.listSpaces || []) as Space[];

  const getImageSrc = (item: Space) => {
    let src = `${ASSET_PREFIX}/assets/images/default-dp.png`;
    if (item.personal) src = userAvatar(me);
    if (item.image_avatar) src = generateUrl(item.image_avatar_expanded);
    return src;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {list
        .sort((a, _) => (a.personal ? -1 : 1))
        .map((item) => (
          <PageCardItem
            key={item._id}
            title={item.title}
            image={{ src: getImageSrc(item), class: 'rounded-sm' }}
            onClick={() => router.push(`/s/${item.slug || item._id}`)}
          />
        ))}
    </div>
  );
}
