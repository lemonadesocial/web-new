import { useSignIn, QRCode } from "@farcaster/auth-kit";
import { sdk } from "@farcaster/miniapp-sdk";
import { useEffect, useState } from "react";

import { decodeJwt } from "../utils/jwt";
import { ory } from "../utils/ory";

import { dummyWalletPassword, handlePasswordLogin, handlePasswordRegistration } from "../services/ory";

import { useAuth } from "./useAuth";

import { UpdateUserDocument } from "../graphql/generated/backend/graphql";
import { useMutation } from "../graphql/request";

import { Button, modal } from "../components/core";

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

const QrCodeModal = (props: { url: string }) => {
  return (
    <div style={{
      padding: 21,
      backgroundColor: "white",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 13,
    }}>
      <QRCode uri={props.url} />
      <div style={{ color: "black" }}>Scan this QR code to connect Farcaster account</div>
    </div>
  )
}

interface SignInData {
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

interface Props {
  disabled?: boolean;
}
export const FarcasterConnectButton = ({ disabled }: Props) => {
  const [data, setData] = useState<SignInData>();

  const { signIn, connect, url } = useSignIn({
    onStatusResponse: (args: { state: 'completed' | 'pending' }) => {
      if (args.state === 'completed') {
        setData(args as unknown as SignInData);
      }
    },
  });

  useEffect(() => {
    console.log("data", data)
  }, [data])

  useEffect(() => {
    if (url) {
      modal.open(QrCodeModal, { props: { url } });
      signIn();
    }
  }, [url])

  return (
    <Button
      className="flex-1"
      variant="tertiary"
      icon="icon-farcaster"
      disabled={disabled}
      onClick={() => {
        connect();
      }}
    />
  )
}
