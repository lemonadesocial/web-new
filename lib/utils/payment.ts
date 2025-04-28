import { EthereumAccount, EthereumRelayAccount, EthereumStakeAccount, NewPaymentAccount } from "$lib/graphql/generated/backend/graphql";

export function getPaymentNetworks(paymentAccounts?: NewPaymentAccount[] | null) {
  if (!paymentAccounts) return [];

  const networks = new Set<string>();

  for (const account of paymentAccounts) {
    if (account.type === 'ethereum_relay') {
      networks.add((account.account_info as EthereumRelayAccount).network);
    } else if (account.type === 'ethereum') {
      networks.add((account.account_info as EthereumAccount).network);
    } else if (account.type === 'ethereum_stake') {
      networks.add((account.account_info as EthereumStakeAccount).network);
    }
  }

  return Array.from(networks).filter(Boolean);
}
