import { useEffect, useState } from 'react';
import { useAccount, useDisconnect, useSignMessage } from 'wagmi';
import * as Sentry from '@sentry/nextjs';

import { getUserWalletRequest } from '../../../services/auth/wallet';

export type SiwePayload = {
  wallet_signature: string;
  wallet_signature_token: string;
}

export const useUnicornWalletSignature = (authCookie: string) => {
  const account = useAccount();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();

  const [siwe, setSiwe] = useState<SiwePayload | null>();

  const sign = async () => {
    if (!account?.address) {
      return;
    }

    try {
      //-- request payload from backend
      const data = await getUserWalletRequest(account.address);

      const message = data.message;

      // Use Thirdweb's signMessage which works with in-app wallets
      const signature = await signMessageAsync({
        message
      });

      const siwePayload = {
        wallet_signature: signature,
        wallet_signature_token: data.token
      };

      setSiwe(siwePayload);
    } catch (error) {
      Sentry.captureException(error);
      disconnect();
    }
  };

  useEffect(() => {
    if (authCookie && account?.address) {
      sign();
    } else {
      setSiwe(null);
    }
  }, [authCookie, account]);

  return { siwe };
};
