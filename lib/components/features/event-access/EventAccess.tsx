import { Event, EventJoinRequest, GetMyEventJoinRequestDocument } from '$lib/generated/backend/graphql';

import { attending } from '$lib/utils/event';
import { useQuery } from '$lib/request';
import { useSession } from '$lib/hooks/useSession';

import { SkeletonBox } from '$lib/components/core';

import { MyTickets } from './MyTickets';
import { ApprovalStatus } from './ApprovalStatus';
import { EventRegistration } from '../event-registration';

export function EventAccess({ event }: { event: Event }) {
  const session = useSession();
  const isAttending = attending(event, session?.user);

  const { data: requestData, loading: requestLoading } = useQuery(GetMyEventJoinRequestDocument, {
    variables: {
      event: event._id
    },
    skip: !session?.user || !event.approval_required,
  });

  if (requestLoading) return <SkeletonBox rows={4} />;

  if (isAttending) return <MyTickets event={event} />;

  if (requestData?.getMyEventJoinRequest) return <ApprovalStatus joinRequest={requestData.getMyEventJoinRequest as EventJoinRequest} />;

  return <EventRegistration event={event} />;
}
