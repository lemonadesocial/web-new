'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TouchDragOverlayProps {
  /** Whether the overlay is currently visible (i.e. a drag is in progress). */
  isVisible: boolean;
  /** Current touch/pointer position in viewport coordinates. */
  position: { x: number; y: number };
  /** Width of the ghost preview in pixels. @default 300 */
  width?: number;
  /** Optional custom content to render inside the overlay. */
  children?: React.ReactNode;
}

// ---------------------------------------------------------------------------
// TouchDragOverlay
// ---------------------------------------------------------------------------

/**
 * Floating preview overlay that follows the user's finger during a touch drag.
 *
 * Renders via a portal to `document.body` so it sits above all other content
 * and is not clipped by overflow containers.
 *
 * Uses `position: fixed` with `will-change: transform` for GPU-accelerated,
 * jank-free movement at 60fps.
 *
 * Usage:
 * ```tsx
 * const { state } = useTouchDnD({ ... });
 *
 * <TouchDragOverlay
 *   isVisible={state.isDragging}
 *   position={state.dragPosition}
 * />
 * ```
 */
export function TouchDragOverlay({
  isVisible,
  position,
  width = 300,
  children,
}: TouchDragOverlayProps) {
  const [mounted, setMounted] = React.useState(false);

  // Ensure we only render the portal on the client (SSR safety).
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isVisible) return null;

  const overlayStyle: React.CSSProperties = {
    // Position the overlay centered horizontally on the touch point,
    // offset 20px above the finger so the user can see it.
    left: 0,
    top: 0,
    width,
    transform: `translate3d(${position.x - width / 2}px, ${position.y - 20}px, 0) scale(0.85)`,
    transformOrigin: 'top center',
    willChange: 'transform',
  };

  return createPortal(
    <div
      className={clsx(
        'fixed pointer-events-none z-50',
        'opacity-80 shadow-2xl rounded-md overflow-hidden',
        'border-2 border-accent-500/50',
        'transition-opacity duration-150',
      )}
      style={overlayStyle}
      aria-hidden="true"
    >
      {children || <DefaultGhost />}
    </div>,
    document.body,
  );
}

// ---------------------------------------------------------------------------
// DefaultGhost — fallback content when no children are provided
// ---------------------------------------------------------------------------

/**
 * A simple placeholder ghost shown when the parent does not provide custom
 * overlay content. Displays a drag-handle icon on a blurred backdrop.
 */
function DefaultGhost() {
  return (
    <div className="h-16 bg-overlay-secondary backdrop-blur-md flex items-center justify-center gap-2">
      <i className="icon-drag-handle text-tertiary size-5" />
      <span className="text-xs font-medium text-secondary select-none">
        Drag to reorder
      </span>
    </div>
  );
}
