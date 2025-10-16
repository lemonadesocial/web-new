'use client';
import { useState } from 'react';
import { Eip1193Provider, ethers } from 'ethers';
import { useAtomValue } from 'jotai';
import * as Sentry from '@sentry/nextjs';

import { Button, modal, ModalContent, toast } from '$lib/components/core';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { appKit, useAppKitProvider } from '$lib/utils/appkit';
import { formatError, LemonadePassportContract, writeContract } from '$lib/utils/crypto';
import { SignTransactionModal } from '$lib/components/features/modals/SignTransaction';
import { ConfirmTransaction } from '$lib/components/features/modals/ConfirmTransaction';
import { PASSPORT_CHAIN_ID } from '../utils';
import { chainsMapAtom } from '$lib/jotai';
import LemonadePassport from '$lib/abis/LemonadePassport.json';

type MintData = {
  signature: string;
  price: string;
  metadata: string;
};

export function MintPassportModal({ 
  onComplete,
  mintData 
}: { 
  onComplete: (txHash: string, tokenId: string) => void;
  mintData: MintData;
}) {
  const { walletProvider } = useAppKitProvider('eip155');
  const chainsMap = useAtomValue(chainsMapAtom);
  const [status, setStatus] = useState<'signing' | 'confirming' | 'success' | 'none'>('none');

  const handleMint = async () => {
    try {
      if (!mintData) {
        throw new Error('Mint data not found');
      }

      const contractAddress = chainsMap[PASSPORT_CHAIN_ID]?.lemonade_passport_contract_address;
      
      if (!contractAddress) {
        throw new Error('Passport contract address not configured');
      }

      setStatus('signing');
      
      const transaction = await writeContract(
        LemonadePassportContract,
        contractAddress,
        walletProvider as Eip1193Provider,
        'mint',
        [mintData.metadata, mintData.signature],
        { value: mintData.price }
      );

      const txHash = transaction.hash;

      setStatus('confirming');

      const receipt = await transaction.wait();
      const iface = new ethers.Interface(LemonadePassport.abi);

      let parsedTransferLog: any = null;

      receipt.logs.some((log: any) => {
        try {
          const parsedLog = iface.parseLog(log);
          if (parsedLog?.name === 'Transfer') {
            parsedTransferLog = parsedLog;
            return true;
          }

          return false;
        } catch (error) {
          return false;
        }
      });

      let tokenId = '';

      if (parsedTransferLog) {
        tokenId = parsedTransferLog.args?.tokenId?.toString();
      }

      modal.close();
      onComplete(txHash, tokenId);
    } catch (error: any) {
      Sentry.captureException(error, {
        extra: {
          walletInfo: appKit.getWalletInfo(),
        },
      });
      toast.error(formatError(error));
      setStatus('none');
    }
  };

  if (status === 'confirming') {
    return (
      <ConfirmTransaction 
        title="Confirming Transaction" 
        description="Please wait while your transaction is being confirmed on the blockchain."
      />
    );
  }

  if (status === 'signing') {
    return (
      <SignTransactionModal
        onClose={() => modal.close()}
        description="Please sign the transaction to pay gas fees & claim your Passport."
        onSign={handleMint}
        loading={true}
      />
    );
  }

  return (
    <ModalContent
      icon={<img src={`${ASSET_PREFIX}/assets/images/passport.png`} className="w-full object-cover aspect-[45/28]" />}
      onClose={() => modal.close()}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-lg">Claim Your Passport</p>
          <p className="text-sm">
            You're just one step away from owning your unique & personalized Passport. Mint & claim your on-chain
            identity.
          </p>
        </div>

        <Button variant="secondary" onClick={handleMint}>
          Mint {mintData?.price && +mintData.price > 0 ? `‣ ${ethers.formatEther(mintData.price)} ETH` : '‣ Free'}
        </Button>
      </div>
    </ModalContent>
  );
}
