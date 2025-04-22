import { Button, ModalContent } from "$lib/components/core";
import { useAppKitAccount } from "$lib/utils/appkit";
import { formatWallet } from "$lib/utils/crypto";

interface SignTransactionModalProps {
  onSign: () => void;
  title?: React.ReactNode;
  description?: string;
  onClose?: () => void;
  loading?: boolean;
}

export function SignTransactionModal({ onClose, title, description, loading, onSign }: SignTransactionModalProps) {
  const { address } = useAppKitAccount();

  return (
    <ModalContent title={title} onClose={onClose}>
      <div className="space-y-2">
        <div className="flex gap-3">
          <div className="size-[34px] flex justify-center items-center rounded-full bg-primary/8">
            <i className="icon-wallet text-tertiary size-[18px]" />
          </div>
          {
            address && (
              <div className="space-y-[2px]">
                <p className="text-xs text-tertiary">Connected Wallet</p>
                <p>{formatWallet(address)}</p>
              </div>
            )
          }
        </div>
        <p>
          {description}
        </p>
      </div>
      <Button
        className="w-full mt-4"
        variant="secondary"
        onClick={onSign}
        disabled={loading}
      >
        {loading ? 'Waiting for Signature...' : 'Sign Transaction'}
      </Button>
    </ModalContent>
  )
}

