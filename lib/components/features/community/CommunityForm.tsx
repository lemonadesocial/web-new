'use client';
import { yupResolver } from '@hookform/resolvers/yup';
import { debounce, kebabCase } from 'lodash';
import React from 'react';
import { Controller, useForm, UseFormReturn } from 'react-hook-form';
import { object, string } from 'yup';
import * as Sentry from '@sentry/nextjs';

import { Button, Card, FileInput, InputField, Map, Segment, TextAreaField, toast } from '$lib/components/core';
import { PlaceAutoComplete } from '$lib/components/core/map/place-autocomplete';
import { Address, CheckSpaceSlugDocument, CreateSpaceDocument, Space } from '$lib/graphql/generated/backend/graphql';
import { useClient, useMutation } from '$lib/graphql/request';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { uploadFiles } from '$lib/utils/file';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { useMe } from '$lib/hooks/useMe';
import { useSignIn } from '$lib/hooks/useSignIn';
import { useSession } from '$lib/hooks/useSession';

const validationSchema = object().shape({
  title: string().required(),
  slug: string()
    .min(3, 'URLs must be at least 3 characters and contain only letters, numbers or dashes.')
    .required('URLs must be at least 3 characters and contain only letters, numbers or dashes.'),
});

type FormValues = {
  title: string;
  description?: string;
  slug: string;
  image_avatar?: string;
  image_cover?: string;
  address?: Address;
};

export function CommunityForm() {
  const router = useRouter();
  const session = useSession();
  const me = useMe();
  const signIn = useSignIn();

  const [mounted, setMounted] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [create] = useMutation(CreateSpaceDocument);

  const form = useForm<FormValues>({
    defaultValues: {
      title: '',
      description: undefined,
      slug: '',
      image_avatar: undefined,
      image_cover: undefined,
      address: undefined,
    },
    resolver: yupResolver(validationSchema),
  });

  const {
    handleSubmit,
    formState: { isValid },
  } = form;

  React.useEffect(() => {
    if (!mounted) setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!me && !session && mounted) signIn(false);
  }, [me, session, mounted]);

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      const siteInfo = values.slug ? { slug: kebabCase(values.slug) } : {};

      const { data, error } = await create({ variables: { input: { ...values, ...siteInfo } } });
      if (error) {
        // toast.error(error.message);
        return;
      }

      if (data) {
        const space = data.createSpace as Space;
        router.push(`/s/manage/${space.slug || space._id}`);
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <CommunityFormContent form={form} />
      <div>
        <Button type="submit" loading={isSubmitting} variant="secondary" disabled={!isValid}>
          Create Community
        </Button>
      </div>
    </form>
  );
}

export function CommunityFormContent({
  form,
  mobile,
}: {
  form: UseFormReturn<FormValues>;
  /** @description force mobile view such as right pane */
  mobile?: boolean;
}) {
  const {
    control,
    setValue,
    setError,
    formState: { errors, dirtyFields },
  } = form;

  const [uploadingCover, setUploadingCover] = React.useState(false);
  const [cover, setCover] = React.useState('');

  const [uploadingDp, setUploadingDp] = React.useState(false);
  const [dp, setDp] = React.useState(`${ASSET_PREFIX}/assets/images/default-dp.png`);

  const [slug, setSlug] = React.useState('');
  const [checking, setChecking] = React.useState(false);
  const [canUseSpaceSlug, setCanUseSpaceSlug] = React.useState(false);

  const { client } = useClient();

  const debouncedFetchData = React.useCallback(
    debounce(async (query) => {
      try {
        const { data } = await client.query({ query: CheckSpaceSlugDocument, variables: { slug: query } });

        if (!!data?.canUseSpaceSlug) {
          setError('slug', { type: 'validate', message: 'This URL is already taken.' });
        }
        setCanUseSpaceSlug(!!data?.canUseSpaceSlug);
      } catch (err: any) {
        Sentry.captureException(err);
      } finally {
        setChecking(false);
      }
    }, 500),
    [],
  );

  const getIconSlugField = () => {
    if (slug.length < 3) return '';

    if (checking) return 'icon-spin animate-spin align-items-center text-warning-400 flex h-full mx-2';
    if (canUseSpaceSlug) {
      return 'icon-richtext-check text-success-400 align-items-center flex h-full mx-2';
    } else {
      return 'icon-x text-danger-400 align-items-center flex h-full mx-2';
    }
  };

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
    } catch (err) {
      Sentry.captureException(err);
      toast.error(`Cannot upload ${type} image!`);
    } finally {
      if (type === 'cover') setUploadingCover(false);
      if (type === 'dp') setUploadingDp(false);
    }
  };

  React.useEffect(() => {
    if (!canUseSpaceSlug) {
    }
  }, [canUseSpaceSlug]);

  return (
    <>
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

      <div className={clsx('flex flex-col gap-6 justify-between', !mobile && 'md:flex-row')}>
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
                    dirtyFields.slug && (!!errors.slug?.message || !canUseSpaceSlug)
                      ? errors.slug?.message || 'This URL is already taken.'
                      : ''
                  }
                />
              )}
            />
          </Card.Content>
        </Card.Root>

        <Card.Root className="flex-1" style={{ overflow: 'inherit !important' }}>
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
                <PlaceAutoComplete onSelect={(value) => setValue('address', value)} />
              </div>
            </div>
          </Card.Content>
        </Card.Root>
      </div>
    </>
  );
}
