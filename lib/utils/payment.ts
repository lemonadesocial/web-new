import { EthereumAccount, EthereumRelayAccount, EthereumStakeAccount, NewPaymentAccount } from "$lib/graphql/generated/backend/graphql";
import { ethers } from 'ethers';
import PaymentSplitterABI from '$lib/abis/PaymentSplitter.json';
import { getListChains } from '$lib/utils/crypto';

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

  const provider = new ethers.JsonRpcProvider(chain.rpc_url);
  const paymentSplitter = new ethers.Contract(accountInfo.payment_splitter_contract, PaymentSplitterABI.abi, provider);

  const payees = await paymentSplitter.allPayees();

  return payees[0].account;
}
