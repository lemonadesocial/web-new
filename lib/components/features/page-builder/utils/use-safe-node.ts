'use client';

import { useNode } from '@craftjs/core';

/**
 * Safe wrapper around Craft.js useNode() hook.
 *
 * NOTE: The try/catch around useNode() technically violates React's Rules of Hooks
 * (hooks should be called unconditionally). However, this is a pragmatic solution for
 * components that may render both inside and outside the Craft.js <Editor> context.
 *
 * This works because:
 * 1. useNode() throws synchronously during render when outside Editor context
 * 2. The hook call order is deterministic (always called, always in same position)
 * 3. Craft.js v0.2.12 has been verified to work with this pattern
 *
 * Alternative: Use a React context to detect editor presence. Deferred to a future refactor.
 *
 * @see Page Builder Architecture in CLAUDE.md
 */
export function useSafeNode() {
  try {
    return useNode();
  } catch {
    return {
      connectors: {
        connect: (ref: HTMLElement | null) => ref,
        drag: (ref: HTMLElement | null) => ref,
      },
    };
  }
}
