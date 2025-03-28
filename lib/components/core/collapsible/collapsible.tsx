'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CollapsibleProps {
  header: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const Collapsible = ({
  header,
  children,
  defaultOpen = false
}: CollapsibleProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const variants = {
    open: {
      height: 'auto',
      opacity: 1,
    },
    closed: {
      height: 0,
      opacity: 0,
    },
  };

  return (
    <div className='rounded-sm border border-tertiary/8'>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className='flex justify-between gap-3 p-2'
        role="button"
      >
        <div>{header}</div>
        <motion.i
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="icon-arrow-down text-tertiary/56"
        />
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            variants={variants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-3 border-t border-tertiary/8">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
