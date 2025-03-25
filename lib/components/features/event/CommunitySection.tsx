import { Button } from '$lib/components/core';
import { Event, GetMeDocument, GetSpaceDocument, Space, User } from '$lib/generated/backend/graphql';
import { useQuery } from '$lib/request';
import { generateUrl } from '$lib/utils/cnd';
import React from 'react';
import { COMMUNITY_SOCIAL_LINKS } from '../community/constants';

export function CommunitySection({ event }: { event: Event }) {
  const { data: dataGetMe } = useQuery(GetMeDocument);
  const me = dataGetMe?.getMe as User;

  const { data } = useQuery(GetSpaceDocument, { variables: { id: event.space }, skip: !event.space });
  const space = data?.getSpace as Space;

  if (!space) return null;
  const canManage = space.creator === me._id || space.admins?.map((p) => p._id).includes(me._id);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3 justify-between items-center">
        {space.image_avatar_expanded && (
          <img src={generateUrl(space.image_avatar_expanded)} className="size-8 border rounded-lg" />
        )}
        <div className="flex flex-col flex-1">
          <p className="text-xs font-medium">Presented by</p>
          <div className="flex gap-1 items-center flex-1">
            <span className="font-medium">{space.title}</span>
            <i className="icon-chevron-right" />
          </div>
        </div>
        {!canManage && (
          <Button className="rounded-full" variant="tertiary">
            {space.followed ? 'UnSubscribe' : 'Subscribe'}
          </Button>
        )}
      </div>

      <p className="font-medium text-sm">{space.description}</p>

      <div className="flex items-center gap-3">
        {COMMUNITY_SOCIAL_LINKS.filter((item) => space?.[item.key as keyof Space]).map((item) => (
          <i
            key={item.key}
            aria-label={item.key}
            className={`${item.icon} cursor-pointer text-tertiary/56 hover:text-tertiary`}
            onClick={() => window.open(`${item.prefix}${space?.[item.key as keyof Space]}`, '_blank')}
          />
        ))}
      </div>
    </div>
  );
}
