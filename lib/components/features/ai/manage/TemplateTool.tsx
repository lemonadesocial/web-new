'use client';
import React from 'react';
import clsx from 'clsx';
import { Button, Card, Input, modal } from '$lib/components/core';
import { storeManageLayout } from './store';

function CreateTemplateModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = React.useState('');

  const handleCreate = () => {
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
  const [selected, setSelected] = React.useState('conference');
  const [myTemplates, setMyTemplates] = React.useState<any[]>([]);
  const [exploreTemplates, setExploreTemplates] = React.useState<any[]>([]);

  return (
    <div className="flex flex-col divide-y divide-(--color-divider)">
      <section className="p-5">
        <div className="mb-4">
          <p className="text-lg">My Templates</p>
          <p className="text-tertiary text-sm">Build your own templates, or let LemonAI create one for you.</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {myTemplates.map((item) => (
            <TemplateCard
              key={item.id}
              name={item.name}
              icon={item.icon}
              active={selected === item.id}
              onClick={() => {
                if (item.id !== 'new') {
                  setSelected(item.id);
                }
              }}
            />
          ))}
          <TemplateCard
            name="New Template"
            icon="icon-plus"
            onClick={() => {
              modal.open(CreateTemplateModal);
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
                key={item.id}
                name={item.name}
                active={selected === item.id}
                onClick={() => setSelected(item.id)}
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
  active,
  onClick,
}: {
  name: string;
  icon?: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <div className="flex flex-col gap-2 cursor-pointer group" onClick={onClick}>
      <Card.Root
        className={clsx(
          'aspect-[3/4] p-0 flex items-center justify-center bg-(--btn-tertiary) border-transparent transition-all',
          active ? 'outline-2 outline-offset-0 outline-white border-white' : 'group-hover:bg-card-hover',
        )}
      >
        {icon && <i className={clsx(icon, 'size-6 text-quaternary')} />}
      </Card.Root>
      <p className={clsx('text-[11px] text-center truncate', active ? 'text-primary' : 'text-tertiary')}>{name}</p>
    </div>
  );
}
