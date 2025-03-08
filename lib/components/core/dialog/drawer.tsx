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

import clsx from 'clsx';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DrawerOptions<T> {
  props?: T;
  width?: string;
  position?: 'left' | 'right';
}

interface Drawer {
  open: <T extends object>(component: React.ComponentType<T>, options?: DrawerOptions<T>) => void;
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
  const [drawerContent, setDrawerContent] = React.useState<React.ReactNode>();
  const [drawerOptions, setDrawerOptions] = React.useState<DrawerOptions<unknown>>({});
  const drawerRef = React.useRef<HTMLDivElement | null>(null);

  const openDrawer = React.useCallback(
    <T extends object>(Component: React.ComponentType<T>, options: DrawerOptions<T> = {}) => {
      setDrawerContent(<Component {...(options.props as T)} />);
      setDrawerOptions(options);
      setIsOpen(true);
    },
    [],
  );

  const handleOutsideClick = (event: MouseEvent) => {
    if (drawerRef.current && event.target instanceof Node && drawerRef.current.contains(event.target)) {
      // ...
    } else {
      setIsOpen(false);
    }
  };

  React.useEffect(() => {
    drawer.open = openDrawer;
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
            <div className={clsx('flex h-full', drawerOptions.position === 'right' && 'justify-end')}>
              <motion.div
                key="drawer"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ duration: 0.3 }}
                ref={drawerRef}
                className=" rounded-sm bg-primary-500 flex-1 max-w-[528px]"
              >
                {drawerContent}
                <button onClick={() => setIsOpen(false)}>close</button>
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
