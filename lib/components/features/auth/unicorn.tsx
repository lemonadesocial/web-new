import assert from 'assert';
import { useEffect, useMemo, useState } from 'react';

import { useSession } from '$lib/hooks/useSession';
import { useRawLogout } from "$lib/hooks/useLogout";

import { ory } from '$lib/utils/ory';

import { dummyWalletPassword, handlePasswordLogin, handlePasswordRegistration, handleUpdateFlowProfile } from '$lib/services/ory';
import { decodeAuthCookie } from '$lib/services/unicorn/common';
import { getUnicornCanLink, linkUnicornWallet } from "$lib/services/unicorn/api";
import { toast } from '$lib/components/core';

import { SiwePayload, useUnicornWalletSignature } from "../unicorn/client";

export const useHandleUnicornCookie = (cookie: string, onSuccess?: (reload: boolean) => void) => {
  const session = useSession();
  const logOut = useRawLogout();
  const authCookie = useMemo(() => decodeAuthCookie(cookie), [cookie]);
  const { siwe } = useUnicornWalletSignature(cookie);

  const [status, setStatus] = useState<'processing' | 'linking' | 'link-options' | 'creating' | 'linked' | 'processed'>('processing');

  const handleLogin = async (identifier: string, cookie: string, siwe: SiwePayload) => {
    const loginFlow = await ory!.createBrowserLoginFlow().then((response) => response.data);

    await handlePasswordLogin({
      flow: loginFlow,
      payload: {
        identifier,
        password: dummyWalletPassword,
        transient_payload: {
          unicorn_auth_cookie: cookie,
          siwe,
        }
      },
      onSuccess: () => {
        onSuccess?.(true);
      },
    });
  }

  const handleLinkWithAccount = async (siwe: SiwePayload) => {
    setStatus('linking');
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
          siwe,
        },
      },
    });

    setStatus('linked');
    onSuccess?.(true);
  }

  const createNewAccount = async (siwe: SiwePayload) => {
    setStatus('creating');
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
          siwe,
        },
      },
      onSuccess: () => {
        onSuccess?.(true);
        setStatus('linked');
      },
    });
  };

  const processCookie = async (cookie: string, siwe: SiwePayload) => {
    try {
      const response = await getUnicornCanLink(cookie);

      if (response.identityId) {
        //-- perform login
        if (session && session._id === response.identityId) {
          //-- do nothing, this is the same user
          onSuccess?.(false);
          setStatus('processed');
          return;
        }

        if (session) {
          //-- raw logout, do not reload page
          await logOut();
        }

        //-- then login with wallet
        const identifier = authCookie?.storedToken.authDetails.walletAddress?.toLowerCase();

        assert.ok(identifier, 'No wallet address in Unicorn auth cookie');

        await handleLogin(identifier, cookie, siwe);

        setStatus('processed');
        return;
      }

      if (!response.canLink) {
        if (session && !session.unicorn_wallet) {
          await handleLinkWithAccount(siwe);
          return;
        }

        setStatus('link-options');
        return;
      }

      const identifier = response.email || response.wallet;

      assert.ok(identifier, 'No identifier in Unicorn auth cookie');

      await linkUnicornWallet(identifier, cookie, siwe);

      //-- link success, perform login
      await handleLogin(identifier, cookie, siwe);

      setStatus('processed');
    }
    catch (e: any) {
      toast.error(e.message);
    }
  }

  useEffect(() => {
    if (cookie && siwe) {
      processCookie(cookie, siwe);
    }
  }, [cookie, siwe]);

  return { siwe, status, handleLinkWithAccount, createNewAccount };
}
