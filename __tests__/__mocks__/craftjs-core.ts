/**
 * Stub for @craftjs/core — used by vitest resolve alias so that
 * import-analysis does not fail when test files transitively import
 * editor components that depend on the (uninstalled) @craftjs/core package.
 */

export const Element = () => null;
export const useNode = () => ({
  connectors: { connect: () => {}, drag: () => {} },
});
export const useEditor = () => ({});
export const Canvas = () => null;
