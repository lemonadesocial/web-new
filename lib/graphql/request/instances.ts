import { GRAPHQL_URL } from "$lib/utils/constants";
import { InMemoryCache } from "./cache";
import { GraphqlClient } from "./client";

export const defaultClient  = new GraphqlClient({
  url: GRAPHQL_URL,
  cache: new InMemoryCache(),
  options: {
    credentials: 'include',
  }
});

export const metaverseClient  = new GraphqlClient({
  url: process.env.NEXT_PUBLIC_METAVERSE_HTTP_URL as string,
  cache: new InMemoryCache(),
});

export const walletClient  = new GraphqlClient({
  url: process.env.NEXT_PUBLIC_WALLET_HTTP_URL as string,
  cache: new InMemoryCache(),
  options: {
    credentials: 'include',
  }
});
