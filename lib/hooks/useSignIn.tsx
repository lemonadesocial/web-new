import { useAtomValue } from "jotai";
import { useOAuth2 } from "./useOAuth2";
import { hydraClientIdAtom } from "$lib/jotai";
import { modal } from "$lib/components/core";
import { AuthModal } from "$lib/components/features/auth/AuthModal";
import { useState } from "react";
import { LoginFlow, RegistrationFlow, SettingsFlow, UiNodeInputAttributes, VerificationFlow } from "@ory/client";
import { ory } from "$lib/utils/ory";

export function useSignIn() {
  const { signIn } = useOAuth2();
  const hydraClientId = useAtomValue(hydraClientIdAtom);

  return () => {
    if (hydraClientId) {
      signIn();
      return;
    }

    modal.open(AuthModal, { dismissible: true });
  };
}

export const useHandleEmail = ({ onSuccess }: { onSuccess: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [flow, setFlow] = useState<LoginFlow | RegistrationFlow>();

  const signupWithCode = async (email: string, code: string) => {
    if (!ory || !flow) return;

    const response = await ory
      .updateRegistrationFlow({
        flow: flow.id,
        updateRegistrationFlowBody: {
          csrf_token: getCsrfTokenFromFlow(flow),
          method: 'code',
          code,
          traits: { email },
        },
      })
      .then((res) => ({ success: true, flow: res.data }))
      .catch((err) => ({ success: false, flow: err.response.data as RegistrationFlow }));

    if (!response.success) {
      setError((response.flow as RegistrationFlow).ui.messages?.[0].text ?? 'Unknown error');
      return;
    }

    onSuccess();
  };

  const loginWithCode = async (email: string, code: string) => {
    if (!ory || !flow) return;

    const response = await ory
      .updateLoginFlow({
        flow: flow.id,
        updateLoginFlowBody: {
          csrf_token: getCsrfTokenFromFlow(flow),
          method: 'code',
          code,
          identifier: email,
        },
      })
      .then((res) => ({ success: true, flow: res.data }))
      .catch((err) => ({ success: false, flow: err.response.data as LoginFlow }));

    if (!response.success) {
      setError((response.flow as LoginFlow).ui.messages?.[0].text ?? 'Unknown error');
      return;
    }

    onSuccess();
  };

  const resendCode = async (email: string) => {
    if (!ory || !flow) return;

    setError('');
    setCodeSent(false);

    const payload = {
      csrf_token: getCsrfTokenFromFlow(flow),
      method: 'code',
      resend: 'code',
    } as const;

    const promise = isSignup
      ? ory.updateRegistrationFlow({
          flow: flow.id,
          updateRegistrationFlowBody: {
            ...payload,
            traits: { email },
          },
        })
      : ory.updateLoginFlow({
          flow: flow.id,
          updateLoginFlowBody: {
            ...payload,
            identifier: email,
          },
        });

    //-- this should always throw an error
    const result = await promise
      .then(() => ({ success: true, response: flow }))
      .catch((err) => ({
        success: false,
        response: err.response.data as LoginFlow | RegistrationFlow,
      }));

    if (!result.success) {
      const codeSent = (result.response as LoginFlow | RegistrationFlow).ui.messages?.find(
        (m) => m.id === 1010014 || 1040005,
      );

      if (codeSent) {
        setCodeSent(true);
        return;
      }

      setError((result.response as LoginFlow | RegistrationFlow).ui.messages?.[0].text ?? 'Unknown error');
      return;
    }
  };

  const trySignup = async (email: string) => {
    if (!ory) return;

    const flow = await ory.createBrowserRegistrationFlow({}).then((res) => res.data);

    const updateResult = await ory
      .updateRegistrationFlow({
        flow: flow.id,
        updateRegistrationFlowBody: {
          csrf_token: getCsrfTokenFromFlow(flow),
          method: 'code',
          traits: {
            email,
          },
        },
      })
      .then((res) => ({ success: true, response: res.data }))
      .catch((err) => ({ success: false, response: err.response.data as RegistrationFlow }));

    if (!updateResult.success) {
      const codeSent = (updateResult.response as RegistrationFlow).ui.messages?.find((m) => m.id === 1040005);

      if (codeSent) {
        return setFlow(updateResult.response as unknown as RegistrationFlow);
      }

      setError((updateResult.response as RegistrationFlow).ui.messages?.[0].text ?? 'Unknown error');
      return;
    }
  };

  const tryLogin = async (email: string) => {
    if (!ory) return;

    const flow = await ory.createBrowserLoginFlow({}).then((res) => res.data);

    const updateResult = await ory
      .updateLoginFlow({
        flow: flow.id,
        updateLoginFlowBody: {
          csrf_token: getCsrfTokenFromFlow(flow),
          method: 'code',
          identifier: email,
        },
      })
      .then((res) => ({ response: res.data, success: true }))
      .catch((err) => ({ response: err.response.data as LoginFlow, success: false }));

    if (!updateResult.success) {
      //-- read the error within flow
      const accountNotExists = (updateResult.response as LoginFlow).ui.messages?.find((m) => m.id === 4000035);

      if (accountNotExists) {
        //-- handle signup
        setIsSignup(true);
        await trySignup(email);

        return;
      }

      const codeSent = (updateResult.response as LoginFlow).ui.messages?.find((m) => m.id === 1010014);

      if (codeSent) {
        setFlow(updateResult.response as unknown as LoginFlow);
        return;
      }

      setError((updateResult.response as RegistrationFlow).ui.messages?.[0].text ?? 'Unknown error');
      return;
    }
  };

  const processCode = async (email: string, code: string) => {
    setCodeSent(false);
    return await (isSignup ? signupWithCode(email, code) : loginWithCode(email, code));
  };

  const reset = () => {
    setFlow(undefined);
    setError('');
    setCodeSent(false);
    setIsSignup(false);
  };

  return {
    processEmail: withLoading(tryLogin, setLoading),
    processCode: withLoading(processCode, setLoading),
    resendCode: withLoading(resendCode, setResending),
    showCode: !!flow,
    codeSent,
    resending,
    loading,
    error,
    reset,
  };
};

export const useHandleOidc = () => {
  const [loading, setLoading] = useState(false);

  const tryLogin = async (provider: string) => {
    if (!ory) return;

    const flow = await ory
      .createBrowserRegistrationFlow({
        returnTo: window.location.href,
      })
      .then((res) => res.data);

    const updateResult = await ory
      .updateRegistrationFlow({
        flow: flow.id,
        updateRegistrationFlowBody: { method: 'oidc', provider },
      })
      .then((res) => ({
        success: true,
        response: res.data,
      }))
      .catch((err) => ({
        success: false,
        response: err.response.data,
      }));

    if (!updateResult.success) {
      const { redirect_browser_to } = updateResult.response as { redirect_browser_to?: string };

      if (redirect_browser_to) {
        window.location.href = redirect_browser_to;
      }

      return;
    }
  };

  return { processOidc: withLoading(tryLogin, setLoading), loading };
};

export const useHandleSignature = ({ onSuccess }: { onSuccess: () => void }) => {
  const [loading, setLoading] = useState(false);

  const trySignup = async (signature: string, token: string, wallet: string) => {
    if (!ory) return;

    const flow = await ory.createBrowserRegistrationFlow({}).then((res) => res.data);

    await ory.updateRegistrationFlow({
      flow: flow.id,
      updateRegistrationFlowBody: {
        method: 'password',
        csrf_token: getCsrfTokenFromFlow(flow),
        password: getPassword(wallet),
        traits: {
          wallet,
        },
        transient_payload: {
          wallet_signature: signature,
          wallet_signature_token: token,
        },
      },
    });

    onSuccess();
  };

  const tryLogin = async (signature: string, token: string, wallet: string) => {
    if (!ory) return;

    const flow = await ory.createBrowserLoginFlow({}).then((res) => res.data);

    const updateResult = await ory
      .updateLoginFlow({
        flow: flow.id,
        updateLoginFlowBody: {
          method: 'password',
          csrf_token: getCsrfTokenFromFlow(flow),
          password: getPassword(wallet),
          identifier: wallet,
          transient_payload: {
            wallet_signature: signature,
            wallet_signature_token: token,
          },
        },
      })
      .then((res) => ({ response: res.data, success: true }))
      .catch((err) => ({ response: err.response.data as LoginFlow, success: false }));

    if (!updateResult.success) {
      //-- read the error within flow
      const accountNotExists = (updateResult.response as LoginFlow).ui.messages?.find((m) => m.id === 4000006);

      if (accountNotExists) {
        //-- handle signup
        await trySignup(signature, token, wallet);
      }

      return;
    }

    onSuccess();
  };

  return { processSignature: withLoading(tryLogin, setLoading), loading };
};

export const useHandleVerifyEmail = ({ onSuccess }: { onSuccess: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [flow, setFlow] = useState<VerificationFlow>();

  const processEmail = async (email: string) => {
    if (!ory) return;

    setError('');

    const flow = await ory.createBrowserSettingsFlow({}).then((res) => res.data);

    const updateResult = await ory
      .updateSettingsFlow({
        flow: flow.id,
        updateSettingsFlowBody: {
          csrf_token: getCsrfTokenFromFlow(flow),
          method: 'profile',
          traits: {
            ...flow.identity?.traits,
            email,
          },
        },
      })
      .then((res) => ({
        success: true,
        response: res.data,
      }))
      .catch((err) => ({
        success: false,
        response: err.response.data,
      }));

    if (!updateResult.success) {
      setError((updateResult.response as SettingsFlow).ui.messages?.[0].text ?? 'Unknown error');
      return;
    }

    //-- create a verification flow
    let verificationFlow = await ory.createBrowserVerificationFlow({}).then((res) => res.data);

    //-- update the verification flow
    verificationFlow = await ory
      .updateVerificationFlow({
        flow: verificationFlow.id,
        updateVerificationFlowBody: {
          csrf_token: getCsrfTokenFromFlow(verificationFlow),
          method: 'code',
          email,
        },
      })
      .then((res) => res.data);

    const codeSent = verificationFlow.ui.messages?.find((m) => m.id === 1080003);

    if (codeSent) {
      setFlow(verificationFlow);
      setCodeSent(true);
      return;
    }

    setError(verificationFlow.ui.messages?.[0].text ?? 'Unknown error');
  };

  const processCode = async (email: string, code: string) => {
    if (!ory || !flow) return;

    const result = await ory
      .updateVerificationFlow({
        flow: flow.id,
        updateVerificationFlowBody: {
          csrf_token: getCsrfTokenFromFlow(flow),
          method: 'code',
          code,
          email,
        },
      })
      .then((res) => ({
        success: true,
        response: res.data,
      }))
      .catch((err) => ({
        success: false,
        response: err.response.data,
      }));

    if (!result.success) {
      setError((result.response as VerificationFlow).ui.messages?.[0].text ?? 'Unknown error');
      return;
    }

    onSuccess();
  };

  const resendCode = async (email: string) => {
    if (!ory || !flow) return;

    const result = await ory
      .updateVerificationFlow({
        flow: flow.id,
        updateVerificationFlowBody: {
          csrf_token: getCsrfTokenFromFlow(flow),
          method: 'code',
          email,
        },
      })
      .then((res) => res.data);

    const codeSent = result.ui.messages?.find((m) => m.id === 1080003);

    if (codeSent) {
      setCodeSent(true);
      return;
    }

    setError(result.ui.messages?.[0].text ?? 'Unknown error');
  };

  const reset = () => {
    setFlow(undefined);
    setError('');
    setCodeSent(false);
  };

  return {
    processEmail: withLoading(processEmail, setLoading),
    processCode: withLoading(processCode, setLoading),
    resendCode: withLoading(resendCode, setResending),
    loading,
    error,
    resending,
    codeSent,
    showCode: !!flow,
    reset,
  };
};

export const useHandleVerifyWallet = ({ onSuccess }: { onSuccess: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const processSignature = async (signature: string, token: string, wallet: string) => {
    if (!ory) return;

    setError('');

    const flow = await ory.createBrowserSettingsFlow({}).then((res) => res.data);

    const result = await ory
      .updateSettingsFlow({
        flow: flow.id,
        updateSettingsFlowBody: {
          csrf_token: getCsrfTokenFromFlow(flow),
          method: 'profile',
          traits: {
            ...flow.identity?.traits,
            wallet,
          },
          transient_payload: {
            wallet_signature: signature,
            wallet_signature_token: token,
          },
        },
      })
      .then((res) => ({
        success: true,
        response: res.data,
      }))
      .catch((err) => ({
        success: false,
        response: err.response.data,
      }));

    if (!result.success) {
      setError((result.response as SettingsFlow).ui.messages?.[0].text ?? 'Unknown error');
      return;
    }

    await ory.updateSettingsFlow({
      flow: flow.id,
      updateSettingsFlowBody: {
        csrf_token: getCsrfTokenFromFlow(result.response as SettingsFlow),
        method: 'password',
        password: getPassword(wallet),
      },
    });

    onSuccess();
  };

  return { processSignature: withLoading(processSignature, setLoading), loading, error };
};

function getCsrfTokenFromFlow(flow: RegistrationFlow | LoginFlow | SettingsFlow | VerificationFlow) {
  const csrfNode = flow.ui.nodes.find(
    (node) => node.type === 'input' && 'name' in node.attributes && node.attributes.name === 'csrf_token',
  );

  if (!csrfNode) {
    return;
  }

  return (csrfNode.attributes as UiNodeInputAttributes).value;
}

function getPassword(address: string) {
  return address.split('').reverse().join('');
}

const withLoading =
  <T extends unknown[], K>(fn: (...args: T) => Promise<K>, setLoading: (loading: boolean) => void) =>
  async (...args: T) => {
    try {
      setLoading(true);
      await fn(...args);
    } finally {
      setLoading(false);
    }
  };
