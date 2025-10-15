'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { sessionClientAtom } from '$lib/jotai/lens';
import { canCreateUsername, createUsername } from '@lens-protocol/client/actions';
import { handleOperationWith } from '@lens-protocol/client/ethers';
import debounce from 'lodash/debounce';
import * as Sentry from '@sentry/nextjs';

import { Button, modal, ModalContent, toast } from "$lib/components/core";
import { ASSET_PREFIX, LENS_NAMESPACE } from "$lib/utils/constants";
import { getUsernameValidationMessage } from '$lib/utils/lens/utils';
import { useSigner } from '$lib/hooks/useSigner';

import { SuccessModal } from '../modals/SuccessModal';
import { useAccount, useLemonadeUsername } from '$lib/hooks/useLens';
import { RulesSubject } from '@lens-protocol/client';
import { formatError } from '$lib/utils/crypto';
import { ConnectWallet } from '../modals/ConnectWallet';
import { chainsMapAtom } from '$lib/jotai';
import { LENS_CHAIN_ID } from '$lib/utils/lens/constants';

export function ClaimLemonadeUsernameModal() {
  const sessionClient = useAtomValue(sessionClientAtom);
  const signer = useSigner();
  const { account } = useAccount();
  const { refetch } = useLemonadeUsername(account);
  const chainsMap = useAtomValue(chainsMapAtom);

  const [username, setUsername] = useState('');
  const [step, setStep] = useState<'search' | 'success'>('search');
  const [status, setStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle');
  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  const usernameRef = useRef(username);

  useEffect(() => {
    usernameRef.current = username;
  }, [username]);

  const checkUsername = useCallback(
    async (value: string) => {
      if (!sessionClient || value !== usernameRef.current) return;

      setStatus('checking');
      setErrorMessage('');

      const result = await canCreateUsername(sessionClient, {
        localName: value,
        namespace: LENS_NAMESPACE,
        rulesSubject: RulesSubject.Signer,
      });
  
      if (result.isErr()) {
        setErrorMessage(result.error?.message || 'Unknown error');
        return;
      }

      switch (result.value.__typename) {
        case 'NamespaceOperationValidationPassed':
          setStatus('available');
          setErrorMessage('');
          break;
        case 'NamespaceOperationValidationFailed': {
          setStatus('available');
          const msg = getUsernameValidationMessage(result.value, value.length);
          setErrorMessage(msg);
          break;
        }
        case 'NamespaceOperationValidationUnknown':
          setErrorMessage('Unknown error');
          break;
        case 'UsernameTaken':
          setStatus('unavailable');
          setErrorMessage('Username is already taken');
          break;
      }
    },
    [sessionClient]
  );

  const debouncedCheckUsername = useCallback(
    debounce((value: string) => {
      checkUsername(value);
    }, 600),
    [checkUsername]
  );

  const handleClaimUsername = async () => {
    try {
      if (!sessionClient || !signer) return;

      setIsLoading(true);

      const result = await createUsername(sessionClient, {
        username: {
          localName: username,
          namespace: LENS_NAMESPACE,
        },
        rulesSubject: RulesSubject.Signer,
      })
        .andThen(handleOperationWith(signer))
        .andThen(sessionClient.waitForTransaction);

      setIsLoading(false);

      if (result.isErr()) {
        toast.error(result.error.message);
        return;
      }

      setStep('success');
      refetch();
    } catch (error: any) {
      Sentry.captureException(error);
      toast.error(formatError(error));
    }
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    setStatus('idle');
    setErrorMessage('');

    if (value.length > 0) {
      debouncedCheckUsername(value);
      return;
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

      <div className='flex items-center gap-1.5 mt-2'>
        <p className='text-sm text-tertiary'>Powered by</p>
        <img src={`${ASSET_PREFIX}/assets/images/lens.svg`} alt='Lens' className='h-3' />
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
        onClick={() => {
          modal.open(ConnectWallet, {
            props: {
              onConnect: () => {
                handleClaimUsername();
              },
              chain: chainsMap[LENS_CHAIN_ID],
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
