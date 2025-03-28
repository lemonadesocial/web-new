import React from 'react';
import { useAtom } from 'jotai';

import { getClient } from '$lib/request';
import { ListChainsDocument } from '$lib/generated/backend/graphql';
import { listChainsAtom } from '$lib/jotai/chains';

export function useListChains() {
  const setListChains = useAtom(listChainsAtom)[1];
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
  }, [setListChains]);

  return loading;
}
