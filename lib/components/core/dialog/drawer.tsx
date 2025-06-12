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
 *   // in other compent call action.
 *   funct OtherComponent() {
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

interface Drawer {
  open: <T extends object>(component: React.ComponentType<T>, options?: Options<T>) => void;
  close: () => void;
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
  const [isOpen, setIsOpen] = React.useState(false);
  const [content, setContent] = React.useState<React.ReactNode>();
  const [options, setOptions] = React.useState<Options<unknown>>({ duration: 0.3, position: 'right', dismissible: true });
  const ref = React.useRef<HTMLDivElement | null>(null);

  const handleOpen = React.useCallback(<T extends object>(Component: React.ComponentType<T>, opts: Options<T> = {}) => {
    setContent(<Component {...(opts.props as T)} />);
    setOptions((prev) => ({ ...prev, ...opts }));
    setIsOpen(true);
  }, []);

  const handleOutsideClick = (event: MouseEvent) => {
    if (!options.dismissible) return;

    if (event.target instanceof Node) {
      const modalElements = document.querySelectorAll('[role="modal"]');
      for (const element of Array.from(modalElements)) {
        // If click is inside a modal, do nothing
        if (element.contains(event.target)) return;
      }
    }

    // Check if click is inside the drawer
    if (ref.current && event.target instanceof Node && ref.current.contains(event.target)) return;

    // Otherwise close the drawer
    setIsOpen(false);
  };

  React.useEffect(() => {
    drawer.open = handleOpen;
    drawer.close = () => {
      setIsOpen(false);
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  if (!drawer.open || !drawer.close) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed z-100000 inset-0">
          <div className="h-full w-full p-2">
            <div className="bg-overlay-backdrop fixed inset-0 z-0" />
            <div className={clsx('flex h-full', options.position === 'right' && 'justify-end')}>
              <motion.div
                key="drawer"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ duration: options.duration }}
                ref={ref}
                className={twMerge(
                  'bg-background backdrop-blur-md rounded-sm flex-1 max-w-[528px] overflow-auto no-scrollbar z-10',
                  options.contentClass,
                )}
                style={{
                  // @ts-expect-error accept variables
                  '--font-title': 'var(--font-class-display)',
                  '--font-body': 'var(--font-general-sans)',
                }}
              >
                {content}
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
