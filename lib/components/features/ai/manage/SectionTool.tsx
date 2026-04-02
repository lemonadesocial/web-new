'use client';
import React from 'react';
import clsx from 'clsx';
import { Card } from '$lib/components/core';

const eventSections = [
  { id: 'hero', name: 'Hero' },
  { id: 'registration', name: 'Registration' },
  { id: 'about', name: 'About' },
  { id: 'schedule', name: 'Schedule' },
  { id: 'speakers', name: 'Speakers' },
  { id: 'location', name: 'Location' },
  { id: 'sponsors', name: 'Sponsors' },
  { id: 'faq', name: 'FAQ' },
  { id: 'gallery', name: 'Gallery' },
  { id: 'collectibles', name: 'Collectibles' },
  { id: 'countdown', name: 'Countdown' },
];

const universalSections = [
  { id: 'u1', name: '' },
  { id: 'u2', name: '' },
  { id: 'u3', name: '' },
  { id: 'u4', name: '' },
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
            <SectionCard key={item.id} name={item.name} />
          ))}
        </div>
      </section>

      <section className="p-5">
        <div className="mb-4">
          <p className="text-lg">Universal Sections</p>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {universalSections.map((item) => (
            <SectionCard key={item.id} name={item.name} />
          ))}
        </div>
      </section>
    </div>
  );
}

function SectionCard({ name }: { name: string }) {
  return (
    <div className="flex flex-col gap-2 cursor-pointer group">
      <Card.Root className="aspect-square p-0 flex items-center justify-center bg-(--btn-tertiary) border-transparent transition-all group-hover:bg-card-hover" />
      <p className="text-[10px] text-center truncate text-tertiary">{name}</p>
    </div>
  );
}
