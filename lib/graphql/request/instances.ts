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

export const lemonheadsClient  = new GraphqlClient({
  url: process.env.NEXT_PUBLIC_LEMONHEADS_INDEXER_URL as string,
  cache: new InMemoryCache(),
});

export function getCoinClient() {
  return new GraphqlClient({
    url: process.env.NEXT_PUBLIC_COIN_INDEXER_URL as string,
    cache: new InMemoryCache(),
  });
}

export const coinClient = getCoinClient();
export const usernameClient = new GraphqlClient({
  url: process.env.NEXT_PUBLIC_USERNAME_INDEXER as string,
  cache: new InMemoryCache(),
});
