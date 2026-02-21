'use client';
import React from 'react';
import { useSetAtom } from 'jotai';

import { getClient } from '$lib/graphql/request';
import { ListChainsDocument } from '$lib/graphql/generated/backend/graphql';
import { listChainsAtom } from '$lib/jotai/chains';

export function useListChains() {
  const setListChains = useSetAtom(listChainsAtom);
  const [loading, setLoading] = React.useState(true);
  const client = getClient();

  React.useEffect(() => {
    client.query({
      query: ListChainsDocument,
    }).then(({ data }) => {
      if (!data?.listChains) throw new Error('Failed to fetch list chains');

      setListChains(data.listChains);
      setLoading(false);
    }).catch(error => {
      setLoading(false);
      throw error;
    });
  }, []);

  return loading;
}
