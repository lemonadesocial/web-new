'use client';
import React, { PropsWithChildren } from 'react';

import { autoPlacement, offset, ReferenceType, useFloating } from '@floating-ui/react';
import { GithubPlacement } from '@uiw/react-color-github';
import { AnimatePresence, MotionStyle, motion } from 'framer-motion';
import { Chrome, ColorResult } from '@uiw/react-color';
import clsx from 'clsx';

type ColorPickerState = {
  isOpen?: boolean;
  toggle: () => void;
  close?: () => void;
  disabled?: boolean;
  refs?: {
    reference: React.MutableRefObject<ReferenceType | null>;
    floating: React.MutableRefObject<HTMLElement | null>;
    setReference: (node: ReferenceType | null) => void;
    setFloating: (node: HTMLElement | null) => void;
  };
  floatingStyles?: MotionStyle;
};
const ColorPickerContext = React.createContext<ColorPickerState>({ toggle: () => {} });

function randomColorHex() {
  return '#' + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, '0');
}

function ColorPickerTrigger({ children }: PropsWithChildren) {
  const { toggle, refs, disabled } = React.useContext(ColorPickerContext);

  return (
    <div
      ref={refs?.setReference}
      onClick={(e) => {
        e.stopPropagation();
        toggle();
      }}
      className={clsx(disabled ? 'cursor-not-allowed' : 'cursor-pointer')}
      aria-haspopup="true"
    >
      {children}
    </div>
  );
}

export function ColorPickerContent({
  color: colorValue,
  onChange,
}: {
  onChange: (color: ColorResult) => void;
  color?: string;
}) {
  const { isOpen, refs, floatingStyles } = React.useContext(ColorPickerContext);

  const dropdownVariants = {
    open: {
      opacity: 1,
    },
    closed: {
      opacity: 0,
    },
  };

  const [color, setColor] = React.useState(colorValue || randomColorHex());

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={refs?.setFloating}
            style={{ ...floatingStyles }}
            initial="closed"
            animate="open"
            exit="closed"
            variants={dropdownVariants}
          >
            <Chrome
              color={color}
              // @ts-expect-error it allow custom css variables for this comp
              style={{ '--github-background-color': 'var(--color-background)' }}
              showAlpha={false}
              autoFocus
              placement={'' as GithubPlacement}
              onChange={(result) => {
                setColor(result.hex);
                onChange(result);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ColorPickerRoot({
  children,
  className,
  disabled,
  strategy = 'absolute',
}: { className?: string; disabled?: boolean; strategy?: 'fixed' | 'absolute' } & React.PropsWithChildren) {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggle = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);

  const { refs, floatingStyles } = useFloating({
    open: isOpen,
    onOpenChange: toggle,
    strategy,
    middleware: [offset(10), autoPlacement()],
  });

  const handleClickOutside = (event: MouseEvent) => {
    if (
      refs.floating.current &&
      !refs.floating.current.contains(event.target as Node) &&
      refs.reference.current &&
      !(refs.reference.current as HTMLDivElement).contains(event.target as Node)
    ) {
      close();
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
    <ColorPickerContext.Provider value={value}>
      <div className={clsx(className, 'relative inline-block', disabled && 'opacity-50')}>{children}</div>
    </ColorPickerContext.Provider>
  );
}

export const ColorPicker = {
  Root: ColorPickerRoot,
  Trigger: ColorPickerTrigger,
  Content: ColorPickerContent,
};
