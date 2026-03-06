'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import * as Sentry from '@sentry/nextjs';

import { useAppKitAccount, useAppKitProvider } from "$lib/utils/appkit";
import { modal } from "$lib/components/core";
import { createPublicClient, decodeEventLog, formatEther, http, parseEventLogs, type Address } from "viem";
import { LaunchTokenTxParams } from "$lib/services/token-launch-pad";
import { Chain, AddLaunchpadCoinDocument } from "$lib/graphql/generated/backend/graphql";
import { createViemClients, getTransactionUrl, getViemChainConfig } from "$lib/utils/crypto";
import { formatError } from "$lib/utils/error";
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

  const handleDepositToGroup = async (flaunchAddress: string, tokenId: bigint, memecoinAddress: string, txHash: string) => {
    if (!walletProvider || !groupAddress) {
      throw new Error('Wallet not connected or group address missing');
    }

    const { walletClient, publicClient, account } = await createViemClients(launchChain.chain_id, walletProvider);

    const flaunchAddressTyped = flaunchAddress as Address;
    const groupAddressTyped = groupAddress as Address;

    setStatus('depositing');

    const approveHash = await walletClient.writeContract({
      abi: FlaunchABI.abi,
      address: flaunchAddressTyped,
      functionName: 'approve',
      args: [groupAddressTyped, tokenId],
      account,
      chain: walletClient.chain,
    });
    await publicClient.waitForTransactionReceipt({ hash: approveHash });

    const depositHash = await walletClient.writeContract({
      abi: TreasuryManagerABI.abi,
      address: groupAddressTyped,
      functionName: 'deposit',
      args: [[flaunchAddressTyped, tokenId], address as Address, '0x'],
      account,
      chain: walletClient.chain,
    });
    await publicClient.waitForTransactionReceipt({ hash: depositHash });

    handleSuccess(memecoinAddress, txHash);
  };

  const handleLaunch = async () => {
    try {
      setStatus('signing');

      if (!walletProvider) {
        throw new Error('Wallet not connected');
      }

      const { walletClient, publicClient, account } = await createViemClients(launchChain.chain_id, walletProvider);

      const zapAddress = launchChain.launchpad_zap_contract_address! as Address;

      const gas = await publicClient.estimateContractGas({
        abi: ZapContractABI.abi,
        address: zapAddress,
        functionName: 'flaunch',
        args: txParams.flaunchParams,
        value: txParams.fee,
        account,
      });

      const hash = await walletClient.writeContract({
        abi: ZapContractABI.abi,
        address: zapAddress,
        functionName: 'flaunch',
        args: txParams.flaunchParams,
        value: txParams.fee,
        account,
        chain: walletClient.chain,
        gas,
      });

      setStatus('confirming');

      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      const publicClientRead = createPublicClient({
        chain: getViemChainConfig(launchChain),
        transport: http(launchChain.rpc_url),
      });

      const flaunchAddress = await publicClientRead.readContract({
        abi: ZapContractABI.abi,
        address: zapAddress,
        functionName: 'flaunchContract',
      }) as string;
      setFlaunchAddress(flaunchAddress);

      const events = parseEventLogs({
        abi: FlaunchABI.abi as any,
        eventName: 'Transfer',
        logs: receipt.logs,
      });
      const event = (events.find(
        (log: any) => log.address?.toLowerCase?.() === flaunchAddress.toLowerCase(),
      ) ?? events[0]) as any;

      const tokenId = (event?.args as readonly unknown[] | undefined)?.[2] as bigint | undefined;
      setTokenId(tokenId ?? null);

      if (!tokenId) {
        throw new Error('Token ID not found');
      }

      const memecoinAddress = await publicClientRead.readContract({
        abi: FlaunchABI.abi,
        address: flaunchAddress as Address,
        functionName: 'memecoin',
        args: [tokenId],
      }) as string;
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
        await handleDepositToGroup(flaunchAddress, tokenId, memecoinAddress, hash);
        return;
      }

      handleSuccess(memecoinAddress, hash);
    } catch (err: unknown) {
      Sentry.captureException(err);
      setError(formatError(err));
      setStatus('error');
    }
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
