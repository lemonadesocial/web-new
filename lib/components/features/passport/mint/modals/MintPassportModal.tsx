'use client';
import React from 'react';
import { Button, modal, ModalContent } from '$lib/components/core';
import { ethers } from 'ethers';
import { ASSET_PREFIX, ETHERSCAN } from '$lib/utils/constants';
import { PassportPreview } from '../preview';
import { InsufficientFundsModal } from '$lib/components/features/modals/InsufficientFundsModal';

export function MintPassportModal({ onComplete }: { onComplete: (mintState: any) => void }) {
  const mintPrice = 0.01;
  const [isMinting, setIsMinting] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [count, setCount] = React.useState(10);
  const [mintState, setMintState] = React.useState({
    minted: false,
    video: false,
    mute: true,
    txHash: '',
    tokenId: '',
    contract: '',
  });

  React.useEffect(() => {
    if (count === 0) {
      modal.close();
      onComplete({ ...mintState, minted: true, video: true });
    }
  }, [count, mintState]);

  // TODO: Update handle mint logic
  const handleMint = async () => {
    // NOTE: this handle show InsufficientFunds
    // modal.open(InsufficientFundsModal, {
    //   onClose: () => setIsMinting(false),
    //   props: {
    //     message: `Make sure you have enough ETH to mint your Passport. Add funds and try again, or switch wallets.`,
    //     onRetry: () => {
    //       modal.close();
    //       handleMint();
    //     },
    //   },
    // });

    setIsMinting(true);
    await sleep(1000);
    setIsMinting(false);
    setMintState((prev) => ({ ...prev, txHash: 'UPDATE_TX_HASH' }));
    await sleep(2000);

    setDone(true);

    setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000);
  };

  if (mintState.txHash) {
    return (
      <ModalContent
        icon={
          <div className="size-[56px] flex justify-center items-center rounded-full bg-background/64 border border-primary/8">
            {done ? <p>{count}</p> : <i className="icon-loader animate-spin" />}
          </div>
        }
        title={
          <Button
            size="sm"
            iconRight="icon-arrow-outward"
            className="rounded-full"
            variant="tertiary-alt"
            onClick={() => window.open(`${ETHERSCAN}/tx/${mintState.txHash}`)}
          >
            View txn.
          </Button>
        }
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-lg">{done ? 'Verifying Transaction' : 'Processing Payment'}</p>
            <p className="text-sm">
              {done
                ? 'Almost there! We’re confirming your transaction and preparing your custom Passport. Thanks for your patience!'
                : `We’re securing your payment and locking in your Passport. This won’t take long — hang tight while we get things ready.`}
            </p>
          </div>
        </div>
      </ModalContent>
    );
  }

  return (
    <ModalContent
      icon={<img src={`${ASSET_PREFIX}/assets/images/passport.png`} className="w-full object-cover aspect-[45/28]" />}
      onClose={() => modal.close()}
      className="**:data-icon:rounded-md **:data-icon:w-[90px]"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-lg">Claim Your Passport</p>
          <p className="text-sm">
            You’re just one step away from owning your unique & personalized Passport. Mint & claim your on-chain
            identity.
          </p>
        </div>

        <Button variant="secondary" onClick={handleMint} loading={isMinting}>
          {/* Mint {mintPrice && +mintPrice > 0 ? `‣ ${ethers.formatEther(mintPrice)} ETH` : '‣ Free'} */}
          Mint {mintPrice && +mintPrice > 0 ? `‣ ${mintPrice} ETH` : '‣ Free'}
        </Button>
      </div>
    </ModalContent>
  );
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
