import { useAtomValue } from "jotai";

import { EthereumAccount, NewPaymentAccount } from "$lib/graphql/generated/backend/graphql";
import { chainsMapAtom } from "$lib/jotai";

export function PaymentNetwork({ vault }: { vault: NewPaymentAccount }) {
  const network = (vault.account_info as EthereumAccount)?.network;
  const chainsMap = useAtomValue(chainsMapAtom);

  const chain = chainsMap[network];

  if (!chain) return <p className="text-tertiary">_</p>;

  return <img src={chain.logo_url} alt={chain.name} className="size-4" />;
}
