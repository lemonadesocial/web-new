'use client';
import React from 'react';
import Sortable from 'sortablejs';
import { arrayMoveImmutable } from 'array-move';
import { Avatar, Button, Card, modal } from '$lib/components/core';
import { PublicSpace, UpdateSubSpaceOrderDocument } from '$lib/graphql/generated/backend/graphql';
import { generateUrl } from '$lib/utils/cnd';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { useMutation } from '$lib/graphql/request';

export const ReOrderFeatureHubs = ({
  data,
  onChange,
}: {
  data: PublicSpace[];
  onChange: (arr: PublicSpace[]) => void;
}) => {
  const sortableContainerRef = React.useRef(null);
  const [list, setList] = React.useState(data);

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
          setList(arr);
        },
      });
    }
  }, []);

  return (
    <Card.Root className="w-sm">
      <Card.Header className="flex justify-between border-b">
        <p>Reorder Hubs</p>
        <Button variant="tertiary-alt" size="xs" className="rounded-full" icon="icon-x" onClick={() => modal.close()} />
      </Card.Header>

      <Card.Content>
        <div ref={sortableContainerRef} className="flex flex-col gap-2">
          {list.map((item) => (
            <Card.Root key={item._id} className="draggable-item cursor-pointer" onClick={() => null}>
              <Card.Content className="flex gap-3 items-center drag-handle px-3 py-1.5">
                <i className="icon-drag-indicator text-tertiary" />
                <Avatar
                  className="size-8 rounded-xs! aspect-square"
                  src={generateUrl(item.image_avatar_expanded) || `${ASSET_PREFIX}/assets/images/default-dp.png`}
                />
                <div className="flex-1">
                  <p className="line-clamp-2">{item.title}</p>
                </div>
              </Card.Content>
            </Card.Root>
          ))}
        </div>
      </Card.Content>
    </Card.Root>
  );
};
