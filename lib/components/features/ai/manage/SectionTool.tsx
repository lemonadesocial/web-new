'use client';
import React from 'react';
import { Card } from '$lib/components/core';
import { useEditor, Element } from '@craftjs/core';
import { useStoreManageLayout } from './store';
import { Event } from '$lib/graphql/generated/backend/graphql';
import { resolver } from './craft/resolver';

const eventSections = [
  { id: 'Hero', name: 'Event Title', component: 'EventHero' },
  { id: 'Registration', name: 'CTA Block', component: 'EventAccess' },
  { id: 'About', name: 'About', component: 'AboutSection' },
  { id: 'DateTime', name: 'Date & Time', component: 'EventDateTimeBlock' },
  { id: 'LocationBlock', name: 'Location', component: 'EventLocationBlock' },
  { id: 'Location', name: 'Map', component: 'LocationSection' },
  { id: 'Schedule', name: 'Schedule', component: 'SubEventSection' },
  { id: 'Gallery', name: 'Gallery', component: 'GallerySection' },
  { id: 'Collectibles', name: 'Collectibles', component: 'EventCollectibles' },
  { id: 'Community', name: 'Community', component: 'CommunitySection' },
  { id: 'HostedBy', name: 'Hosted By', component: 'HostedBySection' },
  { id: 'Attendees', name: 'Attendees', component: 'AttendeesSection' },
  { id: 'SidebarImage', name: 'Event Image', component: 'EventSidebarImage' },
];

const universalSections = [
  { id: 'u1', name: 'Rich Text', component: 'RichText' },
  { id: 'u2', name: 'Image Banner', component: 'ImageBanner' },
  { id: 'u3', name: 'Video Embed', component: 'VideoEmbed' },
  { id: 'u4', name: 'CTA Block', component: 'EventAccess' },
  { id: 'u5', name: 'Cards Grid', component: 'CardsGrid' },
  { id: 'u6', name: 'Testimonials', component: 'Testimonials' },
  { id: 'u7', name: 'Social Links', component: 'SocialLinks' },
  { id: 'u8', name: 'Custom HTML', component: 'CustomHTML' },
  { id: 'u9', name: 'Spacer', component: 'Spacer' },
  { id: 'u10', name: 'Header', component: 'Header' },
  { id: 'u11', name: 'Footer', component: 'Footer' },
  { id: 'u12', name: 'Music Player', component: 'MusicPlayer' },
  { id: 'u13', name: 'Wallet Connect', component: 'WalletConnect' },
  { id: 'u14', name: 'Passport', component: 'Passport' },
];

const layoutContainers = [
  { id: 'Columns', name: 'Columns', component: 'Grid' },
  { id: 'Tabs', name: 'Tabs', component: 'Tabs' },
  { id: 'Accordion', name: 'Accordion', component: 'Accordion' },
  { id: 'Column', name: 'Column', component: 'Col' },
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

      <section className="p-5">
        <div className="mb-4">
          <p className="text-lg">Layout Containers</p>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {layoutContainers.map((item) => (
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
          // Normal Craft.js drag and drop
          connectors.create(ref, <Element is={component as any} event={event} canvas={componentName === 'Grid' || componentName === 'Col' || componentName === 'Tabs' || componentName === 'Accordion'} />, {
            onCreate: (tree) => {
              setTimeout(() => {
                actions.selectNode(tree.rootNodeId);
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