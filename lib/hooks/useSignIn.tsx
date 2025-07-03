import { LoginFlow, RegistrationFlow, SettingsFlow, UiNodeInputAttributes, VerificationFlow } from '@ory/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider, ConnectKitButton, getDefaultConfig } from 'connectkit';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { WagmiProvider, createConfig, useAccount, useDisconnect, useSignMessage } from 'wagmi';

import { hydraClientIdAtom } from '$lib/jotai';
import { ory } from '$lib/utils/ory';

import { Button, Input, modal } from '../components/core';

import { useOAuth2 } from './useOAuth2';

//-- utilities
const request = async <T,>(uri: string): Promise<T> => {
  const response = await fetch(uri, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return (await response.json()) as T;
};

//-- the API definitions go here
export const getUserWalletRequest = (wallet: string) =>
  request<{ message: string; token: string }>(
    `${process.env.NEXT_PUBLIC_IDENTITY_URL}/api/wallet?${new URLSearchParams({ wallet })}`,
  );

//-- HOOKS

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

function getCsrfTokenFromFlow(flow: RegistrationFlow | LoginFlow | SettingsFlow | VerificationFlow) {
  const csrfNode = flow.ui.nodes.find(
    (node) => node.type === 'input' && 'name' in node.attributes && node.attributes.name === 'csrf_token',
  );

  if (!csrfNode) {
    return;
  }

  return (csrfNode.attributes as UiNodeInputAttributes).value;
}

const useHandleEmail = ({ onSuccess }: { onSuccess: () => void }) => {
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

  return {
    processEmail: withLoading(tryLogin, setLoading),
    processCode: withLoading(processCode, setLoading),
    resendCode: withLoading(resendCode, setResending),
    showCode: !!flow,
    codeSent,
    resending,
    loading,
    error,
  };
};

const useHandleOidc = () => {
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

function getPassword(address: string) {
  return address.split('').reverse().join('');
}
const useHandleSignature = ({ onSuccess }: { onSuccess: () => void }) => {
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

const useHandleVerifyEmail = ({ onSuccess }: { onSuccess: () => void }) => {
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

  return {
    processEmail: withLoading(processEmail, setLoading),
    processCode: withLoading(processCode, setLoading),
    resendCode: withLoading(resendCode, setResending),
    loading,
    error,
    resending,
    codeSent,
    showCode: !!flow,
  };
};

const useHandleVerifyWallet = ({ onSuccess }: { onSuccess: () => void }) => {
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

//-- EMAI AND CODE COMPONENTS

function CodeVerification({
  loading,
  resending,
  error,
  email,
  codeSent,
  onResend,
  onSubmit,
}: {
  loading?: boolean;
  resending?: boolean;
  error?: string;
  email: string;
  codeSent: boolean;
  onResend: () => void;
  onSubmit: (code: string) => void;
}) {
  const [code, setCode] = useState('');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
      <div>An email had been sent to {email}</div>
      <Input disabled={loading || resending} placeholder="Input OTP here" onChange={(e) => setCode(e.target.value)} />
      {error && <div style={{ color: 'darkred' }}>{error}</div>}
      {codeSent && <div style={{ color: 'lime' }}>Code sent. Please check your email.</div>}
      <Button loading={resending} disabled={loading} onClick={onResend}>
        Resend Code
      </Button>
      <Button disabled={!code || resending} loading={loading} onClick={() => onSubmit(code)}>
        Continue
      </Button>
    </div>
  );
}

function EmailAndOidcs({
  onSubmitEmail,
  loading,
  disabled,
}: {
  onSubmitEmail: (email: string) => void;
  loading?: boolean;
  disabled?: boolean;
}) {
  const [email, setEmail] = useState('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
        <Input
          disabled={loading || disabled}
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button disabled={!email || disabled} loading={loading} onClick={() => onSubmitEmail(email)}>
          Continue with Email
        </Button>
      </div>
    </div>
  );
}

//-- OIDC COMPONENT

const providers = ['google', 'apple'];

function OidcButtons({
  onSelect,
  disabled,
  loading,
}: {
  onSelect: (provider: string) => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  const [currentProvider, setCurrentProvider] = useState<string>();

  return (
    <div style={{ display: 'flex', gap: 13, alignItems: 'center', justifyContent: 'space-between' }}>
      {providers.map((provider) => (
        <Button
          key={provider}
          style={{ flex: 1 }}
          disabled={disabled || loading}
          loading={loading && currentProvider === provider}
          onClick={() => {
            setCurrentProvider(provider);
            onSelect(provider);
          }}
        >
          <span style={{ textTransform: 'capitalize' }}>{provider}</span>
        </Button>
      ))}
    </div>
  );
}

// -- WALLET COMPONENT

const config = createConfig(
  getDefaultConfig({
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '',
    appName: 'lemonade.social',
  }),
);

const queryClient = new QueryClient();

const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

function WalletButton({
  children,
  loading,
  disabled,
  onSignature,
}: {
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  onSignature: (signature: string, token: string, wallet: string) => Promise<void>;
}) {
  const account = useAccount();
  const { disconnect } = useDisconnect();
  const { signMessage } = useSignMessage();

  const [signing, setSigning] = useState(false);
  const [signature, setSignature] = useState('');
  const [token, setToken] = useState('');

  const sign = async () => {
    if (!account.address) {
      return;
    }

    setSignature('');

    //-- request payload from backend
    const data = await getUserWalletRequest(account.address);

    const message = data.message;
    setToken(data.token);

    signMessage(
      { message },
      {
        onSettled: () => {
          setSigning(false);
        },
        onSuccess: (signature) => {
          setSignature(signature);
        },
        onError: () => {
          if (account.isConnected) {
            disconnect();
          }
        },
      },
    );
  };

  useEffect(() => {
    if (signature && account.address && token) {
      onSignature(signature, token, account.address).finally(() => disconnect());
    }
  }, [signature, account.address, token]);

  useEffect(() => {
    if (account.isDisconnected) {
      setSignature('');
    }
  }, [account.isDisconnected]);

  useEffect(() => {
    if (account.isConnected && !signing && !signature) {
      setSigning(true);

      //-- note: ARC browser will show two signature requests in case of metamask,
      //-- we can set timeout to the sign call if we want to support this browser
      sign().catch(() => disconnect());
    }
  }, [account.isConnected, signing, signature]);

  return (
    <ConnectKitButton.Custom>
      {({ show, isConnecting }) => {
        return (
          <Button
            disabled={disabled}
            loading={loading || signing || isConnecting}
            onClick={() => {
              show?.();
            }}
          >
            {children}
          </Button>
        );
      }}
    </ConnectKitButton.Custom>
  );
}

//-- OPTIONAL WALLET CONNECT
function OptionalWalletConnect({ onFinish }: { onFinish: () => void }) {
  const { processSignature, loading, error } = useHandleVerifyWallet({
    onSuccess: onFinish,
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
      <div>Connect Wallet</div>
      <div>
        We’ll find or help you create your Lens account—required to claim your Lemonade username and start posting,
        commenting, and interacting across the platform.
      </div>
      {error && <div style={{ color: 'darkred' }}>{error}</div>}
      <WalletButton loading={loading} onSignature={processSignature}>
        <span>Connect Wallet</span>
      </WalletButton>
      <Button onClick={onFinish}>Do It Later</Button>
    </div>
  );
}

//-- OPTIONAL EMAIL VERIFY
function OptionalEmailVerify({ onFinish }: { onFinish: () => void }) {
  const { processEmail, processCode, resendCode, showCode, error, codeSent, resending, loading } = useHandleVerifyEmail(
    {
      onSuccess: onFinish,
    },
  );

  const [email, setEmail] = useState('');

  if (showCode) {
    return (
      <CodeVerification
        email={email}
        codeSent={codeSent}
        onResend={() => resendCode(email)}
        onSubmit={(code) => processCode(email, code)}
        error={error}
        loading={loading}
        resending={resending}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
      <div>Verify Your Email</div>
      <div>If you have attended Lemonade events in the past, enter the same email you used to register.</div>
      <Input onChange={(e) => setEmail(e.target.value)} placeholder="Email address" />
      {error && <div style={{ color: 'darkred' }}>{error}</div>}
      <Button disabled={!email} loading={loading} onClick={() => processEmail(email)}>
        Continue
      </Button>
      <Button disabled={loading} onClick={onFinish}>
        Do It Later
      </Button>
    </div>
  );
}

//-- MODAL COMPONENT

function UnifiedLoginSignupModal() {
  const [email, setEmail] = useState('');
  const [showOptionalEmailVerify, setShowOptionalEmailVerify] = useState(false);
  const [showOptionalWalletConnect, setShowOptionalWalletConnect] = useState(false);

  const reloadPage = () => {
    window.location.reload();
  };

  const onSignInSuccess = async () => {
    if (!ory) return;

    const session = await ory.toSession().then((res) => res.data);

    if (!session.identity?.traits?.email) {
      setShowOptionalEmailVerify(true);
      return;
    }

    if (!session.identity?.traits?.wallet) {
      setShowOptionalWalletConnect(true);
      return;
    }

    modal.close();

    //-- TODO: it is better to be reactive and not to reload the page
    reloadPage();
  };

  const {
    processEmail,
    processCode,
    resendCode,
    resending,
    loading: loadingEmail,
    showCode,
    error,
    codeSent,
  } = useHandleEmail({
    onSuccess: onSignInSuccess,
  });
  const { processOidc, loading: loadingOidc } = useHandleOidc();
  const { processSignature, loading: loadingWallet } = useHandleSignature({
    onSuccess: onSignInSuccess,
  });

  const renderChildren = () => {
    if (showOptionalEmailVerify) {
      return (
        <OptionalEmailVerify
          onFinish={() => {
            modal.close();
            reloadPage();
          }}
        />
      );
    }

    if (showOptionalWalletConnect) {
      return (
        <OptionalWalletConnect
          onFinish={() => {
            modal.close();
            reloadPage();
          }}
        />
      );
    }

    if (showCode) {
      return (
        <CodeVerification
          resending={resending}
          loading={loadingEmail}
          codeSent={codeSent}
          onResend={() => resendCode(email)}
          error={error}
          email={email}
          onSubmit={(code) => processCode(email, code)}
        />
      );
    }

    return (
      <>
        <EmailAndOidcs
          loading={loadingEmail}
          disabled={loadingOidc || loadingWallet}
          onSubmitEmail={(email) => {
            setEmail(email);
            processEmail(email);
          }}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 13,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <OidcButtons disabled={loadingEmail || loadingWallet} loading={loadingOidc} onSelect={processOidc} />
          <WalletButton disabled={loadingEmail || loadingOidc} loading={loadingWallet} onSignature={processSignature}>
            <span>Wallet</span>
          </WalletButton>
        </div>
      </>
    );
  };

  return (
    <div style={{ padding: 21, gap: 13, display: 'flex', flexDirection: 'column', width: 400 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 13, alignItems: 'center' }}>
        <div>Login / Signup</div>
        <Button onClick={() => modal.close()}>X</Button>
      </div>

      {renderChildren()}
    </div>
  );
}

function LoginSignup() {
  return (
    <Web3Provider>
      <UnifiedLoginSignupModal />
    </Web3Provider>
  );
}

export function useSignIn() {
  const { signIn } = useOAuth2();
  const hydraClientId = useAtomValue(hydraClientIdAtom);

  return () => {
    if (hydraClientId) {
      signIn();
      return;
    }

    modal.open(LoginSignup, {});
  };
}
