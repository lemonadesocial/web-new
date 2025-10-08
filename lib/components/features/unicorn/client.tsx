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
  const { signMessage } = useSignMessage();

  const [authCookie, setAuthCookie] = useState<string>();
  const [siwe, setSiwe] = useState<SiwePayload | null>();

  const sign = async () => {
    if (!account.address) {
      return;
    }

    //-- request payload from backend
    const data = await getUserWalletRequest(account.address);

    const message = data.message;

    const siwe = await new Promise<SiwePayload>((resolve) =>
      signMessage(
        { message },
        {
          onSuccess: (signature) => {
            // setSignature(signature);
            resolve({ wallet_signature: signature, wallet_signature_token: data.token });
          },
          onError: () => {
            if (account.isConnected) {
              disconnect();
            }
          },
        },
      ),
    );

    setSiwe(siwe);
  };

  useEffect(() => {
    if (authCookie) {
      sign();
    } else {
      setSiwe(null);
    }
  }, [authCookie]);

  useEffect(() => {
    if (account.isDisconnected) {
      setSignature('');
    }
  }, [account.isDisconnected]);

  useEffect(() => {
    const params = new URL(window.location.search).searchParams;

    const authCookie = params.get('authCookie');

    setAuthCookie(authCookie || '');
  }, []);

  return { siwe };
};
