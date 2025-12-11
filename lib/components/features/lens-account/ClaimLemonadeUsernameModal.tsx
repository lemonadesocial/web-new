'use client';
import { useState, useCallback } from 'react';
import { useAtomValue } from 'jotai';
import * as Sentry from '@sentry/nextjs';
import { createDrift } from '@gud/drift';
import debounce from 'lodash/debounce';

import { Button, modal, ModalContent, toast } from "$lib/components/core";
import { formatError } from '$lib/utils/crypto';
import { ConnectWallet } from '../modals/ConnectWallet';
import { listChainsAtom } from '$lib/jotai';
import { useSigner } from '$lib/hooks/useSigner';
import { appKit } from '$lib/utils/appkit';
import { LemonadeUsernameABI } from '$lib/abis/LemonadeUsername';

import { SuccessModal } from '../modals/SuccessModal';

export function ClaimLemonadeUsernameModal() {
  const signer = useSigner();
  const listChains = useAtomValue(listChainsAtom);
  const usernameChain = listChains.find(chain => chain.lemonade_username_contract_address)!;
  const drift = createDrift({
    rpcUrl: usernameChain.rpc_url,
  });


  const [username, setUsername] = useState('');
  const [step, setStep] = useState<'search' | 'success'>('search');
  const [status, setStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const checkUsernameAvailability = async (value: string, toAddress: string) => {
    const isAvailable = await drift.read({
      abi: LemonadeUsernameABI,
      address: usernameChain.lemonade_username_contract_address as `0x${string}`,
      fn: 'isUsernameAvailable',
      args: {
        username: value,
        to: toAddress as `0x${string}`,
      },
    });

    return isAvailable;
  };

  const debouncedCheckUsername = useCallback(
    debounce(async (value: string) => {
      if (!value || value.length === 0) return;

      const walletProvider = appKit.getProvider('eip155');
      const address = appKit.getAddress();

      if (!walletProvider || !address) {
        setStatus('idle');
        setErrorMessage('');
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
      if (!signer) return;

      setIsLoading(true);

      setIsLoading(false);

      setStep('success');
    } catch (error: any) {
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
      title="Lemonade Username"
      onClose={() => modal.close()}
    >
      <p className='text-secondary text-sm'>Secure your identity before someone else does. Price depends on character count. This cannot be changed later.</p>

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
        onClick={() => {
          modal.open(ConnectWallet, {
            props: {
              onConnect: () => {
                handleClaimUsername();
              },
              chain: usernameChain,
            },
          });
        }}
        disabled={status !== 'available'}
        loading={isLoading}
      >
        Continue
      </Button>
    </ModalContent>
  );
}
