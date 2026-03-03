'use client';

import React from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TouchDnDOptions {
  /** Minimum hold time in ms before drag starts. @default 500 */
  longPressMs?: number;
  /** Vertical distance threshold (px) to cancel drag on scroll. @default 10 */
  scrollThreshold?: number;
  /** Called when drag starts with the source node ID. */
  onDragStart?: (nodeId: string) => void;
  /** Called when dragging over a valid target. */
  onDragOver?: (nodeId: string, position: 'before' | 'after') => void;
  /** Called when the item is dropped on a target. */
  onDrop?: (sourceId: string, targetId: string, position: 'before' | 'after') => void;
  /** Called when drag is cancelled (scroll, multi-touch, outside viewport). */
  onDragCancel?: () => void;
}

interface TouchDnDState {
  isDragging: boolean;
  dragNodeId: string | null;
  dragPosition: { x: number; y: number };
  dropTargetId: string | null;
  dropPosition: 'before' | 'after' | null;
}

interface DragHandleProps {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
  onPointerDown: (e: React.PointerEvent) => void;
  onPointerMove: (e: React.PointerEvent) => void;
  onPointerUp: (e: React.PointerEvent) => void;
  'data-section-node-id': string;
}

interface DropIndicatorState {
  isVisible: boolean;
  top: number;
  left: number;
  width: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SECTION_ATTR = 'data-section-node-id';
const DEFAULT_LONG_PRESS_MS = 500;
const DEFAULT_SCROLL_THRESHOLD = 10;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Walk up from an element to find the closest ancestor (or self) that has
 * the `data-section-node-id` attribute.
 */
function findSectionElement(el: Element | null): HTMLElement | null {
  let current = el;
  while (current && current !== document.body) {
    if (current instanceof HTMLElement && current.hasAttribute(SECTION_ATTR)) {
      return current;
    }
    current = current.parentElement;
  }
  return null;
}

/**
 * Given a coordinate, find the closest section element and determine whether
 * the point is in the top half (`before`) or bottom half (`after`).
 */
function findClosestSection(
  x: number,
  y: number,
): { nodeId: string; position: 'before' | 'after'; element: HTMLElement } | null {
  const elements = document.elementsFromPoint(x, y);

  for (const el of elements) {
    const section = findSectionElement(el);
    if (section) {
      const nodeId = section.getAttribute(SECTION_ATTR);
      if (!nodeId) continue;

      const rect = section.getBoundingClientRect();
      const midY = rect.top + rect.height / 2;
      const position: 'before' | 'after' = y < midY ? 'before' : 'after';

      return { nodeId, position, element: section };
    }
  }

  // Fallback: scan all section elements by proximity when touch point is
  // between sections (e.g. in the gap between two cards).
  const allSections = document.querySelectorAll<HTMLElement>(`[${SECTION_ATTR}]`);
  let closest: { nodeId: string; position: 'before' | 'after'; element: HTMLElement; distance: number } | null = null;

  allSections.forEach((section) => {
    const nodeId = section.getAttribute(SECTION_ATTR);
    if (!nodeId) return;

    const rect = section.getBoundingClientRect();
    const centerY = rect.top + rect.height / 2;
    const distance = Math.abs(y - centerY);

    if (!closest || distance < closest.distance) {
      const position: 'before' | 'after' = y < centerY ? 'before' : 'after';
      closest = { nodeId, position, element: section, distance };
    }
  });

  if (closest) {
    const { nodeId, position, element } = closest;
    return { nodeId, position, element };
  }

  return null;
}

// ---------------------------------------------------------------------------
// useTouchDnD
// ---------------------------------------------------------------------------

/**
 * Hook that provides touch-friendly drag-and-drop for page builder sections.
 *
 * Works alongside Craft.js's native mouse-based DnD — it enhances touch
 * interaction without replacing the existing desktop behaviour.
 *
 * Usage:
 * ```tsx
 * const { state, getDragHandleProps, cancelDrag } = useTouchDnD({
 *   onDrop: (src, tgt, pos) => { ... },
 * });
 *
 * sections.map(s => (
 *   <div key={s.id} {...getDragHandleProps(s.id)}>
 *     <SectionComponent />
 *   </div>
 * ));
 * ```
 */
export function useTouchDnD(options: TouchDnDOptions = {}) {
  const {
    longPressMs = DEFAULT_LONG_PRESS_MS,
    scrollThreshold = DEFAULT_SCROLL_THRESHOLD,
    onDragStart,
    onDragOver,
    onDrop,
    onDragCancel,
  } = options;

  // ── State ──

  const [state, setState] = React.useState<TouchDnDState>({
    isDragging: false,
    dragNodeId: null,
    dragPosition: { x: 0, y: 0 },
    dropTargetId: null,
    dropPosition: null,
  });

  // Refs that persist across renders without triggering re-renders.
  const longPressTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialTouchRef = React.useRef<{ x: number; y: number } | null>(null);
  const isDraggingRef = React.useRef(false);
  const dragNodeIdRef = React.useRef<string | null>(null);
  const rafRef = React.useRef<number | null>(null);
  // Track whether the pointer interaction originated from a touch to avoid
  // duplicate handling (pointer events fire alongside touch events on mobile).
  const isTouchActiveRef = React.useRef(false);

  // ── Cleanup helpers ──

  const clearLongPressTimer = React.useCallback(() => {
    if (longPressTimerRef.current !== null) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  const cancelRaf = React.useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const resetState = React.useCallback(() => {
    clearLongPressTimer();
    cancelRaf();
    isDraggingRef.current = false;
    dragNodeIdRef.current = null;
    initialTouchRef.current = null;
    isTouchActiveRef.current = false;
    setState({
      isDragging: false,
      dragNodeId: null,
      dragPosition: { x: 0, y: 0 },
      dropTargetId: null,
      dropPosition: null,
    });
  }, [clearLongPressTimer, cancelRaf]);

  // ── Drag lifecycle ──

  const startDrag = React.useCallback(
    (nodeId: string, x: number, y: number) => {
      isDraggingRef.current = true;
      dragNodeIdRef.current = nodeId;
      setState({
        isDragging: true,
        dragNodeId: nodeId,
        dragPosition: { x, y },
        dropTargetId: null,
        dropPosition: null,
      });
      onDragStart?.(nodeId);
    },
    [onDragStart],
  );

  const updateDragPosition = React.useCallback(
    (x: number, y: number) => {
      // Use rAF to throttle DOM reads and state updates for 60fps drag.
      cancelRaf();
      rafRef.current = requestAnimationFrame(() => {
        const target = findClosestSection(x, y);

        setState((prev) => {
          // Skip update if the drop target hasn't changed — avoids unnecessary renders.
          const targetId = target?.nodeId ?? null;
          const targetPos = target?.position ?? null;
          const isSameTarget =
            targetId === prev.dropTargetId &&
            targetPos === prev.dropPosition &&
            x === prev.dragPosition.x &&
            y === prev.dragPosition.y;

          if (isSameTarget) return prev;

          return {
            ...prev,
            dragPosition: { x, y },
            dropTargetId: targetId !== prev.dragNodeId ? targetId : null,
            dropPosition: targetId !== prev.dragNodeId ? targetPos : null,
          };
        });

        if (target && target.nodeId !== dragNodeIdRef.current) {
          onDragOver?.(target.nodeId, target.position);
        }
      });
    },
    [cancelRaf, onDragOver],
  );

  const completeDrop = React.useCallback(() => {
    const sourceId = dragNodeIdRef.current;

    // Read the current state synchronously via a state-setter callback so we
    // don't need an extra ref for dropTargetId/dropPosition.
    setState((prev) => {
      if (sourceId && prev.dropTargetId && prev.dropPosition && sourceId !== prev.dropTargetId) {
        onDrop?.(sourceId, prev.dropTargetId, prev.dropPosition);
      } else {
        onDragCancel?.();
      }
      return prev;
    });

    resetState();
  }, [onDrop, onDragCancel, resetState]);

  const cancelDrag = React.useCallback(() => {
    onDragCancel?.();
    resetState();
  }, [onDragCancel, resetState]);

  // ── Touch event handlers ──

  const handleTouchStart = React.useCallback(
    (nodeId: string, e: React.TouchEvent) => {
      // Multi-touch: cancel any in-progress drag.
      if (e.touches.length > 1) {
        cancelDrag();
        return;
      }

      const touch = e.touches[0];
      if (!touch) return;

      isTouchActiveRef.current = true;
      initialTouchRef.current = { x: touch.clientX, y: touch.clientY };

      clearLongPressTimer();
      longPressTimerRef.current = setTimeout(() => {
        const initial = initialTouchRef.current;
        if (initial) {
          startDrag(nodeId, initial.x, initial.y);
        }
      }, longPressMs);
    },
    [longPressMs, clearLongPressTimer, startDrag, cancelDrag],
  );

  const handleTouchMove = React.useCallback(
    (e: React.TouchEvent) => {
      // Multi-touch: cancel.
      if (e.touches.length > 1) {
        cancelDrag();
        return;
      }

      const touch = e.touches[0];
      if (!touch) return;

      // If still waiting for long-press, check scroll threshold.
      if (!isDraggingRef.current && initialTouchRef.current) {
        const dy = Math.abs(touch.clientY - initialTouchRef.current.y);
        if (dy > scrollThreshold) {
          // User is scrolling — cancel the long-press.
          clearLongPressTimer();
          initialTouchRef.current = null;
          return;
        }
        // Still within threshold, don't prevent default yet.
        return;
      }

      // Actively dragging — prevent page scroll and update position.
      if (isDraggingRef.current) {
        e.preventDefault();
        updateDragPosition(touch.clientX, touch.clientY);
      }
    },
    [scrollThreshold, clearLongPressTimer, cancelDrag, updateDragPosition],
  );

  const handleTouchEnd = React.useCallback(
    (_e: React.TouchEvent) => {
      isTouchActiveRef.current = false;

      if (isDraggingRef.current) {
        completeDrop();
      } else {
        // Long-press never completed — just clean up.
        clearLongPressTimer();
        initialTouchRef.current = null;
      }
    },
    [completeDrop, clearLongPressTimer],
  );

  // ── Pointer event handlers (stylus / non-touch pointers) ──
  // On devices that fire both touch and pointer events we skip the pointer
  // path to avoid double-handling.

  const handlePointerDown = React.useCallback(
    (nodeId: string, e: React.PointerEvent) => {
      // Only handle touch/pen — mouse is handled by Craft.js natively.
      if (e.pointerType === 'mouse') return;
      // If a touch sequence already started, skip.
      if (isTouchActiveRef.current) return;

      initialTouchRef.current = { x: e.clientX, y: e.clientY };

      clearLongPressTimer();
      longPressTimerRef.current = setTimeout(() => {
        const initial = initialTouchRef.current;
        if (initial) {
          startDrag(nodeId, initial.x, initial.y);
        }
      }, longPressMs);
    },
    [longPressMs, clearLongPressTimer, startDrag],
  );

  const handlePointerMove = React.useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType === 'mouse') return;
      if (isTouchActiveRef.current) return;

      if (!isDraggingRef.current && initialTouchRef.current) {
        const dy = Math.abs(e.clientY - initialTouchRef.current.y);
        if (dy > scrollThreshold) {
          clearLongPressTimer();
          initialTouchRef.current = null;
          return;
        }
        return;
      }

      if (isDraggingRef.current) {
        e.preventDefault();
        updateDragPosition(e.clientX, e.clientY);
      }
    },
    [scrollThreshold, clearLongPressTimer, updateDragPosition],
  );

  const handlePointerUp = React.useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType === 'mouse') return;
      if (isTouchActiveRef.current) return;

      if (isDraggingRef.current) {
        completeDrop();
      } else {
        clearLongPressTimer();
        initialTouchRef.current = null;
      }
    },
    [completeDrop, clearLongPressTimer],
  );

  // ── Edge case: drag cancelled when touch leaves the viewport ──

  React.useEffect(() => {
    if (!state.isDragging) return;

    const handleVisibilityChange = () => {
      if (document.hidden) cancelDrag();
    };

    const handleContextMenu = (e: Event) => {
      // Long-press on some browsers triggers a context menu — prevent it
      // while dragging.
      e.preventDefault();
      cancelDrag();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [state.isDragging, cancelDrag]);

  // ── Cleanup on unmount ──

  React.useEffect(() => {
    return () => {
      clearLongPressTimer();
      cancelRaf();
    };
  }, [clearLongPressTimer, cancelRaf]);

  // ── Public API ──

  /**
   * Returns event-handler props to spread onto a draggable section wrapper.
   *
   * ```tsx
   * <div {...getDragHandleProps(section.id)}>
   *   <SectionContent />
   * </div>
   * ```
   */
  const getDragHandleProps = React.useCallback(
    (nodeId: string): DragHandleProps => ({
      onTouchStart: (e: React.TouchEvent) => handleTouchStart(nodeId, e),
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onPointerDown: (e: React.PointerEvent) => handlePointerDown(nodeId, e),
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      [SECTION_ATTR]: nodeId,
    }),
    [handleTouchStart, handleTouchMove, handleTouchEnd, handlePointerDown, handlePointerMove, handlePointerUp],
  );

  return {
    /** Current drag-and-drop state. */
    state,
    /** Generates event-handler props for a given section node ID. */
    getDragHandleProps,
    /** Imperatively cancel the current drag operation. */
    cancelDrag,
  } as const;
}

// ---------------------------------------------------------------------------
// useDropIndicator
// ---------------------------------------------------------------------------

/**
 * Hook that computes the position of a drop indicator line based on the
 * current `useTouchDnD` state.
 *
 * Usage:
 * ```tsx
 * const { state } = useTouchDnD({ ... });
 * const indicator = useDropIndicator(state);
 *
 * <DropIndicator
 *   isVisible={indicator.isVisible}
 *   top={indicator.top}
 *   left={indicator.left}
 *   width={`${indicator.width}px`}
 * />
 * ```
 */
export function useDropIndicator(dndState: TouchDnDState): DropIndicatorState {
  const [indicator, setIndicator] = React.useState<DropIndicatorState>({
    isVisible: false,
    top: 0,
    left: 0,
    width: 0,
  });

  React.useEffect(() => {
    if (!dndState.isDragging || !dndState.dropTargetId || !dndState.dropPosition) {
      setIndicator((prev) => (prev.isVisible ? { ...prev, isVisible: false } : prev));
      return;
    }

    const targetEl = document.querySelector<HTMLElement>(
      `[${SECTION_ATTR}="${dndState.dropTargetId}"]`,
    );

    if (!targetEl) {
      setIndicator((prev) => (prev.isVisible ? { ...prev, isVisible: false } : prev));
      return;
    }

    const rect = targetEl.getBoundingClientRect();
    const top = dndState.dropPosition === 'before' ? rect.top : rect.bottom;

    setIndicator({
      isVisible: true,
      top,
      left: rect.left,
      width: rect.width,
    });
  }, [dndState.isDragging, dndState.dropTargetId, dndState.dropPosition]);

  return indicator;
}

// ---------------------------------------------------------------------------
// Exports (types)
// ---------------------------------------------------------------------------

export type { TouchDnDOptions, TouchDnDState, DragHandleProps, DropIndicatorState };
