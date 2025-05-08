import { groupBy } from 'lodash';
import { useEffect } from 'react';

import { AcceptEventDocument, AssignTicketsDocument, Event, EventJoinRequest, GetEventDocument, GetMyEventJoinRequestDocument, GetMyTicketsDocument, PaymentRefundInfo, Ticket } from '$lib/graphql/generated/backend/graphql';

import { attending, getAssignedTicket } from '$lib/utils/event';
import { useClient, useMutation, useQuery } from '$lib/graphql/request';
import { SkeletonCard } from '$lib/components/core';
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
  const [assignTickets, { loading: loadingAssignTickets }] = useMutation(AssignTicketsDocument, {
    onComplete() {
      joinEvent();
      refetchTickets();
    }
  });
  const { client } = useClient();

  const { data: ticketsData, loading: ticketsLoading, refetch: refetchTickets } = useQuery(GetMyTicketsDocument, {
    variables: {
      event: event?._id,
      withPaymentInfo: true
    },
    skip: !session?.user || !event?._id,
  });

  useEffect(() => {
    if (isAttending || !ticketsData?.getMyTickets.tickets.length || !session?.user || loadingAssignTickets || ticketsLoading) return;

    const assignedTicket = getAssignedTicket(ticketsData.getMyTickets.tickets as Ticket[], session.user, me?.email as string);

    if (assignedTicket) {
      joinEvent();
      return;
    }

    const ticketsByType = groupBy(ticketsData.getMyTickets.tickets, 'type');
    const ticketTypes = Object.keys(ticketsByType);
  
    if (ticketTypes.length === 1) {
      assignTickets({
        variables: {
          input: {
            event: event._id,
            assignees: [{ ticket: ticketsData.getMyTickets.tickets[0]._id, user: session.user }]
          }
        }
      });
    }
  }, [ticketsData, isAttending, loadingAssignTickets, ticketsLoading]);

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

  if (requestLoading || ticketsLoading) return <SkeletonCard />;

  if (ticketsData?.getMyTickets.tickets.length) return (
    <MyTickets
      tickets={ticketsData.getMyTickets.tickets as Ticket[]}
      payments={ticketsData.getMyTickets.payments as PaymentRefundInfo[]}
      event={event}
    />
  );

  if (requestData?.getMyEventJoinRequest) return <ApprovalStatus joinRequest={requestData.getMyEventJoinRequest as EventJoinRequest} />;

  return <EventRegistration event={event} />;
}
