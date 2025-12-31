'use client';
import { useState, useEffect } from 'react';
import { BrowserProvider, Contract, type Eip1193Provider } from 'ethers';
import { parseUnits } from 'viem';
import * as Sentry from '@sentry/nextjs';

import { Button, ModalContent, Skeleton, modal, toast } from '$lib/components/core';
import { useTokenBalance } from '$lib/hooks/useBalance';
import { useTokenData } from '$lib/hooks/useCoin';
import { Chain, LaunchpadGroup } from '$lib/graphql/generated/backend/graphql';
import { StakingManagerClient } from '$lib/services/coin/StakingManagerClient';
import { SECONDS_PER_MONTH } from '$lib/services/token-launch-pad';
import { formatNumber } from '$lib/utils/number';
import { formatError, getTransactionUrl } from '$lib/utils/crypto';
import { appKit } from '$lib/utils/appkit';
import { ERC20 } from '$lib/abis/ERC20';
import { TxnConfirmedModal } from '../create-coin/TxnConfirmedModal';

type StepStatus = 'pending' | 'loading' | 'completed' | 'error';

interface JoinCommunityModalProps {
  launchpadGroup: LaunchpadGroup;
  stakingToken?: string;
  chain?: Chain;
}

export function JoinCommunityModal({ launchpadGroup, stakingToken, chain }: JoinCommunityModalProps) {
  const { tokenData } = useTokenData(chain, stakingToken);
  const { formattedBalance } = useTokenBalance(chain, stakingToken);

  const [depositAmount, setDepositAmount] = useState('');
  const [minStakeDuration, setMinStakeDuration] = useState<bigint | null>(null);
  const [isLoadingRequirements, setIsLoadingRequirements] = useState(true);
  const [isDepositing, setIsDepositing] = useState(false);
  const [approveStatus, setApproveStatus] = useState<StepStatus>('pending');
  const [stakeStatus, setStakeStatus] = useState<StepStatus>('pending');
  const [approveTxHash, setApproveTxHash] = useState<string | null>(null);

  useEffect(() => {
    if (!chain) return;

    const fetchRequirements = async () => {
      setIsLoadingRequirements(true);
      const client = StakingManagerClient.getInstance(chain, launchpadGroup.address);

      const duration = await client.getMinStakeDuration().catch(() => null);
      setMinStakeDuration(duration);

      setIsLoadingRequirements(false);
    };

    fetchRequirements();
  }, [chain, launchpadGroup.address]);

  const tokenSymbol = tokenData?.symbol || 'LSD';
  const balanceNumber = parseFloat(formattedBalance || '0');
  const depositNumber = parseFloat(depositAmount || '0');

  const minDurationMonths = minStakeDuration ? Number(minStakeDuration) / SECONDS_PER_MONTH : 12;

  const handleDeposit = async () => {
    if (!chain || !stakingToken || !tokenData) {
      toast.error('Missing required data');
      return;
    }

    const walletProvider = appKit.getProvider('eip155');
    const userAddress = appKit.getAddress();

    if (!walletProvider || !userAddress) {
      toast.error('Wallet isn\'t fully connected yet. Please try again in a moment.');
      return;
    }

    const amount = parseUnits(depositAmount, tokenData.decimals);

    setIsDepositing(true);
    setApproveStatus('loading');
    setStakeStatus('pending');

    const provider = new BrowserProvider(walletProvider as Eip1193Provider);
    const signer = await provider.getSigner();

    const tokenContract = new Contract(stakingToken, ERC20, signer);
    const approveTx = await tokenContract.approve(launchpadGroup.address, amount);
    const approveReceipt = await approveTx.wait();
    setApproveTxHash(approveReceipt.hash);
    setApproveStatus('completed');

    setStakeStatus('loading');
    const stakingClient = StakingManagerClient.getInstance(chain, launchpadGroup.address, signer);
    const stakeTxHash = await stakingClient.stake(amount);
    await provider.waitForTransaction(stakeTxHash);
    setStakeStatus('completed');

    modal.close();
    modal.open(TxnConfirmedModal, {
      props: {
        title: `Welcome to ${launchpadGroup.name}!`,
        description: `You've joined the community and can now launch your own tokens on it.`,
      }
    });
  };

  const handleDepositClick = () => {
    handleDeposit().catch((error) => {
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

  return (
    <ModalContent
      icon="icon-shield"
      onClose={() => modal.close()}
    >
      <div className="space-y-4">
        <div className="space-y-1">
          <p className="text-lg">Join {launchpadGroup.name}</p>
          <p className="text-sm text-secondary">
            Deposit {tokenSymbol} to join and add your own tokens to {launchpadGroup.name}.
          </p>
          <p className="text-sm text-secondary">
            Don't have enough {tokenSymbol}?{' '}
            <a
              href={stakingToken && chain ? `/coin/${chain.code_name}/${stakingToken}` : '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-400 hover:text-accent-300 underline"
            >
              Buy now.
            </a>
          </p>
        </div>

        <div className="rounded-sm bg-primary/8">
          <div className="py-2 px-3 space-y-2">
            <div className="flex justify-between items-center gap-2">
              <div className="flex h-6 px-2 items-center rounded-full bg-primary/8 gap-1.5 flex-shrink-0">
                {tokenData?.metadata?.imageUrl && (
                  <img
                    src={tokenData.metadata.imageUrl}
                    alt={tokenSymbol}
                    className="size-4 rounded-full object-cover flex-shrink-0"
                  />
                )}
                <p className="text-xs text-tertiary truncate">{tokenSymbol}</p>
              </div>
              <input
                type="text"
                placeholder="0.00"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                className="text-2xl bg-transparent border-none outline-none text-right flex-1 min-w-0"
                disabled={isDepositing}
              />
            </div>
            <p className="text-sm"><span className="text-tertiary">Balance:</span> {formatNumber(Number(formattedBalance))} {tokenSymbol}</p>
          </div>
          <hr className="border-t" />
          <div className="py-2 px-3 space-y-2">
            <p className="text-sm text-tertiary">Requirements</p>
            {isLoadingRequirements ? (
              <Skeleton className="h-5 w-48" animate />
            ) : (
              <div className="flex items-center gap-2">
                <i className="icon-clock size-5 text-tertiary" />
                <p className="text-sm">Minimum Duration: {Math.round(minDurationMonths)} months</p>
              </div>
            )}
          </div>
        </div>

        {isDepositing && (
          <div className="rounded-sm bg-primary/8 py-2 px-3 space-y-2">
            <p className="text-sm text-tertiary">Sign Transactions</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <StepIcon status={approveStatus} />
                <p className="text-sm">Approve {tokenSymbol} for staking</p>
                {approveTxHash && chain && (
                  <a
                    href={getTransactionUrl(chain, approveTxHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-tertiary hover:text-primary"
                  >
                    <i className="icon-arrow-top-right size-4" />
                  </a>
                )}
              </div>
              <div className="flex items-center gap-2">
                <StepIcon status={stakeStatus} />
                <p className="text-sm">Stake {tokenSymbol} to join</p>
              </div>
            </div>
          </div>
        )}

        <Button
          variant="secondary"
          onClick={handleDepositClick}
          className="w-full"
          disabled={!depositAmount || depositNumber <= 0 || depositNumber > balanceNumber || isDepositing}
        >
          Deposit {tokenSymbol}
        </Button>
      </div>
    </ModalContent>
  );
}

function StepIcon({ status }: { status: StepStatus }) {
  if (status === 'completed') {
    return <i className="icon-check-filled size-4 text-success-500" />;
  }
  if (status === 'loading') {
    return <i className="icon-loader size-4 text-tertiary animate-spin" />;
  }
  if (status === 'error') {
    return <i className="icon-error size-4 text-danger-500" />;
  }
  return <i className="icon-circle-outline size-4 text-tertiary" />;
}

