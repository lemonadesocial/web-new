'use client';
import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import * as Sentry from '@sentry/nextjs';
import type { Eip1193Provider } from 'ethers';
import debounce from 'lodash/debounce';

import { ethers } from 'ethers';
import { Button, modal, ModalContent, toast } from '$lib/components/core';
import { CurrencyClient } from '$lib/services/currency';
import { approveERC20Spender, checkBalanceSufficient, formatError, isNativeToken, writeContract } from '$lib/utils/crypto';
import { listChainsAtom } from '$lib/jotai';
import { appKit, useAppKitProvider } from '$lib/utils/appkit';
import { LemonadeUsernameABI } from '$lib/abis/LemonadeUsername';
import { trpc } from '$lib/trpc/client';
import { useClient } from '$lib/graphql/request';
import type { IsUsernameAvailableQuery } from '$lib/graphql/generated/backend/graphql';
import { IsUsernameAvailableDocument, IsUsernameAvailableQueryVariables } from '$lib/graphql/generated/backend/graphql';

import { SuccessModal } from './SuccessModal';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { formatNumber } from '$lib/utils/number';

export function ClaimLemonadeUsernameModal() {
  const { walletProvider } = useAppKitProvider('eip155');
  const listChains = useAtomValue(listChainsAtom);
  const usernameChain = listChains.find(chain => chain.lemonade_username_contract_address)!;
  const { client } = useClient();
  const queryClient = useQueryClient();

  const usernameApprovalMutation = trpc.usernameApproval.useMutation();
  const uploadUsernameMetadataMutation = trpc.uploadUsernameMetadata.useMutation();

  const [username, setUsername] = useState('');
  const [step, setStep] = useState<'search' | 'claiming' | 'signing' | 'success'>('search');
  const [status, setStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle');
  const [usernamePrice, setUsernamePrice] = useState<{
    price: string;
    currency: string;
    symbol?: string;
    decimals?: number;
  } | null>(null);

  const [errorMessage, setErrorMessage] = useState('');

  const checkUsernameAvailability = useCallback(
    async (value: string, toAddress: string): Promise<IsUsernameAvailableQuery['isUsernameAvailable'] | null> => {
      const variables: IsUsernameAvailableQueryVariables = {
        wallet: toAddress,
        username: value,
      };

      const { data } = await client.query({
        query: IsUsernameAvailableDocument,
        variables,
        fetchPolicy: 'network-only',
      });

      return data?.isUsernameAvailable ?? null;
    },
    [client]
  );

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
      setUsernamePrice(null);

      try {
        const result = await checkUsernameAvailability(value, address);

        if (result?.available) {
          setStatus('available');
          setErrorMessage('');

          if (result.price != null && result.currency != null) {
            const price = result.price;
            const currency = result.currency;

            if (BigInt(price) > 0n) {
              const currencyClient = new CurrencyClient(usernameChain, currency);
              const [symbol, decimals] = await Promise.all([
                currencyClient.getSymbol(),
                currencyClient.getDecimals(),
              ]);

              setUsernamePrice({ price, currency, symbol, decimals });
              return;
            }

            setUsernamePrice({ price, currency });
          }

          return;
        }

        setStatus('unavailable');
        setErrorMessage('Username is already taken');
        setUsernamePrice(null);
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

      setStep('claiming');

      const { tokenUri } = await uploadUsernameMetadataMutation.mutateAsync({
        username,
      });

      const result = await usernameApprovalMutation.mutateAsync({
        username,
        tokenUri,
        wallet: address,
      });

      const contractInstance = new ethers.Contract(
        ethers.ZeroAddress,
        new ethers.Interface(LemonadeUsernameABI)
      );
      const currencyAddress = result.currency as string;
      const price = BigInt(result.price);
      const isNativeCurrency = isNativeToken(currencyAddress, usernameChain.chain_id);

      if (price > 0n) {
        await checkBalanceSufficient(
          currencyAddress,
          usernameChain.chain_id,
          price,
          walletProvider as Eip1193Provider,
          address
        );
      }

      setStep('signing');

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

      setStep('success');
    } catch (error: any) {
      setStep('search');
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
    setUsernamePrice(null);

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
          {status === 'checking' && <i aria-hidden="true" className='icon-loader animate-spin size-4 text-tertiary' />}
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

      {status === 'available' && usernamePrice && BigInt(usernamePrice.price) > 0n && (
        <p className='text-warning-400 text-sm mt-2'>
          Usernames with {username.length} characters cost{' '}
          {formatNumber(Number(ethers.formatUnits(usernamePrice.price, usernamePrice.decimals ?? 18)))}{' '}
          {usernamePrice.symbol ?? usernamePrice.currency}.
        </p>
      )}

      {errorMessage && <p className='text-error text-sm mt-2'>{errorMessage}</p>}
      
      <Button
        className="w-full mt-4"
        variant="secondary"
        onClick={handleClaimUsername}
        disabled={status !== 'available' || step === 'signing'}
        loading={step === 'claiming'}
      >
        {step === 'signing' ? 'Waiting for Signature...' : 'Continue'}
      </Button>
    </ModalContent>
  );
}
