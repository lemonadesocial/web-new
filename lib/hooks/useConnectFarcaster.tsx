import { sdk } from "@farcaster/miniapp-sdk";
import { useEffect, useState } from "react";

import { decodeJwt } from "../utils/jwt";
import { ory } from "../utils/ory";

import { dummyWalletPassword, handlePasswordLogin, handlePasswordRegistration } from "../services/ory";

import { useAuth } from "./useAuth";

import { useModal } from "../components/core";

const Modal = (props: { data: any }) => {
  return <div style={{ "whiteSpace": "wrap" }}>{JSON.stringify(props.data)}</div>;
}

//-- please do not update this function
const getFarcasterIdentifier = (fid: number) => `farcaster:${fid}`;

export const useConnectFarcaster = () => {
  const modal = useModal();
  const { reload } = useAuth();

  const [token, setToken] = useState<string>();

  const updateUserInfo = async () => {
    const context = await sdk.context;
    modal?.open(Modal, { props: { data: { user: context.user } } });
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
        //-- TODO: handle error here
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
        reload().then(() => updateUserInfo());
      },
      onError: (loginFlow, err) => {
        const invalidLoginCredentials = loginFlow.ui.messages?.find((message) => message.id === 4000006);

        if (invalidLoginCredentials) {
          //-- if idenitifier not exists then register
          handleRegister(fid, jwt);

          return;
        }

        //-- TODO: handle error here
        console.log(err);
      }
    });
  }

  const authenWithToken = async (token: string) => {
    const payload = decodeJwt<{ sub: number }>(token);

    handleLogin(payload.sub, token);
  };

  useEffect(() => {
    sdk.quickAuth.getToken().then(({ token }) => setToken(token));
  }, []);

  useEffect(() => {
    if (token && modal) {
      authenWithToken(token);
    }
  }, [token, modal]);
};
