'use client';
import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import * as Sentry from '@sentry/nextjs';
import type { Eip1193Provider } from 'ethers';
import { ethers } from 'ethers';
import debounce from 'lodash/debounce';

import { Button, modal, ModalContent, toast } from "$lib/components/core";
import { approveERC20Spender, formatError, isNativeToken, writeContract } from '$lib/utils/crypto';
import { listChainsAtom } from '$lib/jotai';
import { appKit, useAppKitProvider } from '$lib/utils/appkit';
import { LemonadeUsernameABI } from '$lib/abis/LemonadeUsername';
import { trpc } from '$lib/trpc/client';
import { useClient } from '$lib/graphql/request';
import { UsernameAvailabilityDocument, UsernameAvailabilityQueryVariables } from '$lib/graphql/generated/backend/graphql';

import { SuccessModal } from './SuccessModal';
import { ASSET_PREFIX } from '$lib/utils/constants';

export function ClaimLemonadeUsernameModal() {
  const { walletProvider } = useAppKitProvider('eip155');
  const listChains = useAtomValue(listChainsAtom);
  const usernameChain = listChains.find(chain => chain.lemonade_username_contract_address)!;
  const { client } = useClient();
  const queryClient = useQueryClient();

  const usernameApprovalMutation = trpc.usernameApproval.useMutation();
  const uploadUsernameMetadataMutation = trpc.uploadUsernameMetadata.useMutation();

  const [username, setUsername] = useState('');
  const [step, setStep] = useState<'search' | 'success'>('search');
  const [status, setStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const checkUsernameAvailability = useCallback(async (value: string, toAddress: string) => {
    const variables: UsernameAvailabilityQueryVariables = {
      wallet: toAddress,
      username: value,
    };
  
    const { data } = await client.query({
      query: UsernameAvailabilityDocument,
      variables,
      fetchPolicy: 'network-only',
    });
  
    return data?.isUsernameAvailable ?? false;
  }, [client]);
  
  const debouncedCheckUsername = useCallback(
    debounce(async (value: string) => {
      if (!value || value.length === 0) return;

      const address = appKit.getAddress();

      if (!address) {
        setStatus('idle');
        setErrorMessage('Please connect your wallet');
        return;
      }

      setStatus('checking');
      setErrorMessage('');

      try {
        const isAvailable = await checkUsernameAvailability(value, address);

        if (isAvailable) {
          setStatus('available');
          setErrorMessage('');
          return;
        }

        setStatus('unavailable');
        setErrorMessage('Username is already taken');
      } catch (error: any) {
        setErrorMessage(error?.message || 'Error checking username availability');
        setStatus('idle');
      }
    }, 600),
    [checkUsernameAvailability]
  );

  const handleClaimUsername = async () => {
    try {
      if (!walletProvider) throw new Error('Could not find wallet provider');

      const address = appKit.getAddress();
      if (!address) throw new Error('No wallet address found');

      setIsLoading(true);

      const { tokenUri } = await uploadUsernameMetadataMutation.mutateAsync({
        username,
      });

      const result = await usernameApprovalMutation.mutateAsync({
        username,
        tokenUri,
        wallet: address,
      });

      // const tokenUri = "ipfs://bafkreibf2wymoxnoyyev6ki4uozfnpitjtez2yr55ipdqudrceeymlaaeu"

      // const result = {
      //   "signature":"0xf05c1a1b9b9208e4c55d1866f237b5611eda88e814a568d11f61c2d882ef9335631933da84866fdb720eb48b0aa5035093c2bdcdbbedabba6966fa4f8363e7051b",
      //   "price":"0",
      //   "currency":"0xa19adb1929d2D7C7ABF97dB80a2c231C41eE972B"
      // }

      const contractInstance = new ethers.Contract(
        ethers.ZeroAddress,
        new ethers.Interface(LemonadeUsernameABI)
      );
      const currencyAddress = result.currency as string;
      const price = BigInt(result.price);
      const isNativeCurrency = isNativeToken(currencyAddress, usernameChain.chain_id);

      if (!isNativeCurrency && price > 0n) {
        await approveERC20Spender(
          currencyAddress,
          usernameChain.lemonade_username_contract_address as string,
          BigInt(result.price),
          walletProvider as Eip1193Provider,
        );
      }

      const transaction = await writeContract(
        contractInstance,
        usernameChain.lemonade_username_contract_address as string,
        walletProvider as Eip1193Provider,
        'mintWithSignature',
        [
          username,
          address as `0x${string}`,
          tokenUri,
          price,
          currencyAddress as `0x${string}`,
          result.signature as `0x${string}`,
        ],
        { value: isNativeCurrency ? price : 0 },
      );

      await transaction.wait();

      queryClient.setQueryData(['lemonadeUsername', address], {
        username,
      });

      setIsLoading(false);

      setStep('success');
    } catch (error: any) {
      console.log(error)
      setIsLoading(false);
      Sentry.captureException(error);
      toast.error(formatError(error));
    }
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    const isValidFormat = /^[a-z0-9_]*$/.test(value);

    if (!isValidFormat && value.length > 0) {
      setErrorMessage('Username can only contain lowercase letters (a-z), numbers (0-9), and underscores (_)');
      setStatus('idle');
      setUsername(value);
      return;
    }

    setUsername(value);
    setStatus('idle');
    setErrorMessage('');

    if (value.length > 0) {
      debouncedCheckUsername(value);
    }
  };

  if (step === 'success') {
    return (
      <SuccessModal
        title="Username Claimed!"
        description={`@${username} is now yours. You're all set to join conversations, share your voice and connect with others on Lemonade.`}
      />
    );
  }

  return (
    <ModalContent
      icon="icon-alternate-email"
      onClose={() => modal.close()}
    >
      <div className='space-y-2'>
        <p className='text-lg'>Pick Username</p>
        <p className='text-secondary text-sm'>Secure your identity before someone else does. Price depends on character count. This cannot be changed later.</p>
        <div className='flex items-center gap-1 mt-2'>
          <p className='text-sm text-tertiary'>Powered by</p>
          <img src={`${ASSET_PREFIX}/assets/images/megaeth.svg`} alt='MegaETH' />
        </div>
      </div>

      <div className='flex items-center justify-between mt-4 h-6'>
        <p className='text-sm'>Lemonade Username</p>
        <div>
          {status === 'checking' && <i className='icon-loader animate-spin size-4 text-tertiary' />}
          {status === 'available' && <p className='text-success-500 text-sm'>Available</p>}
          {status === 'unavailable' && <p className='text-error text-sm'>Unavailable</p>}
        </div>
      </div>

      <div className="w-full rounded-sm flex border border-card-border h-10 mt-1.5 overflow-hidden">
        <div className="flex items-center px-3.5 py-2.5 bg-primary/8">
          <span className="text-tertiary font-medium">lemonade/</span>
        </div>
        <input
          placeholder='johndoe'
          className='focus:outline-none placeholder-quaternary px-3.5 font-medium w-full'
          value={username}
          onChange={onInputChange}
        />
      </div>

      {errorMessage && <p className='text-error text-sm mt-2'>{errorMessage}</p>}

      <Button
        className="w-full mt-4"
        variant="secondary"
        onClick={handleClaimUsername}
        disabled={status !== 'available'}
        loading={isLoading}
      >
        Continue
      </Button>
    </ModalContent>
  );
}
