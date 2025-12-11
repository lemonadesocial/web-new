import { useAtomValue } from "jotai";

import { modal } from "$lib/components/core";
import { ClaimLemonadeUsernameModal } from "$lib/components/features/modals/ClaimLemonadeUsernameModal";
import { ConnectWallet } from "$lib/components/features/modals/ConnectWallet";
import { listChainsAtom } from "$lib/jotai";

export const useClaimUsername = () => {
  const listChains = useAtomValue(listChainsAtom);
  const usernameChain = listChains.find(chain => chain.lemonade_username_contract_address)!;

  const open = () => {
    modal.open(ConnectWallet, {
      props: {
        onConnect: () => {
          modal.open(ClaimLemonadeUsernameModal);
        },
        chain: usernameChain,
      },
    });
  }

  return open;
}
