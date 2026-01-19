'use client';
import React from 'react';
import { Panel, Group, Separator } from 'react-resizable-panels';

interface Option<T> {
  props?: T;
  position?: 'left' | 'right';
}

interface WindowPaneItem {
  content: React.ReactNode;
  options: Option<unknown>;
}

interface WindowPane {
  open: <T extends object>(component: React.ComponentType<T>, options?: Option<T>) => void;
  close: (id?: number) => void;
}

export const windowPane: WindowPane = {
  open: () => {
    throw new Error('Drawer not initialized');
  },
  close: () => {
    throw new Error('Drawer not initialized');
  },
};

export function WindowPanesContainer({ children }: React.PropsWithChildren) {
  const [state, setState] = React.useState<WindowPaneItem>();

  const handleOpen = <T extends object>(Component: React.ComponentType<T>, opts: Option<T> = {}) => {
    setState({
      content: <Component {...(opts.props as T)} />,
      options: { position: 'right', ...opts },
    });
  };

  const handleClose = () => setState(undefined);

  React.useEffect(() => {
    windowPane.open = handleOpen;
    windowPane.close = handleClose;
  }, []);

  if (!windowPane.open || !windowPane.close) {
    return null;
  }

  return (
    <Group>
      {state?.options.position === 'left' && (
        <>
          <Panel>{state.content}</Panel> <Separator className="bg-(--color-divider) w-0.5" />
        </>
      )}
      <Panel minSize={720}>{children}</Panel>
      {state?.options.position === 'right' && (
        <>
          <Separator className="bg-(--color-divider) w-0.5" />
          <Panel>{state.content}</Panel>
        </>
      )}
    </Group>
  );
}
