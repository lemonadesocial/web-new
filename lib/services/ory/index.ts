
import {
  LoginFlow,
  RegistrationFlow,
  SettingsFlow,
  SuccessfulNativeLogin,
  SuccessfulNativeRegistration,
  UiNodeInputAttributes,
  UpdateLoginFlowWithPasswordMethod,
  UpdateRegistrationFlowWithPasswordMethod,
  UpdateSettingsFlowWithProfileMethod,
} from "@ory/client";

import { getOry } from "../../utils/ory";

export const dummyWalletPassword = '!!dummy-WALLET-password@@';

export function getCsrfToken(
  flow: LoginFlow | RegistrationFlow | SettingsFlow,
): string | undefined {
  const csrfNode = flow.ui.nodes.find(
    (node) => "name" in node.attributes && node.attributes.name === "csrf_token",
  )?.attributes;

  return (csrfNode as UiNodeInputAttributes)?.value;
}

export async function handlePasswordRegistration(
  {
    flow,
    payload,
    onError,
    onSuccess,
  }: {
    flow: RegistrationFlow;
    payload: Pick<
      UpdateRegistrationFlowWithPasswordMethod,
      "traits" | "password" | "transient_payload"
    >;
    onError?: (flow: RegistrationFlow, err: unknown) => void,
    onSuccess?: (flow: SuccessfulNativeRegistration) => void,
  }
) {
  return getOry()
    .updateRegistrationFlow(
      {
        flow: flow.id,
        updateRegistrationFlowBody: {
          method: "password",
          csrf_token: getCsrfToken(flow),
          ...payload,
        },
      },
    )
    .then((response) => {
      onSuccess?.(response.data);
    })
    .catch((error) => {
      getOry()
        .getRegistrationFlow({ id: flow.id })
        .then((response) => onError?.(response.data, error));
    });
}

export async function handlePasswordLogin(
  {
    flow,
    payload,
    onError,
    onSuccess,
  }: {
    flow: LoginFlow;
    payload: Pick<
      UpdateLoginFlowWithPasswordMethod,
      "identifier" | "password" | "transient_payload"
    >;
    onError?: (flow: LoginFlow, err: unknown) => void;
    onSuccess?: (flow: SuccessfulNativeLogin) => void;
  },
) {
  return getOry()
    .updateLoginFlow(
      {
        flow: flow.id,
        updateLoginFlowBody: {
          method: "password",
          csrf_token: getCsrfToken(flow),
          ...payload,
        },
      },
    )
    .then((response) => {
      onSuccess?.(response.data);
    })
    .catch((err) => {
      getOry()
        .getLoginFlow({ id: flow.id })
        .then((response) => onError?.(response.data, err));
    });
}

export async function handleUpdateFlowProfile(
  {
    flow,
    payload,
  }: {
    flow: SettingsFlow;
    payload: Pick<UpdateSettingsFlowWithProfileMethod, "traits" | "transient_payload">;
  },
  onError?: (flow: SettingsFlow, err: unknown) => void,
  onSuccess?: () => void,
) {
  return getOry()
    .updateSettingsFlow(
      {
        //-- first we need to update the flow with the new wallet address
        flow: flow.id,
        updateSettingsFlowBody: {
          method: "profile",
          csrf_token: getCsrfToken(flow),
          ...payload,
        },
      },
    )
    .then(() => {
      onSuccess?.();
    })
    .catch((err) => {
      getOry()
        .getSettingsFlow({ id: flow.id })
        .then((response) => onError?.(response.data, err));
    });
}
