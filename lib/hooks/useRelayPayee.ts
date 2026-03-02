import { useQuery } from '@tanstack/react-query';
import { EthereumRelayAccount } from '$lib/graphql/generated/backend/graphql';
import { getPayee } from '$lib/utils/payment';

export function useRelayPayee(accountInfo: EthereumRelayAccount) {
  const {
    data: payee,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['relay-payee', accountInfo.payment_splitter_contract, accountInfo.network],
    queryFn: () => getPayee(accountInfo),
  });

  return { payee, loading, error };
}
