'use client';

import { useState } from 'react';
import { BrowserProvider, Contract, Eip1193Provider, ethers } from 'ethers';
import * as Sentry from '@sentry/nextjs';

import { modal } from '$lib/components/core';
import { SignTransactionModal } from '$lib/components/features/modals/SignTransaction';
import { ConfirmTransaction } from '$lib/components/features/modals/ConfirmTransaction';
import { SuccessModal } from '$lib/components/features/modals/SuccessModal';
import { ErrorModal } from '$lib/components/features/modals/ErrorModal';
import { useAppKitProvider } from '$lib/utils/appkit';
import { Chain, AddLaunchpadGroupDocument, ListLaunchpadGroupsDocument } from '$lib/graphql/generated/backend/graphql';
import { CreateGroupParams, parseLogs } from '$lib/services/token-launch-pad';
import { formatError } from '$lib/utils/crypto';
import ZapContractABI from '$lib/abis/token-launch-pad/FlaunchZap.json';
import TreasuryManagerFactoryABI from '$lib/abis/token-launch-pad/TreasuryManagerFactory.json';
import { useMutation } from '$lib/graphql/request';
import { useSpace } from '$lib/hooks/useSpace';

interface CreateGroupModalProps {
  params: CreateGroupParams;
  launchChain: Chain;
  onSuccess?: (managerAddress: string) => void;
}

type CreateGroupStatus = 'idle' | 'signing' | 'confirming' | 'success' | 'error';

export function CreateGroupModal({ params, launchChain, onSuccess }: CreateGroupModalProps) {
  const space = useSpace();
  const { walletProvider } = useAppKitProvider('eip155');
  const [status, setStatus] = useState<CreateGroupStatus>('idle');
  const [error, setError] = useState('');
  const [managerAddress, setManagerAddress] = useState('');
  const [addLaunchpadGroup] = useMutation(AddLaunchpadGroupDocument, {
    onComplete: (client) => {
      if (space?._id) {
        client.refetchQuery({
          query: ListLaunchpadGroupsDocument,
          variables: { space: space._id },
        });
      }
    },
  });

  const getSigner = async () => {
    const provider = new BrowserProvider(walletProvider as Eip1193Provider);
    return provider.getSigner();
  };

  const handleCreateGroup = async () => {
    try {
      setStatus('signing');
      if (!walletProvider) {
        throw new Error('Wallet not connected');
      }

      const zapContractAddress = launchChain.launchpad_zap_contract_address;
      const stakingManagerImplementation = launchChain.launchpad_treasury_staking_manager_implementation_contract_address;
      const closedPermissions = launchChain.launchpad_closed_permissions_contract_address;

      if (!zapContractAddress || !stakingManagerImplementation) {
        throw new Error('Chain configuration missing required contracts');
      }

      const signer = await getSigner();
      const permissionsContractAddress = params.isOpen ? ethers.ZeroAddress : closedPermissions;

      if (!permissionsContractAddress) {
        throw new Error('Permissions contract address is required');
      }

      const writeContract = new Contract(zapContractAddress, ZapContractABI.abi, signer);
      const data = ethers.AbiCoder.defaultAbiCoder().encode(['address', 'uint256', 'uint256', 'uint256', 'uint256','uint256'], [
        params.groupERC20Token,
        params.minEscrowDuration,
        params.minStakeDuration,
        0, // minStakeAmount
        params.creatorSharePercentage * 100000,
        params.ownerSharePercentage * 100000,
      ]);

      const tx = await writeContract.deployAndInitializeManager(
        stakingManagerImplementation,
        params.groupOwner,
        data,
        permissionsContractAddress,
      );

      setStatus('confirming');

      const receipt = await tx.wait();
      const factoryInterface = new ethers.Interface(TreasuryManagerFactoryABI.abi);
      const event = parseLogs(receipt, factoryInterface).find((log) => log.parsedLog.name === 'ManagerDeployed');
      const manager = event?.parsedLog.args._manager as string | undefined;

      if (!manager) {
        throw new Error('Manager address not found');
      }

      addLaunchpadGroup({
        variables: {
          input: {
            address: manager,
            chain_id: Number(launchChain.chain_id),
            implementation_address: stakingManagerImplementation,
            name: space?.title || '',
            description: space?.description,
            cover_photo: space?.image_cover,
            handle_twitter: space?.handle_twitter,
            website: space?.website,
            space: space?._id,
          },
        },
      });

      setManagerAddress(manager);
      onSuccess?.(manager);
      setStatus('success');
    } catch (err: unknown) {
      Sentry.captureException(err);
      setError(formatError(err));
      setStatus('error');
    }
  };

  const handleRetry = async () => {
    await handleCreateGroup();
  };

  if (status === 'success') {
    return (
      <SuccessModal
        title="Launchpad Activated"
        description={`Your launchpad manager is live at ${managerAddress}.`}
        onClose={() => modal.close()}
      />
    );
  }

  if (status === 'confirming') {
    return (
      <ConfirmTransaction
        title="Activating Launchpad"
        description="Your transaction is being confirmed on-chain. This may take a few moments."
      />
    );
  }

  if (status === 'error') {
    return (
      <ErrorModal
        title="Activation Failed"
        message={error}
        onRetry={handleRetry}
        onClose={() => modal.close()}
      />
    );
  }

  return (
    <SignTransactionModal
      title="Activate Launchpad"
      description={`Please sign the transaction to activate your launchpad on ${launchChain.name}.`}
      loading={status === 'signing'}
      onSign={handleCreateGroup}
      onClose={() => modal.close()}
    />
  );
}

