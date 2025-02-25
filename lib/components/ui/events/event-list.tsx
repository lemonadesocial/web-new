'use client';
import { Button } from '$core/button';
import { Segment } from '$core/segment';
import React from 'react';

const segments = [
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Past', value: 'past' },
];

export default function EventList() {
  const [selected, setSelected] = React.useState('upcoming');
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold ">Events</h2>
        <div className="flex items-center gap-3">
          <Segment selected={selected} items={segments} />
          <Button icon="icon-crown" size="sm" variant="tertiary" />
          <Button icon="icon-crown" size="sm" />
        </div>
      </div>

      <div></div>
    </div>
  );
}
