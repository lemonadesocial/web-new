import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { LoginFlow, RegistrationFlow, UiNodeInputAttributes } from '@ory/client';

import { hydraClientIdAtom } from '$lib/jotai';
import { ory } from '$lib/utils/ory';

import { modal } from '../components/core';
import { Input, Button } from '../components/core';

import { useOAuth2 } from './useOAuth2';

function getCsrfTokenFromFlow(flow: RegistrationFlow | LoginFlow) {
  const csrfNode = flow.ui.nodes.find(
    (node) => node.type === 'input' && 'name' in node.attributes && node.attributes.name === 'csrf_token',
  );

  if (!csrfNode) {
    return;
  }

  return (csrfNode.attributes as UiNodeInputAttributes).value;
}

const useHandleEmail = ({ onSuccess }: { onSuccess: () => void }) => {
  const [error, setError] = useState('');
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

  return { processEmail: tryLogin, showCode: !!flow, processCode: isSignup ? signupWithCode : loginWithCode, error };
};

const useHandleOidc = () => {
  const [flow, setFlow] = useState<LoginFlow | RegistrationFlow>();

  return { processOidc: () => {} };
};

function CodeVerification({
  error,
  email,
  onSubmit,
}: {
  error?: string;
  email: string;
  onSubmit: (code: string) => void;
}) {
  const [code, setCode] = useState('');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
      <div>An email had been sent to {email}</div>
      <Input onChange={(e) => setCode(e.target.value)} />
      {error && <div style={{ color: 'darkred' }}>{error}</div>}
      <Button disabled={!code} onClick={() => onSubmit(code)}>
        Continue
      </Button>
    </div>
  );
}

function EmailAndOidcs({ onSubmitEmail }: { onSubmitEmail: (email: string) => void }) {
  const [email, setEmail] = useState('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
        <Input placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Button disabled={!email} onClick={() => onSubmitEmail(email)}>
          Continue with Email
        </Button>
      </div>
    </div>
  );
}

const providers = ['google', 'apple'];

function OidcButtons() {
  return (
    <div style={{ display: 'flex', gap: 13, alignItems: 'center', justifyContent: 'space-between' }}>
      {providers.map((provider) => (
        <Button key={provider} style={{ flex: 1 }}>
          {provider}
        </Button>
      ))}
    </div>
  );
}

function UnifiedLoginSignupModal() {
  const { processEmail, processCode, showCode, error } = useHandleEmail({
    onSuccess: () => {
      modal.close();
      window.location.reload();
    },
  });

  const { processOidc } = useHandleOidc();

  const [email, setEmail] = useState('');

  return (
    <div style={{ padding: 21, gap: 13, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 13, alignItems: 'center' }}>
        <div>Login / Signup</div>
        <Button onClick={() => modal.close()}>X</Button>
      </div>

      {!showCode && (
        <>
          <EmailAndOidcs
            onSubmitEmail={(email) => {
              setEmail(email);
              processEmail(email);
            }}
          />
          <OidcButtons />
        </>
      )}
      {showCode && <CodeVerification error={error} email={email} onSubmit={(code) => processCode(email, code)} />}
    </div>
  );
}

function handleSignIn() {
  modal.open(UnifiedLoginSignupModal, {});
}

export function useSignIn() {
  const { signIn } = useOAuth2();
  const hydraClientId = useAtomValue(hydraClientIdAtom);

  return () => {
    if (hydraClientId) {
      signIn();
      return;
    }

    handleSignIn();
  };
}
