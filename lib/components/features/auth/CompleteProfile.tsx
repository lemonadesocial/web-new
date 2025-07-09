import { useState } from 'react';

import { Avatar, Button, FileInput, Input, modal, ModalContent, toast } from '$lib/components/core';
import { useMutation } from '$lib/graphql/request';
import { UpdateUserDocument } from '$lib/graphql/generated/backend/graphql';
import { userAvatar } from '$lib/utils/user';
import { useMe } from '$lib/hooks/useMe';

export function CompleteProfile() {
  const [displayName, setDisplayName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const me = useMe();

  const [updateUser] = useMutation(UpdateUserDocument, {
    onComplete(client, data) {
      const user = data.updateUser;
      if (user && '_id' in user && user._id) {
        client.writeFragment({ id: `User:${user._id}`, data: user });
      }
    },
  });

  const handleSubmit = async () => {
    if (!displayName.trim()) {
      toast.error('Please enter your display name');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await updateUser({
        variables: {
          input: {
            display_name: displayName.trim(),
          },
        },
      });

      if (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
        toast.error(errorMessage);
        return;
      }

      toast.success('Profile completed successfully');
      modal.close();
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalContent
      onBack={() => modal.close()}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-lg">Complete Your Profile</p>
          <p className="text-secondary text-sm">
            Enter your name and choose an avatar so your friends can recognize you.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar src={file ? URL.createObjectURL(file) : userAvatar(me)} className="rounded-full size-[60px]" />
            <FileInput
              accept="image/*"
              onChange={files => setFile(files[0])}
            >
              {open => (
                <Button
                  variant="secondary"
                  size="xs"
                  className="absolute bottom-0 right-0 rounded-full"
                  icon="icon-upload-sharp"
                  onClick={open}
                />
              )}
            </FileInput>
          </div>
          <div className="space-y-1.5 flex-1">
            <p className="text-sm">Name</p>
          <Input
              placeholder="Your Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              variant="outlined"
              className="w-full"
            />
          </div>
        </div>

        <Button
          className="w-full"
          variant="secondary"
          onClick={handleSubmit}
          loading={isSubmitting}
          disabled={!displayName.trim()}
        >
          Let&aspos;s Go
        </Button>
      </div>
    </ModalContent>
  );
}
