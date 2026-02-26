import { GRAPHQL_URL } from '$lib/utils/constants';
import { InMemoryCache } from './cache';
import { GraphqlClient } from './client';

const AI_GRAPHQL_PROXY_PATH = '/api/ai/graphql';

function resolveAiChatUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_AI_API_HTTP;
  const isBrowser = typeof window !== 'undefined';
  const proxyUrl = isBrowser ? `${window.location.origin}${AI_GRAPHQL_PROXY_PATH}` : AI_GRAPHQL_PROXY_PATH;

  if (!configuredUrl) {
    return proxyUrl;
  }

  if (!isBrowser) {
    return configuredUrl;
  }

  try {
    const parsed = new URL(configuredUrl, window.location.origin);
    return parsed.origin === window.location.origin ? parsed.toString() : proxyUrl;
  } catch {
    return proxyUrl;
  }
}

export const defaultClient = new GraphqlClient({
  url: GRAPHQL_URL,
  cache: new InMemoryCache(),
  options: {
    credentials: 'include',
  },
});

export const metaverseClient = new GraphqlClient({
  url: process.env.NEXT_PUBLIC_METAVERSE_HTTP_URL as string,
  cache: new InMemoryCache(),
});

export const walletClient = new GraphqlClient({
  url: process.env.NEXT_PUBLIC_WALLET_HTTP_URL as string,
  cache: new InMemoryCache(),
  options: {
    credentials: 'include',
  },
});

export const lemonheadsClient = new GraphqlClient({
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

export const aiChatClient = new GraphqlClient({
  url: resolveAiChatUrl(),
  options: {
    credentials: 'include',
  },
});
