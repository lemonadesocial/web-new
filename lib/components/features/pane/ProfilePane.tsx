'use client';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import { useAtomValue, useSetAtom } from 'jotai';
import { account, AccountOptions, MetadataAttributeType } from '@lens-protocol/metadata';
import { setAccountMetadata } from '@lens-protocol/client/actions';
import { storageClient } from '$lib/utils/lens/client';

import {
  Button,
  drawer,
  Dropdown,
  FileInput,
  InputField,
  Menu,
  MenuItem,
  modal,
  Skeleton,
  TextAreaField,
  toast,
} from '$lib/components/core';
import { Pane } from '$lib/components/core/pane/pane';
import { useMe } from '$lib/hooks/useMe';
import { userAvatar } from '$lib/utils/user';
import { useClient, useMutation } from '$lib/graphql/request';
import { File, UpdateUserDocument, User } from '$lib/graphql/generated/backend/graphql';
import { chainsMapAtom, sessionClientAtom } from '$lib/jotai';
import { useConnectWallet } from '$lib/hooks/useConnectWallet';
import { ATTRIBUTES_SAFE_KEYS, LENS_CHAIN_ID } from '$lib/utils/lens/constants';
import { getAccountAvatar } from '$lib/utils/lens/utils';
import { useAccount, useLemonadeUsername } from '$lib/hooks/useLens';
import { uploadFiles } from '$lib/utils/file';
import { generateUrl } from '$lib/utils/cnd';
import { useDisconnect } from '$lib/utils/appkit';

import { SelectProfileModal } from '../lens-account/SelectProfileModal';
import { ProfileMenu } from '../lens-account/ProfileMenu';
import { ClaimLemonadeUsernameModal } from '../lens-account/ClaimLemonadeUsernameModal';
import { PROFILE_SOCIAL_LINKS } from '$lib/utils/constants';

type ProfileValues = {
  name?: string | null;
  username?: string | null;
  description?: string | null;
  website?: string | null;
  job_title?: string | null;
  pronoun?: string | null;
  company_name?: string | null;
  handle_farcaster?: string | null;
  handle_github?: string | null;
  handle_instagram?: string | null;
  handle_twitter?: string | null;
  handle_linkedin?: string | null;
  calendly_url?: string | null;
  new_photos?: string[];
};

export function ProfilePane() {
  const me = useMe();

  if (!me) return null;
  return <ProfilePaneContent me={me} />;
}

export function ProfilePaneContent({ me }: { me: User }) {
  const sessionClient = useAtomValue(sessionClientAtom);
  const { account: myAccount, refreshAccount } = useAccount();
  const { username, isLoading } = useLemonadeUsername(myAccount);
  const { disconnect } = useDisconnect();
  const { client } = useClient();
  const setSessionClient = useSetAtom(sessionClientAtom);

  const chainsMap = useAtomValue(chainsMapAtom);
  const { connect, isReady } = useConnectWallet(chainsMap[LENS_CHAIN_ID]);

  const [uploading, setUploading] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [file, setFile] = React.useState<{ lens: any; lemonade: File } | null>(null);

  const [updateProfile] = useMutation(UpdateUserDocument, {
    onComplete(client, data) {
      const user = data.updateUser as User;
      client.writeFragment({ id: `User:${user._id}`, data: user });
    },
  });

  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { isDirty },
  } = useForm<ProfileValues>({
    defaultValues: {
      name: me?.name,
      // username: me?.username,
      description: me?.description,
      website: me.website,
      handle_farcaster: me?.handle_farcaster,
      handle_github: me?.handle_github,
      handle_instagram: me?.handle_instagram,
      handle_twitter: me?.handle_twitter,
      handle_linkedin: me?.handle_linkedin,
      calendly_url: me?.calendly_url,
      job_title: me?.job_title,
      pronoun: me?.pronoun,
      company_name: me?.company_name,
      new_photos: me?.new_photos || [],
    },
  });

  React.useEffect(() => {
    if (myAccount) {
      setValue('name', myAccount.metadata?.name);
      setValue('username', username);
      setValue('description', myAccount.metadata?.bio);
      ATTRIBUTES_SAFE_KEYS.forEach((key) => {
        const attr = myAccount.metadata?.attributes.find((p) => p.key === key);
        setValue(key as any, attr?.value || '');
      });
    }
  }, [myAccount, username]);

  const getProfilePicture = async () => {
    if (!file?.lens) return undefined;
    const { uri } = await storageClient.uploadFile(file.lens);
    return uri;
  };

  const onSubmit = async (values: ProfileValues) => {
    setIsSubmitting(true);
    try {
      const { username: _, new_photos, ...data } = values;
      let input: any = { ...data, display_name: data.name };
      if (new_photos?.length) input = { ...input, new_photos };
      const { error } = await updateProfile({ variables: { input } });
      if (error) {
        toast.error(error.message);
        return;
      }

      if (myAccount && sessionClient) {
        // NOTE: picture not accept empty string
        const picture = (await getProfilePicture()) || myAccount.metadata?.picture || undefined;

        const attributes = [] as { key: string; type: MetadataAttributeType; value: string }[];
        ATTRIBUTES_SAFE_KEYS.forEach((k) => {
          // @ts-expect-error ignore ts check
          if (values[k]) attributes.push({ key: k, type: MetadataAttributeType.STRING, value: values[k] });
        });

        const accountVariables = {
          name: values.name || undefined,
          bio: values.description || undefined,
          picture,
        } as AccountOptions;

        // @ts-expect-error no need to check attributes type
        if (attributes.length) accountVariables.attributes = attributes;

        const accountMetadata = account(accountVariables);

        const { uri } = await storageClient.uploadAsJson(accountMetadata);

        const result = await setAccountMetadata(sessionClient, {
          metadataUri: uri,
        });

        if (result.isErr()) {
          toast.error(result.error.message);
          return;
        }

        setTimeout(() => {
          refreshAccount();
        }, 2000);
      }

      toast.success('Profile updated successfully');
      drawer.close();
    } catch (err) {
      console.error(err);
      // toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Pane.Root>
      <Pane.Header.Root>
        <Pane.Header.Left />
        <Pane.Header.Center className="flex items-center justify-center">
          <p className="text-primary">Edit Profile</p>
        </Pane.Header.Center>
      </Pane.Header.Root>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Pane.Content className="p-4 flex flex-col gap-5">
          <div className="flex items-center justify-center py-4">
            <div className="size-[140px] relative">
              <img
                src={
                  file?.lemonade ? generateUrl(file.lemonade) : myAccount ? getAccountAvatar(myAccount) : userAvatar(me)
                }
                className="w-full h-full aspect-square object-cover rounded-full"
              />
              <FileInput
                onChange={async (files) => {
                  try {
                    setUploading(true);
                    const photos = watch('new_photos') || [];
                    const lemonadeFiles = await uploadFiles(files, 'user');
                    const file = lemonadeFiles[0] as File;
                    setValue('new_photos', [file._id, ...photos], { shouldDirty: true });
                    setFile({ lens: files[0], lemonade: file });
                  } catch (err) {
                    console.log(err);
                    toast.error('Upload fail!');
                  } finally {
                    setUploading(false);
                  }
                }}
              >
                {(open) => (
                  <Button
                    icon="icon-upload-sharp"
                    variant="secondary"
                    onClick={open}
                    loading={uploading}
                    className="rounded-full absolute bottom-0 right-0 border-4! border-overlay-primary! max-w-[40px] max-h-[40px]"
                  />
                )}
              </FileInput>
            </div>
          </div>

          <div className="flex flex-col gap-5 divide-y divide-[var(--color-divider)]">
            <div className="flex flex-col gap-4 pb-5">
              <Controller
                control={control}
                name="name"
                render={({ field }) => {
                  return (
                    <InputField label="Name" placeholder="Jane Doe" value={field.value} onChange={field.onChange} />
                  );
                }}
              />

              {isLoading ? (
                <Skeleton animate className="h-8 w-1/2 rounded" />
              ) : myAccount && username ? (
                <Controller
                  control={control}
                  name="username"
                  render={({ field }) => {
                    return (
                      <div className="flex gap-2 items-end">
                        <div className="flex-1">
                          <InputField
                            label="Username"
                            prefix="@lemonade/"
                            readOnly
                            value={field.value}
                            onChange={field.onChange}
                          />
                        </div>

                        <ProfileMenu options={{ canView: false, canEdit: false }}>
                          <Button variant="tertiary-alt" icon="icon-more-vert" className="w-[40px] h-[40px]" />
                        </ProfileMenu>
                      </div>
                    );
                  }}
                />
              ) : (
                <div className="flex flex-col gap-1.5">
                  <label className="font-medium text-sm">Username</label>
                  <div className="flex w-full flex-between gap-5">
                    <div className="flex-1">
                      <Button
                        variant="secondary"
                        className="w-full"
                        onClick={() => {
                          if (!isReady) connect();
                          if (!myAccount) modal.open(SelectProfileModal);
                          else modal.open(ClaimLemonadeUsernameModal);
                        }}
                      >
                        {isReady
                          ? myAccount && !username
                            ? 'Claim Your Username'
                            : 'Select Account'
                          : 'Connect Wallet'}
                      </Button>
                    </div>

                    {myAccount ? (
                      <ProfileMenu options={{ canView: false, canEdit: false }}>
                        <Button variant="tertiary-alt" icon="icon-more-vert" className="w-[40px] h-[40px]" />
                      </ProfileMenu>
                    ) : (
                      <Menu.Root>
                        <Menu.Trigger>
                          <Button variant="tertiary-alt" icon="icon-more-vert" className="w-[40px] h-[40px]" />
                        </Menu.Trigger>
                        <Menu.Content className="p-1">
                          {({ toggle }) => (
                            <MenuItem
                              onClick={async () => {
                                disconnect();
                                client.resetCustomerHeader();
                                setSessionClient(null);
                                toggle();
                              }}
                            >
                              <div className="flex items-center gap-2.5">
                                <i className="icon-exit size-4 text-error" />
                                <p className="text-sm text-error">Disconnect</p>
                              </div>
                            </MenuItem>
                          )}
                        </Menu.Content>
                      </Menu.Root>
                    )}
                  </div>
                </div>
              )}

              <Controller
                control={control}
                name="description"
                render={({ field }) => (
                  <TextAreaField label="Bio" rows={3} value={field.value} onChange={field.onChange} />
                )}
              />

              {/* TODO: check location value from lens */}
              {/* <InputField label="Location" iconLeft="icon-location-outline" placeholder="Where you’re currently based" /> */}

              <Controller
                control={control}
                name="website"
                render={({ field }) => (
                  <InputField
                    label="Website"
                    iconLeft="icon-globe"
                    placeholder="Your website"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>

            <div className="flex flex-col gap-4 pb-5">
              <p>Social Links</p>
              <div className="flex flex-col gap-4">
                {PROFILE_SOCIAL_LINKS.map((item) => (
                  <div key={item.name} className="flex items-center gap-4">
                    <i className={twMerge('size-5 text-tertiary', item.icon)} />
                    <div className="flex-1">
                      <Controller
                        name={item.name as any}
                        control={control}
                        render={({ field }) => (
                          <InputField
                            value={field.value}
                            prefix={item.prefix}
                            placeholder={item.placeholder}
                            onChange={field.onChange}
                          />
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 pb-5">
              <p>Personal Details</p>
              <div className="flex flex-col gap-4">
                <Controller
                  control={control}
                  name="pronoun"
                  render={() => {
                    const pronoun = watch('pronoun');
                    const options = [
                      { key: 'She', value: 'She / her', icon: 'icon-gender-female' },
                      { key: 'He', value: 'He / his', icon: 'icon-gender-male' },
                      { key: 'They', value: 'They / them', icon: 'icon-user-group-outline-2' },
                    ];
                    const selected = options.find((item) => item.key === pronoun);
                    return (
                      <Dropdown
                        label="Pronouns"
                        placeholder="Select the pronouns you use"
                        iconLeft="icon-user"
                        value={selected}
                        options={options}
                        onSelect={(opt) => setValue('pronoun', opt.key as string)}
                      />
                    );
                  }}
                />

                <Controller
                  control={control}
                  name="job_title"
                  render={({ field }) => (
                    <InputField
                      iconLeft="icon-suitcase"
                      value={field.value}
                      onChange={field.onChange}
                      label="Job Title"
                      placeholder="Your current role"
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="company_name"
                  render={({ field }) => (
                    <InputField
                      iconLeft="icon-factory"
                      value={field.value}
                      onChange={field.onChange}
                      label="Organization"
                      placeholder="Where you work"
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </Pane.Content>
        <Pane.Footer className="border-t px-4 py-3">
          <Button variant="secondary" disabled={!isDirty} loading={isSubmitting} type="submit">
            Save Changes
          </Button>
        </Pane.Footer>
      </form>
    </Pane.Root>
  );
}
