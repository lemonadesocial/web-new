import { EthereumAccount, EthereumRelayAccount, EthereumStakeAccount, NewPaymentAccount } from "$lib/graphql/generated/backend/graphql";
import { createPublicClient, http, type Address } from 'viem';
import PaymentSplitterABI from '$lib/abis/PaymentSplitter.json';
import { getListChains, getViemChainConfig } from '$lib/utils/crypto';

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

export function groupPaymentAccounts(paymentAccounts?: NewPaymentAccount[] | null) {
  if (!paymentAccounts) return {};

  const grouped = paymentAccounts.reduce((acc, account) => {
    const title = account.title || account._id;
    
    if (!acc[title]) {
      acc[title] = [];
    }
    
    acc[title].push(account);
    return acc;
  }, {} as Record<string, NewPaymentAccount[]>);

  return grouped;
}

export async function getPayee(accountInfo: EthereumRelayAccount) {
  if (!accountInfo.payment_splitter_contract) return;

  const chains = getListChains();
  const chain = chains.find((chain) => chain.chain_id === accountInfo.network);
  
  if (!chain?.rpc_url) return null;

  const viemChain = getViemChainConfig(chain);
  const publicClient = createPublicClient({
    chain: viemChain,
    transport: http(chain.rpc_url),
  });
  const payees = await publicClient.readContract({
    abi: PaymentSplitterABI.abi,
    address: accountInfo.payment_splitter_contract as Address,
    functionName: 'allPayees',
  });

  return payees[0].account;
}
