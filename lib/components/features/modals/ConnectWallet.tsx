import { useEffect, useRef, useState } from "react";

import { Button, modal, ModalContent } from "$lib/components/core";
import { Chain } from "$lib/graphql/generated/backend/graphql";
import { getAppKitNetwork, useAppKit, useAppKitAccount, useAppKitNetwork } from "$lib/utils/appkit";

export function ConnectWallet({ onConnect, chain }: { onConnect: () => void; chain?: Chain; }) {
  const { isConnected } = useAppKitAccount();
  const { open } = useAppKit();
  const { chainId, switchNetwork } = useAppKitNetwork();

  const [showSwitchNetwork, setShowSwitchNetwork] = useState(false);
  const hasConnected = useRef(false);

  useEffect(() => {
    if (hasConnected.current || !isConnected) return;

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

    setShowSwitchNetwork(true);
  }, [isConnected, chain, chainId, onConnect]);

  if (showSwitchNetwork && chain) {
    return (
      <ModalContent icon={chain.logo_url && <img src={chain.logo_url} className="w-6" />}>
        <p className="text-lg">Switch Network</p>
        <p className="text-secondary mt-2">
          You&apos;re connected to a different network than the one you selected. Please switch to ${chain.name} in your wallet to continue.
        </p>
        <Button variant="secondary" className="w-full mt-4" onClick={() => switchNetwork(getAppKitNetwork(chain))}>
          Switch to {chain.name}
        </Button>
      </ModalContent>
    );
  }

  return (
    <ModalContent icon="icon-wallet">
      <p className="text-lg">Connect Wallet</p>
      <p className="text-secondary mt-2">
        Connect a compatible wallet to securely complete your payment on your preferred blockchain network.
      </p>
      <Button variant="secondary" className="w-full mt-4" onClick={() => open()}>
        Connect Wallet
      </Button>
    </ModalContent>
  );
}
