import { useState } from "react";
import { ory } from '$lib/utils/ory';
import { useSetAtom } from "jotai";

import { Button, ErrorText, Input, LabeledInput, modal, ModalContent, toast } from "$lib/components/core";
import { useHandleEmail, useHandleOidc, useHandleSignature } from "$lib/hooks/useSignIn";
import { EMAIL_REGEX } from "$lib/utils/regex";
import { Session, sessionAtom } from "$lib/jotai";
import { appKit } from '$lib/utils/appkit';
import { IDENTITY_TOKEN_KEY } from "$lib/utils/constants";
import { useSignWallet } from "$lib/hooks/useSignWallet";
import { useHandleFarcasterAuthKit } from "$lib/hooks/useConnectFarcaster";

import { CodeVerification } from "./CodeVerification";
import { VerifyEmailModal } from "./VerifyEmailModal";
import { ConnectWalletModal } from "./ConnectWalletModal";
import { ConnectWalletButton } from "./ConnectWalletButton";
import { formatError } from "$lib/utils/crypto";
import { useClient } from "$lib/graphql/request";
import { GetMeDocument } from "$lib/graphql/generated/backend/graphql";
import { FarcasterConnectButton } from "./FarcasterConnectButton";

interface Props {
  onSuccess?: () => void;
}
export function AuthModal({ onSuccess }: Props) {
  const signWallet = useSignWallet();
  const { processAuthKitPayload } = useHandleFarcasterAuthKit();
  const { client } = useClient();

  const [email, setEmail] = useState('');
  const [currentProvider, setCurrentProvider] = useState<string>();
  const setSession = useSetAtom(sessionAtom);

  const onSignInSuccess = async (token?: string) => {
    if (onSuccess) {
      onSuccess();
      return;
    }

    if (token) {
      localStorage.setItem(IDENTITY_TOKEN_KEY, token);
      setSession({ token } as Session);
      modal.close();

      const meData = await client.query({
        query: GetMeDocument,
        fetchPolicy: 'network-only',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!meData.data?.getMe) return;

      if (!meData.data.getMe.email_verified) {
        modal.open(VerifyEmailModal);
        return;
      }

      if (!meData.data.getMe.kratos_wallet_address) {
        modal.open(ConnectWalletModal, {
          props: {
            verifyRequired: true
          },
        });
      }

      return;
    }

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
      toast.error(formatError(err.message));
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
            onChange={(e) => setEmail(e.target.value.toLowerCase())}
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
            aria-label="Sign in with Google"
          />
          <ConnectWalletButton onConnect={onConnect}>
            {(open) => (
              <Button
                className="flex-1"
                variant="tertiary"
                icon="icon-wallet text-blue-400"
                disabled={loadingOidcOrWallet}
                loading={loadingWallet}
                onClick={open}
                aria-label="Connect wallet"
              />
            )}
          </ConnectWalletButton>
          <FarcasterConnectButton
            onSuccess={(data, signedNonce) => {
              modal.close();
              processAuthKitPayload(data, signedNonce, onSignInSuccess);
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
            aria-label="Sign in with Apple"
          />
        </div>

        {errorWallet && <ErrorText message={errorWallet} />}
      </div>
    </ModalContent>
  );
}
