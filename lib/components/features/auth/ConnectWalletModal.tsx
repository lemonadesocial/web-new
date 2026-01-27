import { useState } from "react";
import { useAtom } from "jotai";

import { Button, ErrorText, modal, ModalContent, toast } from "$lib/components/core";
import { useAppKit, useAppKitAccount } from "$lib/utils/appkit";
import { sessionAtom } from "$lib/jotai";
import { useHandleVerifyWallet } from "$lib/hooks/useSignIn";
import { useSignWallet } from "$lib/hooks/useSignWallet";

import { completeProfile } from "./utils";
import { formatError } from "$lib/utils/crypto";

export function ConnectWalletModal({ verifyRequired }: { verifyRequired: boolean }) {
  const { isConnected } = useAppKitAccount();
  const { open } = useAppKit();
  const { address } = useAppKitAccount();
  const [session, setSession] = useAtom(sessionAtom);

  const [verified, setVerified] = useState(!verifyRequired);
  const signWallet = useSignWallet();

  const { processSignature, loading: loadingVerify, error: errorVerify } = useHandleVerifyWallet({
    onSuccess: () => {
      if (address && session) {
        setSession({ ...session, wallet: address });
      }
      setVerified(true);
      modal.close();
    },
  });

  const handleVerify = () => {
    if (!address) return;

    signWallet().then(async ({ signature, token }) => {
      processSignature(signature, token, address);
    }).catch((err) => {
      toast.error(formatError(err));
    });
  };

  if (!isConnected) {
    return (
      <ConnectWalletModalContainer>
        <Button variant="secondary" className="w-full" onClick={() => open()}>
          Connect Wallet
        </Button>
      </ConnectWalletModalContainer>
    )
  }

  if (!verified) {
    return (
      <ConnectWalletModalContainer subtitle="Please sign a message to verify your ownership of the wallet. This will not incur any cost." errorMessage={errorVerify}>
        <Button variant="secondary" className="w-full" onClick={handleVerify} loading={loadingVerify}>
          Sign Message
        </Button>
      </ConnectWalletModalContainer>
    );
  }

  return (
    <ConnectWalletModalContainer subtitle="Your wallet is already verified." />
  );
}

export function ConnectWalletModalContainer({ children, subtitle, errorMessage }: { children?: React.ReactNode; subtitle?: string; errorMessage?: string }) {
  return (
    <ModalContent icon="icon-wallet">
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-lg">Connect Wallet</p>
          <p className="text-secondary">
            {subtitle || 'Secure your account with your wallet and claim your Lemonade username.'}
          </p>
        </div>
        {errorMessage && <ErrorText message={errorMessage} />}
        {
          children
            ? <>
              {children}
              <p
                className="w-full text-tertiary text-center cursor-pointer"
                onClick={() => {
                  completeProfile();
                  modal.close();
                }}
              >
                Do It Later
              </p>
            </>
            : (
              <Button variant="tertiary" className="w-full" onClick={() => modal.close()}>
                Done
              </Button>
            )
        }
      </div>
    </ModalContent>
  )
}
