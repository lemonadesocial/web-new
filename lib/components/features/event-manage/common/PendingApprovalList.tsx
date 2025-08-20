import { formatDistanceToNow } from 'date-fns';
import { useMemo } from 'react';

import { Avatar, Button, drawer } from '$lib/components/core';
import { Event, EventJoinRequestState, GetEventJoinRequestsDocument } from '$lib/graphql/generated/backend/graphql';
import { useQuery } from '$lib/graphql/request';
import { userAvatar } from '$lib/utils/user';

import { useEventRequest } from '../hooks';
import { GuestDetailsDrawer } from '../drawers/GuestDetailsDrawer';

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

  const {
    approve,
    decline,
    loading: requestLoading,
  } = useEventRequest(event._id, () => {
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

  const handleGuestDetail = (email: string) => {
    drawer.open(GuestDetailsDrawer, {
      props: {
        email,
        event: event._id,
      },
    });
  };

  return (
    <div className="rounded-md border border-card-border bg-card">
      <div className="divide-y divide-(--color-divider)">
        {pendingRequests.map((request) => {
          const user = request.user_expanded || request.non_login_user;
          const name = user?.display_name || user?.name;
          const email = request.email || (user as any)?.email;

          return (
            <div key={request._id} className="flex items-center justify-between px-4 py-3">
              <div className="flex md:items-center gap-3 flex-1">
                <Avatar src={userAvatar(user as any)} className="size-7 md:size-5" />
                <div className="flex flex-col flex-1 gap-2">
                  <div className="flex justify-between w-full">
                    <div className="flex-1 flex flex-col md:flex-row md:gap-2 md:items-center">
                      <p className="truncate">{name}</p>
                      <p className="text-tertiary truncate">{email}</p>
                    </div>

                    <span className="block md:hidden text-sm text-tertiary whitespace-nowrap">
                      {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <div className="flex md:hidden gap-2">
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
                      iconLeft="icon-x"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDecline(request._id);
                      }}
                      disabled={requestLoading}
                    >
                      Decline
                    </Button>
                    <Button
                      variant="success"
                      size="xs"
                      className="w-full"
                      iconLeft="icon-done"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApprove(request._id);
                      }}
                      disabled={requestLoading}
                    >
                      Approve
                    </Button>
                  </div>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-3">
                <span className="text-sm text-tertiary whitespace-nowrap">
                  {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                </span>

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
