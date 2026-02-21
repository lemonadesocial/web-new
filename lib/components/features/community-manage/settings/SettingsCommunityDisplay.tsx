'use client';
import { Controller, useForm } from 'react-hook-form';
import clsx from 'clsx';
import React from 'react';
import { debounce, kebabCase } from 'lodash';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string } from 'yup';
import * as Sentry from '@sentry/nextjs';

import {
  Button,
  Card,
  FileInput,
  InputField,
  Map,
  PlaceAutoComplete,
  Segment,
  TextAreaField,
  toast,
} from '$lib/components/core';
import { Address, CheckSpaceSlugDocument, Space, UpdateSpaceDocument } from '$lib/graphql/generated/backend/graphql';
import { useClient, useMutation } from '$lib/graphql/request';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { uploadFiles } from '$lib/utils/file';
import { generateUrl } from '$lib/utils/cnd';

import { COMMUNITY_SOCIAL_LINKS } from '../../community/constants';
import { ThemeProvider, useTheme } from '../../theme-builder/provider';
import { CommunityThemeContentBuilder } from '../../theme-builder/CommunityThemeBuilder';
import { defaultTheme, ThemeValues } from '../../theme-builder/store';

type FormValues = {
  title: string;
  description?: string;
  slug: string;
  image_avatar?: string;
  image_cover?: string;
  address?: Address;
  handle_instagram: string;
  handle_twitter: string;
  handle_youtube: string;
  handle_tiktok: string;
  handle_linkedin: string;
  website: string;
  theme_data: ThemeValues;
};

const validationSchema = object().shape({
  title: string().required(),
  slug: string()
    .min(3, 'URLs must be at least 3 characters and contain only letters, numbers or dashes.')
    .required('URLs must be at least 3 characters and contain only letters, numbers or dashes.'),
});

function SettingsCommunityDisplay({ space }: { space: Space }) {
  return (
    <ThemeProvider themeData={space.theme_data}>
      <Content space={space} />
    </ThemeProvider>
  );
}

function Content({ space }: { space: Space }) {
  const [mounted, setMounted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [uploadingCover, setUploadingCover] = React.useState(false);
  const [cover, setCover] = React.useState(generateUrl(space?.image_cover_expanded));
  const [state] = useTheme();

  const [uploadingDp, setUploadingDp] = React.useState(false);
  const [dp, setDp] = React.useState(
    generateUrl(space?.image_avatar_expanded) || `${ASSET_PREFIX}/assets/images/default-dp.png`,
  );

  const [slug, setSlug] = React.useState(space.slug || '');
  const [checking, setChecking] = React.useState(false);
  const [canUseSpaceSlug, setCanUseSpaceSlug] = React.useState(false);

  const { client } = useClient();
  const { __typename, ...address } = space.address || {};

  const {
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors, dirtyFields, isDirty },
  } = useForm<FormValues>({
    defaultValues: {
      title: space.title,
      description: space.description || '',
      slug: space.slug || '',
      image_avatar: space.image_avatar,
      image_cover: space.image_cover,
      address: address || undefined,
      handle_instagram: space.handle_instagram || '',
      handle_twitter: space.handle_twitter || '',
      handle_youtube: space.handle_youtube || '',
      handle_tiktok: space.handle_tiktok || '',
      handle_linkedin: space.handle_linkedin || '',
      website: space.website || '',
      theme_data: space.theme_data || defaultTheme,
    },
    resolver: yupResolver(validationSchema),
  });

  const [update] = useMutation(UpdateSpaceDocument, {
    onComplete: (client, incomming) => {
      if (incomming?.updateSpace) {
        const data = incomming.updateSpace as Space;

        /** map form fields bc backend is not return some field based on roles  */
        client.writeFragment({
          id: `Space:${space._id}`,
          data: {
            ...space,
            title: data.title,
            description: data.description,
            slug: data.slug,
            image_avatar: data.image_avatar,
            image_cover: data.image_cover,
            address: data.address,
            handle_instagram: data.handle_instagram,
            handle_twitter: data.handle_twitter,
            handle_youtube: data.handle_youtube,
            handle_tiktok: data.handle_tiktok,
            handle_linkedin: data.handle_linkedin,
            website: data.website,
            theme_data: data.theme_data || defaultTheme,
          },
        });

        const { __typename: _, ...dataAddress } = data.address || {};
        reset({
          title: data.title,
          description: data.description || '',
          slug: data.slug || '',
          image_avatar: data.image_avatar,
          image_cover: data.image_cover,
          address: dataAddress || undefined,
          handle_instagram: data.handle_instagram || '',
          handle_twitter: data.handle_twitter || '',
          handle_youtube: data.handle_youtube || '',
          handle_tiktok: data.handle_tiktok || '',
          handle_linkedin: data.handle_linkedin || '',
          website: data.website || '',
          theme_data: data.theme_data || defaultTheme,
        });
        toast.success('Update succeess.');
      }
    },
  });

  React.useEffect(() => {
    if (!mounted) setMounted(true);
  }, []);

  React.useEffect(() => {
    if (space.title) setValue('title', space.title);
    if (space.description) setValue('description', space.description);
  }, [space]);

  const handleUpload = async (files: globalThis.File[], type: 'cover' | 'dp') => {
    try {
      if (type === 'cover') setUploadingCover(true);
      if (type === 'dp') setUploadingDp(true);

      const images = await uploadFiles(files, 'community');

      if (type === 'cover') {
        setCover(images[0].url);
        setValue('image_cover', images[0]._id as any);
      }
      if (type === 'dp') {
        setDp(images[0].url);
        setValue('image_avatar', images[0]._id as any);
      }

      handleSubmit(onSubmit)();
    } catch (err) {
      Sentry.captureException(err);
      toast.error(`Cannot upload ${type} image!`);
    } finally {
      if (type === 'cover') setUploadingCover(false);
      if (type === 'dp') setUploadingDp(false);
    }
  };

  const debouncedFetchData = React.useCallback(
    debounce(async (query) => {
      try {
        const { data } = await client.query({ query: CheckSpaceSlugDocument, variables: { slug: query } });
        setCanUseSpaceSlug(!!data?.canUseSpaceSlug);
      } catch (err) {
        Sentry.captureException(err);
      } finally {
        setChecking(false);
      }
    }, 500),
    [],
  );

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      const siteInfo = values.slug ? { slug: kebabCase(values.slug) } : {};
      await update({ variables: { id: space._id, input: { ...values, ...siteInfo } } });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getIconSlugField = () => {
    if (slug.length < 3 || !dirtyFields.slug) return '';

    if (checking) return 'icon-spin animate-spin align-items-center text-warning-400 flex h-full mx-2';
    if (canUseSpaceSlug) {
      return 'icon-richtext-check text-success-400 align-items-center flex h-full mx-2';
    } else {
      return 'icon-x text-danger-400 align-items-center flex h-full mx-2';
    }
  };

  React.useEffect(() => {
    setValue('theme_data', state, { shouldDirty: true });
  }, [state]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {isDirty && (
        <div className="px-4 md:px-0 bg-warning-300/16 backdrop-blur-sm sticky top-[156px] z-50">
          <div className="page mx-auto flex justify-between py-3 items-center">
            <p className="text-warning-300">You have unsaved changes.</p>
            <Button type="submit" size="sm" loading={isSubmitting} className="rounded-full" variant="warning">
              Save Changes
            </Button>
          </div>
        </div>
      )}

      <div className="page bg-transparent! mx-auto py-7 px-4 md:px-0">
        <div className="flex flex-col gap-4">
          <Card.Root>
            <Card.Content className="p-0">
              <div className="relative">
                <FileInput onChange={(files) => handleUpload(files, 'cover')}>
                  {(open) => (
                    <>
                      <div
                        style={{
                          backgroundImage: `url(${cover})`,
                          backgroundColor: 'var(--btn-tertiary)',
                        }}
                        className="aspect-[7/2] w-full bg-cover bg-center bg-no-repeat"
                      />

                      <Button
                        size="sm"
                        variant="tertiary-alt"
                        className="absolute right-2 top-2"
                        onClick={open}
                        loading={uploadingCover}
                      >
                        Change Cover
                      </Button>
                    </>
                  )}
                </FileInput>

                <div className="flex flex-col gap-2 p-4 -mt-[48px]">
                  <FileInput onChange={(files) => handleUpload(files, 'dp')}>
                    {(open) => (
                      <div
                        className="size-[72px] rounded flex justify-end items-end bg-contain bg-no-repeat bg-center border border-(--color-divider) cursor-pointer"
                        style={{
                          backgroundImage: `url(${dp})`,
                        }}
                        onClick={(e) => {
                          if (uploadingDp) {
                            e.preventDefault();
                            return;
                          }
                          open();
                        }}
                      >
                        <Button icon="icon-upload" size="xs" variant="secondary" loading={uploadingDp} />
                      </div>
                    )}
                  </FileInput>

                  <div className="flex flex-col gap-1 space-y-2 py-2">
                    <Controller
                      name="title"
                      control={control}
                      render={({ field }) => (
                        <input
                          className={clsx(
                            'font-medium text-xl outline-none border-b border-(--color-divider) pb-2',
                            errors.title?.message && 'border-danger-500',
                          )}
                          placeholder="Community Name"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      )}
                    />

                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <TextAreaField
                          className="px-0! border-none! bg-transparent! hover:border-none! *:field-sizing-content!"
                          value={field.value}
                          placeholder="Add a short description"
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card.Root>

          <div className="flex flex-col md:flex-row gap-6 justify-between z-1">
            <Card.Root className="flex-1">
              <Card.Content className="space-y-4">
                <p className="text-lg">Customization</p>

                <Controller
                  control={control}
                  name="slug"
                  render={() => (
                    <InputField
                      label="Public URL"
                      prefix="lemonade.social/s/"
                      value={slug}
                      onChangeText={(value) => {
                        setSlug(value);
                        setValue('slug', value, { shouldDirty: true, shouldValidate: true });
                        if (value.length > 2) {
                          setChecking(true);
                          debouncedFetchData(value);
                        }
                      }}
                      right={{
                        icon: getIconSlugField(),
                      }}
                      error={dirtyFields.slug && (!!errors.slug?.message || !canUseSpaceSlug)}
                      hint={
                        !checking && dirtyFields.slug && (!!errors.slug?.message || !canUseSpaceSlug)
                          ? errors.slug?.message || 'This URL is already taken.'
                          : ''
                      }
                    />
                  )}
                />
              </Card.Content>
            </Card.Root>

            <Card.Root className="flex-1 overflow-visible">
              <Card.Content className="space-y-4">
                <p className="text-lg">Location</p>
                <div className="relative">
                  <div className="h-[192px] rounded-md overflow-hidden">
                    <Map customMap />
                  </div>

                  <Segment
                    size="sm"
                    className="absolute top-2 left-2"
                    selected="city"
                    items={[
                      { value: 'city', label: 'City' },
                      { value: 'global', label: 'Global' },
                    ]}
                  />
                  <div className="absolute bottom-2 left-2 right-2">
                    <Controller
                      name="address"
                      control={control}
                      render={({ field }) => (
                        <PlaceAutoComplete
                          value={field.value?.title || ''}
                          onSelect={(value) => {
                            setValue('address', value, { shouldDirty: value?.title !== space.address?.title });
                          }}
                        />
                      )}
                    />
                  </div>
                </div>
              </Card.Content>
            </Card.Root>
          </div>

          <Card.Root>
            <Card.Content className="space-y-4">
              <p className="text-lg">Appearance</p>
              <CommunityThemeContentBuilder className="p-0 [&>*:first-child]:justify-start" />
            </Card.Content>
          </Card.Root>

          <Card.Root>
            <Card.Content className="space-y-4">
              <p className="text-lg">Links</p>

              <div className="flex flex-col md:grid grid-cols-2 gap-4">
                {COMMUNITY_SOCIAL_LINKS.map((item) => {
                  return (
                    <Controller
                      key={item.key}
                      name={item.key as any}
                      control={control}
                      render={({ field }) => {
                        return (
                          <div className="flex items-center gap-4 flex-1">
                            <i className={`text-tertiary ${item.icon}`} />
                            <InputField
                              prefix={item.prefix}
                              className="w-full"
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </div>
                        );
                      }}
                    />
                  );
                })}
              </div>
            </Card.Content>
          </Card.Root>
        </div>
      </div>
    </form>
  );
}

export default SettingsCommunityDisplay;
