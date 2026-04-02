import React from 'react';
import { format, isAfter, isBefore } from 'date-fns';

import { Avatar, Badge, Button, Card } from '$lib/components/core';
import { Event, SpaceTag, User } from '$lib/graphql/generated/backend/graphql';
import { generateUrl } from '$lib/utils/cnd';
import { convertFromUtcToTimezone } from '$lib/utils/date';
import { getEventCohosts, getEventPrice, isAttending } from '$lib/utils/event';
import { userAvatar } from '$lib/utils/user';

export function EventCardItem({
  item,
  tags = [],
  onClick,
  onManage,
  me,
}: {
  item: Event;
  tags?: SpaceTag[];
  onClick?: () => void;
  onManage?: React.MouseEventHandler<HTMLButtonElement>;
  me?: User | null;
}) {
  const users = getEventCohosts(item);
  const isHost = item.host === me?._id || users.map((i) => i._id).includes(me?._id);

  const status = React.useMemo(() => {
    if (!item) return;

    const startDate = new Date(item.start);
    const endDate = new Date(item.end);
    const today = new Date();

    if (isBefore(today, startDate)) return 'upcoming';
    if (isBefore(today, endDate)) return 'going';
    return 'ended';
  }, [item]);

  return (
    <Card.Root as="button" onClick={onClick} key={`event_${item.shortid}`} className="flex flex-col gap-3">
      <Card.Content className="flex gap-6">
        <div className="text-tertiary flex-1 w-43.25 flex flex-col gap-2">
          <div>
            <div className="flex gap-2 text-sm md:text-base font-medium">
              {isBefore(new Date(), item.end) && isAfter(new Date(), item.start) && (
                <div className="flex gap-2 items-center">
                  <div className="size-1.5 bg-danger-400 rounded-full motion-safe:animate-pulse" />
                  <span className="text-danger-400 uppercase">Live</span>
                  <div className="size-0.5 bg-quaternary rounded-full" />
                </div>
              )}
              <p>{format(convertFromUtcToTimezone(item.start, item.timezone), "MMM dd 'at' hh:mm a")}</p>
              {!item.published && <Badge title="Draft" color="var(--color-warning-400)" />}
            </div>

            <div className="flex gap-1.5 items-center">
              {item.private && (
                <div className="size-5 aspect-square bg-accent-400/16 rounded-full flex items-center justify-center">
                  <i aria-hidden="true" className="icon-sparkles text-accent-400 size-3" />
                </div>
              )}
              <p className="font-title text-lg md:text-xl font-semibold text-primary truncate">{item.title}</p>
            </div>

            <div className="flex gap-2 item-center">
              {item.external_url && item.external_hostname ? (
                <p className="font-medium text-tertiary text-sm md:text-base truncate">
                  {`By ${item.external_hostname}`}
                </p>
              ) : (
                !!users.length && (
                  <>
                    <div className="flex -space-x-1 overflow-hidden p-1 min-w-fit">
                      {users.map((p) => (
                        <Avatar
                          key={p?._id}
                          src={userAvatar(p as User)}
                          size="sm"
                          className="outline outline-background"
                        />
                      ))}
                    </div>

                    <p className="font-medium text-tertiary text-sm md:text-base truncate">
                      By{' '}
                      {users
                        .map((p) => p.display_name || p.name)
                        .join(', ')
                        .replace(/,(?=[^,]*$)/, ' & ')}
                    </p>
                  </>
                )
              )}
            </div>
          </div>

          {!!getLocation(item, me) && (
            <div className="flex flex-col gap-1">
              <div className="inline-flex items-center gap-2">
                <i aria-hidden="true" className="icon-location-outline size-4" />
                <span className="text-sm md:text-md truncate">{getLocation(item, me)}</span>
              </div>
            </div>
          )}

          {isHost && !!item.guests && (
            <div className="flex flex-col gap-1">
              <div className="inline-flex items-center gap-2">
                <i aria-hidden="true" className="icon-user-group-outline size-4" />
                <span className="text-sm md:text-md truncate">{item.guests} guests</span>
              </div>
            </div>
          )}

          {item.external_url && <Badge className="bg-quaternary text-tertiary" title="External" />}

          {!!tags.length && (
            <div className="flex gap-1.5 flex-wrap">
              {tags
                .filter((t) => t.targets?.includes(item._id))
                .map((t) => (
                  <Badge key={t._id} title={t.tag} color={t.color} className="truncate" />
                ))}
            </div>
          )}

          {getEventPrice(item) && (
            <Badge title={getEventPrice(item)} className="bg-success-500/[0.16] text-success-500" />
          )}

          {!isHost && (
            <div className="flex gap-2 items-center">
              {status === 'going' && (
                <>
                  <div className="bg-[#096] w-fit py-0.75 px-2 rounded-xs backdrop-blur-sm">
                    <p className="text-xs text-primary">Going</p>
                  </div>

                  <div className="text-tertiary bg-(--btn-tertiary) rounded-xs size-6 aspect-square flex items-center justify-center">
                    <i aria-hidden="true" className="icon-ticket size-3.5" />
                  </div>
                </>
              )}
            </div>
          )}

          {typeof onManage === 'function' && (
            <div>
              <Button variant="tertiary" size="xs" iconLeft="icon-gears" onClick={onManage}>
                Manage
              </Button>
            </div>
          )}
        </div>

        {!!item?.new_new_photos_expanded?.[0] && (
          <img
            className="aspect-square object-contain rounded-lg size-22.5 md:size-30"
            src={generateUrl(item?.new_new_photos_expanded[0], {
              resize: { height: 120, width: 120, fit: 'cover' },
            })}
            loading="lazy"
            alt={item.title}
          />
        )}
      </Card.Content>
    </Card.Root>
  );
}

function getLocation(event?: Event | null, me?: User | null) {
  const attending = me?._id && event ? isAttending(event, me?._id) : false;

  if (event?.address) {
    return attending
      ? event.address.title
      : [event.address?.city || event.address?.region, event.address?.country].filter(Boolean).join(', ');
  }

  if (event?.virtual_url) return 'Virtual';

  return '';
}
