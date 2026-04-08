'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { kebabCase } from 'lodash';

import { useMutation } from '$lib/graphql/request';
import { CreateSpaceDocument, Space } from '$lib/graphql/generated/backend/graphql';
import { Button, toast } from '$lib/components/core';
import { getErrorMessage } from '$lib/utils/error';
import { Pane } from '$lib/components/core/pane/pane';
import { CommunityFormContent } from '../../community/CommunityForm';
import { ThemeProvider } from '../../theme-builder/provider';
import { communityValidationSchema, type CommunityFormValues } from '../../community/communityFormSchema';

interface Props {
  title: string;
  data?: Partial<Space>;
}

export function CreateCommunityPane(props: Props) {
  return (
    <ThemeProvider>
      <FormContent {...props} />
    </ThemeProvider>
  );
}

function FormContent({ data, title }: Props) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [create] = useMutation(CreateSpaceDocument);

  const form = useForm<CommunityFormValues>({
    defaultValues: {
      title: data?.title || '',
      description: data?.description || undefined,
      slug: data?.slug || '',
      image_avatar: undefined,
      image_cover: undefined,
      address: undefined,
    },
    resolver: zodResolver(communityValidationSchema),
  });

  const {
    handleSubmit,
    formState: { isValid },
  } = form;

  const onSubmit = async (values: CommunityFormValues) => {
    try {
      setIsSubmitting(true);
      const siteInfo = values.slug ? { slug: kebabCase(values.slug) } : {};

      const { data, error } = await create({ variables: { input: { ...values, ...siteInfo } } });
      if (error) {
        toast.error(error instanceof Error ? error.message : 'An error occurred');
        return;
      }

      if (data) {
        // const space = data.createSpace as Space;
        toast.success('Created community!');
      }
    } catch (err: unknown) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Pane.Root>
        <Pane.Header.Root>
          <Pane.Header.Left showBackButton />
          <Pane.Header.Center className="flex items-center justify-center">
            <p>{title}</p>
          </Pane.Header.Center>
          <Pane.Header.Right>
            <Button type="submit" variant="secondary" size="sm" loading={isSubmitting} disabled={!isValid}>
              Create
            </Button>
          </Pane.Header.Right>
        </Pane.Header.Root>

        <Pane.Content className="p-4 flex flex-col gap-6">
          <CommunityFormContent form={form} mobile />
        </Pane.Content>
      </Pane.Root>
    </form>
  );
}
