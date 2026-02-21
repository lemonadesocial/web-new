import { useState } from "react";

import { Button, ModalContent } from "$lib/components/core";
import { useAppKitAccount } from "$lib/utils/appkit";
import { formatWallet } from "$lib/utils/crypto";

import { registrationModal } from "../store";
import { useSignWallet } from "$lib/hooks/useSignWallet";

export function VerifyWalletModal({ onSuccess }: { onSuccess: (signature: string, token: string) => void; }) {
  const { address } = useAppKitAccount();
  const [loadingSign, setLoadingSign] = useState(false);

  const signWallet = useSignWallet();

  const onSign = async () => {
    setLoadingSign(true);
    const { signature, token } = await signWallet();
    setLoadingSign(false);
    onSuccess(signature, token);
  };

  return (
    <ModalContent title="Verify Wallet" onClose={() => registrationModal.close()}>
      <div className="space-y-2">
        <div className="flex gap-3">
          <div className="size-[34px] flex justify-center items-center rounded-full bg-primary/8">
            <i className="icon-wallet text-tertiary size-[18px]" />
          </div>
          <div className="space-y-[2px]">
            <p className="text-xs text-tertiary">Connected Wallet</p>
            <p>{formatWallet(address ?? '')}</p>
          </div>
        </div>
        <p>
          Please sign a message to verify your ownership of the wallet. This will not incur any cost.
        </p>
        <p className="text-sm text-tertiary">Make sure the message contains &quot;Lemonade&quot; text.</p>
      </div>
      <Button
        className="w-full mt-4"
        variant="secondary"
        onClick={onSign}
      >
        {loadingSign ? 'Waiting for Signature...' : 'Sign Transaction'}
      </Button>
    </ModalContent>
  );
}
