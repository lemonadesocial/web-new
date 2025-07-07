import { useEffect, useRef, useState } from "react";

import { Button, modal, ModalContent } from "$lib/components/core";
import { Chain } from "$lib/graphql/generated/backend/graphql";
import { getAppKitNetwork, useAppKit, useAppKitAccount, useAppKitNetwork } from "$lib/utils/appkit";

export function ConnectWalletButton({ onConnect, chain, children }: { onConnect: () => void; chain?: Chain; children: (open: () => void) => React.ReactNode }) {
  const { isConnected } = useAppKitAccount();
  const { open } = useAppKit();
  const { chainId, switchNetwork } = useAppKitNetwork();

  const hasConnected = useRef(false);
  const [clicked, setClicked] = useState(false);

  const handleOpen = () => {
    setClicked(true);
    open();
  };

  useEffect(() => {
    if (!clicked || hasConnected.current || !isConnected) return;

    if (!chain) {
      onConnect();
      hasConnected.current = true;
      modal.close();
      return;
    }

    if (chainId?.toString() === chain.chain_id) {
      onConnect();
      hasConnected.current = true;
      modal.close();
      return;
    }

    switchNetwork(getAppKitNetwork(chain));
  }, [clicked, isConnected, chain, chainId, onConnect]);

  return children(handleOpen);
}
