import { TokenComplex, TokensDocument } from "$lib/graphql/generated/metaverse/graphql";
import { useQuery } from "$lib/graphql/request";
import { Event } from "$lib/graphql/generated/backend/graphql";
import { metaverseClient } from "$lib/graphql/request/instances";
import { GraphQLWSProvider } from "$lib/graphql/subscription";

import { CollectibleList } from "./CollectibleList";

export function EventCollectibles({ event }: { event: Event }) {
  const offers = event.offers?.filter(offer => offer.provider === 'poap');

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
