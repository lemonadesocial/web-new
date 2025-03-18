'use client';
import React from 'react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { useFloating, offset, Placement } from '@floating-ui/react';

interface MenuProps extends React.PropsWithChildren {
  className?: string;
  contentClass?: string;
  disabled?: boolean;
  placement?: Placement;
}

function MenuTrigger({ children }: React.PropsWithChildren) {
  return <>{children}</>;
}

function MenuContent({ children }: React.PropsWithChildren) {
  return <>{children}</>;
}

function MenuRoot({ children, className, contentClass, disabled, placement = 'bottom-end' }: MenuProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const { refs, floatingStyles } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    strategy: 'fixed',
    placement,
    middleware: [offset(10)],
  });

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // React.useEffect(() => {
  //   if (isOpen && triggerRef.current) {
  //     const buttonRect = triggerRef.current.getBoundingClientRect();
  //     const windowHeight = window.innerHeight;
  //
  //     if (buttonRect.bottom + 200 > windowHeight) {
  //       // 200 is an approximate dropdown height.
  //       setPlacement('top-start');
  //     } else {
  //       setPlacement('bottom-start');
  //     }
  //   }
  // }, [isOpen]);

  const dropdownVariants = {
    open: {
      opacity: 1,
      // y: 0,
      // transition: {
      //   duration: 0.2,
      //   ease: 'easeInOut',
      // },
    },
    closed: {
      opacity: 0,
      // y: -10,
      // transition: {
      //   duration: 0.15,
      //   ease: 'easeInOut',
      // },
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
        ref={refs.setReference}
      >
        {React.Children.toArray(children).find(
          (child) =>
            React.isValidElement(child) && typeof child.type === 'function' && child.type.name === 'MenuTrigger',
        )}
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={refs.setFloating}
            style={floatingStyles}
            className={twMerge(
              'absolute focus:outline-none border rounded-sm border-tertiary/4 bg-menu w-fit p-4 z-50',
              // clsx(placement === 'bottom-start' ? 'mt-2' : 'mb-2 bottom-full'),
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
  placement,
}: { className?: string; contentClass?: string; disabled?: boolean; placement?: Placement } & React.PropsWithChildren) {
  return (
    <MenuRoot className={className} contentClass={contentClass} disabled={disabled} placement={placement}>
      {children}
    </MenuRoot>
  );
}

Menu.Trigger = MenuTrigger;
Menu.Content = MenuContent;
