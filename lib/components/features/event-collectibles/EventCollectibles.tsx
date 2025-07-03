import { TokenComplex, TokensDocument } from "$lib/graphql/generated/metaverse/graphql";
import { useQuery } from "$lib/graphql/request";
import { Event, GetMyTicketsDocument, Ticket } from "$lib/graphql/generated/backend/graphql";
import { metaverseClient } from "$lib/graphql/request/instances";
import { GraphQLWSProvider } from "$lib/graphql/subscription";
import { getAssignedTicket } from "$lib/utils/event";
import { useMe } from "$lib/hooks/useMe";

import { CollectibleList } from "./CollectibleList";
import { usePoapOffers } from "./hooks";
import { useSession } from "$lib/hooks/useSession";

export function EventCollectibles({ event }: { event: Event }) {
  const me = useMe();
  const session = useSession();

  const { data: ticketsData } = useQuery(GetMyTicketsDocument, {
    variables: {
      event: event._id,
      withPaymentInfo: true
    },
    skip: !session
  });

  const tickets = ticketsData?.getMyTickets.tickets as Ticket[];
  const myTicket = getAssignedTicket(tickets, me?._id) || tickets?.[0];
  const ticketType = myTicket?.type;

  const offers = usePoapOffers(event, ticketType);

  const { data } = useQuery(
    TokensDocument,
    {
      variables: {
        where: {
          network_in: offers?.map(offer => offer.provider_network as string),
          contract_in: offers?.map(offer => offer.provider_id?.toLowerCase() as string),
          tokenId_eq: '0',
        },
      },
      skip: !offers?.length,
    },
    metaverseClient
  );

  if (!data?.tokens.length || !offers?.length) return null;

  return (
    <GraphQLWSProvider url={process.env.NEXT_PUBLIC_WALLET_WSS_URL as string}>
      <CollectibleList tokens={data.tokens as TokenComplex[]} offers={offers} />
    </GraphQLWSProvider>
  );
}
