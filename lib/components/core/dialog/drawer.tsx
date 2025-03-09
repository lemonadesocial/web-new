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
  const [options, setOptions] = React.useState<Options<unknown>>({ duration: 0.3 });
  const ref = React.useRef<HTMLDivElement | null>(null);

  const handleOpen = React.useCallback(<T extends object>(Component: React.ComponentType<T>, opts: Options<T> = {}) => {
    setContent(<Component {...(options.props as T)} />);
    setOptions((prev) => ({ ...prev, ...opts }));
    setIsOpen(true);
  }, []);

  const handleOutsideClick = (event: MouseEvent) => {
    if (ref.current && event.target instanceof Node && ref.current.contains(event.target)) {
      // do nothing here
    } else {
      setIsOpen(false);
    }
  };

  React.useEffect(() => {
    drawer.open = handleOpen;
    drawer.close = () => {
      setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  if (!drawer.open || !drawer.close) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed z-50 inset-0">
          <div className="h-full w-full p-4">
            <div className={clsx('flex h-full', options.position === 'right' && 'justify-end')}>
              <motion.div
                key="drawer"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ duration: options.duration }}
                ref={ref}
                className={twMerge('rounded-sm flex-1 max-w-[528px]', options.contentClass)}
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
