'use client';
import React from 'react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

interface MenuProps extends React.PropsWithChildren {
  className?: string;
  contentClass?: string;
  disabled?: boolean;
}

function MenuTrigger({ children }: React.PropsWithChildren) {
  return <>{children}</>;
}

function MenuContent({ children }: React.PropsWithChildren) {
  return <>{children}</>;
}

function MenuRoot({ children, className, contentClass, disabled }: MenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState('bottom-start');
  const triggerRef = React.useRef(null);
  const dropdownRef = React.useRef(null);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  React.useEffect(() => {
    if (isOpen && triggerRef.current) {
      const buttonRect = triggerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (buttonRect.bottom + 200 > windowHeight) {
        // 200 is an approximate dropdown height.
        setPlacement('top-start');
      } else {
        setPlacement('bottom-start');
      }
    }
  }, [isOpen]);

  const dropdownVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: 'easeInOut',
      },
    },
    closed: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.15,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <div className={clsx(className, 'relative inline-block', disabled && 'opacity-50')} ref={dropdownRef}>
      <div
        onClick={() => {
          if (disabled) return;
          setIsOpen(!isOpen);
        }}
        className={clsx(disabled ? 'cursor-not-allowed' : 'cursor-pointer')}
        aria-haspopup="true"
        ref={triggerRef}
      >
        {React.Children.toArray(children).find(
          (child) =>
            React.isValidElement(child) && typeof child.type === 'function' && child.type.name === 'MenuTrigger',
        )}
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={twMerge(
              'absolute focus:outline-none border rounded-sm border-tertiary/4 bg-alabaster-950 w-full p-4',
              clsx(placement === 'bottom-start' ? 'mt-2 right-0' : 'mb-2 right-0 bottom-full'),
              contentClass,
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
            {React.Children.toArray(children).find(
              (child) =>
                React.isValidElement(child) && typeof child.type === 'function' && child.type.name === 'MenuContent',
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Menu({
  children,
  className,
  contentClass,
  disabled,
}: { className?: string; contentClass?: string; disabled?: boolean } & React.PropsWithChildren) {
  return (
    <MenuRoot className={className} contentClass={contentClass} disabled={disabled}>
      {children}
    </MenuRoot>
  );
}

Menu.Trigger = MenuTrigger;
Menu.Content = MenuContent;
