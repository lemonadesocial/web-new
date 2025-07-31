
import {
  LoginFlow,
  RegistrationFlow,
  SettingsFlow,
  SuccessfulNativeLogin,
  SuccessfulNativeRegistration,
  UiNodeInputAttributes,
  UpdateLoginFlowWithPasswordMethod,
  UpdateRegistrationFlowWithPasswordMethod,
} from "@ory/client";

import { ory as frontendApi } from "../../utils/ory";

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
  return frontendApi!
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
      frontendApi!
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
  return frontendApi!
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
      frontendApi!
        .getLoginFlow({ id: flow.id })
        .then((response) => onError?.(response.data, err));
    });
}
