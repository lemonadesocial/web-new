'use client';
import React from 'react';
import { twMerge } from 'tailwind-merge';

import { Button } from '../button';
import { drawer } from '../dialog';

type ComponentType<P = any> = React.ComponentType<P>;
type ComponentElement<T extends ComponentType> = React.ReactElement<React.ComponentProps<T>, T>;

const useChildrenByComponent = <T extends ComponentType>(
  children: React.ReactNode,
  Component: T,
): ComponentElement<T> | undefined => {
  return React.useMemo(() => {
    return React.Children.toArray(children).find(
      (child): child is ComponentElement<T> => React.isValidElement(child) && child.type === Component,
    );
  }, [children, Component]);
};

function PaneRoot({ children }: React.PropsWithChildren) {
  return <div className="flex flex-col flex-1 bg-overlay-primary overflow-auto no-scrollbar h-full">{children}</div>;
}

function PaneHeaderRoot({ children }: React.PropsWithChildren) {
  const Left = useChildrenByComponent(children, PaneHeaderLeft);
  const Center = useChildrenByComponent(children, PaneHeaderCenter);
  const Right = useChildrenByComponent(children, PaneHeaderRight);

  return (
    <div className="sticky top-0 flex justify-between px-4 py-2 border-b bg-overlay-secondary backdrop-blur-2xl z-10">
      {Left || <div className="flex-1" />}
      {Center || <div className="flex-auto" />}
      {Right || <div className="flex-1" />}
    </div>
  );
}

function PaneHeaderLeft({ showBackButton = true }: { showBackButton?: boolean }) {
  return (
    <div className="flex-1 w-fit">
      {showBackButton && (
        <Button icon="icon-chevron-double-right" variant="tertiary-alt" size="sm" onClick={() => drawer.close()} />
      )}
    </div>
  );
}

function PaneHeaderCenter({ children, className }: React.PropsWithChildren & { className?: string }) {
  return <div className={twMerge('flex-auto', className)}>{children}</div>;
}
function PaneHeaderRight({ children }: React.PropsWithChildren) {
  return <div className="flex justify-end flex-1 items-center">{children}</div>;
}

function PaneContent({ children, className }: React.PropsWithChildren & { className?: string }) {
  return <div className={twMerge('flex flex-1', className)}>{children}</div>;
}

function PaneFooter({ children, className }: React.PropsWithChildren & { className?: string }) {
  return <div className={twMerge('sticky bottom-0 bg-overlay-primary', className)}>{children}</div>;
}

const PaneHeader = {
  Root: PaneHeaderRoot,
  Left: PaneHeaderLeft,
  Center: PaneHeaderCenter,
  Right: PaneHeaderRight,
};

export const Pane = {
  Root: PaneRoot,
  Header: PaneHeader,
  Content: PaneContent,
  Footer: PaneFooter,
};
