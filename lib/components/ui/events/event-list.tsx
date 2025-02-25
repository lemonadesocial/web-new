'use client';
import React from 'react';
import { Button } from '$core/button';
import { Segment } from '$core/segment';

type SegmentValueType = 'upcoming' | 'past';
type SegmentValue = { label: string; value: SegmentValueType };

const segments: SegmentValue[] = [
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Past', value: 'past' },
];

export default function EventList() {
  const [selected, setSelected] = React.useState<SegmentValueType>('upcoming');

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold ">Events</h2>
        <div className="flex items-center gap-3">
          <Segment
            selected={selected}
            items={segments}
            onSelect={(item) => {
              setSelected(item.value);
            }}
          />
          <Button icon="icon-crown" size="sm" variant="tertiary" />
          <Button icon="icon-edit-square" size="sm" />
        </div>
      </div>

      <div></div>
    </div>
  );
}
