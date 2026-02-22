'use client';

import { useNode } from '@craftjs/core';

/**
 * Safe wrapper around Craft.js useNode() that returns null connectors
 * when rendered outside the editor context (e.g., on the published page).
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
