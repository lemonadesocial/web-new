import { useCallback, useEffect, useState } from "react";
import { useAtomValue } from "jotai";

import { Chain } from "$lib/graphql/generated/backend/graphql";
import { appKitReadyAtom } from "$lib/jotai";
import { getAppKitNetwork, useAppKit, useAppKitAccount, useAppKitNetwork } from "$lib/utils/appkit";

export function ConnectWalletButton({ onConnect, chain, children }: { onConnect: () => void; chain?: Chain; children: (open: () => void) => React.ReactNode }) {
  const appKitReady = useAtomValue(appKitReadyAtom);
  const [openWhenReady, setOpenWhenReady] = useState(false);
  const handleOpenWhenReadyHandled = useCallback(() => setOpenWhenReady(false), []);

  if (!appKitReady) {
    return children(() => setOpenWhenReady(true));
  }

  return (
    <ReadyConnectWalletButton
      onConnect={onConnect}
      chain={chain}
      openWhenReady={openWhenReady}
      onOpenWhenReadyHandled={handleOpenWhenReadyHandled}
    >
      {children}
    </ReadyConnectWalletButton>
  );
}

function ReadyConnectWalletButton({
  onConnect,
  chain,
  children,
  openWhenReady,
  onOpenWhenReadyHandled,
}: {
  onConnect: () => void;
  chain?: Chain;
  children: (open: () => void) => React.ReactNode;
  openWhenReady: boolean;
  onOpenWhenReadyHandled: () => void;
}) {
  const { isConnected } = useAppKitAccount();
  const { open } = useAppKit();
  const { chainId, switchNetwork } = useAppKitNetwork();

  const [ready, setReady] = useState(false);
  const [clicked, setClicked] = useState(false);

  const handleOpen = useCallback(() => {
    if (ready) {
      onConnect();
      return;
    }

    setClicked(true);
    open();
  }, [ready, onConnect, open]);

  useEffect(() => {
    if (!openWhenReady) return;

    handleOpen();
    onOpenWhenReadyHandled();
  }, [openWhenReady, handleOpen, onOpenWhenReadyHandled]);

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
  }, [clicked, ready, isConnected, chain, chainId, onConnect, switchNetwork]);

  return children(handleOpen);
}
