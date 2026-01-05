'use client';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { formatUnits, parseUnits } from 'viem';
import { BrowserProvider, type Eip1193Provider } from 'ethers';
import * as Sentry from '@sentry/nextjs';

import { useTokenData, useStakingAPR, useClaimableAmount } from '$lib/hooks/useCoin';
import { useTokenBalance } from '$lib/hooks/useBalance';
import { useStakeDeposit, StepIcon } from '$lib/hooks/useStakeDeposit';
import { Chain, LaunchpadGroup, Space } from '$lib/graphql/generated/backend/graphql';
import { communityAvatar } from '$lib/utils/community';
import { Button, modal, toast } from '$lib/components/core';
import { StakingManagerClient } from '$lib/services/coin/StakingManagerClient';
import { appKit } from '$lib/utils/appkit';
import { formatError, getTransactionUrl } from '$lib/utils/crypto';
import { formatNumber } from '$lib/utils/number';
import { JoinCommunityModal } from './JoinCommunityModal';
import { TxnConfirmedModal } from '../create-coin/TxnConfirmedModal';

interface StakingInfo {
  chain: Chain;
  stakingManagerAddress: string;
  stakingToken: string;
  tokenSymbol: string;
  tokenDecimals: number;
  positionAmount: bigint;
}

export function LaunchpadGroupCard({ launchpadGroup, space, stakingToken, chain }: { launchpadGroup: LaunchpadGroup; space?: Space | null; stakingToken?: string; chain?: Chain }) {
  const { tokenData } = useTokenData(chain, stakingToken);
  const [positionAmount, setPositionAmount] = useState<bigint | null>(null);

  useEffect(() => {
    if (!chain) return;

    const checkUserPosition = async () => {
      const userAddress = appKit.getAddress();
      if (!userAddress) return;

      const client = StakingManagerClient.getInstance(chain, launchpadGroup.address);
      const position = await client.userPositions(userAddress).catch(() => null);

      if (position && position.amount > 0n) {
        setPositionAmount(position.amount);
      }
    };

    checkUserPosition();
  }, [chain, launchpadGroup.address]);

  const handleJoinClick = () => {
    modal.open(JoinCommunityModal, {
      props: {
        launchpadGroup,
        stakingToken,
        chain,
      },
    });
  };

  const tokenSymbol = tokenData?.symbol || '';
  const tokenDecimals = tokenData?.decimals || 18;

  if (positionAmount !== null && chain && stakingToken) {
    const stakingInfo: StakingInfo = {
      chain,
      stakingManagerAddress: launchpadGroup.address,
      stakingToken,
      tokenSymbol,
      tokenDecimals,
      positionAmount,
    };

    return <StakingCard stakingInfo={stakingInfo} />;
  }

  return (
    <div className="rounded-md bg-card border-card-border flex flex-col gap-4 p-4">
      <div className="flex justify-between items-start">
        <img
          src={launchpadGroup.cover_photo_url || communityAvatar(space || undefined)}
          alt={launchpadGroup.name}
          className="size-12 aspect-square rounded-sm object-cover"
        />

        {tokenSymbol && (
          <div className="flex h-6 px-2 items-center rounded-full bg-primary/8 gap-1.5">
            {tokenData?.metadata?.imageUrl && (
              <img
                src={tokenData.metadata.imageUrl}
                alt={tokenSymbol}
                className="size-4 rounded-full object-cover"
              />
            )}
            <p className="text-xs text-tertiary">{tokenSymbol}</p>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">{launchpadGroup.name}</h3>
        {launchpadGroup.description && (
          <p className="text-sm text-tertiary line-clamp-2">{launchpadGroup.description}</p>
        )}
      </div>
      <Button variant="secondary" onClick={handleJoinClick} className="w-full">
        Join Community
      </Button>
    </div>
  );
}

type StakingTab = 'claim' | 'deposit' | 'withdraw';

function StakingCard({ stakingInfo }: { stakingInfo: StakingInfo }) {
  const [activeTab, setActiveTab] = useState<StakingTab>('claim');

  return (
    <div className="rounded-md bg-card border-card-border flex flex-col">
      <div className="grid grid-cols-3 border-b">
        <button
          onClick={() => setActiveTab('claim')}
          className={clsx(
            'py-2 text-center text-sm font-medium text-tertiary transition-colors',
            activeTab === 'claim' && 'border-b-2 border-primary'
          )}
        >
          Claim
        </button>
        <button
          onClick={() => setActiveTab('deposit')}
          className={clsx(
            'py-2 text-center text-sm font-medium text-tertiary transition-colors',
            activeTab === 'deposit' && 'border-b-2 border-primary'
          )}
        >
          Deposit
        </button>
        <button
          onClick={() => setActiveTab('withdraw')}
          className={clsx(
            'py-2 text-center text-sm font-medium text-tertiary transition-colors',
            activeTab === 'withdraw' && 'border-b-2 border-primary'
          )}
        >
          Withdraw
        </button>
      </div>

      <div className="p-4">
      {activeTab === 'claim' && <ClaimTab stakingInfo={stakingInfo} />}
      {activeTab === 'deposit' && <DepositTab stakingInfo={stakingInfo} />}
      {activeTab === 'withdraw' && <WithdrawTab stakingInfo={stakingInfo} />}
      </div>
    </div>
  );
}

function ClaimTab({ stakingInfo }: { stakingInfo: StakingInfo }) {
  const { chain, stakingManagerAddress, stakingToken, tokenSymbol, tokenDecimals, positionAmount } = stakingInfo;
  const formattedAmount = formatUnits(positionAmount, tokenDecimals);
  const { apr, isLoading: isLoadingAPR } = useStakingAPR(chain, stakingManagerAddress);
  const { claimableUSDC, isLoading: isLoadingClaimable } = useClaimableAmount(chain, stakingManagerAddress, stakingToken);
  const [isClaiming, setIsClaiming] = useState(false);

  const handleClaim = async () => {
    if (!chain) {
      toast.error('Missing chain data');
      return;
    }

    const walletProvider = appKit.getProvider('eip155');
    const userAddress = appKit.getAddress();

    if (!walletProvider || !userAddress) {
      toast.error('Wallet isn\'t fully connected yet. Please try again in a moment.');
      return;
    }

    setIsClaiming(true);

    const provider = new BrowserProvider(walletProvider as Eip1193Provider);
    const signer = await provider.getSigner();

    const stakingClient = StakingManagerClient.getInstance(chain, stakingManagerAddress, signer);
    const claimTxHash = await stakingClient.claim();
    await provider.waitForTransaction(claimTxHash);

    setIsClaiming(false);

    modal.open(TxnConfirmedModal, {
      props: {
        title: 'Claim Successful',
        description: 'Your rewards have been claimed successfully.',
      }
    });
  };

  const handleClaimClick = () => {
    handleClaim().catch((error) => {
      Sentry.captureException(error);
      toast.error(formatError(error));
      setIsClaiming(false);
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <p className="text-sm">Deposited</p>
          <p className="text-sm">{formattedAmount} {tokenSymbol}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm">APR</p>
          <p className="text-sm">{isLoadingAPR ? '...' : `${apr}%`}</p>
        </div>
      </div>

      <div className="rounded-sm bg-primary/8 p-3 space-y-1">
        <p className="text-sm text-tertiary">Claimable Amount</p>
        <p className="text-2xl">{isLoadingClaimable ? '...' : claimableUSDC}</p>
      </div>

      <Button variant="secondary" className="w-full" onClick={handleClaimClick} disabled={isClaiming || isLoadingClaimable}>
        {isClaiming ? 'Claiming...' : 'Claim'}
      </Button>
    </div>
  );
}

function DepositTab({ stakingInfo }: { stakingInfo: StakingInfo }) {
  const { chain, stakingManagerAddress, stakingToken, tokenSymbol, tokenDecimals } = stakingInfo;
  const { formattedBalance } = useTokenBalance(chain, stakingToken);
  const { apr, isLoading: isLoadingAPR } = useStakingAPR(chain, stakingManagerAddress);

  const [depositAmount, setDepositAmount] = useState('');

  const {
    isDepositing,
    approveStatus,
    stakeStatus,
    approveTxHash,
    stakeTxHash,
    handleDeposit,
    reset,
  } = useStakeDeposit({
    chain,
    stakingToken,
    stakingManagerAddress,
    onSuccess: () => {
      modal.open(TxnConfirmedModal, {
        props: {
          title: 'Deposit Successful',
          description: `You've successfully deposited ${depositAmount} ${tokenSymbol}.`,
        }
      });
      setDepositAmount('');
      reset();
    },
  });

  const balanceNumber = parseFloat(formattedBalance || '0');
  const depositNumber = parseFloat(depositAmount || '0');

  const handleDepositClick = () => {
    const amount = parseUnits(depositAmount, tokenDecimals);
    handleDeposit(amount);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <p className="text-sm">Owned</p>
          <p className="text-sm">{formatNumber(balanceNumber)} {tokenSymbol}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm">APR</p>
          <p className="text-sm">{isLoadingAPR ? '...' : `${apr}%`}</p>
        </div>
      </div>

      <div className="rounded-sm bg-primary/8">
        <div className="py-2 px-3 space-y-1">
          <div className="flex justify-between items-center">
            <p className="text-sm text-tertiary">Deposit {tokenSymbol}</p>
            <a
              href={`/coin/${chain.code_name}/${stakingToken}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium"
            >
              Buy {tokenSymbol}
            </a>
          </div>
          <input
            type="text"
            placeholder="0.00"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            className="text-2xl bg-transparent border-none outline-none w-full text-tertiary"
            disabled={isDepositing}
          />
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
              <p className="text-sm">Stake {tokenSymbol}</p>
              {stakeTxHash && chain && (
                <a
                  href={getTransactionUrl(chain, stakeTxHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-tertiary hover:text-primary"
                >
                  <i className="icon-arrow-top-right size-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      <Button
        variant="secondary"
        className="w-full"
        onClick={handleDepositClick}
        disabled={!depositAmount || depositNumber <= 0 || depositNumber > balanceNumber || isDepositing}
      >
        Deposit
      </Button>
    </div>
  );
}

function WithdrawTab({ stakingInfo }: { stakingInfo: StakingInfo }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-tertiary text-center py-8">Withdraw tab coming soon</p>
    </div>
  );
}

