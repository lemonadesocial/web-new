import { useSignIn as useFarcasterSignIn, QRCode, AuthKitProvider } from "@farcaster/auth-kit";
import { sdk } from "@farcaster/miniapp-sdk";
import { useEffect, useState } from "react";

import { request } from '$lib/utils/request';

import { decodeJwt } from "../utils/jwt";
import { ory } from "../utils/ory";

import { dummyWalletPassword, handlePasswordLogin, handlePasswordRegistration, handleUpdateFlowProfile } from "../services/ory";

import { useAuth } from "./useAuth";
import { useSignIn } from "./useSignIn";

import { UpdateUserDocument } from "../graphql/generated/backend/graphql";
import { useMutation } from "../graphql/request";

import { Button, useModal } from "../components/core";

//-- please do not update this function
const getFarcasterIdentifier = (fid: number) => `farcaster:${fid}`;

export const useConnectFarcaster = () => {
  const [updateUser] = useMutation(UpdateUserDocument);
  const { reload, loading, session } = useAuth();

  const [token, setToken] = useState<string>();

  const updateUserInfo = async () => {
    const context = await sdk.context;

    await updateUser({
      variables: {
        input: {
          display_name: context.user.displayName,
          image_avatar: context.user.pfpUrl,
        }
      }
    })
  }

  const handleRegister = async (fid: number, jwt: string) => {
    const registrationFlow = await ory!.createBrowserRegistrationFlow().then((response) => response.data);

    await handlePasswordRegistration({
      flow: registrationFlow,
      payload: {
        password: dummyWalletPassword,
        traits: {
          farcaster_fid: getFarcasterIdentifier(fid),
        },
        transient_payload: {
          farcaster_app_hostname: window.location.hostname,
          farcaster_jwt: jwt,
        },
      },
      onSuccess: () => {
        reload().then(() => updateUserInfo());
      },
      onError: (_registrationFlow, err) => {
        //-- TODO: handle error here, toast or modal
        console.log(err);
      }
    });
  }

  const handleLogin = async (fid: number, jwt: string) => {
    const loginFlow = await ory!.createBrowserLoginFlow().then((response) => response.data);

    await handlePasswordLogin({
      flow: loginFlow,
      payload: {
        identifier: getFarcasterIdentifier(fid),
        password: dummyWalletPassword,
        transient_payload: {
          farcaster_app_hostname: window.location.hostname,
          farcaster_jwt: jwt,
        }
      },
      onSuccess: () => {
        reload();
      },
      onError: (loginFlow, err) => {
        //-- if idenitifier not exists (4000006) then register
        const invalidLoginCredentials = loginFlow.ui.messages?.find((message) => message.id === 4000006);

        if (invalidLoginCredentials) {
          handleRegister(fid, jwt);

          return;
        }

        //-- TODO: handle error here, toast or modal
        console.log(err);
      }
    });
  }

  const authenWithToken = async (token: string) => {
    const payload = decodeJwt<{ sub: number }>(token);

    handleLogin(payload.sub, token);
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

const FarcasterAuthPrompt = (props: { data: SignInData, signedNonce: SignedNonce, onSuccess: () => Promise<void> }) => {
  const modal = useModal();
  const signIn = useSignIn();

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
                farcaster_fid: getFarcasterIdentifier(props.data.fid),
              },
              transient_payload: {
                farcaster_siwe_nonce: props.signedNonce.nonce,
                farcaster_size_nonce_token: props.signedNonce.token,
                farcaster_siwe_signature: props.data.signature,
                farcaster_siwe_message: props.data.message,
              },
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
            farcaster_fid: getFarcasterIdentifier(props.data.fid),
          },
          transient_payload: {
            farcaster_siwe_nonce: props.signedNonce.nonce,
            farcaster_size_nonce_token: props.signedNonce.token,
            farcaster_siwe_signature: props.data.signature,
            farcaster_siwe_message: props.data.message,
          }
        }
      });

      modal?.close();
      await props.onSuccess();
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

export const useHandleFarcaster = () => {
  const modal = useModal();
  const { session, reload } = useAuth();

  const loginWithFid = async (fid: string, data: SignInData, signedNonce: SignedNonce) => {
    const loginFlow = await ory!.createBrowserLoginFlow().then((response) => response.data);

    await handlePasswordLogin({
      flow: loginFlow,
      payload: {
        identifier: fid,
        password: dummyWalletPassword,
        transient_payload: {
          farcaster_siwe_nonce: signedNonce.nonce,
          farcaster_size_nonce_token: signedNonce.token,
          farcaster_siwe_signature: data.signature,
          farcaster_siwe_message: data.message,
        }
      }
    })

    await reload();
  }

  const processFarcaster = async (data: SignInData, signedNonce: SignedNonce, onSignInSuccess: () => Promise<void>) => {
    const exists = await request<{ userFID: string; userId?: string }>(
      `${process.env.NEXT_PUBLIC_IDENTITY_URL}/api/farcaster/exists`,
      "POST",
      {
        nonce: signedNonce.nonce,
        token: signedNonce.token,
        message: data.message,
        signature: data.signature,
      },
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
            farcaster_fid: getFarcasterIdentifier(data.fid),
          },
          transient_payload: {
            farcaster_siwe_nonce: signedNonce.nonce,
            farcaster_size_nonce_token: signedNonce.token,
            farcaster_siwe_signature: data.signature,
            farcaster_siwe_message: data.message,
          },
        },
      });

      await onSignInSuccess();
    }
    else {
      if (exists.userId) {
        //-- login with this user
        await loginWithFid(exists.userFID, data, signedNonce);
        onSignInSuccess();
      }
      else {
        //-- prompt user to link
        modal?.close();
        modal?.open(FarcasterAuthPrompt, {
          props: {
            data, signedNonce, onSuccess: onSignInSuccess,
          }
        });
      }
    }
  }

  return { processFarcaster };
}
