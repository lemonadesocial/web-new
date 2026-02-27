import { useState } from "react";
import { isAddress } from "viem";

import { Claim, TransferDocument } from "$lib/graphql/generated/wallet/graphql";
import { Button, Input, LabeledInput, ModalContent, toast } from "$lib/components/core";
import { modal } from "$lib/components/core";
import { formatWallet } from "$lib/utils/crypto";
import { TokenComplex } from "$lib/graphql/generated/metaverse/graphql";
import { useMutation } from "$lib/graphql/request";
import { walletClient } from "$lib/graphql/request/instances";

export function TransferCollectible({ claim, token }: { claim: Claim; token: TokenComplex; }) {
  const [walletAddress, setWalletAddress] = useState('');
  const [step, setStep] = useState<'confirm' |'input'>('input');

  const [transfer, { loading }] = useMutation(TransferDocument, {
    onComplete() {
      modal.close();
    },
    onError(error) {
      toast.error(error.message);
    },
  }, walletClient);

  if (step === 'confirm') return (
    <ModalContent
      title="Confirm Transfer"
      onClose={() => modal.close()}
      onBack={() => setStep('input')}
    >
      <div className="space-y-2">
        <div className="flex gap-3">
          <div className="size-[34px] flex justify-center items-center rounded-full bg-primary/8">
            <i aria-hidden="true" className="icon-wallet text-tertiary size-[18px]" />
          </div>
          <div className="space-y-[2px]">
            <p className="text-xs text-tertiary">Destination Wallet</p>
            <p>{formatWallet(walletAddress!)}</p>
          </div>
        </div>
        <p className="text-secondary">
          You&apos;re about to send {token.metadata.name} to the above wallet address.
        </p>
        <p className="text-sm text-tertiary">
          This action is irreversible. Once transferred, it will no longer be in your Lemonade wallet.
        </p>
      </div>
      <Button
        className="w-full mt-4"
        variant="secondary"
        loading={loading}
        onClick={() => {
          transfer({
            variables: {
              input: {
                to: walletAddress,
                tokenId: claim.tokenId,
              },
              network: token.network,
              address: token.contract,
            }
          })
        }}
      >
        Transfer Collectible
      </Button>
    </ModalContent>
  );

  return (
    <ModalContent
      title="Transfer Collectible"
      onClose={() => modal.close()}
    >
      <div className="space-y-4">
        <p className="text-sm text-secondary">
          Enter the wallet address you&apos;d like to send this collectible to. Transfers are permanent, so double-check before proceeding.
        </p>
        <LabeledInput label="Destination Wallet Address">
          <Input
            placeholder="0x000000..."
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
          />
        </LabeledInput>
      </div>
      <Button
        variant="secondary"
        className="w-full mt-4"
        onClick={() => {
          if (!walletAddress || !isAddress(walletAddress)) {
            toast.error("Invalid wallet address");
            return;
          }

          setStep('confirm');
        }}
        disabled={!walletAddress}
      >
        Continue
      </Button>
    </ModalContent>
  );
}
