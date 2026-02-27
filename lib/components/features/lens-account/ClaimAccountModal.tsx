'use client';
import { useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { accountAtom, sessionClientAtom } from '$lib/jotai/lens';
import { createAccount, fetchAccount } from "@lens-protocol/client/actions";
import { nonNullable } from '@lens-protocol/client';
import { storageClient } from '$lib/utils/lens/client';
import { account } from '@lens-protocol/metadata';
import { handleOperationWith } from '@lens-protocol/client/viem';

import { Avatar, Button, Input, modal, ModalContent, toast, FileInput, LabeledInput } from "$lib/components/core";
import { randomUserImage } from '$lib/utils/user';
import { useSigner } from '$lib/hooks/useSigner';

export function ClaimAccountModal() {
  const sessionClient = useAtomValue(sessionClientAtom);
  const signer = useSigner();
  const setAccount = useSetAtom(accountAtom);
  
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getProfilePicture = async () => {
    if (!file) return undefined;

    setUploading(true);
    const { uri } = await storageClient.uploadFile(file);
    setUploading(false);
    return uri;
  }

  const save = async () => {
    if (!sessionClient || !signer) return;

    setIsLoading(true);

    const picture = await getProfilePicture();
    const accountMetadata = account({
      name: name,
      bio: bio || undefined,
      picture
    });
    const { uri } = await storageClient.uploadAsJson(accountMetadata);
    
    const result = await createAccount(sessionClient, {
      metadataUri: uri,
    })
      .andThen(handleOperationWith(signer))
      .andThen(sessionClient.waitForTransaction)
      .andThen((txHash) => fetchAccount(sessionClient, { txHash }).map(nonNullable))
      .andThen((account) => {
        setAccount(account);

        return sessionClient.switchAccount({
          account: account.address,
        })
      });

    setIsLoading(false);

    if (result.isErr()) {
      toast.error(result.error?.message || 'Unknown error');
      return;
    }

    modal.close();
  }

  return (
    <ModalContent
      onClose={() => modal.close()}
      title="Create Lens Profile"
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
      <LabeledInput label="Name" className='mt-4' required>
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
      <Button
        className="w-full mt-4"
        variant="secondary"
        onClick={save}
        loading={uploading || isLoading}
        disabled={!name}
      >
        Save
      </Button>
    </ModalContent>
  );
}
