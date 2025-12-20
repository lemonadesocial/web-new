import { Card } from '$lib/components/core';
import React from 'react';

interface Props extends React.PropsWithChildren {
  title: string;
}

export function WidgetContent({ title, children }: Props) {
  return (
    <div className="flex flex-col items-center min-h-full gap-2 flex-1">
      <Card.Root className="flex-1 w-full">
        <Card.Content>{children}</Card.Content>
      </Card.Root>
      <p className="text-sm text-tertiary">{title}</p>
    </div>
  );
}
