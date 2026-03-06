'use client';

import { useState } from 'react';
import { encodeAbiParameters, parseEventLogs, zeroAddress, type Address, type EIP1193Provider } from 'viem';
import * as Sentry from '@sentry/nextjs';

import { modal } from '$lib/components/core';
import { SignTransactionModal } from '$lib/components/features/modals/SignTransaction';
import { ConfirmTransaction } from '$lib/components/features/modals/ConfirmTransaction';
import { SuccessModal } from '$lib/components/features/modals/SuccessModal';
import { ErrorModal } from '$lib/components/features/modals/ErrorModal';
import { useAppKitProvider } from '$lib/utils/appkit';
import { Chain, AddLaunchpadGroupDocument, ListLaunchpadGroupsDocument } from '$lib/graphql/generated/backend/graphql';
import { CreateGroupParams } from '$lib/services/token-launch-pad';
import { createViemClients } from '$lib/utils/crypto';
import { formatError } from '$lib/utils/error';
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

      const { walletClient, publicClient, account } = await createViemClients(
        launchChain.chain_id,
        walletProvider as EIP1193Provider,
      );
      const rawPermissionsAddress = params.isOpen ? zeroAddress : closedPermissions;

      if (!rawPermissionsAddress) {
        throw new Error('Permissions contract address is required');
      }

      const permissionsContractAddress = rawPermissionsAddress as Address;

      const data = encodeAbiParameters(
        [
          { name: 'groupERC20Token', type: 'address' },
          { name: 'minEscrowDuration', type: 'uint256' },
          { name: 'minStakeDuration', type: 'uint256' },
          { name: 'minStakeAmount', type: 'uint256' },
          { name: 'creatorSharePercentage', type: 'uint256' },
          { name: 'ownerSharePercentage', type: 'uint256' },
        ],
        [
          params.groupERC20Token as `0x${string}`,
          BigInt(params.minEscrowDuration),
          BigInt(params.minStakeDuration),
          0n, // minStakeAmount
          BigInt(params.creatorSharePercentage * 100000),
          BigInt(params.ownerSharePercentage * 100000),
        ],
      );

      const hash = await walletClient.writeContract({
        abi: ZapContractABI.abi,
        address: zapContractAddress as Address,
        functionName: 'deployAndInitializeManager',
        args: [
          stakingManagerImplementation as Address,
          params.groupOwner as Address,
          data,
          permissionsContractAddress as Address,
        ],
        account,
        chain: walletClient.chain,
      });

      setStatus('confirming');

      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      const events = parseEventLogs({
        abi: TreasuryManagerFactoryABI.abi as any,
        eventName: 'ManagerDeployed',
        logs: receipt.logs,
      });
      const manager = (events[0] as any)?.args?._manager as string | undefined;

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

