import React from 'react';
import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import { truncateMiddle } from '$lib/utils/string';
import { Button, Card, modal, ModalContent } from '$lib/components/core';

interface Props {
  onRetry: () => void;
  message: string;
}

export function InsufficientFundsModal({ message, onRetry }: Props) {
  const { isConnected, address } = useAppKitAccount();
  const { open } = useAppKit();

  React.useEffect(() => {
    if (!isConnected) modal.close();
  }, [isConnected]);

  return (
    <ModalContent
      icon={
        <div className="size-[56px] flex justify-center items-center rounded-full bg-danger-400/16" data-icon>
          <i className="icon-info text-danger-400 size-8" />
        </div>
      }
      onClose={() => modal.close()}
      className="**:data-icon:rounded-full"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-lg">Insufficient Funds</p>
          <p className="text-sm text-secondary">{message}</p>
        </div>

        <Card.Root className="border-none bg-none">
          <Card.Content className="justify-between flex items-center py-2 px-3">
            <div className="flex gap-3">
              <i className="icon-wallet size-5 aspect-square text-tertiary" />
              {address && <p>{truncateMiddle(address, 6, 4)}</p>}
            </div>
            <i
              className="icon-edit-sharp size-5 aspect-square text-quaternary hover:text-primary"
              onClick={() => open()}
            />
          </Card.Content>
        </Card.Root>

        <Button variant="secondary" className="w-full" onClick={onRetry}>
          Try Again
        </Button>
      </div>
    </ModalContent>
  );
}
