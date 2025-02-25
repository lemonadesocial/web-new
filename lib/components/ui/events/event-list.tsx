'use client';
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
        <div>
          <Segment selected={selected} items={segments} />
        </div>
      </div>

      <div></div>
    </div>
  );
}
