import { formatDistanceToNow } from 'date-fns';
import { useMemo } from 'react';

import { Avatar, Button, drawer } from '$lib/components/core';
import { Event, EventJoinRequestState, GetEventJoinRequestsDocument } from '$lib/graphql/generated/backend/graphql';
import { useQuery } from '$lib/graphql/request';
import { userAvatar } from '$lib/utils/user';

import { useEventRequest } from './hooks';
import { GuestDetailsDrawer } from './drawers/GuestDetailsDrawer';

interface PendingApprovalListProps {
  event: Event;
  limit?: number;
}

export function PendingApprovalList({ event, limit = 3 }: PendingApprovalListProps) {
  const { data, refetch } = useQuery(GetEventJoinRequestsDocument, {
    variables: {
      event: event._id,
      state: EventJoinRequestState.Pending,
      skip: 0,
      limit,
    },
  });

  const { approve, decline, loading: requestLoading } = useEventRequest(event._id, () => {
    refetch();
  });

  const pendingRequests = useMemo(() => {
    return data?.getEventJoinRequests.records || [];
  }, [data]);

  const handleApprove = (requestId: string) => {
    approve([requestId]);
  };

  const handleDecline = (requestId: string) => {
    decline([requestId]);
  };

  if (!pendingRequests.length) return;

  return (
    <div className="rounded-md border border-card-border bg-card">
      <div className="divide-y divide-(--color-divider)">
        {pendingRequests.map((request) => {
          const user = request.user_expanded || request.non_login_user;
          const name = user?.display_name || user?.name;
          const email = request.email || (user as any)?.email;

          return (
            <div
              key={request._id}
              className="flex items-center justify-between px-4 py-3"
            >
              <div className="flex items-center gap-3 flex-1">
                <Avatar
                  src={userAvatar(user as any)}
                  className="size-5"
                />
                <div className="flex-1 flex gap-2 items-center">
                  <p className="truncate">{name}</p>
                  <p className="text-tertiary truncate">{email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-tertiary whitespace-nowrap">
                  {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                </span>

                <div className="flex gap-1">
                  <Button
                    variant="tertiary"
                    size="xs"
                    icon="icon-contract"
                    onClick={(e) => {
                      e.stopPropagation();
                      drawer.open(GuestDetailsDrawer, {
                        props: {
                          email,
                          event: event._id,
                        },
                      });
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
