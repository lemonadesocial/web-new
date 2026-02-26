'use client';
import { useState } from 'react';

import { useAtomValue } from 'jotai';
import { hydraClientIdAtom, sessionAtom } from '$lib/jotai';
import { modal } from '$lib/components/core';
import { AuthModal } from '$lib/components/features/auth/AuthModal';
import { LoginFlow, RegistrationFlow, SettingsFlow, UiNodeInputAttributes, VerificationFlow } from '@ory/client';
import { ory } from '$lib/utils/ory';
import { dummyWalletPassword } from '../services/ory';
import { identityApi, IdentityError } from '../services/identity';
import { useOAuth2 } from './useOAuth2';

export function useSignIn() {  
  return (dismissible = true, props?: Record<string, unknown>) => {
    modal.open(AuthModal, { dismissible, props });
  };
}

export const useHandleEmail = ({ onSuccess }: { onSuccess: (token?: string) => void }) => {
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [flow, setFlow] = useState<LoginFlow | RegistrationFlow>();
  const [identityFlowId, setIdentityFlowId] = useState<string>('');
  const hydraClientId = useAtomValue(hydraClientIdAtom);

  const signupWithCode = async (email: string, code: string) => {
    if (hydraClientId) {
      try {
        const data = await identityApi.signupWithCode({
          method: 'code',
          traits: { email },
          flow_id: identityFlowId,
          code: code,
        });

        if (data.error) {
          setError(data.error[0]?.text || 'Unknown error');
          return;
        }

        if (data.session?.token) {
          onSuccess(data.session.token);
          return;
        }

        setError('Unexpected response format');
      } catch (err) {
        setError('Network error occurred');
      }
      return;
    }

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
    if (hydraClientId) {
      try {
        const data = await identityApi.loginWithCode({
          method: 'code',
          identifier: email,
          flow_id: identityFlowId,
          code: code,
        });

        if (data.error) {
          setError(data.error[0]?.text || 'Unknown error');
          return;
        }

        if (data.session?.token) {
          onSuccess(data.session.token);
          return;
        }

        setError('Unexpected response format');
      } catch (err) {
        setError('Network error occurred');
      }
      return;
    }

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
    if (hydraClientId) {
      setError('');
      setCodeSent(false);

      try {
        if (isSignup) {
          const data = await identityApi.signupWithCode({
            method: 'code',
            traits: { email },
            flow_id: identityFlowId,
            resend: true,
          });

          if (data.error) {
            const codeSent = data.error.find((err: IdentityError) => err.id === 1040005);
            
            if (codeSent) {
              setCodeSent(true);
              return;
            }

            setError(data.error[0]?.text || 'Unknown error');
            return;
          }

          if (data.flow_id) {
            setCodeSent(true);
            return;
          }
        } else {
          const data = await identityApi.loginWithCode({
            method: 'code',
            identifier: email,
            flow_id: identityFlowId,
            resend: true,
          });

          if (data.error) {
            const accountNotExists = data.error.find((err: IdentityError) => err.id === 4000035);
            
            if (accountNotExists) {
              setIsSignup(true);
              await trySignup(email);
              return;
            }

            setError(data.error[0]?.text || 'Unknown error');
            return;
          }

          if (data.flow_id) {
            setCodeSent(true);
            return;
          }
        }

        setError('Unexpected response format');
      } catch (err) {
        setError('Network error occurred');
      }
      return;
    }

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
    if (hydraClientId) {
      try {
        const data = await identityApi.signupWithCode({
          method: 'code',
          traits: { email },
        });

        if (data.error) {
          const codeSent = data.error.find((err: IdentityError) => err.id === 1040005);
          
          if (codeSent && data.flow_id) {
            setIdentityFlowId(data.flow_id);
            setCodeSent(true);
            return;
          }

          setError(data.error[0]?.text || 'Unknown error');
          return;
        }

        if (data.flow_id) {
          setIdentityFlowId(data.flow_id);
          setCodeSent(true);
          return;
        }

        setError('Unexpected response format');
      } catch (err) {
        setError('Network error occurred');
      }
      return;
    }

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
    if (hydraClientId) {
      try {
        const data = await identityApi.loginWithCode({
          method: 'code',
          identifier: email,
        });

        if (data.error) {
          const accountNotExists = data.error.find((err: IdentityError) => err.id === 4000035);
          
          if (accountNotExists) {
            setIsSignup(true);
            await trySignup(email);
            return;
          }

          const codeSent = data.error.find((err: IdentityError) => err.id === 1010014);
          
          if (codeSent && data.flow_id) {
            setIdentityFlowId(data.flow_id);
            setCodeSent(true);
            return;
          }

          setError(data.error[0]?.text || 'Unknown error');
          return;
        }

        if (data.flow_id) {
          setIdentityFlowId(data.flow_id);
          setCodeSent(true);
          return;
        }

        setError('Unexpected response format');
      } catch (err) {
        setError('Network error occurred');
      }
      return;
    }

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
    setIdentityFlowId('');
  };

  return {
    processEmail: withLoading(tryLogin, setLoading),
    processCode: withLoading(processCode, setLoading),
    resendCode: withLoading(resendCode, setResending),
    showCode: hydraClientId ? !!identityFlowId : !!flow,
    codeSent,
    resending,
    loading,
    error,
    reset,
  };
};

export const useHandleOidc = () => {
  const [loading, setLoading] = useState(false);
  const { signIn } = useOAuth2();
  const hydraClientId = useAtomValue(hydraClientIdAtom);

  const tryLogin = async (provider: string) => {
    if (hydraClientId) {
      await signIn(provider);
      return;
    }

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

export const useHandleSignature = ({ onSuccess }: { onSuccess: (token?: string) => void }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const hydraClientId = useAtomValue(hydraClientIdAtom);

  const trySignup = async (signature: string, token: string, wallet: string) => {
    if (hydraClientId) {
      try {
        const data = await identityApi.signupWithWallet({
          traits: { wallet: wallet.toLowerCase() },
          password: dummyWalletPassword,
          transient_payload: {
            wallet_signature: signature,
            wallet_signature_token: token,
          },
        });
        if (data.error) {
          setError(data.error[0]?.text || 'Signup failed');
          return;
        }
        if (data.session?.token) {
          onSuccess(data.session.token);
          return;
        }
        setError('Unexpected response format');
        return;
      } catch (err) {
        setError('Network error occurred');
        return;
      }
    }

    if (!ory) return;

    const lowercaseWallet = wallet.toLowerCase();

    const flow = await ory.createBrowserRegistrationFlow({}).then((res) => res.data);

    const updateResult = await ory
      .updateRegistrationFlow({
        flow: flow.id,
        updateRegistrationFlowBody: {
          method: 'password',
          csrf_token: getCsrfTokenFromFlow(flow),
          password: dummyWalletPassword,
          traits: {
            wallet: lowercaseWallet,
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

    if (!updateResult.success) {
      setError((updateResult.response as RegistrationFlow).ui.messages?.[0].text ?? 'Unknown error');
      return;
    }

    onSuccess();
  };

  const tryLogin = async (signature: string, token: string, wallet: string) => {
    setError('');

    if (hydraClientId) {
      try {
        const data = await identityApi.loginWithWallet({
          identifier: wallet.toLowerCase(),
          password: dummyWalletPassword,
          transient_payload: {
            wallet_signature: signature,
            wallet_signature_token: token,
          },
        });
        if (data.error) {
          const accountNotExists = data.error.find((m) => m.id === 4000006);
          if (accountNotExists) {
            await trySignup(signature, token, wallet);
            return;
          }
          setError(data.error[0]?.text || 'Login failed');
          return;
        }
        if (data.session?.token) {
          onSuccess(data.session.token);
          return;
        }
        setError('Unexpected response format');
        return;
      } catch (err) {
        setError('Network error occurred');
        return;
      }
    }

    if (!ory) return;

    const lowercaseWallet = wallet.toLowerCase();
    const flow = await ory.createBrowserLoginFlow({}).then((res) => res.data);

    const updateResult = await ory
      .updateLoginFlow({
        flow: flow.id,
        updateLoginFlowBody: {
          method: 'password',
          csrf_token: getCsrfTokenFromFlow(flow),
          password: dummyWalletPassword,
          identifier: lowercaseWallet,
          transient_payload: {
            wallet_signature: signature,
            wallet_signature_token: token,
          },
        },
      })
      .then((res) => ({ response: res.data, success: true }))
      .catch((err) => ({ response: err.response.data as LoginFlow, success: false }));

    if (!updateResult.success) {
      const accountNotExists = (updateResult.response as LoginFlow).ui.messages?.find((m) => m.id === 4000006);

      if (accountNotExists) {
        await trySignup(signature, token, lowercaseWallet);
        return;
      }

      setError((updateResult.response as LoginFlow).ui.messages?.[0].text ?? 'Unknown error');
      return;
    }

    onSuccess();
  };

  return { processSignature: withLoading(tryLogin, setLoading), loading, error };
};

export const useHandleVerifyEmail = ({ onSuccess }: { onSuccess: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [flow, setFlow] = useState<VerificationFlow>();
  const [flowId, setFlowId] = useState<string>('');
  const hydraClientId = useAtomValue(hydraClientIdAtom);
  const session = useAtomValue(sessionAtom);

  const processEmail = async (email: string) => {
    setError('');

    if (hydraClientId) {
      try {
        const data = await identityApi.updateSettings({
          traits: { email },
          session_token: session?.token,
        });

        if (data.error && !data.error.some((err: IdentityError) => err.id === 1050001)) {
          setError(data.error[0]?.text || 'Unknown error');
          return;
        }

        const verificationData = await identityApi.verify({
          email,
        });

        if (verificationData.error) {
          const codeSent = verificationData.error.some((err: IdentityError) => err.id === 1080003);
          
          if (codeSent) {
            setFlowId(verificationData.flow_id);
            setCodeSent(true);
            return;
          }
          
          setError(verificationData.error[0]?.text || 'Unknown error');
        }
      } catch (err) {
        setError('Network error occurred');
      }
      return;
    }

    if (!ory) return;

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
      const errMessage =
        (updateResult.response as SettingsFlow).ui?.messages?.[0].text || updateResult.response.error.reason;
      setError(errMessage ?? 'Unknown error');
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
    if (hydraClientId) {
      try {
        const data = await identityApi.verify({
          flow_id: flowId,
          email,
          code,
        });

        if (data.error) {
          const success = data.error.some((err: IdentityError) => err.id === 1080002);
          
          if (success) {
            onSuccess();
            return;
          }
          
          setError(data.error[0]?.text || 'Unknown error');
          return;
        }

        onSuccess();
        return;
      } catch (err) {
        setError('Network error occurred');
      }
      return;
    }

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
    if (hydraClientId) {
      try {
        const data = await identityApi.updateSettings({
          traits: { email },
          session_token: session?.token,
        });

        if (data.error) {
          setError(data.error[0]?.text || 'Unknown error');
          return;
        }
        
        const verificationData = await identityApi.verify({
          email,
        });

        if (verificationData.error) {
          const codeSent = verificationData.error.some((err: IdentityError) => err.id === 1080003);
          
          if (codeSent) {
            setFlowId(verificationData.flow_id);
            setCodeSent(true);
            return;
          }
          
          setError(verificationData.error[0]?.text || 'Unknown error');
          return;
        }

        setFlowId(verificationData.flow_id);
        setCodeSent(true);
        return;
      } catch (err) {
        setError('Network error occurred');
      }
      return;
    }

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
    setFlowId('');
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
    showCode: !!flow || (hydraClientId && codeSent),
    reset,
  };
};

export const useHandleVerifyWallet = ({ onSuccess }: { onSuccess: () => void }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const hydraClientId = useAtomValue(hydraClientIdAtom);
  const session = useAtomValue(sessionAtom);

  const processSignature = async (signature: string, token: string, wallet: string) => {
    if (hydraClientId) {
      try {
        setError('');

        const lowercaseWallet = wallet.toLowerCase();

        const data = await identityApi.updateSettings({
          traits: { wallet: lowercaseWallet },
          session_token: session?.token,
          transient_payload: {
            wallet_signature: signature,
            wallet_signature_token: token,
          },
        });

        if (data.error) {
          setError(data.error[0]?.text || 'Unknown error');
          return;
        }

        onSuccess();
        return;
      } catch (err) {
        setError('Network error occurred');
      }
      return;
    }

    if (!ory) return;

    setError('');

    const lowercaseWallet = wallet.toLowerCase();

    const flow = await ory.createBrowserSettingsFlow({}).then((res) => res.data);

    const result = await ory
      .updateSettingsFlow({
        flow: flow.id,
        updateSettingsFlowBody: {
          csrf_token: getCsrfTokenFromFlow(flow),
          method: 'profile',
          traits: {
            ...flow.identity?.traits,
            wallet: lowercaseWallet,
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
      const errMessage = (result.response as SettingsFlow).ui?.messages?.[0].text || result.response.error.reason;
      setError(errMessage ?? 'Unknown error');
      return;
    }

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
