'use client';
import React from 'react';
import { Card } from '$lib/components/core';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

const eventSections = [
  { id: 'Hero', name: 'Event Title', component: 'EventHero' },
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
  { id: 'u7', name: 'Social Links', component: 'SocialLinks' },
  { id: 'u8', name: 'Custom HTML', component: 'CustomHTML' },
];

// const layoutContainers = [
//   { id: 'Columns', name: 'Columns', component: 'Grid' },
//   { id: 'Accordion', name: 'Accordion', component: 'Accordion' },
//   { id: 'Column', name: 'Column', component: 'Col' },
// ];

export function SectionTool() {
  return (
    <div className="flex flex-col divide-y divide-(--color-divider)">
      <section className="p-5">
        <div className="mb-4">
          <p className="text-lg">Event Sections</p>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {eventSections.map((item) => (
            <SectionCard key={item.id} name={item.name} componentName={item.component} />
          ))}
        </div>
      </section>

      <section className="p-5">
        <div className="mb-4">
          <p className="text-lg">Universal Sections</p>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {universalSections.map((item) => (
            <SectionCard key={item.id} name={item.name} componentName={item.component} />
          ))}
        </div>
      </section>

      {/* <section className="p-5"> */}
      {/*   <div className="mb-4"> */}
      {/*     <p className="text-lg">Layout Containers</p> */}
      {/*   </div> */}
      {/*   <div className="grid grid-cols-4 gap-3"> */}
      {/*     {layoutContainers.map((item) => ( */}
      {/*       <SectionCard key={item.id} name={item.name} componentName={item.component} /> */}
      {/*     ))} */}
      {/*   </div> */}
      {/* </section> */}
    </div>
  );
}

function SectionCard({ name, componentName }: { name: string; componentName: string }) {
  const cardRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    return draggable({
      element: el,
      getInitialData: () => ({ type: 'new-section', componentName, displayName: name }),
    });
  }, [componentName, name]);

  return (
    <div ref={cardRef} className="flex flex-col gap-2 cursor-pointer group">
      <Card.Root className="aspect-square p-0 flex items-center justify-center bg-(--btn-tertiary) border-transparent transition-all group-hover:bg-card-hover border-dashed hover:border-primary/50 text-tertiary">
        <i className="icon-plus size-5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </Card.Root>
      <p className="text-[10px] text-center truncate text-tertiary">{name}</p>
    </div>
  );
}
