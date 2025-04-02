import { groupBy } from "lodash";

import { attending, getAssignedTicket } from "$lib/utils/event";
import { useSession } from "./useSession";
import { useClient, useMutation, useQuery } from "$lib/request";
import { AcceptEventDocument, AssignTicketsDocument, Event, GetEventDocument, GetTicketsDocument, Ticket } from "$lib/generated/backend/graphql";
import { useMe } from "./useMe";

export const useTickets = (event: Event) => {
  const session = useSession();
  const me = useMe();
  const isAttending = event ? attending(event, session?.user) : false;

  const [acceptEvent] = useMutation(AcceptEventDocument);
  const [assignTickets] = useMutation(AssignTicketsDocument);

  const { client } = useClient();

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

  useQuery(GetTicketsDocument, {
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
};
