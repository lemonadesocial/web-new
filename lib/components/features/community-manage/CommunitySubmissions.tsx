'use client';

import React from 'react';
import { Avatar, Button, Skeleton, toast } from '$lib/components/core';
import { CardTable } from '$lib/components/core/table';
import {
  DecideSpaceEventRequestsDocument,
  EventJoinRequestState,
  GetSpaceEventRequestsDocument,
  Space,
  SpaceEventRequest,
  SpaceEventRequestState,
} from '$lib/graphql/generated/backend/graphql';
import { useMutation, useQuery } from '$lib/graphql/request';
import { formatWithTimezone } from '$lib/utils/date';
import { generateUrl } from '$lib/utils/cnd';
import { randomEventDP, userAvatar } from '$lib/utils/user';
import { format } from 'date-fns';
import { Segment } from '$lib/components/core';
import { Event } from '$lib/graphql/generated/backend/graphql';

const LIMIT = 15;

interface Props {
  space: Space;
}

export function CommunitySubmissions({ space }: Props) {
  const [skip, setSkip] = React.useState(0);
  const [stateFilter, setStateFilter] = React.useState<string>(EventJoinRequestState.Pending);
  const [decideState, setDecideState] = React.useState<{
    id: string;
    action: SpaceEventRequestState;
    submitting: boolean;
  }>();

  const state = stateFilter ? (stateFilter as EventJoinRequestState) : undefined;

  const { data, loading, refetch } = useQuery(GetSpaceEventRequestsDocument, {
    variables: {
      space: space._id,
      skip,
      limit: LIMIT,
      state,
    },
    skip: !space._id,
  });

  const [decide] = useMutation(DecideSpaceEventRequestsDocument, {
    onComplete: async () => {
      await refetch();
      setDecideState(undefined);
    },
  });

  const eventRequests = (data?.getSpaceEventRequests.records.filter((item) => item.event_expanded) ||
    []) as SpaceEventRequest[];
  const total = data?.getSpaceEventRequests.total || 0;

  const handleDecide = async (event: SpaceEventRequest, decision: SpaceEventRequestState) => {
    setDecideState({ id: event._id, action: decision, submitting: true });
    const { error } = await decide({
      variables: {
        input: {
          space: space._id,
          decision,
          requests: [event._id],
        },
      },
    });

    if (error) {
      toast.error(`Cannot ${decision} at this time.`);
      setDecideState(undefined);
      return;
    }

    const actionLabel =
      decision === SpaceEventRequestState.Approved
        ? 'added'
        : decision === SpaceEventRequestState.Declined
          ? 'removed'
          : 'updated';
    toast.success(`'${event.event_expanded?.title}' has been ${actionLabel}`);
  };

  return (
    <div className="page bg-transparent! mx-auto py-7 px-4 md:px-0">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-xl font-semibold">
            Submissions {!!total && `(${total})`}
          </h3>
          <Segment
            size="sm"
            items={[
              { label: 'Pending', value: EventJoinRequestState.Pending },
              { label: 'Approved', value: EventJoinRequestState.Approved },
              { label: 'Declined', value: EventJoinRequestState.Declined },
            ]}
            selected={stateFilter}
            onSelect={(item) => {
              setStateFilter(item.value as string);
              setSkip(0);
            }}
          />
        </div>

        <CardTable.Root loading={loading} data={eventRequests}>
          <CardTable.Header className="px-4 py-3">
            <div className="flex gap-4 items-center flex-1 min-w-0">
              <p className="flex-1 min-w-0 text-sm text-tertiary">Event</p>
              <p className="w-[18%] min-w-0 shrink-0 hidden lg:block text-sm text-tertiary">Starts On</p>
              <p className="w-[22%] min-w-0 shrink-0 hidden md:block text-sm text-tertiary">Submitted By</p>
              <p className="w-[12%] min-w-0 shrink-0 hidden lg:block text-sm text-tertiary">Submitted On</p>
              <div className="w-[13%] min-w-18 shrink-0" />
            </div>
          </CardTable.Header>

          <CardTable.Loading rows={5}>
            <Skeleton className="size-8 rounded-md" animate />
            <Skeleton className="h-5 w-32" animate />
            <Skeleton className="h-5 w-24" animate />
            <Skeleton className="h-5 w-20" animate />
          </CardTable.Loading>

          <CardTable.EmptyState>
            <div className="flex flex-col gap-5 pt-12 pb-20 items-center justify-center text-tertiary">
              <i aria-hidden="true" className="icon-calendar size-44 md:size-46 text-quaternary" />
              <div className="space-y-2 text-center">
                <h3 className="text-xl font-semibold">No Submissions</h3>
                <p>
                  {stateFilter
                    ? `No ${stateFilter.toLowerCase()} submissions.`
                    : 'When members submit events to your community, they will appear here.'}
                </p>
              </div>
            </div>
          </CardTable.EmptyState>

          {eventRequests.map((item) => (
            <SubmissionRow
              key={item._id}
              item={item}
              decideState={decideState}
              onDecide={handleDecide}
            />
          ))}

          {total > LIMIT && (
            <CardTable.Pagination
              skip={skip}
              limit={LIMIT}
              total={total}
              onPrev={() => setSkip((prev) => Math.max(0, prev - LIMIT))}
              onNext={() => setSkip((prev) => prev + LIMIT)}
            />
          )}
        </CardTable.Root>
      </div>
    </div>
  );
}

function SubmissionRow({
  item,
  decideState,
  onDecide,
}: {
  item: SpaceEventRequest;
  decideState?: { id: string; action: SpaceEventRequestState; submitting: boolean };
  onDecide: (item: SpaceEventRequest, decision: SpaceEventRequestState) => void;
}) {
  const event = item.event_expanded as Event & { shortid?: string } | undefined;
  const photo = event?.new_new_photos_expanded?.[0];
  const eventUrl = event?.shortid ? `/e/${event.shortid}` : undefined;

  return (
    <CardTable.Row>
      <div className="flex gap-4 items-center px-4 py-3 min-w-0">
        <div
          className="flex gap-3 items-center flex-1 min-w-0 cursor-pointer hover:opacity-80"
          onClick={() => eventUrl && window.open(eventUrl, '_blank')}
          onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ' ') && eventUrl) {
              e.preventDefault();
              window.open(eventUrl, '_blank');
            }
          }}
          role={eventUrl ? 'button' : undefined}
          tabIndex={eventUrl ? 0 : undefined}
        >
          <img
            src={
              photo
                ? generateUrl(photo, { resize: { width: 40, height: 40, fit: 'cover' } })
                : randomEventDP(event?._id)
            }
            alt=""
            className="size-5 rounded-sm border object-cover shrink-0"
          />
          <p className="truncate">{event?.title}</p>
        </div>

        <div className="hidden lg:block w-[18%] min-w-0 shrink-0">
          <p className="text-tertiary">
            {event?.start &&
              formatWithTimezone(event.start, 'MMM d, h:mm a', event.timezone || undefined)}
          </p>
        </div>

        <div className="hidden md:flex gap-2 items-center w-[22%] min-w-0 shrink-0">
          <Avatar
            className="size-5 shrink-0"
            src={userAvatar(item.created_by_expanded)}
          />
          <p className="truncate">
            {item.created_by_expanded?.name ||
              item.created_by_expanded?.display_name ||
              'Anonymous'}
          </p>
        </div>

        <div className="hidden lg:block w-[12%] min-w-0 shrink-0">
          <p className="text-tertiary text-sm">
            {format(new Date(item.created_at), 'MMM d, h:mm a')}
          </p>
        </div>

        <div className="flex gap-1 w-[13%] min-w-18 shrink-0 justify-end" onClick={(e) => e.stopPropagation()}>
          {item.state === SpaceEventRequestState.Pending && (
            <>
              <Button
                variant="danger"
                size="xs"
                className="!p-1.5 !min-w-0"
                disabled={decideState?.id === item._id && decideState?.submitting}
                loading={
                  decideState?.id === item._id &&
                  decideState?.action === SpaceEventRequestState.Declined &&
                  decideState.submitting
                }
                onClick={(e) => {
                  e.stopPropagation();
                  onDecide(item, SpaceEventRequestState.Declined);
                }}
              >
                <i aria-hidden="true" className="icon-x size-4" />
              </Button>
              <Button
                variant="success"
                size="xs"
                className="!p-1.5 !min-w-0"
                disabled={decideState?.id === item._id && decideState?.submitting}
                loading={
                  decideState?.id === item._id &&
                  decideState?.action === SpaceEventRequestState.Approved &&
                  decideState.submitting
                }
                onClick={(e) => {
                  e.stopPropagation();
                  onDecide(item, SpaceEventRequestState.Approved);
                }}
              >
                <i aria-hidden="true" className="icon-done size-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </CardTable.Row>
  );
}
