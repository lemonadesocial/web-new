import { useEffect, useState } from "react";


import { getSignedNonce, SignedNonce, SignInData } from "$lib/hooks/useConnectFarcaster";
import { Button, useModal } from "$lib/components/core";
import { FarcasterAuthModal } from "./FarcasterAuthModal";

interface Props {
  disabled?: boolean;
  onSuccess?: (data: SignInData, signedNonce: SignedNonce) => void;
}

export const FarcasterConnectButton = ({ disabled, onSuccess }: Props) => {
  const modal = useModal();
  const [signedNonce, setSignedNonce] = useState<SignedNonce>();

  useEffect(() => {
    if (signedNonce && modal) {
      modal.open(FarcasterAuthModal, {
        props: {
          nonce: signedNonce.nonce, onSuccess: (data) => {
            onSuccess?.(data, signedNonce);
          }
        }
      });
    }
  }, [signedNonce, modal])

  return (
    <Button
      className="flex-1"
      variant="tertiary"
      icon="icon-farcaster text-accent-400"
      disabled={disabled}
      onClick={() => {
        getSignedNonce().then(setSignedNonce);
      }}
    />
  )
}
