'use client';
import React from 'react';
import clsx from 'clsx';
import { AnimatePresence, motion, MotionStyle } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { useFloating, offset, Placement, ReferenceType } from '@floating-ui/react';

type MenuState = {
  isOpen?: boolean;
  toggle: () => void;
  close?: () => void;
  disabled?: boolean;
  placement?: Placement;
  refs?: {
    reference: React.MutableRefObject<ReferenceType | null>;
    floating: React.MutableRefObject<HTMLElement | null>;
    setReference: (node: ReferenceType | null) => void;
    setFloating: (node: HTMLElement | null) => void;
  };
  floatingStyles?: MotionStyle;
};
const MenuContext = React.createContext<MenuState>({ toggle: () => {} });

function MenuTrigger({ children }: React.PropsWithChildren) {
  const { toggle, refs, disabled } = React.useContext(MenuContext);

  return (
    <div
      ref={refs?.setReference}
      onClick={toggle}
      className={clsx(disabled ? 'cursor-not-allowed' : 'cursor-pointer')}
      aria-haspopup="true"
    >
      {children}
    </div>
  );
}

function MenuContent({
  children,
  className,
}: {
  className?: string;
  children: React.ReactNode | ((props: { toggle: () => void }) => React.ReactNode);
}) {
  const { isOpen, toggle, refs, floatingStyles } = React.useContext(MenuContext);

  const dropdownVariants = {
    open: {
      opacity: 1,
    },
    closed: {
      opacity: 0,
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={refs?.setFloating}
          style={{
            ...floatingStyles,
            // @ts-expect-error accept variables
            '--font-title': 'var(--font-class-display)',
            '--font-body': 'var(--font-general-sans)',
          }}
          className={twMerge(
            'outline outline-tertiary/4 rounded-sm bg-menu backdrop-blur-md w-fit p-4 z-50 shadow-md',
            className,
          )}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex={-1}
          initial="closed"
          animate="open"
          exit="closed"
          variants={dropdownVariants}
        >
          {typeof children === 'function' ? children({ toggle }) : children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MenuRoot({
  children,
  className,
  disabled,
  placement = 'bottom-end',
  dismissable = true,
}: { className?: string; disabled?: boolean; placement?: Placement; dismissable?: boolean } & React.PropsWithChildren) {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggle = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);

  const { refs, floatingStyles } = useFloating({
    open: isOpen,
    onOpenChange: toggle,
    strategy: 'fixed',
    placement,
    middleware: [offset(10)],
  });

  const handleClickOutside = (event: MouseEvent) => {
    if (
      refs.floating.current &&
      !refs.floating.current.contains(event.target as Node) &&
      refs.reference.current &&
      !(refs.reference.current as HTMLDivElement).contains(event.target as Node)
    ) {
      if (dismissable) close();
    }
  };

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [refs.reference, refs.floating]);

  const value = { isOpen, toggle, close, refs, floatingStyles, disabled };

  return (
    <MenuContext.Provider value={value}>
      <div className={clsx(className, 'relative inline-block', disabled && 'opacity-50')}>{children}</div>
    </MenuContext.Provider>
  );
}

export const Menu = {
  Root: MenuRoot,
  Trigger: MenuTrigger,
  Content: MenuContent,
};
