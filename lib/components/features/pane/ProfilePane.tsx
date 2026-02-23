'use client';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import { useSetAtom } from 'jotai';
import * as Sentry from '@sentry/nextjs';

import {
  Button,
  drawer,
  Dropdown,
  FileInput,
  InputField,
  TextAreaField,
  toast,
} from '$lib/components/core';
import { Pane } from '$lib/components/core/pane/pane';
import { useMe } from '$lib/hooks/useMe';
import { userAvatar } from '$lib/utils/user';
import { useClient, useMutation } from '$lib/graphql/request';
import { File, UpdateUserDocument, User } from '$lib/graphql/generated/backend/graphql';
import { userAtom } from '$lib/jotai';
import { uploadFiles } from '$lib/utils/file';
import { generateUrl } from '$lib/utils/cnd';

import { PROFILE_SOCIAL_LINKS } from '$lib/utils/constants';
import { useClaimUsername } from '$lib/hooks/useUsername';

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
  cover?: string;
};

export function ProfilePane() {
  const me = useMe();

  if (!me) return null;
  return <ProfilePaneContent me={me} />;
}

export function ProfilePaneContent({ me }: { me: User }) {
  const { client } = useClient();
  const setMe = useSetAtom(userAtom);
  const claimUsername = useClaimUsername();

  const [uploading, setUploading] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const [fileCover, setFileCover] = React.useState<File | null>(null);

  const [updateProfile] = useMutation(UpdateUserDocument, {
    onComplete(client, data) {
      const user = data.updateUser as User;
      setMe(user);
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
      username: me?.username,
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
      cover: me.cover,
    },
  });

  const onSubmit = async (values: ProfileValues) => {
    setIsSubmitting(true);
    try {
      const { username: _, new_photos, ...data } = values;
      let input: any = { ...data, display_name: data.name };
      if (new_photos?.length) input = { ...input, new_photos };

      await updateProfile({ variables: { input } });

      toast.success('Profile updated successfully');
      drawer.close();
    } catch (err: any) {
      Sentry.captureException(err);
      toast.error(err.message);
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
          <div className="relative h-[172px]">
            <div className="bg-(--btn-tertiary) aspect-[4/1] rounded-sm">
              {(fileCover || me.cover_expanded) && (
                <img
                  src={fileCover ? generateUrl(fileCover) : me.cover_expanded ? generateUrl(me.cover_expanded) : ''}
                  className="w-full h-full object-cover rounded-sm"
                />
              )}
              <FileInput
                onChange={async (files) => {
                  try {
                    setUploading(true);
                    const lemonadeFiles = await uploadFiles(files, 'user');
                    const file = lemonadeFiles[0] as File;
                    setValue('cover', file._id, { shouldDirty: true });
                    setFileCover(file);
                  } catch (err) {
                    Sentry.captureException(err);
                    toast.error('Upload fail!');
                  } finally {
                    setUploading(false);
                  }
                }}
              >
                {(open) => (
                  <Button
                    variant="tertiary-alt"
                    size="sm"
                    onClick={open}
                    loading={uploading}
                    className="absolute top-2 right-2"
                  >
                    Change Cover
                  </Button>
                )}
              </FileInput>
            </div>
            <div className="absolute bottom-0">
              <div className="size-24 relative">
                <img
                  src={
                    file
                      ? generateUrl(file)
                      : me.new_photos_expanded?.[0]
                        ? generateUrl(me.new_photos_expanded[0])
                        : userAvatar(me)
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
                      setFile(file);
                    } catch (err) {
                      Sentry.captureException(err);
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

              {me.username ? (
                <Controller
                  control={control}
                  name="username"
                  render={({ field }) => {
                    return (
                      <InputField
                        label="Username"
                        prefix="@lemonade/"
                        readOnly
                        value={field.value}
                        onChange={field.onChange}
                      />
                    );
                  }}
                />
              ) : (
                <div className="flex flex-col gap-1.5">
                  <label className="font-medium text-sm">Username</label>
                  <Button variant="secondary" className="w-full" onClick={claimUsername}>
                    Claim Your Username
                  </Button>
                </div>
              )}

              <Controller
                control={control}
                name="description"
                render={({ field }) => (
                  <TextAreaField label="Bio" rows={3} value={field.value} onChange={field.onChange} />
                )}
              />

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
