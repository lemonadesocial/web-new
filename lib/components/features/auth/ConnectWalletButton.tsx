import { useEffect, useRef, useState } from "react";

import { Chain } from "$lib/graphql/generated/backend/graphql";
import { getAppKitNetwork, useAppKit, useAppKitAccount, useAppKitNetwork } from "$lib/utils/appkit";

export function ConnectWalletButton({ onConnect, chain, children }: { onConnect: () => void; chain?: Chain; children: (open: () => void) => React.ReactNode }) {
  const { isConnected } = useAppKitAccount();
  const { open } = useAppKit();
  const { chainId, switchNetwork } = useAppKitNetwork();

  const [ready, setReady] = useState(false);
  const [clicked, setClicked] = useState(false);

  const handleOpen = () => {
    if (ready) {
      onConnect();
      return;
    }

    setClicked(true);
    open();
  };

  useEffect(() => {
    if (!clicked || ready || !isConnected) return;

    if (!chain) {
      onConnect();
      setReady(true);
      return;
    }

    if (chainId?.toString() === chain.chain_id) {
      onConnect();
      setReady(true);
      return;
    }

    switchNetwork(getAppKitNetwork(chain));
  }, [clicked, isConnected, chain, chainId, onConnect]);

  return children(handleOpen);
}
