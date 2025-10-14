import { useEffect, useState } from 'react';
import { useAccount, useDisconnect, useSignMessage } from 'wagmi';

import { getUserWalletRequest } from '../../../services/auth/wallet';

export type SiwePayload = {
  wallet_signature: string;
  wallet_signature_token: string;
}

export const useUnicornWalletSignature = () => {
  const account = useAccount();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();

  const [authCookie, setAuthCookie] = useState<string>();
  const [siwe, setSiwe] = useState<SiwePayload | null>();

  const sign = async () => {
    console.log("sign with account address", account?.address);

    if (!account?.address) {
      return;
    }

    try {
      //-- request payload from backend
      const data = await getUserWalletRequest(account.address);

      console.log("data", data);

      const message = data.message;

      console.log("signing message with account", account);

      // Use Thirdweb's signMessage which works with in-app wallets
      const signature = await signMessageAsync({
        message
      });

      console.log("signature received", signature);

      const siwePayload = {
        wallet_signature: signature,
        wallet_signature_token: data.token
      };

      console.log("siwe payload", siwePayload);

      setSiwe(siwePayload);
    } catch (error) {
      console.log("signMessage error", error);
      disconnect();
    }
  };

  useEffect(() => {
    if (authCookie && account?.address) {
      console.log("sign");
      sign();
    } else {
      setSiwe(null);
    }
  }, [authCookie, account?.address]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const authCookie = params.get('authCookie');

    setAuthCookie(authCookie || '');
  }, []);

  return { siwe };
};
