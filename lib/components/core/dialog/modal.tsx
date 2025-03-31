'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

interface Options<T> {
  props?: T;
  dismissible?: boolean;
  className?: string;
}

interface ModalItem {
  id: number;
  content: React.ReactNode;
  options: Options<unknown>;
}

interface Modal {
  open: <T extends object>(component: React.ComponentType<T>, options?: Options<T>) => number;
  close: (id?: number) => void;
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
  const [modals, setModals] = React.useState<ModalItem[]>([]);
  const nextId = React.useRef(0);
  const modalRefs = React.useRef<Map<number, HTMLDivElement>>(new Map());

  const handleOpen = React.useCallback(<T extends object>(
    Component: React.ComponentType<T>,
    opts: Options<T> = {}
  ): number => {
    const id = nextId.current++;
    setModals((prev) => [
      ...prev,
      { id, content: <Component {...(opts.props as T)} />, options: opts },
    ]);
    return id;
  }, []);

  const handleClose = React.useCallback((id?: number) => {
    if (id !== undefined) {
      setModals((prev) => prev.filter((modal) => modal.id !== id));
    } else {
      setModals((prev) => prev.slice(0, -1));
    }
  }, []);

  const handleOutsideClick = React.useCallback(
    (event: MouseEvent) => {
      if (modals.length === 0) return;
      const topModal = modals[modals.length - 1];
      const modalRef = modalRefs.current.get(topModal.id);
      if (
        modalRef &&
        event.target instanceof Node &&
        !modalRef.contains(event.target)
      ) {
        if (topModal.options.dismissible) {
          handleClose(topModal.id);
        }
      }
    },
    [modals, handleClose]
  );

  React.useEffect(() => {
    modal.open = handleOpen;
    modal.close = handleClose;

    if (modals.length > 0) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [handleOpen, handleClose, modals.length]);

  return (
    <AnimatePresence>
      {modals.map((modal, index) => (
        <div
          key={modal.id}
          className="fixed inset-0 bg-overlay-backdrop flex w-full h-full items-center justify-center"
          style={{ zIndex: 10000 + index }}
        >
          <motion.div
            ref={(el) => {
              if (el) {
                modalRefs.current.set(modal.id, el);
              } else {
                modalRefs.current.delete(modal.id);
              }
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={twMerge(
              'bg-overlay-primary border border-card-border rounded-lg overflow-hidden',
              modal.options.className
            )}
          >
            {modal.content}
          </motion.div>
        </div>
      ))}
    </AnimatePresence>
  );
}
