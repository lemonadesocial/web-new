import { useState } from "react";
import { ory } from '$lib/utils/ory';
import { useSetAtom } from "jotai";

import { Button, ErrorText, Input, LabeledInput, modal, ModalContent, toast } from "$lib/components/core";
import { useHandleEmail, useHandleOidc, useHandleSignature } from "$lib/hooks/useSignIn";
import { EMAIL_REGEX } from "$lib/utils/regex";
import { sessionAtom } from "$lib/jotai";
import { appKit } from '$lib/utils/appkit';
import { useSignWallet } from "$lib/hooks/useSignWallet";

import { CodeVerification } from "./CodeVerification";
import { VerifyEmailModal } from "./VerifyEmailModal";
import { ConnectWalletModal } from "./ConnectWalletModal";
import { ConnectWalletButton } from "./ConnectWalletButton";

export function AuthModal() {
  const signWallet = useSignWallet();

  const [email, setEmail] = useState('');
  const [currentProvider, setCurrentProvider] = useState<string>();
  const setSession = useSetAtom(sessionAtom);

  const onSignInSuccess = async () => {
    if (!ory) return;

    const session = await ory.toSession().then((res) => res.data);

    if (session.identity?.id) {
      setSession({
        _id: session.identity.id,
        email: session.identity?.traits?.email,
        wallet: session.identity?.traits?.wallet,
      });
    }

    modal.close();

    if (!session.identity?.traits?.email) {
      modal.open(VerifyEmailModal);

      return;
    }

    if (!session.identity?.traits?.wallet) {
      modal.open(ConnectWalletModal, {
        props: {
          verifyRequired: true
        },
      });
    }
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
    reset,
  } = useHandleEmail({
    onSuccess: onSignInSuccess,
  });

  const { processOidc, loading: loadingOidc } = useHandleOidc();
  const { processSignature, loading: loadingWallet, error: errorWallet } = useHandleSignature({
    onSuccess: onSignInSuccess,
  });

  const onConnect = () => {
    const address = appKit.getAddress();

    if (!address) {
      toast.error('Could not find wallet address. Please try again.');
      return;
    }

    signWallet().then(({ signature, token }) => {
      processSignature(signature, token, address);
    }).catch((err) => {
      toast.error(err.message);
    });
  };

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
        onBack={reset}
      />
    );
  }

  const loadingOidcOrWallet = loadingOidc || loadingWallet;

  return (
    <ModalContent icon="icon-login">
      <div className="space-y-4">
        <div>
          <p className="text-lg">Welcome to Lemonade</p>
          <p className="text-sm text-secondary">Please sign in or sign up below.</p>
        </div>

        <LabeledInput label="Email">
          <Input
            disabled={loadingEmail}
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined"
          />
        </LabeledInput>

        <Button
          variant="secondary"
          className="w-full"
          onClick={() => {
            if (!EMAIL_REGEX.test(email)) {
              toast.error('Please enter a valid email');
              return;
            }
            processEmail(email);
          }}
          loading={loadingEmail}
          disabled={loadingEmail || loadingOidcOrWallet}
        >
          Continue with Email
        </Button>

        <hr className="border-t -mx-4" />

        <div className="flex gap-2">
          <Button
            className="flex-1"
            variant="tertiary"
            icon="icon-google"
            disabled={loadingOidcOrWallet}
            loading={loadingOidc && currentProvider === 'google'}
            onClick={() => {
              setCurrentProvider('google');
              processOidc('google');
            }}
          />
          <Button
            className="flex-1"
            variant="tertiary"
            icon="icon-apple"
            disabled={loadingOidcOrWallet}
            loading={loadingOidc && currentProvider === 'apple'}
            onClick={() => {
              setCurrentProvider('apple');
              processOidc('apple');
            }}
          />
          <ConnectWalletButton onConnect={onConnect}>
            {(open) => (
              <Button
                className="flex-1"
                variant="tertiary"
                icon="icon-wallet"
                disabled={loadingOidcOrWallet}
                loading={loadingWallet}
                onClick={open}
              />
            )}
          </ConnectWalletButton>
        </div>

        {errorWallet && <ErrorText message={errorWallet} />}
      </div>
    </ModalContent>
  );
}
