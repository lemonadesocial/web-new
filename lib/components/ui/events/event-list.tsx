'use client';
import React from 'react';

import { Button } from '$core/button';
import { Segment } from '$core/segment';
import { generateCssVariables } from '$lib/utils/fetchers';

type SegmentValueType = 'upcoming' | 'past';
type SegmentValue = { label: string; value: SegmentValueType };

const segments: SegmentValue[] = [
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Past', value: 'past' },
];

export default function EventList() {
  const [selected, setSelected] = React.useState<SegmentValueType>('upcoming');
  const [styled, setStyled] = React.useState({});
  console.log(generateCssVariables(styled));

  return (
    <div className="flex flex-col gap-6">
      <style jsx global>
        {`
          :root {
            ${generateCssVariables(styled)}
          }
        `}
      </style>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold ">Events</h2>
        <div className="flex items-center gap-3">
          <Segment
            selected={selected}
            items={segments}
            onSelect={(item) => {
              setStyled({ '--color-primary-500': 'red', '--color-background': 'blue' });
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
