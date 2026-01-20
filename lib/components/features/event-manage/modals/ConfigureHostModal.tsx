import { useState } from "react";

import { Input, ModalContent, modal, Avatar, Toggle, FileInput, Button, toast } from "$lib/components/core";
import { Event, User, ManageEventCohostRequestsDocument, GetEventDocument, EventRole } from "$lib/graphql/generated/backend/graphql";
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
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  
  const currentRole = event.cohosts_expanded_new?.find(
    (host) => host?._id === user._id
  )?.event_role;
  
  const [selectedRole, setSelectedRole] = useState<EventRole>(
    currentRole || EventRole.Cohost
  );

  const { client } = useClient();
  const updateEvent = useUpdateEvent();

  const [manageEventCohostRequests] = useMutation(ManageEventCohostRequestsDocument, {
    onComplete: async () => {
      toast.success('Host updated successfully');
      modal.close();

      const { data } = await client.query({
        query: GetEventDocument,
        variables: { id: event._id },
        fetchPolicy: 'network-only'
      });

      if (data?.getEvent) {
        updateEvent(data.getEvent as Event);
      }
    }
  });

  const handleSendInvite = async () => {
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }

    setIsUpdating(true);

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
            to: user._id,
            profile_name: name,
            profile_image_avatar: profileImageAvatar,
            visible: showOnEventPage,
            event_role: selectedRole,
          }
        }
      });
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveHost = async () => {
    setIsRemoving(true);

    try {
      await manageEventCohostRequests({
        variables: {
          input: {
            decision: false,
            event: event._id,
            to_email: user.email,
            to: user._id,
          }
        }
      });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <ModalContent
      title="Configure Host"
      onClose={() => modal.close()}
    >
      <div className="space-y-4">
        {
          user && (
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

        {
          user._id !== event.host && (
            <div className="space-y-2">
              <p className="text-sm text-secondary">Access Control</p>
              <div className="space-y-2">
                <div
                  className={`flex items-center gap-3 py-1.5 px-3 rounded-sm cursor-pointer border transition-colors ${
                    selectedRole === EventRole.Cohost
                      ? 'border-primary'
                      : 'border-primary/8'
                  }`}
                  onClick={() => setSelectedRole(EventRole.Cohost)}
                >
                  <i className="icon-crown size-5" />
                  <div className="flex-1">
                    <p>Cohost</p>
                    <p className="text-sm text-tertiary">Full manage access to the event</p>
                  </div>
                  {selectedRole === EventRole.Cohost && <i className="icon-check size-5" />}
                </div>
                <div
                  className={`flex items-center gap-3 py-1.5 px-3 rounded-sm cursor-pointer border transition-colors ${
                    selectedRole === EventRole.Gatekeeper
                      ? 'border-primary'
                      : 'border-primary/8'
                  }`}
                  onClick={() => setSelectedRole(EventRole.Gatekeeper)}
                >
                  <i className="icon-person-sharp size-5" />
                  <div className="flex-1">
                    <p>Promoter</p>
                    <p className="text-sm text-tertiary">Check in guests & view guest list</p>
                  </div>
                  {selectedRole === EventRole.Gatekeeper && <i className="icon-check size-5" />}
                </div>
              </div>
            </div>
          )
        }

        <div className="flex gap-2">
          {
            user._id !== event.host && (
              <Button
                variant="danger"
                outlined
                className="w-full"
                onClick={handleRemoveHost}
                disabled={isUpdating || isRemoving}
                loading={isRemoving}
              >
                Remove
              </Button>
            )
          }
          <Button
            variant="secondary"
            className="w-full"
            onClick={handleSendInvite}
            disabled={isUpdating || isRemoving}
            loading={isUpdating}
          >
            Update
          </Button>
        </div>
      </div>
    </ModalContent>
  );
}
