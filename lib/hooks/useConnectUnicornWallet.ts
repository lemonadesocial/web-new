import assert from 'assert';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { ory } from '../utils/ory';

import { modal } from "../components/core";
import { UnicornAuth } from "../components/features/auth/unicorn";

import { dummyWalletPassword, handlePasswordLogin } from '../services/ory';
import { getUnicornCanLink, linkUnicornWallet } from '../services/unicorn/api';
import { decodeAuthCookie } from '../services/unicorn/common';

import { useSession } from "./useSession";
import { useRawLogout } from "./useLogout";
import { useAuth } from "./useAuth";

export const useHandleUnicornCookie = (cookie: string, onSuccess?: (reload: boolean) => void) => {
  const session = useSession();
  const logOut = useRawLogout();

  const [processing, setProcessing] = useState(false);
  const [linking, setLinking] = useState(false);
  const [showLinkOptions, setShowLinkOptions] = useState(false);

  const processCookie = async (cookie: string) => {
    try {
      setProcessing(true);
      const response = await getUnicornCanLink(cookie);

      if (response.identityId) {
        //-- perform login
        if (session && session._id === response.identityId) {
          //-- do nothing, this is the same user
          onSuccess?.(false);
        }
        else {
          if (session) {
            //-- raw logout, do not reload page
            await logOut();
          }

          //-- then login with wallet
          const authCookie = decodeAuthCookie(cookie);

          const identifier = authCookie?.storedToken.authDetails.walletAddress?.toLowerCase();

          assert.ok(identifier, 'No wallet address in Unicorn auth cookie');

          const loginFlow = await ory!.createBrowserLoginFlow().then((response) => response.data);

          await handlePasswordLogin({
            flow: loginFlow,
            payload: {
              identifier,
              password: dummyWalletPassword,
              transient_payload: {
                unicorn_auth_cookie: cookie,
              }
            },
            onSuccess: () => {
              onSuccess?.(true);
            },
          });
        }
      }
      else {
        if (!response.canLink) {
          setShowLinkOptions(true);
        }
        else {
          try {
            setLinking(true);
            const identifier = response.email || response.wallet;

            assert.ok(identifier, 'No identifier in Unicorn auth cookie');

            await linkUnicornWallet(identifier, cookie);

            //-- link success, perform login

          }
          finally {
            setLinking(false);
          }
        }
      }
    }
    finally {
      setProcessing(false);
    }
  }

  useEffect(() => {
    processCookie(cookie);
  }, [cookie]);

  return { processing, linking, showLinkOptions };
}

export const useConnectUnicornWallet = () => {
  const { reload } = useAuth();
  const params = useSearchParams();
  const authCookie = params.get('authCookie');

  useEffect(() => {
    let modalId: number | undefined;

    if (authCookie && modal.ready) {
      modalId = modal.open(UnicornAuth, {
        dismissible: false, props: {
          authCookie,
          onSuccess: (reloadAuth) => {
            console.log("close modal", modalId);

            modal.close(modalId);

            if (reloadAuth) {
              reload();
            }
          }
        }
      });

      console.log("open modal", modalId);
    }

    return () => {
      modal.close(modalId);
    }
  }, [authCookie, modal.ready]);
};
