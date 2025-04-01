import { attending, getAssignedTicket } from "$lib/utils/event";
import { useSession } from "./useSession";
import { useClient, useMutation, useQuery } from "$lib/request";
import { AcceptEventDocument, AssignTicketsDocument, Event, GetEventDocument, GetTicketsDocument, Ticket } from "$lib/generated/backend/graphql";
import { useMe } from "./useMe";
import { groupBy } from "lodash";

export const useTickets = (event: Event) => {
  const session = useSession();
  const me = useMe();
  const isAttending = attending(event, session?.user);

  const [acceptEvent] = useMutation(AcceptEventDocument);
  const [assignTickets] = useMutation(AssignTicketsDocument);

  const { client } = useClient();

  const joinEvent = () => {
    acceptEvent({ variables: { id: event._id } });

    if (!session?.user) return;

    // client.writeFragment({
    //   id: `Event:${event._id}`,
    //   data: {
    //     ...event,
    //     accepted: [...(event.accepted || []), session.user],
    //   },
    // });

    client.refetchQuery({
      query: GetEventDocument,
      variables: { id: event._id },
    });
  };

  useQuery(GetTicketsDocument, {
    variables: {
      event: event._id,
      user: session?.user,
    },
    skip: !session?.user,
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
