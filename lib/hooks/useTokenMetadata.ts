'use client';

import { useQuery } from '@tanstack/react-query';

import { getTokenMeta } from '$lib/utils/crypto';

export function useTokenMetadata(chainId?: string | null, tokenAddress?: string | null) {
  const normalizedAddress = tokenAddress?.toLowerCase();

  const { data, isLoading, error } = useQuery({
    queryKey: ['token-metadata', chainId, normalizedAddress],
    queryFn: () => getTokenMeta(chainId!, tokenAddress!),
    enabled: Boolean(chainId && tokenAddress),
  });

  return {
    tokenMetadata: data ?? null,
    isLoading,
    error,
  };
}

