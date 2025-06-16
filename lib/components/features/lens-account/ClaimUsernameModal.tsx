'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { sessionClientAtom } from '$lib/jotai/lens';
import { canCreateUsername } from '@lens-protocol/client/actions';
import { evmAddress } from '@lens-protocol/client';
import { account } from '@lens-protocol/metadata';
import debounce from 'lodash/debounce';

import { Avatar, Button, Input, modal, ModalContent, toast, FileInput, LabeledInput } from "$lib/components/core";
import { ASSET_PREFIX } from "$lib/utils/constants";
import { useClaimUsername } from '$lib/hooks/useLens';
import { randomUserImage } from '$lib/utils/user';
import { storageClient } from '$lib/utils/lens/client';
import { getUsernameValidationMessage } from '$lib/utils/lens/utils';

export function ClaimUsernameModal() {
  const sessionClient = useAtomValue(sessionClientAtom);

  const [username, setUsername] = useState('');
  const [step, setStep] = useState<'search' | 'profile'>('search');
  const [status, setStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle');

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const { claimUsername, isLoading } = useClaimUsername();

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
        namespace: process.env.NEXT_PUBLIC_LENS_NAMESPACE ? evmAddress(process.env.NEXT_PUBLIC_LENS_NAMESPACE) : undefined,
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
    setErrorMessage('');

    if (value.length > 0) {
      debouncedCheckUsername(value);
      return;
    }
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
        onClick={() => setStep('profile')}
        disabled={status !== 'available'}
      >
        Continue
      </Button>
    </ModalContent>
  );
}
