import React from 'react';
import { useAtomValue } from 'jotai';
import { listChainsAtom } from '$lib/jotai/chains';

export function useListChainIds() {
  const listChains = useAtomValue(listChainsAtom);

  return React.useMemo(
    () =>
      listChains
        .filter((chain) => chain.launchpad_zap_contract_address)
        .map((chain) => Number(chain.chain_id)),
    [listChains],
  );
}
