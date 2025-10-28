'use client';
import { useState } from "react";
import { useAtomValue } from 'jotai';

import { useAppKitProvider } from "$lib/utils/appkit";
import { modal } from "$lib/components/core";
import { BrowserProvider, Eip1193Provider, Contract } from "ethers";
import { LaunchTokenTxParams } from "$lib/services/token-launch-pad";
import { chainsMapAtom } from '$lib/jotai';
import { LAUNCH_CHAIN_ID } from '$lib/utils/constants';
import { formatError } from "$lib/utils/crypto";
import ZapContractABI from "$lib/abis/token-launch-pad/FlaunchZap.json";

import { SignTransactionModal } from "../modals/SignTransaction";
import { ConfirmTransaction } from "../modals/ConfirmTransaction";
import { SuccessModal } from "../modals/SuccessModal";
import { ErrorModal } from "../modals/ErrorModal";

interface CreateCoinModalProps {
  txParams: LaunchTokenTxParams;
}

export function CreateCoinModal({ 
  txParams
}: CreateCoinModalProps) {
  const chainsMap = useAtomValue(chainsMapAtom);
  const launchChain = chainsMap[LAUNCH_CHAIN_ID];
  const { walletProvider } = useAppKitProvider('eip155');
  const [status, setStatus] = useState<'signing' | 'confirming' | 'success' | 'none' | 'error'>('none');
  const [error, setError] = useState('');

  const handleLaunch = async () => {
    try {
      setStatus('signing');

      if (!walletProvider) {
        throw new Error('Wallet not connected');
      }

      const browserProvider = new BrowserProvider(walletProvider as Eip1193Provider);
      const signer = await browserProvider.getSigner();

      const writeContract = new Contract(launchChain.launchpad_zap_contract_address!, ZapContractABI.abi, signer);

      const estimatedGas = await writeContract.flaunch.estimateGas(...txParams.flaunchParams, { value: txParams.fee });
      
      const tx = await writeContract.flaunch(...txParams.flaunchParams, {
        value: txParams.fee,
        gasLimit: estimatedGas,
      });

      setStatus('confirming');

      await tx.wait();

      setStatus('success');
    } catch (err: any) {
      setError(formatError(err));
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <SuccessModal 
        title="You’re Token is Live!"
        description="Congratulations! Your payment has been confirmed, and your token is ready to use."
        onClose={() => modal.close()}
      />
    );
  }

  if (status === 'confirming') {
    return (
      <ConfirmTransaction 
        title="Deploying Token" 
        description="Almost there! We’re confirming your transaction and deploying your token. Thank you for your patience!"
      />
    );
  }

  if (status === 'error') {
    return (
      <ErrorModal
        title="Launch Failed"
        message={formatError(error)}
        onRetry={handleLaunch}
        onClose={() => modal.close()}
      />
    );
  }

  return (
    <SignTransactionModal
      title="Confirm Payment"
      onClose={() => modal.close()}
      description={`Please sign the transaction on ${launchChain.name} & deploy your token. An approval step may appear first..`}
      onSign={handleLaunch}
      loading={status === 'signing'}
    />
  );
}
