'use client';
import { useState } from "react";
import { useAtomValue } from 'jotai';

import { useAppKitAccount, useAppKitProvider } from "$lib/utils/appkit";
import { modal } from "$lib/components/core";
import { BrowserProvider, Eip1193Provider, Contract, ethers, JsonRpcProvider } from "ethers";
import { LaunchTokenTxParams, parseLogs } from "$lib/services/token-launch-pad";
import { chainsMapAtom } from '$lib/jotai';
import { LAUNCH_CHAIN_ID } from '$lib/utils/constants';
import { formatError } from "$lib/utils/crypto";
import ZapContractABI from "$lib/abis/token-launch-pad/FlaunchZap.json";
import TreasuryManagerABI from '$lib/abis/token-launch-pad/TreasuryManager.json';

import { SignTransactionModal } from "../modals/SignTransaction";
import { ConfirmTransaction } from "../modals/ConfirmTransaction";
import { SuccessModal } from "../modals/SuccessModal";
import { ErrorModal } from "../modals/ErrorModal";

import FlaunchABI from '$lib/abis/token-launch-pad/Flaunch.json';

interface CreateCoinModalProps {
  txParams: LaunchTokenTxParams;
  groupAddress?: string;
}

export function CreateCoinModal({ 
  txParams,
  groupAddress
}: CreateCoinModalProps) {
  const chainsMap = useAtomValue(chainsMapAtom);
  const launchChain = chainsMap[LAUNCH_CHAIN_ID];
  const { walletProvider } = useAppKitProvider('eip155');
  const [status, setStatus] = useState<'signing' | 'confirming' | 'depositing' | 'success' | 'none' | 'error'>('none');
  const [error, setError] = useState('');
  const [receipt, setReceipt] = useState<ethers.ContractTransactionReceipt | null>(null);
  const { address } = useAppKitAccount();

  const getSigner = async () => {
    const browserProvider = new BrowserProvider(walletProvider as Eip1193Provider);
    const signer = await browserProvider.getSigner();
    return signer;
  }

  const handleDepositToGroup = async (receipt: ethers.ContractTransactionReceipt) => {
    if (!walletProvider || !groupAddress) {
      throw new Error('Wallet not connected or group address missing');
    }

    const rpcProvider = new JsonRpcProvider(launchChain.rpc_url);
    const readContract = new ethers.Contract(launchChain.launchpad_zap_contract_address!, ZapContractABI.abi, rpcProvider);

    const flaunchAddress = await readContract.flaunchContract() as string;
  
    const flaunchInterface = new ethers.Interface(FlaunchABI.abi);
    const event = parseLogs(receipt, flaunchInterface).find(
      (log) => log.address == flaunchAddress.toLowerCase() && log.parsedLog.name === 'Transfer'
    );
  
    const tokenId = event?.parsedLog.args[2] as bigint;
  
    const signer = await getSigner();

    const flaunchContract = new ethers.Contract(flaunchAddress, FlaunchABI.abi, signer);
  
    setStatus('depositing');
  
    const approveTx = await flaunchContract.approve(groupAddress, tokenId);
    await approveTx.wait();
  
    const groupContract = new ethers.Contract(groupAddress, TreasuryManagerABI.abi, signer);
    const estimatedGas = await groupContract.deposit.estimateGas([flaunchAddress, tokenId], address, '0x');
    const depositTx = await groupContract.deposit([flaunchAddress, tokenId], address, '0x', {
      gasLimit: estimatedGas,
    });
    await depositTx.wait();

    setStatus('success');
  };

  const handleLaunch = async () => {
    try {
      setStatus('signing');

      if (!walletProvider) {
        throw new Error('Wallet not connected');
      }

      const signer = await getSigner();

      const writeContract = new Contract(launchChain.launchpad_zap_contract_address!, ZapContractABI.abi, signer);

      console.log(txParams)

      const estimatedGas = await writeContract.flaunch.estimateGas(...txParams.flaunchParams, { value: txParams.fee });
      
      const tx = await writeContract.flaunch(...txParams.flaunchParams, {
        value: txParams.fee,
        gasLimit: estimatedGas,
      });

      setStatus('confirming');

      const receipt = await tx.wait();

      if (groupAddress) {
        setReceipt(receipt);
        await handleDepositToGroup(receipt);
        return;
      }

      setStatus('success');
    } catch (err: any) {
      console.log(err)
      setError(formatError(err));
      setStatus('error');
    }
  };

  const handleRetry = async () => {
    if (receipt && groupAddress) {
      try {
        await handleDepositToGroup(receipt);
      } catch (err: any) {
        console.log(err)
        setError(formatError(err));
        setStatus('error');
      }

      return;
    }

    await handleLaunch();
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
        description="Almost there! We're confirming your transaction and deploying your token. Thank you for your patience!"
      />
    );
  }

  if (status === 'depositing') {
    return (
      <ConfirmTransaction 
        title="Depositing Token to Group" 
        description="We're depositing your token to the community group. This may take a few moments. An approval step may appear first."
      />
    );
  }

  if (status === 'error') {
    return (
      <ErrorModal
        title="Launch Failed"
        message={formatError(error)}
        onRetry={handleRetry}
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
