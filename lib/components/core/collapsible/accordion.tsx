'use client';
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';

type State = { isOpen?: boolean; toggle: () => void; close?: () => void };

const Context = React.createContext<State>({ toggle: () => {} });

function Root({ children, color }: React.PropsWithChildren & { color: 'warning' }) {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };
  const close = () => setIsOpen(false);

  const value = { isOpen, toggle, close };
  return (
    <Context.Provider value={value}>
      <div className={clsx('collapse', color)}>{children}</div>
    </Context.Provider>
  );
}

function Header({ children }: React.PropsWithChildren) {
  const { isOpen, toggle } = React.useContext(Context);

  return (
    <div onClick={toggle} className="trigger" role="button">
      <div>{children}</div>
      <motion.i
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        className="icon-arrow-down text-tertiary"
      />
    </div>
  );
}

function Content({ children }: React.PropsWithChildren) {
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
          <div className="content-box">{children}</div>
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
