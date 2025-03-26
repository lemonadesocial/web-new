'use client';

/**
 * How to use it.
 * 1. Add ModalContainer at top level
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
 *        modal.open(MyComponent, {width: 300, props: {text: 'Hi there'}})
 *     }
 *     return ....
 *   }
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Options<T> {
  props?: T;
  dismiss?: boolean;
}

interface Modal {
  open: <T extends object>(component: React.ComponentType<T>, options?: Options<T>) => void;
  close: () => void;
}

export const modal: Modal = {
  open: () => {
    throw new Error('Modal not initialized');
  },
  close: () => {
    throw new Error('Modal not initialized');
  },
};

export function ModalContainer() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [content, setContent] = React.useState<React.ReactNode>();
  const [options, setOptions] = React.useState<Options<unknown>>({});
  const ref = React.useRef<HTMLDivElement | null>(null);

  const handleOpen = React.useCallback(<T extends object>(Component: React.ComponentType<T>, opts: Options<T> = {}) => {
    setContent(<Component {...(opts.props as T)} />);
    setOptions((prev) => ({ ...prev, ...opts }));
    setIsOpen(true);
  }, []);

  const handleOutsideClick = (event: MouseEvent) => {
    if (ref.current && event.target instanceof Node && ref.current.contains(event.target)) {
      // do nothing here
    } else {
      if (options.dismiss) setIsOpen(false);
    }
  };

  React.useEffect(() => {
    modal.open = handleOpen;
    modal.close = () => {
      setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  if (!modal.open || !modal.close) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-overlay/80" style={{ zIndex: 10000 }}>
          <div className="h-full w-full p-4">
            <div className="flex h-full items-center justify-center">
              <motion.div
                key="modal"
                ref={ref}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-modal rounded-lg overflow-hidden"
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
