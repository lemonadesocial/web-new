'use client';
import React from 'react';
import clsx from 'clsx';
import { useForm, Controller } from 'react-hook-form';
import { Button, Card, Input, LabeledInput, Menu, MenuItem, modal, Textarea } from '$lib/components/core';
import { storeManageLayout, useStoreManageLayout } from './store';
import { useMutation, useQuery } from '$lib/graphql/request';
import {
  CreateTemplateDocument,
  ListTemplatesDocument,
  SubscriptionItemType,
  Template,
  TemplateCategory,
  TemplateTarget,
  TemplateVisibility,
} from '$lib/graphql/generated/backend/graphql';
import { useMe } from '$lib/hooks/useMe';

interface CreateTemplateForm {
  name: string;
  category: TemplateCategory;
  description: string;
  slug: string;
  thumbnail_url: string;
}

function CreateTemplateModal() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateTemplateForm>({
    defaultValues: {
      name: '',
      category: TemplateCategory.Custom,
      description: '',
      slug: '',
      thumbnail_url: '',
    },
  });

  const [createTemplate, { loading }] = useMutation(CreateTemplateDocument);

  const onSubmit = async (data: CreateTemplateForm) => {
    createTemplate({
      variables: {
        input: {
          ...data,
          config: {},
          tags: [],
          subscription_tier_min: SubscriptionItemType.Free,
          target: TemplateTarget.Event,
          visibility: TemplateVisibility.Private,
        },
      },
    });

    storeManageLayout.setIsCreatingTemplate(true, data.name);
    storeManageLayout.setBuilderTab('sections');
    modal.close();
  };

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="space-y-1">
        <p className="text-lg font-medium">Create New Template</p>
        <p className="text-tertiary text-sm">Enter the details for your custom template.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <LabeledInput label="Template Name" required>
          <Input
            placeholder="e.g. My Awesome Layout"
            {...register('name', { required: 'Name is required' })}
            error={!!errors.name}
            // eslint-disable-next-line jsx-a11y/no-autofocus -- focusing the first field when the create-template modal opens is the expected UX
            autoFocus
          />
        </LabeledInput>

        <LabeledInput label="Slug">
          <Input placeholder="e.g. my-awesome-layout" {...register('slug')} />
        </LabeledInput>

        <LabeledInput label="Category">
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Menu.Root placement="bottom-start" className="w-full">
                <Menu.Trigger>
                  {({ toggle }) => (
                    <button
                      type="button"
                      onClick={toggle}
                      className="w-full h-10 px-2.5 flex items-center justify-between rounded-sm bg-primary/8 border border-transparent hover:border-tertiary cursor-pointer transition-colors text-left"
                    >
                      <span className={clsx('capitalize text-base font-medium', !field.value ? 'text-quaternary' : 'text-primary')}>
                        {field.value || 'Select a category'}
                      </span>
                      <i className="icon-chevron-down size-4 text-tertiary" />
                    </button>
                  )}
                </Menu.Trigger>
                <Menu.Content className="w-56 p-1 max-h-60 overflow-y-auto no-scrollbar backdrop-blur-md!">

                  {({ toggle }) => (
                    <>
                      {Object.values(TemplateCategory).map((cat) => (
                        <MenuItem
                          key={cat}
                          title={cat.charAt(0).toUpperCase() + cat.slice(1)}
                          onClick={() => {
                            field.onChange(cat);
                            toggle();
                          }}
                        />
                      ))}
                    </>
                  )}
                </Menu.Content>
              </Menu.Root>
            )}
          />
        </LabeledInput>

        <LabeledInput label="Thumbnail URL">
          <Input placeholder="https://..." {...register('thumbnail_url')} />
        </LabeledInput>

        <LabeledInput label="Description">
          <Textarea placeholder="Describe your template..." {...register('description')} rows={3} />
        </LabeledInput>

        <div className="flex justify-end gap-2 mt-2">
          <Button variant="tertiary" onClick={() => modal.close()} type="button">
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Create
          </Button>
        </div>
      </form>
    </div>
  );
}

import { getAIPageEditTriggers } from '$lib/components/features/page-builder/hooks/ai-page-edit-bridge';

// ... rest of the file ...

export function TemplateTool() {
  const me = useMe();
  const state = useStoreManageLayout();
  const [selected, setSelected] = React.useState('');

  const { data } = useQuery(ListTemplatesDocument, {
    variables: {
      limit: 100,
      target: state.layoutType === 'event' ? 'EVENT' : 'SPACE',
    },
  });

  const templates = (data?.listTemplates || []) as Template[];
  const myTemplates = templates.filter((t) => t.creator_id === me?._id);
  const exploreTemplates = templates.filter((t) => t.creator_id !== me?._id);

  const handleReset = () => {
    setSelected('default');
    getAIPageEditTriggers()?.resetToDefault();
  };

  return (
    <div className="flex flex-col divide-y divide-(--color-divider)">
      <section className="p-5">
        <div className="mb-4">
          <p className="text-lg">My Templates</p>
          <p className="text-tertiary text-sm">Build your own templates, or let LemonAI create one for you.</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <TemplateCard
            name="Default"
            icon="icon-refresh"
            active={selected === 'default'}
            onClick={handleReset}
          />
          {myTemplates.map((item) => (
            <TemplateCard
              key={item._id}
              name={item.name}
              thumbnail={item.thumbnail_url ?? undefined}
              active={selected === item._id}
              onClick={() => setSelected(item._id)}
            />
          ))}
          <TemplateCard
            name="New Template"
            icon="icon-plus"
            onClick={() => {
              modal.open(CreateTemplateModal, {
                className: 'md:w-[520px] w-full max-w-[calc(100vw-32px)]',
              });
            }}
          />
        </div>
      </section>

      {exploreTemplates.length > 0 && (
        <section className="p-5">
          <div className="mb-4">
            <p className="text-lg">Explore</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {exploreTemplates.map((item) => (
              <TemplateCard
                key={item._id}
                name={item.name}
                thumbnail={item.thumbnail_url ?? undefined}
                active={selected === item._id}
                onClick={() => setSelected(item._id)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function TemplateCard({
  name,
  icon,
  thumbnail,
  active,
  onClick,
}: {
  name: string;
  icon?: string;
  thumbnail?: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button type="button" className="flex flex-col gap-2 cursor-pointer group text-left" onClick={onClick}>
      <Card.Root
        className={clsx(
          'aspect-[3/4] p-0 flex items-center justify-center bg-(--btn-tertiary) border-transparent transition-all overflow-hidden',
          active ? 'outline-2 outline-offset-0 outline-white border-white' : 'group-hover:bg-card-hover',
        )}
      >
        {thumbnail ? (
          <img src={thumbnail} alt={name} className="w-full h-full object-cover" />
        ) : (
          icon && <i className={clsx(icon, 'size-6 text-quaternary')} />
        )}
      </Card.Root>
      <p className={clsx('text-[11px] text-center truncate', active ? 'text-primary' : 'text-tertiary')}>{name}</p>
    </button>
  );
}
