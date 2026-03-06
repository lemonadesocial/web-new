'use client';
import { useState } from 'react';
import { type Address, type EIP1193Provider } from 'viem';
import * as Sentry from '@sentry/nextjs';

import { toast } from '$lib/components/core';
import { Chain } from '$lib/graphql/generated/backend/graphql';
import { StakingManagerClient } from '$lib/services/coin/StakingManagerClient';
import { createViemClients } from '$lib/utils/crypto';
import { formatError } from '$lib/utils/error';
import { appKit } from '$lib/utils/appkit';
import ERC20 from '$lib/abis/ERC20.json';

export type StepStatus = 'pending' | 'loading' | 'completed' | 'error';

interface UseStakeDepositParams {
  chain?: Chain;
  stakingToken?: string;
  stakingManagerAddress: string;
  onSuccess?: () => void;
}

export function useStakeDeposit({ chain, stakingToken, stakingManagerAddress, onSuccess }: UseStakeDepositParams) {
  const [isDepositing, setIsDepositing] = useState(false);
  const [approveStatus, setApproveStatus] = useState<StepStatus>('pending');
  const [stakeStatus, setStakeStatus] = useState<StepStatus>('pending');
  const [approveTxHash, setApproveTxHash] = useState<string | null>(null);
  const [stakeTxHash, setStakeTxHash] = useState<string | null>(null);

  const reset = () => {
    setIsDepositing(false);
    setApproveStatus('pending');
    setStakeStatus('pending');
    setApproveTxHash(null);
    setStakeTxHash(null);
  };

  const deposit = async (amount: bigint) => {
    if (!chain || !stakingToken) {
      toast.error('Missing required data');
      return;
    }

    const walletProvider = appKit.getProvider('eip155');
    const userAddress = appKit.getAddress();

    if (!walletProvider || !userAddress) {
      toast.error('Wallet isn\'t fully connected yet. Please try again in a moment.');
      return;
    }

    setIsDepositing(true);
    setApproveStatus('loading');
    setStakeStatus('pending');

    const { walletClient, publicClient, account } = await createViemClients(chain.chain_id, walletProvider as EIP1193Provider);

    const approveHash = await walletClient.writeContract({
      abi: ERC20,
      address: stakingToken as Address,
      functionName: 'approve',
      args: [stakingManagerAddress as Address, amount],
      account,
      chain: walletClient.chain,
    });
    setApproveTxHash(approveHash);
    await publicClient.waitForTransactionReceipt({ hash: approveHash });
    setApproveStatus('completed');

    setStakeStatus('loading');
    const stakingClient = StakingManagerClient.getInstance(chain, stakingManagerAddress, walletClient);
    const txHash = await stakingClient.stake(amount);
    setStakeTxHash(txHash);
    await publicClient.waitForTransactionReceipt({ hash: txHash as `0x${string}` });
    setStakeStatus('completed');

    onSuccess?.();
  };

  const handleDeposit = (amount: bigint) => {
    deposit(amount).catch((error) => {
      Sentry.captureException(error);
      toast.error(formatError(error));
      setIsDepositing(false);
      if (approveStatus === 'loading') {
        setApproveStatus('error');
      }
      if (stakeStatus === 'loading') {
        setStakeStatus('error');
      }
    });
  };

  return {
    isDepositing,
    approveStatus,
    stakeStatus,
    approveTxHash,
    stakeTxHash,
    handleDeposit,
    reset,
  };
}

export function StepIcon({ status }: { status: StepStatus }) {
  if (status === 'completed') {
    return <i aria-hidden="true" className="icon-check-filled size-4 text-success-500" />;
  }
  if (status === 'loading') {
    return <i aria-hidden="true" className="icon-loader size-4 text-tertiary animate-spin" />;
  }
  if (status === 'error') {
    return <i aria-hidden="true" className="icon-error size-4 text-danger-500" />;
  }
  return <i aria-hidden="true" className="icon-circle-outline size-4 text-tertiary" />;
}

