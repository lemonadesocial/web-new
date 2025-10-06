import { formatDistanceToNow } from 'date-fns';
import { useRef, useEffect, useState } from 'react';
import clsx from 'clsx';

import { Avatar, Button, drawer, Skeleton } from '$lib/components/core';
import { GetEventJoinRequestsQuery } from '$lib/graphql/generated/backend/graphql';
import { userAvatar } from '$lib/utils/user';

import { useEventRequest } from '../hooks';
import { GuestDetailsDrawer } from '../drawers/GuestDetailsDrawer';

type EventJoinRequestFromQuery = GetEventJoinRequestsQuery['getEventJoinRequests']['records'][0];

interface PendingApprovalListProps {
  pendingRequests: EventJoinRequestFromQuery[];
  eventId: string;
  onRefetch?: () => void;
}

export function PendingApprovalList({ pendingRequests, eventId, onRefetch }: PendingApprovalListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  const {
    approve,
    decline,
    loading: requestLoading,
  } = useEventRequest(eventId, () => {
    onRefetch?.();
  });

  useEffect(() => {
    if (containerRef.current) {
      const width = containerRef.current.offsetWidth;
      setContainerWidth(width);
    }
  }, [pendingRequests]);

  const handleApprove = (requestId: string) => {
    approve([requestId]);
  };

  const handleDecline = (requestId: string) => {
    decline([requestId]);
  };

  const handleGuestDetail = (email: string) => {
    drawer.open(GuestDetailsDrawer, {
      props: {
        email,
        event: eventId,
      },
    });
  };

  const isContainerNarrow = containerWidth < 500;
  const isContainerVeryNarrow = containerWidth < 400;

  return (
    <div ref={containerRef} className="rounded-md border border-card-border bg-card">
      <div className="divide-y divide-(--color-divider)">
        {pendingRequests.map((request) => {
          const user = request.user_expanded || request.non_login_user;
          const name = user?.display_name || user?.name;
          const email = request.email || (user as any)?.email;

          return (
            <div key={request._id} className="flex items-center justify-between px-4 py-3 gap-2">
              <div className="flex items-center gap-3 flex-1">
                <Avatar src={userAvatar(user as any)} className="size-5" />
                <div className="flex flex-col flex-1 gap-2">
                  <div className="flex justify-between relative">
                    <div className={clsx('flex-1 flex w-1', isContainerNarrow ? 'flex-col' : 'gap-2 items-center')}>
                      <p className="truncate">{name}</p>
                      <p className="text-tertiary text-sm truncate">{email}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {!isContainerVeryNarrow && (
                  <span className="text-sm text-tertiary whitespace-nowrap">
                    {formatDistanceToNow(new Date(request.created_at), { addSuffix: !isContainerNarrow })}
                  </span>
                )}

                <div className="flex items-center gap-2">
                  <Button
                    variant="tertiary"
                    size="xs"
                    icon="icon-contract"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGuestDetail(email);
                    }}
                  />
                  <Button
                    variant="danger"
                    size="xs"
                    icon="icon-x"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDecline(request._id);
                    }}
                    disabled={requestLoading}
                  />
                  <Button
                    variant="success"
                    size="xs"
                    icon="icon-done"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApprove(request._id);
                    }}
                    disabled={requestLoading}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
