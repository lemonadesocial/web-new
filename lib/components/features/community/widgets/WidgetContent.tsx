import { Card } from '$lib/components/core';
import React from 'react';
import { twMerge } from 'tailwind-merge';

interface Props extends React.PropsWithChildren {
  title: string;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export function WidgetContent({ title, children, className, onClick }: Props) {
  return (
    <div className={twMerge('flex flex-col items-center gap-2', className)}>
      <Card.Root data-card className="w-full" onClick={onClick}>
        <Card.Content className="p-0">{children}</Card.Content>
      </Card.Root>
      <p className="text-sm text-tertiary">{title}</p>
    </div>
  );
}
