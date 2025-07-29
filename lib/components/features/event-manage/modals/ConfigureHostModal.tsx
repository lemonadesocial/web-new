import { useState } from "react";

import { Input, ModalContent, modal, Avatar, Toggle, FileInput, Button, toast } from "$lib/components/core";
import { Event, User, ManageEventCohostRequestsDocument, GetEventDocument } from "$lib/graphql/generated/backend/graphql";
import { useMutation, useClient } from "$lib/graphql/request";
import { userAvatar } from "$lib/utils/user";
import { uploadFiles } from "$lib/utils/file";

import { useUpdateEvent } from "../store";

type ConfigureHostModalProps = {
  event: Event;
  user: User;
  isVisible?: boolean;
};

export function ConfigureHostModal({ event, user, isVisible }: ConfigureHostModalProps) {
  const [showOnEventPage, setShowOnEventPage] = useState(isVisible);

  const userName = user.display_name || user.name || '';

  const [name, setName] = useState(userName);
  const [file, setFile] = useState<File | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const { client } = useClient();
  const updateEvent = useUpdateEvent();

  const [manageEventCohostRequests] = useMutation(ManageEventCohostRequestsDocument, {
    onComplete: async () => {
      toast.success('Host updated successfully');
      
      const { data } = await client.query({
        query: GetEventDocument,
        variables: { id: event._id },
        fetchPolicy: 'network-only'
      });
      
      if (data?.getEvent) {
        updateEvent(data.getEvent as Event);
      }
      
      modal.close();
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const handleSendInvite = async () => {
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }

    setIsLoading(true);

    try {
      let profileImageAvatar: string | undefined;

      if (file) {
        const uploadedFiles = await uploadFiles([file], 'user');
        profileImageAvatar = uploadedFiles[0].url;
      }

      await manageEventCohostRequests({
        variables: {
          input: {
            decision: true,
            event: event._id,
            to_email: user.email,
            profile_name: name,
            profile_image_avatar: profileImageAvatar,
            visible: showOnEventPage,
          }
        }
      });
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalContent
      title="Configure Host"
      onClose={() => modal.close()}
    >
      <div className="space-y-4">
        {
          user ? (
            <div className="flex gap-3 items-center">
              <Avatar
                src={userAvatar(user as any)}
                size="lg"
              />
              <div>
                <p>{user.display_name || user.name}</p>
                <p className="text-sm text-tertiary">
                  {user.email}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex gap-2 items-center">
              <i className="icon-person-outline text-tertiary size-5" />
              <p>{email}</p>
            </div>
          )
        }

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p>Show on Event Page</p>
            <Toggle
              id="show-on-event-page"
              checked={showOnEventPage}
              onChange={value => setShowOnEventPage(value)}
            />
          </div>

          {
            user._id === event.host && (
              <p className="text-tertiary text-sm">
                If you&apos;d like to hide the creator of this event, please transfer the event to a different community.
              </p>
            )
          }

          {
            !userName && <>
              <p className="text-sm text-tertiary">Help them set up their Lemonade profile so they show up nicely on the event page.</p>
              <div className="flex gap-3 items-center">
                <div className="relative">
                  <Avatar src={file ? URL.createObjectURL(file) : userAvatar(user)} className="rounded-full size-10" />
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

                <Input
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  variant="outlined"
                />
              </div>
            </>
          }
        </div>

        <Button
          variant="secondary"
          className="w-full"
          onClick={handleSendInvite}
          loading={isLoading}
        >
          Update
        </Button>
      </div>
    </ModalContent>
  );
}
