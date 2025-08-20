import Link from 'next/link';

import { Avatar, Divider } from '$lib/components/core';
import { Event, User } from '$lib/graphql/generated/backend/graphql';
import { userAvatar } from '$lib/utils/user';
import { LEMONADE_DOMAIN } from '$lib/utils/constants';
import { getEventCohosts } from '$lib/utils/event';

import { COMMUNITY_SOCIAL_LINKS } from '../community/constants';

export function HostedBySection({ event }: { event: Event }) {
  if (!event) return null;

  const hosts = getEventCohosts(event);

  if (!hosts.length) return null;

  return (
    <div className="flex flex-col gap-2 w-full">
      <p className="text-secondary text-sm">Hosted by</p>
      <Divider className="h-1 w-full mb-2" />
      {hosts.map((u) => (
        <div key={u._id} className="flex gap-3">
          <Avatar src={userAvatar(u)} />
          <Link className="hover:text-accent-400 flex-1 font-medium" href={`${LEMONADE_DOMAIN}/u/${u.username || u._id}`} target="_blank">
            {u.display_name || u.name}
          </Link>
          <div className="flex items-center gap-3">
            {COMMUNITY_SOCIAL_LINKS.filter((item) => u[item.key as keyof User]).map((item) => (
              <i
                key={item.key}
                aria-label={item.key}
                className={`${item.icon} cursor-pointer text-tertiary hover:text-primary size-5`}
                onClick={() => window.open(`${item.prefix}${u[item.key as keyof User]}`, '_blank')}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
