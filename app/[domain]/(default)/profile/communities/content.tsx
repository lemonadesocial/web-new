'use client';
import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { useRouter } from 'next/navigation';
import { isMobile } from 'react-device-detect';

import { Button } from '$lib/components/core';
import { useQuery } from '$lib/graphql/request';
import { GetSpacesDocument, Space, SpaceRole } from '$lib/graphql/generated/backend/graphql';
import { generateUrl } from '$lib/utils/cnd';
import { useMe } from '$lib/hooks/useMe';
import { userAvatar } from '$lib/utils/user';

import { ASSET_PREFIX } from '$lib/utils/constants';
import { useSession } from '$lib/hooks/useSession';
import { useSignIn } from '$lib/hooks/useSignIn';

import { PageCardItem, PageCardItemSkeleton } from '../../shared';

export function Content() {
  const session = useSession();
  const me = useMe();
  const signIn = useSignIn();

  const [tab, setTab] = useState<'my-hubs' | 'subscribed-hubs'>('my-hubs');

  React.useEffect(() => {
    if (!me && !session) signIn();
  }, [me, session]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
      <div className="flex items-center">
        <button
          type="button"
          className={twMerge(
            'flex justify-center items-center gap-1.5 px-3 py-1.5 rounded-sm font-medium text-sm',
            tab === 'my-hubs'
              ? 'bg-primary/8 text-primary'
              : 'bg-transparent text-tertiary hover:text-primary'
          )}
          onClick={() => setTab('my-hubs')}
        >
          Managing
        </button>
        <button
          type="button"
          className={twMerge(
            'flex justify-center items-center gap-1.5 px-3 py-1.5 rounded-sm font-medium text-sm',
            tab === 'subscribed-hubs'
              ? 'bg-primary/8 text-primary'
              : 'bg-transparent text-tertiary hover:text-primary'
          )}
          onClick={() => setTab('subscribed-hubs')}
        >
          Subscriptions
        </button>
      </div>
      <Button size="sm" variant="secondary"  icon="icon-edit-square" onClick={() => (window.location.href = '/create/community')} />
      </div>
      <div>
        {
          tab === 'my-hubs' ? <MyHubs /> : <SubscribedHubs />
        }
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[...Array(5)].map((_, i) => (
          <PageCardItemSkeleton key={i} view={isMobile ? 'list-item' : 'card'} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <PageCardItemSkeleton key={i} view={isMobile ? 'list-item' : 'card'} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
