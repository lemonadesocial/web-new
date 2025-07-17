import { useEffect, useState } from "react";
import { useAtom, useAtomValue } from "jotai";

import { Button, ErrorText, modal, ModalContent, toast } from "$lib/components/core";
import { getAppKitNetwork, useAppKit, useAppKitAccount, useAppKitNetwork } from "$lib/utils/appkit";
import { LENS_CHAIN_ID } from "$lib/utils/lens/constants";
import { chainsMapAtom, sessionAtom } from "$lib/jotai";
import { useHandleVerifyWallet } from "$lib/hooks/useSignIn";
import { useSignWallet } from "$lib/hooks/useSignWallet";

import { completeProfile } from "./utils";
import { SelectProfileModal } from "../lens-account/SelectProfileModal";
import { formatError } from "$lib/utils/crypto";

export function ConnectWalletModal({ verifyRequired, skipSelectProfile }: { verifyRequired: boolean; skipSelectProfile?: boolean }) {
  const { isConnected } = useAppKitAccount();
  const { open } = useAppKit();
  const { chainId, switchNetwork } = useAppKitNetwork();
  const { address } = useAppKitAccount();
  const [session, setSession] = useAtom(sessionAtom);

  const [verified, setVerified] = useState(!verifyRequired);

  const chainsMap = useAtomValue(chainsMapAtom);
  const chain = chainsMap[LENS_CHAIN_ID];
  const signWallet = useSignWallet();

  const isChainValid = chainId?.toString() === LENS_CHAIN_ID && chain;

  useEffect(() => {
    if (verified && isConnected && isChainValid && !skipSelectProfile) {
      modal.close();
      setTimeout(() => {
        modal.open(SelectProfileModal);
      });
    }
  }, [isConnected, isChainValid, verified]);

  const { processSignature, loading: loadingVerify, error: errorVerify } = useHandleVerifyWallet({
    onSuccess: () => {
      if (address && session) {
        setSession({ ...session, wallet: address });
      }

      if (skipSelectProfile) {
        modal.close();
        return;
      }

      setVerified(true);
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

  if (!isChainValid) {
    return (
      <ConnectWalletModalContainer subtitle={`Please switch to ${chain.name} in your wallet to continue.`}>
        <Button variant="secondary" className="w-full" onClick={() => switchNetwork(getAppKitNetwork(chain))}>
          Switch to {chain.name}
        </Button>
      </ConnectWalletModalContainer>
    );
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
    <ConnectWalletModalContainer>
      <Button
        variant="secondary"
        className="w-full"
        onClick={() => {
          modal.close();
          setTimeout(() => {
            modal.open(SelectProfileModal);
          });
        }}
      >
        Continue
      </Button>
    </ConnectWalletModalContainer>
  );
}

export function ConnectWalletModalContainer({ children, subtitle, errorMessage }: { children: React.ReactNode; subtitle?: string; errorMessage?: string }) {
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
      </div>
    </ModalContent>
  )
}
