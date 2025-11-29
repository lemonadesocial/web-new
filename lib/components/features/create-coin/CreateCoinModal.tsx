'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import * as Sentry from '@sentry/nextjs';

import { useAppKitAccount, useAppKitProvider } from "$lib/utils/appkit";
import { modal } from "$lib/components/core";
import { BrowserProvider, Eip1193Provider, Contract, ethers, JsonRpcProvider } from "ethers";
import { LaunchTokenTxParams, parseLogs } from "$lib/services/token-launch-pad";
import { Chain, AddLaunchpadCoinDocument } from "$lib/graphql/generated/backend/graphql";
import { formatError, getTransactionUrl } from "$lib/utils/crypto";
import ZapContractABI from "$lib/abis/token-launch-pad/FlaunchZap.json";
import TreasuryManagerABI from '$lib/abis/token-launch-pad/TreasuryManager.json';
import { useMutation } from "$lib/graphql/request";
import type { LaunchpadSocials } from "./CreateCoin";

import { SignTransactionModal } from "../modals/SignTransaction";
import { ConfirmTransaction } from "../modals/ConfirmTransaction";
import { ErrorModal } from "../modals/ErrorModal";

import FlaunchABI from '$lib/abis/token-launch-pad/Flaunch.json';
import { TxnConfirmedModal } from "./TxnConfirmedModal";

interface CreateCoinModalProps {
  txParams: LaunchTokenTxParams;
  groupAddress?: string;
  launchChain: Chain;
  socials: LaunchpadSocials;
}

export function CreateCoinModal({ 
  txParams,
  groupAddress,
  launchChain,
  socials
}: CreateCoinModalProps) {
  const { walletProvider } = useAppKitProvider('eip155');
  const [status, setStatus] = useState<'signing' | 'confirming' | 'depositing' | 'none' | 'error'>('none');
  const [error, setError] = useState('');
  const [flaunchAddress, setFlaunchAddress] = useState<string | null>(null);
  const [tokenId, setTokenId] = useState<bigint | null>(null);
  const { address } = useAppKitAccount();
  const [addLaunchpadCoinMutation] = useMutation(AddLaunchpadCoinDocument);
  const router = useRouter();

  const getSigner = async () => {
    const browserProvider = new BrowserProvider(walletProvider as Eip1193Provider);
    const signer = await browserProvider.getSigner();
    return signer;
  }

  const handleDepositToGroup = async (flaunchAddress: string, tokenId: bigint, memecoinAddress: string, txHash: string) => {
    if (!walletProvider || !groupAddress) {
      throw new Error('Wallet not connected or group address missing');
    }

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

    handleSuccess(memecoinAddress, txHash);
  };

  const handleLaunch = async () => {
    try {
      setStatus('signing');

      if (!walletProvider) {
        throw new Error('Wallet not connected');
      }

      const signer = await getSigner();

      const writeContract = new Contract(launchChain.launchpad_zap_contract_address!, ZapContractABI.abi, signer);

      const estimatedGas = await writeContract.flaunch.estimateGas(...txParams.flaunchParams, { value: txParams.fee });
      
      const tx = await writeContract.flaunch(...txParams.flaunchParams, {
        value: txParams.fee,
        gasLimit: estimatedGas,
      });

      setStatus('confirming');

      const receipt = await tx.wait();

      const rpcProvider = new JsonRpcProvider(launchChain.rpc_url);
      const zapContract = new ethers.Contract(launchChain.launchpad_zap_contract_address!, ZapContractABI.abi, rpcProvider);

      const flaunchAddress = await zapContract.flaunchContract() as string;
      setFlaunchAddress(flaunchAddress);

      const flaunchInterface = new ethers.Interface(FlaunchABI.abi);
      
      const event = parseLogs(receipt, flaunchInterface).find(
        log => log.address === flaunchAddress.toLowerCase() && log.parsedLog.name === 'Transfer'
      );

      const tokenId = event?.parsedLog.args[2] as bigint;
      setTokenId(tokenId);

      const flaunchContract = new ethers.Contract(flaunchAddress, FlaunchABI.abi, rpcProvider);
      const memecoinAddress = await flaunchContract.memecoin(tokenId) as string;
      if (!memecoinAddress) {
        throw new Error('Failed to determine memecoin address');
      }

      addLaunchpadCoinMutation({
        variables: {
          input: {
            address: memecoinAddress,
            handle_twitter: socials.twitter,
            handle_telegram: socials.telegram,
            handle_discord: socials.discord,
            handle_farcaster: socials.warpcast,
            website: socials.website,
          }
        }
      });

      if (groupAddress) {
        await handleDepositToGroup(flaunchAddress, tokenId, memecoinAddress, tx.hash);
        return;
      }

      handleSuccess(memecoinAddress, tx.hash);
    } catch (err: any) {
      Sentry.captureException(err);
      setError(formatError(err));
      setStatus('error');
    }
  };

  const handleRetry = async () => {
    if (flaunchAddress && tokenId && groupAddress) {
      try {
        await handleDepositToGroup(flaunchAddress, tokenId);
      } catch (err: any) {
        setError(formatError(err));
        setStatus('error');
      }

      return;
    }

    await handleLaunch();
  };

  const handleSuccess = (memecoinAddress: string, txHash: string) => {
    modal.close();
    modal.open(TxnConfirmedModal, {
      props: {
        title: 'Token Created',
        description: 'Congratulations! Your payment has been confirmed, and your token is ready to use.',
        txUrl: getTransactionUrl(launchChain, txHash)
      },
      onClose: () => {
        router.push(`/coin/${launchChain.code_name}/${memecoinAddress}`);
      }
    });
  };

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
