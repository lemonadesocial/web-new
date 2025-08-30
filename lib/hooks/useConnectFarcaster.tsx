import { sdk } from "@farcaster/miniapp-sdk";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";

import { request } from '$lib/utils/request';

import { decodeJwt } from "../utils/jwt";
import { ory } from "../utils/ory";

import { dummyWalletPassword, handlePasswordLogin, handleUpdateFlowProfile } from "../services/ory";

import { useAuth } from "./useAuth";

import { UserInput } from "../graphql/generated/backend/graphql";

import { toast, useModal } from "../components/core";
import { FarcasterAuthPrompt } from "$lib/components/features/modals/FarcasterAuthPrompt";
import { FarcasterAuthModal } from "$lib/components/features/auth/FarcasterAuthModal";

import { userAtom } from "$lib/jotai";

//-- please do not update this function
export const getFarcasterIdentifier = (fid: number) => `farcaster:${fid}`;

export interface SignInData {
  //-- user data
  fid: number;
  displayName: string;
  username: string;
  bio: string;

  //-- signature data
  pfpUrl: string;
  nonce: string;
  signature: string;
  message: string;
}

export interface SignedNonce {
  nonce: string;
  token: string;
}

export const getSignedNonce = async () => {
  return await request<SignedNonce>(
    `${process.env.NEXT_PUBLIC_IDENTITY_URL}/api/siwe/nonce`,
  );
}

export const useHandleFarcaster = <T extends Record<string, unknown>>() => {
  const modal = useModal();
  const { session, reload } = useAuth();

  const loginWithFid = async (fid: string, payload: T) => {
    const loginFlow = await ory!.createBrowserLoginFlow().then((response) => response.data);

    await handlePasswordLogin({
      flow: loginFlow,
      payload: {
        identifier: fid,
        password: dummyWalletPassword,
        transient_payload: payload,
      }
    })

    await reload();
  }

  const processFarcaster = async (fid: number, payload: T, onSignInSuccess: () => Promise<void>, profileExtractor: () => Promise<UserInput>) => {
    const exists = await request<{ userFID: string; userId?: string }>(
      `${process.env.NEXT_PUBLIC_IDENTITY_URL}/api/farcaster/exists`,
      "POST",
      payload
    );

    if (session) {
      //-- if current session matched, do nothing
      if (session.farcaster_fid === exists.userFID) {
        await onSignInSuccess();
        return;
      }

      //-- link with current session
      const settingFlow = await ory!.createBrowserSettingsFlow().then((response) => response.data);

      await handleUpdateFlowProfile({
        flow: settingFlow,
        payload: {
          traits: {
            ...settingFlow.identity.traits,
            farcaster_fid: getFarcasterIdentifier(fid),
          },
          transient_payload: payload,
        },
      });

      await onSignInSuccess();
    }
    else {
      if (exists.userId) {
        //-- login with this user
        await loginWithFid(exists.userFID, payload);
        onSignInSuccess();
      }
      else {
        //-- prompt user to link
        modal?.close();
        modal?.open(FarcasterAuthPrompt, {
          props: {
            fid,
            profile: await profileExtractor(),
            payload,
            onSuccess: onSignInSuccess,
          }
        });
      }
    }
  }

  return { processFarcaster };
}

export const useHandleFarcasterAuthKit = () => {
  const { processFarcaster } = useHandleFarcaster();

  const processAuthKitPayload = async (data: SignInData, signedNonce: SignedNonce, onSignInSuccess: () => Promise<void>) => {
    await processFarcaster(
      data.fid,
      {
        farcaster_siwe_nonce: signedNonce.nonce,
        farcaster_size_nonce_token: signedNonce.token,
        farcaster_siwe_signature: data.signature,
        farcaster_siwe_message: data.message,
      },
      onSignInSuccess,
      async () => ({
        display_name: data.displayName,
        image_avatar: data.pfpUrl,
      })
    );
  }

  return { processAuthKitPayload };
}

export const useHandleFarcasterMiniApp = (onSignInSuccess: () => Promise<void>) => {
  const { loading, session } = useAuth();
  const { processFarcaster } = useHandleFarcaster();

  const [token, setToken] = useState<string>();

  const authenWithToken = async (token: string) => {
    const payload = decodeJwt<{ sub: number }>(token);

    await processFarcaster(
      payload.sub,
      {
        farcaster_app_hostname: window.location.hostname,
        farcaster_jwt: token,
      },
      onSignInSuccess,
      async () => {
        const context = await sdk.context;

        return {
          display_name: context.user.displayName,
          image_avatar: context.user.pfpUrl,
        }
      }
    );
  };

  useEffect(() => {
    if (!loading && !session) {
      sdk.quickAuth.getToken().then(({ token }) => setToken(token));
    }
  }, [loading, session]);

  useEffect(() => {
    if (token) {
      authenWithToken(token);
    }
  }, [token]);
};

export const useLinkFarcaster = () => {
  const modal = useModal();
  const [me, setMe] = useAtom(userAtom);

  const handleConnect = async () => {
    const signedNonce = await getSignedNonce();

    modal?.open(FarcasterAuthModal, {
      props: {
        nonce: signedNonce.nonce,
        onSuccess: async (data) => {
          const settingFlow = await ory!.createBrowserSettingsFlow().then((response) => response.data);

          handleUpdateFlowProfile({
            flow: settingFlow,
            payload: {
              traits: {
                ...settingFlow.identity.traits,
                farcaster_fid: getFarcasterIdentifier(data.fid),
              },
              transient_payload: {
                farcaster_siwe_nonce: signedNonce.nonce,
                farcaster_size_nonce_token: signedNonce.token,
                farcaster_siwe_signature: data.signature,
                farcaster_siwe_message: data.message,
              },
            }
          }, (_, err: any) => {
            toast.error(err.message || 'Failed to link Farcaster account');
          }, () => {
            toast.success('Farcaster account linked successfully');
            setMe(me ? {
              ...me,
              kratos_farcaster_fid: data.fid.toString(),
            } : null);
          });

          modal?.close();
        }
      }
    });
  }

  return { handleConnect };
}
