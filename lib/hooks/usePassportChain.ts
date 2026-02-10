import React from 'react';
import { useAtomValue } from 'jotai';

import { Chain } from '$lib/graphql/generated/backend/graphql';
import { listChainsAtom } from '$lib/jotai';
import { ContractAddressFieldMapping, PASSPORT_PROVIDER } from '$lib/components/features/passports/types';

export function usePassportChain(provider: PASSPORT_PROVIDER) {
  const listChains = useAtomValue(listChainsAtom);

  const chain = React.useMemo(() => {
    const contractField = ContractAddressFieldMapping[provider] as keyof Chain;
    return listChains.find(
      (c) => c && contractField && c[contractField]
    );
  }, [listChains, provider]);

  return chain;
}
