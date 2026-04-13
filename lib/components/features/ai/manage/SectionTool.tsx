'use client';
import React from 'react';
import clsx from 'clsx';
import { Card } from '$lib/components/core';
import { useEditor, Element } from '@craftjs/core';
import { useStoreManageLayout } from './store';
import { Event } from '$lib/graphql/generated/backend/graphql';
import { resolver } from './craft/resolver';

export function SectionTool() {
  return (
    <div className="flex flex-col divide-y divide-(--color-divider)">
      <section className="p-5">
        <div className="mb-4">
          <p className="text-lg">Event Sections</p>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {eventSections.map((item) => (
            <SectionCard key={item.id} name={item.name} componentName={item.component as any} />
          ))}
        </div>
      </section>

      <section className="p-5">
        <div className="mb-4">
          <p className="text-lg">Universal Sections</p>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {universalSections.map((item) => (
            <SectionCard key={item.id} name={item.name} componentName={item.component as any} />
          ))}
        </div>
      </section>
    </div>
  );
}

function SectionCard({ name, componentName }: { name: string; componentName: string }) {
  const { connectors, actions } = useEditor();
  const state = useStoreManageLayout();
  const event = state.data as Event | undefined;
  const component = resolver[componentName as keyof typeof resolver];

  return (
    <div
      ref={(ref) => {
        if (ref) {
          // Drop the section directly.
          connectors.create(ref, <Element is={component as any} event={event} />, {
            onCreate: (nodeId) => {
              setTimeout(() => {
                actions.selectNode(nodeId);
              }, 100);
            },
          });
        }
      }}
      className="flex flex-col gap-2 cursor-pointer group"
    >
      <Card.Root className="aspect-square p-0 flex items-center justify-center bg-(--btn-tertiary) border-transparent transition-all group-hover:bg-card-hover border-dashed hover:border-primary/50 text-tertiary">
        <i className="icon-plus size-5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </Card.Root>
      <p className="text-[10px] text-center truncate text-tertiary">{name}</p>
    </div>
  );
}