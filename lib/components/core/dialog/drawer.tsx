'use client';

/**
 * How to use it.
 * 1. Add DrawerContainer at top level
 * 2. import drawer
 * 3. define component
 *   Example:
 *    function MyComponent({text}: {text: string}) {
 *      return <>{text}</>
 *    }
 *
 *   // in other component call action.
 *   function OtherComponent() {
 *     const showDrawer = () => {
 *        drawer.open(MyComponent, {position: 'right', width: 300, props: {text: 'Hi there'}})
 *     }
 *     return ....
 *   }
 */

import React from 'react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

interface Options<T> {
  props?: T;
  position?: 'left' | 'right';
  duration?: number;
  contentClass?: string;
  dismissible?: boolean;
}

interface DrawerItem {
  id: number;
  content: React.ReactNode;
  options: Options<unknown>;
}

interface Drawer {
  open: <T extends object>(component: React.ComponentType<T>, options?: Options<T>) => number;
  close: (id?: number) => void;
}

export const drawer: Drawer = {
  open: () => {
    throw new Error('Drawer not initialized');
  },
  close: () => {
    throw new Error('Drawer not initialized');
  },
};

export function DrawerContainer() {
  const [drawers, setDrawers] = React.useState<DrawerItem[]>([]);
  const nextId = React.useRef(0);
  const drawerRefs = React.useRef<Map<number, HTMLDivElement>>(new Map());

  const handleOpen = React.useCallback(
    <T extends object>(Component: React.ComponentType<T>, opts: Options<T> = {}): number => {
      const id = nextId.current++;
      setDrawers((prev) => [
        ...prev,
        {
          id,
          content: <Component {...(opts.props as T)} />,
          options: { duration: 0.3, position: 'right', dismissible: true, ...opts },
        },
      ]);
      return id;
    },
    [],
  );

  const handleClose = React.useCallback((id?: number) => {
    if (id !== undefined) {
      setDrawers((prev) => prev.filter((drawer) => drawer.id !== id));
    } else {
      setDrawers((prev) => prev.slice(0, -1));
    }
  }, []);

  const handleOutsideClick = React.useCallback(
    (event: MouseEvent) => {
      if (drawers.length === 0) return;
      const topDrawer = drawers[drawers.length - 1];
      const drawerRef = drawerRefs.current.get(topDrawer.id);

      // Prevent closing if clicking inside a modal
      const modalElements = document.querySelectorAll('[role="modal"]');
      for (const element of Array.from(modalElements)) {
        if (element.contains(event.target as Node)) return;
      }

      // Prevent closing if clicking inside the drawer
      if (drawerRef && event.target instanceof Node && drawerRef.contains(event.target)) return;

      // Close the top drawer if dismissible
      if (topDrawer.options.dismissible) {
        handleClose(topDrawer.id);
      }
    },
    [drawers, handleClose],
  );

  React.useEffect(() => {
    drawer.open = handleOpen;
    drawer.close = handleClose;

    if (drawers.length > 0) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [drawers.length, handleOpen, handleClose]);

  if (!drawer.open || !drawer.close) {
    return null;
  }

  return (
    <AnimatePresence>
      {drawers.map((drawer, index) => (
        <React.Fragment key={drawer.id}>
          <div className="fixed inset-0" style={{ zIndex: 10000 + index }}>
            <div className="h-full w-full p-2">
              <div className="bg-overlay-backdrop fixed inset-0 z-0" />
              <div
                className={clsx('flex h-full', drawer.options.position === 'right' ? 'justify-end' : 'justify-start')}
              >
                <motion.div
                  initial={{ x: drawer.options.position === 'right' ? '100%' : '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: drawer.options.position === 'right' ? '100%' : '-100%' }}
                  transition={{ duration: drawer.options.duration }}
                  ref={(el) => {
                    if (el) {
                      drawerRefs.current.set(drawer.id, el);
                    } else {
                      drawerRefs.current.delete(drawer.id);
                    }
                  }}
                  className={twMerge(
                    'bg-overlay-primary backdrop-blur-md rounded-sm flex-1 max-w-sm md:max-w-[528px] z-10',
                    drawer.options.contentClass,
                  )}
                  style={{
                    // @ts-expect-error accept variables
                    '--font-title': 'var(--font-class-display)',
                    '--font-body': 'var(--font-general-sans)',
                  }}
                >
                  {drawer.content}
                </motion.div>
              </div>
            </div>
          </div>
        </React.Fragment>
      ))}
    </AnimatePresence>
  );
}
