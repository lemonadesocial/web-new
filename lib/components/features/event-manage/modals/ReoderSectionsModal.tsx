'use client';

import React from 'react';
import Sortable from 'sortablejs';
import { arrayMoveImmutable } from 'array-move';
import { Button, Card, modal } from '$lib/components/core';

export function ReoderSectionsModal({ list = [], onChange }: { list?: string[]; onChange: (list: string[]) => void }) {
  const sortableContainerRef = React.useRef(null);
  const [data, setData] = React.useState(list);

  React.useEffect(() => {
    if (sortableContainerRef.current) {
      new Sortable(sortableContainerRef.current, {
        draggable: '.draggable-item',
        handle: '.drag-handle',
        ghostClass: 'sortable-drag',
        onEnd: (evt: any) => {
          const { oldIndex, newIndex } = evt;
          const arr = arrayMoveImmutable(data, oldIndex, newIndex);
          onChange(arr);
          setData(arr);
        },
      });
    }
  }, []);

  return (
    <Card.Root className="w-[308px] border-none bg-transparent">
      <Card.Header className="flex justify-between">
        <p>Reorder Sections</p>
        <Button size="xs" icon="icon-x" className="rounded-full" variant="tertiary-alt" onClick={() => modal.close()} />
      </Card.Header>

      <Card.Content>
        <div ref={sortableContainerRef} className="flex flex-col gap-2">
          {list.map((item) => (
            <div
              key={item}
              className="draggable-item flex gap-3 px-3 py-2 rounded-sm bg-(--btn-tertiary) hover:bg-(--btn-tertiary-hover)"
            >
              <i className="icon-drag-indicator drag-handle cursor-pointer" />
              <p className="capitalize">{item}</p>
            </div>
          ))}
        </div>
      </Card.Content>
    </Card.Root>
  );
}
