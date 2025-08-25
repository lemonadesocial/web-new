import { useState } from "react";

import { Button, ErrorText, Input, modal, ModalContent, toast } from "$lib/components/core";
import { EMAIL_REGEX } from "$lib/utils/regex";
import { CodeVerification } from "./CodeVerification";
import { useHandleVerifyEmail } from "$lib/hooks/useSignIn";
import { completeProfile } from "./utils";

export function VerifyEmailModal() {
  const { processEmail, processCode, resendCode, showCode, error, codeSent, resending, loading, reset } = useHandleVerifyEmail(
    {
      onSuccess: () => {
        modal.close();
        // TODO: update me
      },
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
        onBack={reset}
      />
    );
  }

  return (
    <ModalContent icon="icon-email">
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-lg">Verify Your Email</p>
          <p className="text-secondary text-sm">
            If you have attended Lemonade events in the past, enter the same email you used to register.
          </p>
        </div>

        <div className="space-y-2">
          <Input
            placeholder="you@email.com"
            className="w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && <ErrorText message={error} />}
        </div>

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
          loading={loading}
        >
          Continue
        </Button>
        <p
          className="w-full text-tertiary text-center cursor-pointer"
          onClick={() => {
            completeProfile();
            modal.close();
          }}
        >
          Do It Later
        </p>
      </div>
    </ModalContent>
  );
}
