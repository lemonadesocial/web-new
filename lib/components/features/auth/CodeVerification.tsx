
import { useState, useEffect } from "react";
import { OTPInput, SlotProps } from 'input-otp';
import clsx from "clsx";

import { Button, ErrorText, ModalContent } from "$lib/components/core";

export function CodeVerification({
  loading,
  resending,
  error,
  email,
  codeSent,
  onResend,
  onSubmit,
  onBack
}: {
  loading?: boolean;
  resending?: boolean;
  error?: string;
  email: string;
  codeSent: boolean;
  onResend: () => void;
  onSubmit: (code: string) => void;
  onBack: () => void;
}) {
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (codeSent && countdown === 0) {
      setCountdown(60);
    }
  }, [codeSent]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handlePasteCode = async () => {
    const clipboard = await navigator.clipboard.readText();
    setCode(clipboard);
  };

  const canResend = countdown === 0;

  return (
    <ModalContent onBack={onBack}>
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-lg">Enter Code</p>
          <p className="text-sm text-secondary">
            {codeSent
              ? `Code resent! Please check your email.` : `Please enter the 6 digit code we sent to ${email}.`}
          </p>
        </div>

        <div className="space-y-2">
          <OTPInput
            maxLength={6}
            containerClassName="group flex items-center has-[:disabled]:opacity-30"
            render={({ slots }) => (
              <div className="flex gap-2 w-full">
                {slots.map((slot, idx) => (
                  <OTPSlot key={idx} {...slot} />
                ))}
              </div>
            )}
            value={code}
            onChange={(code) => setCode(code)}
            onComplete={onSubmit}
          />
          {error && <ErrorText message={error} />}
        </div>

        <div className="flex justify-between">
          <Button disabled={loading || resending} variant="tertiary" onClick={handlePasteCode} iconLeft="icon-paste">
            Paste Code
          </Button>
          <div className="flex gap-1 items-center">
            <Button
              variant="flat"
              disabled={loading || resending || !canResend}
              onClick={onResend}
            >
              {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
            </Button>
            {
              resending && <i aria-hidden="true" className="icon-loader animate-spin size-4 text-tertiary" />
            }
          </div>
        </div>
      </div>
    </ModalContent>
  );
}

function OTPSlot(props: SlotProps) {
  return (
    <div
      className={clsx(
        'relative flex-1 aspect-square text-lg font-medium',
        'flex items-center justify-center',
        'transition-all duration-300',
        'border rounded-sm',
        { 'border-primary': props.isActive },
      )}
    >
      {props.char !== null && <div>{props.char}</div>}
    </div>
  )
}
