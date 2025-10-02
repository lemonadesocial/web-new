'use client';
import React from 'react';
import { Button, Card, toast } from '$lib/components/core';
import {
  Address,
  DecideSpaceEventRequestsDocument,
  EventJoinRequestState,
  GetSpaceEventRequestsDocument,
  SpaceEventRequest,
  SpaceEventRequestState,
} from '$lib/graphql/generated/backend/graphql';
import { useMutation, useQuery } from '$lib/graphql/request';
import { formatWithTimezone } from '$lib/utils/date';
import { getEventAddress } from '$lib/utils/event';
import { CommonSection, SmallCommonSection } from './shared';

interface Props {
  spaceId: string;
  /** the number events want to show */
  total?: number;
  /** using for render small or default CommonSection */
  isCommonSection?: boolean;
}
export function PendingApprovalEvents({ spaceId, isCommonSection }: Props) {
  const [state, setState] = React.useState<{ id: string; action: SpaceEventRequestState; submitting: boolean }>();
  const { data, refetch } = useQuery(GetSpaceEventRequestsDocument, {
    variables: { space: spaceId, skip: 0, limit: 2, state: EventJoinRequestState.Pending },
    skip: !spaceId,
    fetchPolicy: 'cache-and-network',
  });

  const eventRequests = (data?.getSpaceEventRequests.records.filter((item) => item.event_expanded) ||
    []) as SpaceEventRequest[];

  const [decide] = useMutation(DecideSpaceEventRequestsDocument, {
    onComplete: async () => {
      await refetch();
      setState(undefined);
    },
  });

  if (!eventRequests.length) return null;

  const handleDecide = async (event: SpaceEventRequest, decision: SpaceEventRequestState) => {
    setState({ id: event._id, action: decision, submitting: true });
    const { error } = await decide({
      variables: {
        input: {
          space: spaceId,
          decision,
          requests: [event._id],
        },
      },
    });

    if (error) {
      toast.error(`Cannot ${decision} at this time.`);
      setState(undefined);
      return;
    }

    let _action = 'pending';
    switch (decision) {
      case SpaceEventRequestState.Approved:
        _action = 'added';
        break;
      case SpaceEventRequestState.Declined:
        _action = 'removed';
        break;

      default:
        break;
    }

    toast.success(`'${event.event_expanded?.title}' has been ${_action} to the space`);
  };

  const Comp = isCommonSection ? CommonSection : SmallCommonSection;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between mb-1">
        <div className="flex gap-2 items-center">
          <p>Pending Approval</p>
          <div className="size-6 aspect-square rounded-full inline-flex items-center justify-center bg-primary/[0.08] text-tertiary">
            <p className="text-xs">{data?.getSpaceEventRequests.total}</p>
          </div>
        </div>
        <Button variant="tertiary-alt" size="sm" iconRight="icon-chevron-right">
          All Submissions
        </Button>
      </div>
      {eventRequests.map((item) => (
        <Card.Root key={item._id}>
          <Card.Content className="flex gap-6">
            <div className="flex-1 flex flex-col gap-2">
              <p>{item.event_expanded?.title}</p>

              <div className="flex flex-col text-tertiary gap-1">
                <div className="flex gap-2 items-center">
                  <i className="icon-calendar size-4 aspect-square" />
                  <p className="text-sm">
                    {formatWithTimezone(
                      item.event_expanded?.start,
                      "EEE, MMM dd 'at' hh:mm a",
                      item.event_expanded?.timezone,
                    )}
                  </p>
                </div>
                {getEventAddress(item.event_expanded?.address as Address) && (
                  <div className="flex gap-2 items-center">
                    <i className="icon-location-outline size-4 aspect-square" />
                    <p className="text-sm">{getEventAddress(item.event_expanded?.address as Address)}</p>
                  </div>
                )}
                <div className="flex gap-2 items-center">
                  <i className="icon-user size-4 aspect-square" />
                  <p className="text-sm">
                    Submitted by {item.created_by_expanded?.name || item.created_by_expanded?.display_name}{' '}
                    {item.created_by_expanded?.email && `(${item.created_by_expanded?.email})`}
                  </p>
                </div>
                {!!item.event_expanded?.guests && !isNaN(item.event_expanded?.guests) && (
                  <div className="flex gap-2 items-center">
                    <i className="icon-user-group-outline size-4 aspect-square" />
                    <p className="text-sm">
                      {item.event_expanded?.guests} {item.event_expanded.guests > 1 ? 'guests' : 'guest'}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                iconLeft="icon-done"
                size="sm"
                variant="success"
                disabled={state?.id === item._id && state?.submitting}
                loading={
                  state?.id === item._id && state?.action === SpaceEventRequestState.Approved && state.submitting
                }
                onClick={() => handleDecide(item, SpaceEventRequestState.Approved)}
              >
                Approve
              </Button>
              <Button
                iconLeft="icon-x"
                size="sm"
                variant="danger"
                disabled={state?.id === item._id && state?.submitting}
                loading={
                  state?.id === item._id && state?.action === SpaceEventRequestState.Declined && state.submitting
                }
                onClick={() => handleDecide(item, SpaceEventRequestState.Declined)}
              >
                Remove
              </Button>
            </div>
          </Card.Content>
        </Card.Root>
      ))}
    </div>
  );
}
