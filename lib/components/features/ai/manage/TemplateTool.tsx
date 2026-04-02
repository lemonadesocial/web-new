'use client';
import React from 'react';
import clsx from 'clsx';
import { Card } from '$lib/components/core';

const myTemplates = [
  { id: 'nft', name: 'NFT Drop' },
  { id: 'album', name: 'Album Release' },
  { id: 'new', name: 'New Template', icon: 'icon-plus' },
];

const exploreTemplates = [
  { id: 'default', name: 'Default' },
  { id: 'conference', name: 'Conference' },
  { id: 'festival', name: 'Festival' },
  { id: 'meetup', name: 'Meetup' },
  { id: 'workshop', name: 'Workshop' },
  { id: 'concert', name: 'Concert' },
];

export function TemplateTool() {
  const [selected, setSelected] = React.useState('conference');

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
        </div>
      </section>

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
