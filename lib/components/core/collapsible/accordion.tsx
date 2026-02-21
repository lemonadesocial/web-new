'use client';
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

type State = { isOpen?: boolean; toggle: () => void; close?: () => void };

const Context = React.createContext<State>({ toggle: () => {} });

function Root({
  children,
  color,
  open,
  className,
}: React.PropsWithChildren & { color?: 'warning'; open?: boolean; className?: string }) {
  const [isOpen, setIsOpen] = React.useState(open);

  React.useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const toggle = () => {
    setIsOpen(!isOpen);
  };
  const close = () => setIsOpen(false);

  const value = { isOpen, toggle, close };
  return (
    <Context.Provider value={value}>
      <div className={clsx('collapse', color, className)}>{children}</div>
    </Context.Provider>
  );
}

function Header({
  children,
  chevron = true,
  className,
  disabled = false,
}: {
  chevron?: boolean;
  className?: string;
  disabled?: boolean;
  children: React.ReactNode | ((props: { toggle: () => void; isOpen?: boolean }) => React.ReactNode);
}) {
  const { isOpen, toggle } = React.useContext(Context);

  return (
    <button
      type="button"
      onClick={!disabled ? toggle : undefined}
      className={twMerge('trigger cursor-pointer w-full text-left', className)}
      aria-expanded={isOpen}
      disabled={disabled}
    >
      {typeof children === 'function' ? children({ toggle, isOpen }) : <div className="w-full">{children}</div>}
      {chevron && (
        <motion.i
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="icon-arrow-down text-tertiary"
        />
      )}
    </button>
  );
}

function Content({ children, className }: React.PropsWithChildren & { className?: string }) {
  const { isOpen } = React.useContext(Context);

  const variants = {
    open: { height: 'auto', opacity: 1 },
    closed: { height: 0, opacity: 0 },
  };

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          variants={variants}
          initial="closed"
          animate="open"
          exit="closed"
          transition={{ duration: 0.3 }}
          className="content"
        >
          <div className={twMerge('content-box', className)}>{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * How to usage:
 *
 *   <Accordion.Root color="warning">
 *     <Accordion.Header>
 *       Header
 *     </Accordion.Header>
 *     <Accordion.Content>
 *       Content
 *     </Accordion.Content>
 *   </Accordion.Root>
 */
export const Accordion = {
  Root,
  Header,
  Content,
};
