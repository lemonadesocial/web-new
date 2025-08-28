import { useSignIn as useFarcasterSignIn, QRCode, AuthKitProvider } from "@farcaster/auth-kit";
import { sdk } from "@farcaster/miniapp-sdk";
import { useEffect, useState } from "react";

import { request } from '$lib/utils/request';

import { decodeJwt } from "../utils/jwt";
import { ory } from "../utils/ory";

import { dummyWalletPassword, handlePasswordLogin, handlePasswordRegistration, handleUpdateFlowProfile } from "../services/ory";

import { useAuth } from "./useAuth";
import { useSignIn } from "./useSignIn";

import { UpdateUserDocument, UserInput } from "../graphql/generated/backend/graphql";
import { useMutation } from "../graphql/request";

import { Button, useModal } from "../components/core";

//-- please do not update this function
const getFarcasterIdentifier = (fid: number) => `farcaster:${fid}`;

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

const getSignedNonce = async () => {
  return await request<SignedNonce>(
    `${process.env.NEXT_PUBLIC_IDENTITY_URL}/api/siwe/nonce`,
  );
}

const FarcasterAuthInner = (props: { nonce: string, onSuccess: (data: SignInData) => void }) => {
  const [connected, setConnected] = useState(false);

  const { signIn, connect, url } = useFarcasterSignIn({
    nonce: props.nonce,
    onStatusResponse: (args: { state: 'completed' | 'pending' }) => {
      if (args.state === 'completed') {
        props.onSuccess(args as unknown as SignInData);
      }
    },
  });

  useEffect(() => {
    connect().then(() => setConnected(true));
  }, []);

  useEffect(() => {
    if (connected && url) {
      signIn();
    }
  }, [connected, url])

  return <div style={{ padding: 20, background: "white", display: "flex", flexDirection: "column", alignItems: "center", gap: 13 }}>
    {url
      ? <>
        <QRCode uri={url} />
        <div style={{ color: "black" }}>Scan this QR code to connect Farcaster account</div>
        <Button onClick={() => {
          window.open(url, "_blank");
        }}>{"I'm using my phone"}</Button>
      </>
      : <div style={{ color: "black" }}>Loading</div>}
  </div>
}

const FarcasterAuth = (props: { nonce: string, onSuccess: (data: SignInData) => void }) => {
  return <AuthKitProvider config={{}}>
    <FarcasterAuthInner {...props} />
  </AuthKitProvider>
}

interface Props {
  disabled?: boolean;
  onSuccess?: (data: SignInData, signedNonce: SignedNonce) => void;
}
export const FarcasterConnectButton = ({ disabled, onSuccess }: Props) => {
  const modal = useModal();
  const [signedNonce, setSignedNonce] = useState<SignedNonce>();

  useEffect(() => {
    if (signedNonce && modal) {
      modal.open(FarcasterAuth, {
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
      icon="icon-farcaster"
      disabled={disabled}
      onClick={() => {
        getSignedNonce().then(setSignedNonce);
      }}
    />
  )
}

const FarcasterAuthPrompt = (props: {
  fid: number;
  profile: UserInput;
  payload: Record<string, unknown>;
  onSuccess: () => Promise<void>;
}) => {
  const modal = useModal();
  const signIn = useSignIn();
  const [updateUser] = useMutation(UpdateUserDocument);

  const [registering, setRegistering] = useState(false);
  const [linking, setLinking] = useState(false);

  const link = async () => {
    signIn(false, {
      onSuccess: async () => {
        //-- update profile
        try {
          const settingFlow = await ory!.createBrowserSettingsFlow().then((response) => response.data);

          await handleUpdateFlowProfile({
            flow: settingFlow,
            payload: {
              traits: {
                ...settingFlow.identity.traits,
                farcaster_fid: getFarcasterIdentifier(props.fid),
              },
              transient_payload: props.payload,
            },
          });

          modal?.close();
          await props.onSuccess();
        }
        finally {
          setLinking(false);
        }
      }
    });
  }

  const register = async () => {
    try {
      setRegistering(true);
      const registrationFlow = await ory!.createBrowserRegistrationFlow().then((response) => response.data);

      await handlePasswordRegistration({
        flow: registrationFlow,
        payload: {
          password: dummyWalletPassword,
          traits: {
            farcaster_fid: getFarcasterIdentifier(props.fid),
          },
          transient_payload: props.payload,
        }
      });

      modal?.close();
      await props.onSuccess();

      await updateUser({
        variables: {
          input: props.profile,
        }
      })
    }
    finally {
      setRegistering(false);
    }
  }

  return <div style={{ width: "200px", padding: 21, display: "flex", flexDirection: "column", gap: 21 }}>
    <div>Link your register?</div>
    <Button disabled={linking || registering} loading={linking} onClick={link}>Link</Button>
    <Button disabled={linking || registering} loading={registering} onClick={register}>Register</Button>
  </div>
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
