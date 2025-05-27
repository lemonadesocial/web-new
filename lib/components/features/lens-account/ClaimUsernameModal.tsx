import { useState, useCallback } from 'react';
import { useAtomValue } from 'jotai';
import { sessionClientAtom } from '$lib/jotai/lens';
import { canCreateUsername } from '@lens-protocol/client/actions';

import { Menu } from '$lib/components/core/menu/menu';
import { Button, Input, modal, ModalContent, toast } from "$lib/components/core";
import { ASSET_PREFIX } from "$lib/utils/constants";
import { formatWallet } from '$lib/utils/crypto';
import { useAppKitAccount } from '$lib/utils/appkit';
import { useClaimUsername } from '$lib/hooks/useLens';

export function ClaimUsernameModal() {
  const sessionClient = useAtomValue(sessionClientAtom);
  const { address } = useAppKitAccount();
  const [username, setUsername] = useState('');
  const [step, setStep] = useState<'search' | 'claim'>('search');
  const [status, setStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable' | 'error'>('idle');

  const { claimUsername, isLoading } = useClaimUsername();

  const checkUsername = useCallback(
    async (value: string) => {
      if (!sessionClient) {
        setStatus('idle');
        return;
      }
      setStatus('checking');
      try {
        const result = await canCreateUsername(sessionClient, {
          localName: value,
          // namespace: process.env.NEXT_PUBLIC_LENS_NAMESPACE ? evmAddress(process.env.NEXT_PUBLIC_LENS_NAMESPACE) : undefined,
        });
    
        if (result.isErr()) {
          setStatus('unavailable');
          return;
        }

        switch (result.value.__typename) {
          case "NamespaceOperationValidationPassed":
            setStatus('available');
            break;
          case "NamespaceOperationValidationFailed":
            toast.error(result.value.reason);
            setStatus('unavailable');
            break;
          case "NamespaceOperationValidationUnknown":
            setStatus('error');
            break;
          case "UsernameTaken":
            setStatus('unavailable');
            break;
          default:
            setStatus('error');
        }
      } catch {
        setStatus('error');
      }
    },
    [sessionClient]
  );

  const handleClaimUsername = async () => {
    try {
      await claimUsername(username);
      modal.close();
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    setStatus('idle');
    clearTimeout((onInputChange as any).debounce);
    (onInputChange as any).debounce = setTimeout(() => checkUsername(value), 400);
  };

  if (step === 'claim') {
    return (
      <ModalContent
        onBack={() => setStep('search')}
        onClose={() => modal.close()}
        title={`@${username}`}
      >
        <p className='text-secondary text-sm'>
          Secure <span className='font-semibold'>@{username}</span> as your unique identity on Lemonade. Once claimed, it&apos;s yours <span className='italic'>forever</span>.
        </p>
        <div className="rounded-sm border border-divider px-3 py-2 bg-primary/8 mt-4 gap-2.5 flex items-center">
          <i className="icon-wallet size-5 text-tertiary" />
          <p>{formatWallet(address!)}</p>
        </div>
        <Button
          className='w-full mt-4'
          variant='secondary'
          onClick={handleClaimUsername}
          loading={isLoading}
        >
          Claim Username
        </Button>
        <hr className='mt-4 border-t border-t-divider -mx-4' />
        <div className='flex items-center justify-center gap-1.5 mt-4'>
          <p className='text-xs text-quaternary'>Powered by</p>
          <img src={`${ASSET_PREFIX}/assets/images/lens.svg`} alt='Lens' className='h-3' />
        </div>
      </ModalContent>
    );
  }

  return (
    <ModalContent
      icon={<i className='icon-lemonade size-8 text-warning-300' />}
      onClose={() => modal.close()}
    >
      <p className='text-lg'>Pick Username</p>
      <p className='text-secondary text-sm mt-2'>Username pricing depends on character count and naming rules. Secure your identity before someone else does.</p>
      <p className='text-sm mt-4'>Search Username</p>
      <Menu.Root className='w-full' isOpen={status !== 'idle'}>
        <Menu.Trigger className='w-full'>
          <Input
            placeholder='johndoe'
            className='mt-1.5 w-full'
            value={username}
            onChange={onInputChange}
          />
        </Menu.Trigger>
        <Menu.Content
          className='w-full p-1.5 flex justify-between items-center'
          onClick={status === 'available' ? () => setStep('claim') : undefined}
        >
          <div>
            <p className='text-secondary text-sm'>lemonade/@{username}</p>
            {status !== 'idle' && (
              <>
                {status === 'checking' && <p className='text-quaternary text-xs'>Checking...</p>}
                {status === 'available' && <p className='text-success-500 text-xs'>Available</p>}
                {status === 'unavailable' && <p className='text-error text-xs'>Unavailable</p>}
                {status === 'error' && <p className='text-error text-xs'>Error checking username</p>}
              </>
            )}
          </div>
          {
            status === 'available' && <i className='icon-chevron-right size-4 text-tertiary' />
          }
        </Menu.Content>
      </Menu.Root>
      <hr className='mt-4 border-t border-t-divider -mx-4' />
      <div className='flex items-center justify-center gap-1.5 mt-4'>
        <p className='text-xs text-quaternary'>Powered by</p>
        <img src={`${ASSET_PREFIX}/assets/images/lens.svg`} alt='Lens' className='h-3' />
      </div>
    </ModalContent>
  );
}
