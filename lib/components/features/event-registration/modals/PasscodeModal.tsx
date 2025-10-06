import { useState } from 'react';

import { Button, Input, ModalContent, toast } from '$lib/components/core';
// import { CheckTicketTypePasscodeDocument } from '$lib/graphql/generated/backend/graphql';
import { useMutation } from '$lib/graphql/request';
import { registrationModal, ticketPasscodesAtom, useAtom } from '../store';

interface PasscodeModalProps {
  ticketTypeId: string;
  ticketTitle: string;
  onConfirm: () => void;
}

export function PasscodeModal({ ticketTypeId, ticketTitle, onConfirm }: PasscodeModalProps) {
  const [ticketPasscodes, setTicketPasscodes] = useAtom(ticketPasscodesAtom);
  const [passcode, setPasscode] = useState(ticketPasscodes[ticketTypeId] || '');
  const checkPasscode = () => {};
  const loading = false;

  // const [checkPasscode, { loading }] = useMutation(CheckTicketTypePasscodeDocument, {
  //   onComplete: (_, data) => {
  //     if (data?.checkTicketTypePasscode) {
  //       setTicketPasscodes({
  //         ...ticketPasscodes,
  //         [ticketTypeId]: passcode.trim(),
  //       });
  //
  //       registrationModal.close();
  //       onConfirm();
  //     } else {
  //       toast.error('Invalid passcode. Please try again.');
  //     }
  //   },
  //   onError: () => {
  //     toast.error('Error validating passcode. Please try again.');
  //   },
  // });

  const handleConfirm = () => {
    if (!passcode.trim()) return;

    checkPasscode({
      variables: {
        passcode: passcode.trim(),
        type: ticketTypeId,
      },
    });
  };

  return (
    <ModalContent title="Enter Passcode" onClose={() => registrationModal.close()}>
      <div className="space-y-2">
        <div className="flex gap-3 items-center">
          <div className="size-[34px] flex justify-center items-center rounded-full bg-primary/8">
            <i className="icon-lock text-tertiary size-[18px]" />
          </div>
          <p>{ticketTitle}</p>
        </div>
        <p className="text-secondary">
          This ticket requires a passcode. Enter it below to continue with your registration.
        </p>
      </div>

      <Input
        type="password"
        placeholder="Passcode"
        value={passcode}
        onChange={(e) => setPasscode(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleConfirm();
          }
        }}
        autoFocus
        className="mt-4"
      />

      <Button
        variant="secondary"
        className="w-full mt-4"
        onClick={handleConfirm}
        disabled={!passcode.trim()}
        loading={loading}
      >
        Confirm
      </Button>
    </ModalContent>
  );
}
