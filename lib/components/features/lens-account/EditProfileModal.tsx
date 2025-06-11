import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { sessionClientAtom } from '$lib/jotai/lens';
import { setAccountMetadata } from '@lens-protocol/client/actions';
import { account } from '@lens-protocol/metadata';

import { Avatar, Button, Input, modal, ModalContent, toast, FileInput, LabeledInput } from "$lib/components/core";
import { storageClient } from '$lib/utils/lens/client';
import { useAccount } from '$lib/hooks/useLens';
import { randomUserImage } from '$lib/utils/user';

export function EditProfileModal() {
  const sessionClient = useAtomValue(sessionClientAtom);
  const { account: myAccount, refreshAccount } = useAccount();

  const [name, setName] = useState(myAccount?.metadata?.name || '');
  const [bio, setBio] = useState(myAccount?.metadata?.bio || '');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const getProfilePicture = async () => {
    if (!file) return undefined;

    const { uri } = await storageClient.uploadFile(file);

    return uri;
  }

  const handleEditProfile = async () => {
    if (!sessionClient) return;
    
    try {
      setLoading(true);
      const picture = await getProfilePicture();
      const accountMetadata = account({
        name: name || undefined,
        bio: bio || undefined,
        picture 
      });

      const { uri } = await storageClient.uploadAsJson(accountMetadata);
    
      const result = await setAccountMetadata(sessionClient, {
        metadataUri: uri,
      });

      if (result.isErr()) {
        toast.error(result.error.message);
        setLoading(false);
        return;
      }

      setTimeout(() => {
        refreshAccount();
      }, 1000);

      toast.success('Profile updated successfully');
      modal.close();
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (!myAccount?.metadata?.picture) return;
      
      try {
        const response = await fetch(myAccount.metadata.picture);
        const blob = await response.blob();
        const file = new File([blob], 'profile-picture', { type: blob.type });
        setFile(file);
      } catch {
        toast.error('Failed to fetch profile picture');
      }
    };

    fetchProfilePicture();
  }, [myAccount]);

  return (
    <ModalContent
      onClose={() => modal.close()}
      title="Edit Your Profile"
    >
      <div className="flex items-center justify-center">
        <div className="relative">
          <Avatar src={file ? URL.createObjectURL(file) : randomUserImage(myAccount?.owner)} className="rounded-full size-[108px]" />
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
      <Button className="w-full mt-4" variant="secondary" onClick={handleEditProfile} loading={loading}>
        Save
      </Button>
    </ModalContent>
  );
}
