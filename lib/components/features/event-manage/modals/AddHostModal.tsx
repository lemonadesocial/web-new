import { useState, useEffect, useRef, useMemo } from "react";
import * as Sentry from '@sentry/nextjs';

import { Input, ModalContent, Spacer, modal, Avatar, Toggle, FileInput, Button, toast } from "$lib/components/core";
import { Event, SearchUsersDocument, User, ManageEventCohostRequestsDocument, GetEventDocument, EventRole } from "$lib/graphql/generated/backend/graphql";
import { useQuery, useMutation, useClient } from "$lib/graphql/request";
import { userAvatar } from "$lib/utils/user";
import { EMAIL_REGEX } from "$lib/utils/regex";
import { uploadFiles } from "$lib/utils/file";
import { useUpdateEvent } from "../store";

export function AddHostModal({ event }: { event: Event }) {
  const [email, setEmail] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: usersData, loading: usersLoading } = useQuery(SearchUsersDocument, {
    variables: { query: debouncedSearchTerm },
    skip: !debouncedSearchTerm,
  });

  const [showConfigureHostModal, setShowConfigureHostModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);

  const users = usersData?.searchUsers || [];

  const isValidEmail = useMemo(() => {
    return EMAIL_REGEX.test(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setSearchTerm(value);
  };

  if (showConfigureHostModal) {
    return (
      <ConfigureHostModal
        event={event}
        onBack={() => {
          setShowConfigureHostModal(false);
          setSelectedUser(undefined);
        }}
        user={selectedUser}
        email={selectedUser?.email || debouncedSearchTerm}
      />
    );
  }

  return (
    <ModalContent icon="icon-crown" onClose={() => modal.close()}>
      <p className="text-lg">Add Host</p>
      <p className="text-sm text-secondary mt-2">Add a host to highlight them on the event page or to get help managing the event.</p>
      <p className="text-sm mt-4">Enter Email or Search</p>
      <Input
        ref={inputRef}
        className="mt-1.5"
        value={email}
        onChange={handleSearchChange}
        variant="outlined"
        placeholder="Search by name or email..."
      />
      <Spacer className="h-2" />
      <div className="h-[140px] overflow-auto no-scrollbar flex flex-col">
        {
          (isValidEmail && users.length === 0) && (
            <div
              className="flex items-center gap-3 py-2 px-3 bg-primary/8 rounded-sm cursor-pointer mb-2"
              onClick={() => setShowConfigureHostModal(true)}
            >
              <div className="size-8 bg-primary/8 rounded-full flex items-center justify-center">
                <i className="icon-person-sharp text-tertiary" />
              </div>
              <div className="flex-1">
                <p>
                  {debouncedSearchTerm}
                </p>
                <p className="text-sm text-tertiary">
                  Invite host via email
                </p>
              </div>
            </div>
          )
        }
        {usersLoading ? (
          <div className="w-[216px] self-center flex flex-col justify-center h-full">
            <p className="text-tertiary text-center">Searching...</p>
          </div>
        ) : users.length === 0 && !isValidEmail ? (
          <div className="w-[216px] self-center flex flex-col justify-center h-full">
            <p className="text-tertiary text-center">No Suggestions Found</p>
            <p className="text-sm text-tertiary text-center">You can invite hosts by entering their email address.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {users.map((user) => (
              <div
                key={user._id}
                className="flex items-center gap-3 py-2 px-3 bg-primary/8 rounded-sm cursor-pointer"
                onClick={() => {
                  setSelectedUser(user as any);
                  setShowConfigureHostModal(true);
                }}
              >
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
            ))}
          </div>
        )}
      </div>
    </ModalContent>
  );
}

type ConfigureHostModalProps = {
  event: Event;
  onBack: () => void;
  user?: User;
  email?: string;
};

function ConfigureHostModal({ event, onBack, user, email }: ConfigureHostModalProps) {
  const [showOnEventPage, setShowOnEventPage] = useState(true);
  const userName = user?.display_name || user?.name || '';
  const [name, setName] = useState(userName);
  const [file, setFile] = useState<File | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<EventRole>(EventRole.Cohost);

  const { client } = useClient();
  const updateEvent = useUpdateEvent();

  const [manageEventCohostRequests] = useMutation(ManageEventCohostRequestsDocument, {
    onComplete: async () => {
      toast.success('Host invite sent successfully');
      
      try {
        const { data } = await client.query({
          query: GetEventDocument,
          variables: { id: event._id },
          fetchPolicy: 'network-only'
        });
        
        if (data?.getEvent) {
          updateEvent(data.getEvent as Event);
        }
      } catch (error) {
        Sentry.captureException(error);
      }
      
      modal.close();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to send invite');
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
            to_email: email,
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
      setIsLoading(false);
    }
  };

  return (
    <ModalContent
      title="Configure Host"
      onClose={() => modal.close()}
      onBack={onBack}
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

        <Button
          variant="secondary"
          className="w-full"
          onClick={handleSendInvite}
          loading={isLoading}
        >
          Send Invite
        </Button>
      </div>
    </ModalContent>
  );
}
