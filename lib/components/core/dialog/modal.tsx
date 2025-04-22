'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { createPortal } from 'react-dom';
import { Button } from '../button';
import clsx from 'clsx';

interface Options<T> {
  props?: T;
  dismissible?: boolean;
  className?: string;
  skipBaseClassName?: boolean;
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

export function createModal(): Modal {
  return ({
    open: () => {
      throw new Error('Modal not initialized');
    },
    close: () => {
      throw new Error('Modal not initialized');
    },
  });
}

export const modal = createModal();

export function ModalContainer({ modal }: { modal: Modal }) {
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

  useEffect(() => {
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
        <React.Fragment key={modal.id}>
          {createPortal(
            <div
              className="fixed inset-0 bg-overlay-backdrop flex w-full h-full items-center justify-center"
              style={{ zIndex: 10000 + index }}
              role="modal"
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
                  modal.options.skipBaseClassName ? '' : 'bg-overlay-primary border border-card-border rounded-lg overflow-hidden',
                  modal.options.className
                )}
              >
                {modal.content}
              </motion.div>
            </div>,
            document.body
          )}
        </React.Fragment>
      ))}
    </AnimatePresence>
  );
}

interface ModalContentProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  icon?: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export function ModalContent({ children, onClose, title, icon, className }: ModalContentProps) {
  return (
    <div className={twMerge("p-4 space-y-4 w-[340px]", className)}>
      {
        (title || icon || onClose) && (
          <div className={clsx("flex justify-between", icon ? 'items-start' : 'items-center')}>
            {icon && (
              <div className="size-[56px] flex justify-center items-center rounded-full bg-primary/8">
                {
                  typeof icon === 'string' ? <i className={clsx(icon, 'size-8 text-tertiary')} /> : icon
                }
              </div>
            )}
            {title && <span className='min-w-6' />}
            {title}
            {onClose && (
              <Button icon="icon-x" size='xs' variant="tertiary" className="rounded-full" onClick={onClose} />
            )}
          </div>
        )
      }
      <div>
        {children}
      </div>
    </div>
  );
}
