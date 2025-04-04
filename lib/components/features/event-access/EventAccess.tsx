import { groupBy } from 'lodash';

import { AcceptEventDocument, AssignTicketsDocument, Event, EventJoinRequest, GetEventDocument, GetMyEventJoinRequestDocument, GetTicketsDocument, Ticket } from '$lib/generated/backend/graphql';

import { attending, getAssignedTicket } from '$lib/utils/event';
import { useClient, useMutation, useQuery } from '$lib/request';
import { SkeletonBox } from '$lib/components/core';
import { useSession } from '$lib/hooks/useSession';
import { useMe } from '$lib/hooks/useMe';

import { MyTickets } from './MyTickets';
import { ApprovalStatus } from './ApprovalStatus';
import { EventRegistration } from '../event-registration';

export function EventAccess({ event }: { event: Event }) {
  const session = useSession();
  const isAttending = attending(event, session?.user);
  const me = useMe();

  const { data: requestData, loading: requestLoading } = useQuery(GetMyEventJoinRequestDocument, {
    variables: {
      event: event._id
    },
    skip: !session?.user || !event.approval_required,
  });

  const [acceptEvent] = useMutation(AcceptEventDocument);
  const [assignTickets] = useMutation(AssignTicketsDocument);
  const { client } = useClient();

  const { data: ticketsData, loading: ticketsLoading } = useQuery(GetTicketsDocument, {
    variables: {
      event: event?._id,
      user: session?.user,
    },
    skip: !session?.user || !event?._id,
    onComplete: async (data) => {
      if (isAttending || !data?.getTickets.length || !session?.user) return;

      const assignedTicket = getAssignedTicket(data.getTickets as Ticket[], session.user, me?.email as string);

      if (assignedTicket) {
        joinEvent();
        return;
      }

      const ticketsByType = groupBy(data.getTickets, 'type');
      const ticketTypes = Object.keys(ticketsByType);

      if (ticketTypes.length === 1) {
        await assignTickets({
          variables: {
            input: {
              event: event._id,
              assignees: [{ ticket: data.getTickets[0]._id, user: session.user }]
            }
          }
        });

        joinEvent();
        return;
      }
    }
  });

  const joinEvent = () => {
    acceptEvent({ variables: { id: event._id } });

    if (!session?.user) return;

    client.writeQuery({
      query: GetEventDocument,
      variables: { id: event._id },
      data: {
        getEvent: {
          ...event,
          accepted: [...(event.accepted || []), session.user],
        },
      },
    });
  };

  if (requestLoading || ticketsLoading) return <SkeletonBox rows={4} />;

  if (ticketsData?.getTickets.length) return <MyTickets tickets={ticketsData.getTickets as Ticket[]} />;

  if (requestData?.getMyEventJoinRequest) return <ApprovalStatus joinRequest={requestData.getMyEventJoinRequest as EventJoinRequest} />;

  return <EventRegistration event={event} />;
}
