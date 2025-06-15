'use client';
import { EventCohostRequestState, GetEventCohostInvitesDocument, DecideEventCohostRequestDocument, GetEventDocument, Event } from '$lib/graphql/generated/backend/graphql';
import { useQuery, useMutation } from '$lib/graphql/request';
import { Button, toast } from '$lib/components/core';
import { useMe } from '$lib/hooks/useMe';

interface Props {
  event: Event;
}

export function PendingCohostRequest({ event }: Props) {
  const me = useMe();
  const { data } = useQuery(GetEventCohostInvitesDocument, {
    variables: { input: { event: event._id, state: EventCohostRequestState.Pending } },
    skip: !me
  });

  const [decideEventCohostRequest, { loading }] = useMutation(DecideEventCohostRequestDocument, {
    onComplete: (client) => {
      toast.success('Cohost request accepted');
      
      client.writeQuery({
        query: GetEventCohostInvitesDocument,
        variables: { input: { event: event._id, state: EventCohostRequestState.Pending } },
        data: {
          getEventCohostInvites: [],
          __typename: 'Query'
        }
      });

      const updatedEvent = {
        ...event,
        cohosts: [...(event.cohosts || []), me?._id]
      };

      client.writeQuery({
        query: GetEventDocument,
        variables: { id: event._id },
        data: { getEvent: updatedEvent }
      });
    }
  });

  const inviteData = data?.getEventCohostInvites?.[0];

  const handleAcceptCohost = () => {
    decideEventCohostRequest({ variables: { input: { event: event._id, decision: true } } });
  };

  if (!inviteData) return null;

  return (
    <div className="flex gap-2 items-center px-3.5 py-2 border border-card-border bg-accent-400/16 rounded-md">
      <p className="text-accent-500 flex-1">You&apos;ve been invited to co-host this event</p>
      <Button
        variant="primary"
        size="sm"
        className="rounded-full"
        loading={loading}
        onClick={handleAcceptCohost}
      >
        Accept
      </Button>
    </div>
  );
}
