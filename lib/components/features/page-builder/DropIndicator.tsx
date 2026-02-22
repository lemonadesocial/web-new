'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DropIndicatorProps {
  /** Whether the indicator line is currently visible. */
  isVisible: boolean;
  /** Vertical offset from the top of the positioning parent (px). */
  top: number;
  /** Horizontal offset from the left of the positioning parent (px). @default 0 */
  left?: number;
  /** Width of the indicator line. Accepts any CSS width value. @default '100%' */
  width?: string;
}

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------

const LINE_VARIANTS = {
  hidden: { opacity: 0, scaleX: 0.5 },
  visible: { opacity: 1, scaleX: 1 },
  exit: { opacity: 0 },
} as const;

const TRANSITION = { duration: 0.15, ease: 'easeOut' } as const;

// ---------------------------------------------------------------------------
// DropIndicator
// ---------------------------------------------------------------------------

/**
 * Animated horizontal line that indicates where a dragged section will be
 * dropped. Rendered between sections during a touch drag.
 *
 * The line has small circular dots at each end for visual clarity, matching
 * the accent colour from the current theme.
 *
 * Usage:
 * ```tsx
 * const indicator = useDropIndicator(dndState);
 *
 * <DropIndicator
 *   isVisible={indicator.isVisible}
 *   top={indicator.top}
 *   left={indicator.left}
 *   width={`${indicator.width}px`}
 * />
 * ```
 */
export function DropIndicator({
  isVisible,
  top,
  left = 0,
  width = '100%',
}: DropIndicatorProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="drop-indicator"
          variants={LINE_VARIANTS}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={TRANSITION}
          className="fixed z-40 pointer-events-none"
          style={{ top, left, width }}
          aria-hidden="true"
        >
          {/* Main line */}
          <div className="h-0.5 bg-accent-500 rounded-full" />
          {/* Left dot */}
          <div className="absolute -left-1 -top-1 w-2.5 h-2.5 rounded-full bg-accent-500" />
          {/* Right dot */}
          <div className="absolute -right-1 -top-1 w-2.5 h-2.5 rounded-full bg-accent-500" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
