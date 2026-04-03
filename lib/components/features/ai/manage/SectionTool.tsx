'use client';
import React from 'react';
import clsx from 'clsx';
import { Card } from '$lib/components/core';
import { useEditor, Element } from '@craftjs/core';
import { useStoreManageLayout } from './store';
import { Event } from '$lib/graphql/generated/backend/graphql';
import { resolver } from './craft/resolver';

const eventSections = [
  { id: 'Hero', name: 'Hero', component: 'AboutSection' },
  { id: 'Registration', name: 'Registration', component: 'EventAccess' },
  { id: 'About', name: 'About', component: 'AboutSection' },
  { id: 'Schedule', name: 'Schedule', component: 'SubEventSection' },
  { id: 'Speakers', name: 'Speakers', component: 'AboutSection' },
  { id: 'Location', name: 'Location', component: 'LocationSection' },
  { id: 'Sponsors', name: 'Sponsors', component: 'AboutSection' },
  { id: 'FAQ', name: 'FAQ', component: 'AboutSection' },
  { id: 'Gallery', name: 'Gallery', component: 'GallerySection' },
  { id: 'Collectibles', name: 'Collectibles', component: 'EventCollectibles' },
  { id: 'Countdown', name: 'Countdown', component: 'AboutSection' },
];

const universalSections = [
  { id: 'u1', name: 'Rich Text', component: 'AboutSection' },
  { id: 'u2', name: 'Image Banner', component: 'AboutSection' },
  { id: 'u3', name: 'Video Embed', component: 'AboutSection' },
  { id: 'u4', name: 'CTA Block', component: 'AboutSection' },
];

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

function SectionCard({ name, componentName }: { name: string; componentName: keyof typeof resolver }) {
  const { connectors } = useEditor();
  const state = useStoreManageLayout();
  const event = state.data as Event | undefined;
  const component = resolver[componentName];

  return (
    <div
      ref={(ref) => {
        if (ref) {
          // React 19 fix: Passing the component reference directly instead of a string
          // to avoid casing warnings and ensure correct resolution.
          connectors.create(ref, <Element is={component} event={event} />);
        }
      }}
      className="flex flex-col gap-2 cursor-pointer group"
    >
      <Card.Root className="aspect-square p-0 flex items-center justify-center bg-(--btn-tertiary) border-transparent transition-all group-hover:bg-card-hover" />
      <p className="text-[10px] text-center truncate text-tertiary">{name}</p>
    </div>
  );
}
