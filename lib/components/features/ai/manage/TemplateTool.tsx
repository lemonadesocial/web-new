'use client';
import React from 'react';
import clsx from 'clsx';
import { Button, Card, Input, modal } from '$lib/components/core';
import { storeManageLayout, useStoreManageLayout } from './store';
import { useQuery } from '$lib/graphql/request';
import { ListTemplatesDocument, Template } from '$lib/graphql/generated/backend/graphql';
import { useMe } from '$lib/hooks/useMe';

function CreateTemplateModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = React.useState('');

  const handleCreate = async () => {
    if (!name.trim()) return;

    storeManageLayout.setIsCreatingTemplate(true, name);
    storeManageLayout.setBuilderTab('sections');
    onClose();
  };

  return (
    <div className="p-6 flex flex-col gap-4">
      <div className="space-y-1">
        <p className="text-lg font-medium">Create New Template</p>
        <p className="text-tertiary text-sm">Enter a name for your custom template.</p>
      </div>
      <Input placeholder="Template Name" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
      <div className="flex justify-end gap-2">
        <Button variant="tertiary" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleCreate} disabled={!name.trim()}>
          Create
        </Button>
      </div>
    </div>
  );
}

export function TemplateTool() {
  const me = useMe();
  const state = useStoreManageLayout();
  const [selected, setSelected] = React.useState('');

  const { data, loading } = useQuery(ListTemplatesDocument, {
    variables: {
      limit: 100,
      target: state.layoutType === 'event' ? 'EVENT' : 'SPACE',
    },
  });

  const templates = (data?.listTemplates || []) as Template[];
  const myTemplates = templates.filter((t) => t.creator_id === me?._id);
  const exploreTemplates = templates.filter((t) => t.creator_id !== me?._id);

  return (
    <div className="flex flex-col divide-y divide-(--color-divider)">
      <section className="p-5">
        <div className="mb-4">
          <p className="text-lg">My Templates</p>
          <p className="text-tertiary text-sm">Build your own templates, or let LemonAI create one for you.</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <TemplateCard
            name="New Template"
            icon="icon-plus"
            onClick={() => {
              modal.open(CreateTemplateModal);
            }}
          />
          {myTemplates.map((item) => (
            <TemplateCard
              key={item._id}
              name={item.name}
              thumbnail={item.thumbnail_url}
              active={selected === item._id}
              onClick={() => setSelected(item._id)}
            />
          ))}
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
                thumbnail={item.thumbnail_url}
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
    <div className="flex flex-col gap-2 cursor-pointer group" onClick={onClick}>
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
    </div>
  );
}
