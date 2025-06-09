import { useState, useCallback } from 'react';
import { useAtomValue } from 'jotai';
import { sessionClientAtom } from '$lib/jotai/lens';
import { canCreateUsername } from '@lens-protocol/client/actions';
import { evmAddress } from '@lens-protocol/client';
import { account } from '@lens-protocol/metadata';

import { Avatar, Button, Input, modal, ModalContent, toast, FileInput, Menu, LabeledInput } from "$lib/components/core";
import { ASSET_PREFIX } from "$lib/utils/constants";
import { useClaimUsername } from '$lib/hooks/useLens';
import { randomUserImage } from '$lib/utils/user';
import { storageClient } from '$lib/utils/lens/client';
import { getTokenRequirementMessage } from '$lib/utils/lens/utils';

export function ClaimUsernameModal() {
  const sessionClient = useAtomValue(sessionClientAtom);

  const [username, setUsername] = useState('');
  const [step, setStep] = useState<'search' | 'profile'>('search');
  const [status, setStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable' | 'error'>('idle');

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

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
          namespace: process.env.NEXT_PUBLIC_LENS_NAMESPACE ? evmAddress(process.env.NEXT_PUBLIC_LENS_NAMESPACE) : undefined,
        });

        if (result.isErr()) {
          setStatus('unavailable');
          return;
        }

        switch (result.value.__typename) {
          case "NamespaceOperationValidationPassed":
            setStatus('available');
            break;
          case "NamespaceOperationValidationFailed": {
            const tokenMessage = getTokenRequirementMessage(result.value);
            if (tokenMessage) {
              toast.error(tokenMessage);
            } else {
              toast.error(result.value.reason);
            }
            setStatus('unavailable');
            break;
          }
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

  const getProfilePicture = async () => {
    if (!file) return undefined;

    setUploading(true);
    const { uri } = await storageClient.uploadFile(file);
    setUploading(false);
    return uri;
  }

  const handleClaimUsername = async () => {
    try {
      const picture = await getProfilePicture();
      const accountMetadata = account({
        name: name || username,
        bio: bio || undefined,
        picture 
      });
    
      await claimUsername(username, accountMetadata);

      modal.close();
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    setName(value);
    setStatus('idle');
    clearTimeout((onInputChange as any).debounce);
    (onInputChange as any).debounce = setTimeout(() => checkUsername(value), 400);
  };

  if (step === 'profile') {
    return (
      <ModalContent
        onBack={() => setStep('search')}
        onClose={() => modal.close()}
        title="Create Your Profile"
      >
        <div className="flex items-center justify-center">
          <div className="relative">
            <Avatar src={file ? URL.createObjectURL(file) : randomUserImage()} className="rounded-full size-[108px]" />
            <FileInput
              accept="image/*"
              onChange={files => setFile(files[0])}
            >
              {open => (
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute bottom-0 right-0 rounded-full"
                  icon="icon-upload-sharp"
                  onClick={open}
                />
              )}
            </FileInput>
          </div>
        </div>
        <LabeledInput label="Name" className='mt-4'>
          <Input
            placeholder="John Doe"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </LabeledInput>
        <LabeledInput label="Bio" className='mt-3'>
          <textarea
            placeholder="Share a little about your background and interests."
            value={bio}
            onChange={e => setBio(e.target.value)}
            className="w-full rounded-sm focus:outline-none border border-transparent placeholder-quaternary px-3.5 py-2.5 hover:border hover:border-tertiary min-h-[80px] font-medium bg-primary/8 text-base"
          />
        </LabeledInput>
        <Button className="w-full mt-4" variant="secondary" onClick={handleClaimUsername} loading={uploading || isLoading}>
          Save
        </Button>
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
          onClick={status === 'available' ? () => setStep('profile') : undefined}
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
