import Link from 'next/link';

import { Button } from '$lib/components/core';
import {
  Event,
  FollowSpaceDocument,
  GetSpaceDocument,
  Space,
  UnfollowSpaceDocument,
} from '$lib/graphql/generated/backend/graphql';
import { useMutation, useQuery } from '$lib/graphql/request';
import { generateUrl } from '$lib/utils/cnd';
import { COMMUNITY_SOCIAL_LINKS } from '../community/constants';
import { useMe } from '$lib/hooks/useMe';

export function CommunitySection({ event }: { event?: Event }) {
  const me = useMe();

  const { data } = useQuery(GetSpaceDocument, { variables: { id: event?.space }, skip: !event?.space });
  const space = data?.getSpace as Space;

  const [follow, resFollow] = useMutation(FollowSpaceDocument, {
    onComplete: (client) => {
      client.writeFragment({ id: `Space:${space?._id}`, data: { followed: true } });
    },
  });
  const [unfollow, resUnfollow] = useMutation(UnfollowSpaceDocument, {
    onComplete: (client) => {
      client.writeFragment({ id: `Space:${space?._id}`, data: { followed: false } });
    },
  });

  if (!space) return null;
  const canManage = space.creator === me?._id || space.admins?.map((p) => p._id).includes(me?._id);

  const handleSubscribe = () => {
    if (!me) {
      // need to login to subscribe
      return;
    }

    const variables = { space: space?._id };
    if (space?.followed) unfollow({ variables });
    else follow({ variables });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3 justify-between items-center">
        {space.image_avatar_expanded && (
          <img src={generateUrl(space.image_avatar_expanded)} className="size-8 border rounded-sm" />
        )}
        <div className="flex flex-col flex-1">
          <p className="text-xs font-medium">Presented by</p>
          <div className="group flex gap-1 items-center flex-1">
            <Link
              href={`/s/${space.slug || space._id}`}
              className="font-medium group-hover:text-accent-400 line-clamp-1"
              target="_blank"
            >
              {space.title}
            </Link>
            <i className="transition icon-chevron-right text-quaternary group-hover:translate-x-1" />
          </div>
        </div>
        {!canManage && (
          <Button
            className="rounded-full"
            variant="tertiary-alt"
            loading={resFollow.loading || resUnfollow.loading}
            onClick={() => handleSubscribe()}
          >
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
            className={`${item.icon} cursor-pointer text-tertiary hover:text-primary size-5`}
            onClick={() => window.open(`${item.prefix}${space?.[item.key as keyof Space]}`, '_blank')}
          />
        ))}
      </div>
    </div>
  );
}
