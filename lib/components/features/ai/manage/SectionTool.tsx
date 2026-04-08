'use client';
import React from 'react';
import clsx from 'clsx';
import { Card } from '$lib/components/core';
import { useStoreManageLayout } from './store';
import { Event } from '$lib/graphql/generated/backend/graphql';
import { gridLayoutActions } from './layoutStore';

const eventSections = [
  { id: 'Hero', name: 'Event Hero', component: 'EventHero' },
  { id: 'Registration', name: 'Registration', component: 'EventAccess' },
  { id: 'About', name: 'About', component: 'AboutSection' },
  { id: 'DateTime', name: 'Date & Time', component: 'EventDateTimeBlock' },
  { id: 'LocationBlock', name: 'Location (Info)', component: 'EventLocationBlock' },
  { id: 'Location', name: 'Location (Map)', component: 'LocationSection' },
  { id: 'Schedule', name: 'Schedule', component: 'SubEventSection' },
  { id: 'Gallery', name: 'Gallery', component: 'GallerySection' },
  { id: 'Collectibles', name: 'Collectibles', component: 'EventCollectibles' },
  { id: 'Community', name: 'Community', component: 'CommunitySection' },
  { id: 'HostedBy', name: 'Hosted By', component: 'HostedBySection' },
  { id: 'Attendees', name: 'Attendees', component: 'AttendeesSection' },
  { id: 'SidebarImage', name: 'Event Image', component: 'EventSidebarImage' },
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

function SectionCard({ name, componentName }: { name: string; componentName: string }) {
  const state = useStoreManageLayout();
  const event = state.data as Event | undefined;

  return (
    <div
      onClick={() => {
        gridLayoutActions.addSection(componentName, { event });
      }}
      className="flex flex-col gap-2 cursor-pointer group"
    >
      <Card.Root className="aspect-square p-0 flex items-center justify-center bg-(--btn-tertiary) border-transparent transition-all group-hover:bg-card-hover border-dashed hover:border-primary/50 text-tertiary" />
      <p className="text-[10px] text-center truncate text-tertiary">{name}</p>
    </div>
  );
}
