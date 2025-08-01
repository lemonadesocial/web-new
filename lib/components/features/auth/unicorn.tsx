import assert from 'assert';
import { useEffect, useMemo, useState } from 'react';

import { useSession } from '../../../hooks/useSession';
import { useRawLogout } from "../../../hooks/useLogout";
import { useSignIn } from "../../../hooks/useSignIn";

import { ory } from '../../../utils/ory';

import { dummyWalletPassword, handlePasswordLogin, handlePasswordRegistration, handleUpdateFlowProfile } from '../../../services/ory';
import { decodeAuthCookie } from '../../../services/unicorn/common';
import { getUnicornCanLink, linkUnicornWallet } from "../../../services/unicorn/api";

import { Button } from '../../core/button';
import { modal } from "../../core";

export const useHandleUnicornCookie = (cookie: string, onSuccess?: (reload: boolean) => void) => {
  const session = useSession();
  const logOut = useRawLogout();
  const authCookie = useMemo(() => decodeAuthCookie(cookie), [cookie]);

  const [processing, setProcessing] = useState(false);
  const [linking, setLinking] = useState(false);
  const [showLinkOptions, setShowLinkOptions] = useState(false);

  const handleLogin = async (identifier: string, cookie: string) => {
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

          const identifier = authCookie?.storedToken.authDetails.walletAddress?.toLowerCase();

          assert.ok(identifier, 'No wallet address in Unicorn auth cookie');

          await handleLogin(identifier, cookie);
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
            await handleLogin(identifier, cookie);
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
    if (cookie) {
      processCookie(cookie);
    }
  }, [cookie]);

  return { processing, linking, showLinkOptions };
}

interface Props {
  cookie: string;
  onSuccess: (reload?: boolean, keepModalOpen?: boolean) => void;
}
export function UnicornAuth({ cookie, onSuccess }: Props) {
  const logOut = useRawLogout();
  const session = useSession();
  const signIn = useSignIn();
  const authCookie = useMemo(() => decodeAuthCookie(cookie), [cookie]);
  const [showLinkSuccess, setShowLinkSuccess] = useState(false);

  const { processing, linking, showLinkOptions } = useHandleUnicornCookie(cookie, onSuccess);
  const [linkToAccount, setLinkToAccount] = useState(false);

  const handleLinkWithAccount = async () => {
    try {
      setLinkToAccount(true);
      const wallet = authCookie?.storedToken.authDetails.walletAddress?.toLowerCase();

      const settingFlow = await ory!.createBrowserSettingsFlow().then((response) => response.data);

      await handleUpdateFlowProfile({
        flow: settingFlow,
        payload: {
          traits: {
            ...settingFlow.identity.traits,
            unicorn_wallet: wallet,
          },
          transient_payload: {
            unicorn_auth_cookie: cookie,
          },
        },
      });
    }
    finally {
      setLinkToAccount(false);
    }
  }

  const onLinkCurrentAccount = async () => {
    await handleLinkWithAccount();
    //-- reload auth and keep modal open
    onSuccess(true, true);

    setShowLinkSuccess(true);
  };

  const onLinkOtherAccount = async () => {
    if (session) {
      await logOut();
    }

    signIn(false, {
      onSuccess: () => {
        //-- close current login modal
        modal.close();

        onLinkCurrentAccount();
      }
    });
  };

  const onCreateNewAccount = async () => {
    const wallet = authCookie?.storedToken.authDetails.walletAddress?.toLowerCase();

    assert.ok(wallet, 'No wallet address in Unicorn auth cookie');

    const registrationFlow = await ory!.createBrowserRegistrationFlow().then((response) => response.data);

    await handlePasswordRegistration({
      flow: registrationFlow,
      payload: {
        password: dummyWalletPassword,
        traits: {
          unicorn_wallet: wallet,
        },
        transient_payload: {
          unicorn_auth_cookie: cookie,
        },
      },
      onSuccess: () => {
        onSuccess?.(true);
      },
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: 21 }}>
      {
        showLinkSuccess ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
            <div>{'You have linked your Unicorn wallet to your account'}</div>
            <Button onClick={() => {
              modal.close();
            }}>OK</Button>
          </div>
        ) :
          (linking || linkToAccount) ? (
            <div>{'Linking with Unicorn...'}</div>
          ) : showLinkOptions ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
              <div>{'Unicorn linking options'}</div>
              {session && (
                <Button disabled={linking || !!session.unicorn_wallet} onClick={onLinkCurrentAccount}>
                  {!session.unicorn_wallet ? 'Link to current account' : 'Cannot link to current account'}
                </Button>
              )}
              <Button disabled={linking} onClick={onLinkOtherAccount}>
                {'Link to other account'}
              </Button>
              <Button disabled={linking} onClick={onCreateNewAccount}>
                {'Create new account'}
              </Button>
            </div>
          ) : processing ? (
            <div>{'Authenticating with Unicorn...'}</div>
          ) : null}
    </div>
  );
}
