'use client';

import React from 'react';
import { Frame, Element } from '@craftjs/core';
import { useAtomValue, useSetAtom } from 'jotai';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';

import { devicePreviewAtom, zoomAtom, pageConfigAtom } from './store';
import type { DevicePreview } from './types';

// ---------------------------------------------------------------------------
// Device frame specifications
// ---------------------------------------------------------------------------

interface DeviceFrame {
  width: number | '100%';
  height: number | '100%';
  frame: boolean;
  borderRadius?: number;
}

const DEVICE_FRAMES: Record<DevicePreview, DeviceFrame> = {
  desktop: { width: '100%', height: '100%', frame: false },
  tablet: { width: 768, height: 1024, frame: true, borderRadius: 20 },
  mobile: { width: 375, height: 812, frame: true, borderRadius: 40 },
};

/** Padding added by the device chrome (border + notch area) */
const FRAME_CHROME_PADDING = 16;

// ---------------------------------------------------------------------------
// Dot-grid background style (Figma-like)
// ---------------------------------------------------------------------------

const DOT_GRID_STYLE: React.CSSProperties = {
  backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
  backgroundSize: '20px 20px',
};

// ---------------------------------------------------------------------------
// useFitToScreen — auto-calculates zoom to fit the device frame
// ---------------------------------------------------------------------------

function useFitToScreen(device: DevicePreview, containerRef: React.RefObject<HTMLDivElement | null>) {
  const setZoom = useSetAtom(zoomAtom);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const frame = DEVICE_FRAMES[device];

    // Desktop uses full width — reset to 100%
    if (frame.width === '100%') {
      setZoom(100);
      return;
    }

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const padding = 48; // p-6 on each side

    const availableWidth = containerWidth - padding * 2;
    const availableHeight = containerHeight - padding * 2;

    const frameOuterWidth = (frame.width as number) + FRAME_CHROME_PADDING * 2;
    const frameOuterHeight = (frame.height as number) + FRAME_CHROME_PADDING * 2;

    const scaleX = availableWidth / frameOuterWidth;
    const scaleY = availableHeight / frameOuterHeight;
    const fitScale = Math.min(scaleX, scaleY, 1); // never exceed 100%

    // Snap to nearest 5% for cleaner display
    const snappedZoom = Math.max(25, Math.round((fitScale * 100) / 5) * 5);
    setZoom(snappedZoom);
  }, [device, containerRef, setZoom]);
}

// ---------------------------------------------------------------------------
// Canvas
// ---------------------------------------------------------------------------

/**
 * Canvas — the center preview area of the page builder.
 *
 * Features:
 *  - Dot-grid background (Figma-like)
 *  - Device frame chrome for tablet/mobile (rounded borders, notch indicator)
 *  - Smooth Framer Motion transitions between viewport sizes
 *  - Fit-to-screen auto-zoom when device changes
 *  - Dimension indicator label below the device frame
 *
 * Once Craft.js is integrated, this component will wrap the `<Frame>`
 * element. Until then it renders a static preview of the sections
 * stored in `pageConfigAtom`.
 */
interface CanvasProps {
  /** JSON string of serialized Craft.js nodes for Frame initialization */
  initialData?: string;
}

export function Canvas({ initialData }: CanvasProps) {
  const device = useAtomValue(devicePreviewAtom);
  const zoom = useAtomValue(zoomAtom);
  const config = useAtomValue(pageConfigAtom);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Auto-fit zoom when device changes
  useFitToScreen(device, containerRef);

  const scale = zoom / 100;
  const frame = DEVICE_FRAMES[device];
  const widthValue = frame.width === '100%' ? '100%' : `${frame.width}px`;

  return (
    <div
      ref={containerRef}
      className="relative flex-1 overflow-auto"
      style={DOT_GRID_STYLE}
    >
      {/* Scrollable container with padding so the viewport floats */}
      <div className="flex flex-col items-center p-6 min-h-full">
        {/* Device frame wrapper */}
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 400, damping: 40 }}
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
          }}
        >
          {/* Chrome shell — only renders border/notch for tablet & mobile */}
          <div
            className={twMerge(
              clsx(
                'relative transition-all duration-300',
                frame.frame && 'border-2 border-white/10 bg-black/20',
              ),
            )}
            style={{
              borderRadius: frame.frame ? frame.borderRadius : undefined,
              padding: frame.frame ? FRAME_CHROME_PADDING : 0,
            }}
          >
            {/* Notch indicator — mobile only */}
            {device === 'mobile' && <MobileNotch />}

            {/* Home indicator — mobile only */}
            {device === 'mobile' && <MobileHomeIndicator />}

            {/* The actual page viewport */}
            <motion.div
              layout
              transition={{ type: 'spring', stiffness: 400, damping: 40 }}
              className={twMerge(
                'bg-page-background shadow-lg overflow-hidden',
                frame.frame ? 'rounded-sm' : 'rounded-md border border-card-border',
              )}
              style={{
                width: widthValue,
                maxWidth: '100%',
              }}
            >
              <div className="min-h-[60vh] relative">
                {initialData ? (
                  <Frame data={initialData}>
                    <Element canvas is="div" className="min-h-[60vh]" />
                  </Frame>
                ) : (
                  <EmptyCanvas />
                )}
                {initialData && !config?.sections?.length && (
                  <EmptyCanvasOverlay />
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Dimension indicator */}
        <AnimatePresence mode="wait">
          {frame.frame && (
            <DimensionLabel
              key={device}
              width={frame.width as number}
              height={frame.height as number}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MobileNotch — subtle notch/dynamic-island indicator at top of mobile frame
// ---------------------------------------------------------------------------

function MobileNotch() {
  return (
    <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
      <div className="w-[120px] h-[28px] bg-black rounded-b-2xl flex items-center justify-center">
        <div className="w-[60px] h-[4px] rounded-full bg-white/10" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MobileHomeIndicator — small bar at the bottom of mobile frame
// ---------------------------------------------------------------------------

function MobileHomeIndicator() {
  return (
    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
      <div className="w-[134px] h-[5px] rounded-full bg-white/15" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// DimensionLabel — viewport dimensions shown below the device frame
// ---------------------------------------------------------------------------

function DimensionLabel({ width, height }: { width: number; height: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.2 }}
      className="mt-3 px-2.5 py-1 rounded-full bg-overlay-secondary/60 backdrop-blur-sm"
    >
      <span className="text-[11px] font-mono text-tertiary tracking-wider">
        {width} &times; {height}
      </span>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// EmptyCanvas
// ---------------------------------------------------------------------------

function EmptyCanvas() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-8">
      <div
        className={clsx(
          'size-16 rounded-full bg-primary/8 flex items-center justify-center',
        )}
      >
        <i className="icon-grid-view size-8 text-tertiary" />
      </div>
      <div className="space-y-1">
        <p className="text-lg font-semibold text-primary">Start building your page</p>
        <p className="text-sm text-tertiary max-w-sm">
          Add sections from the toolbar or ask the AI assistant to generate a layout for you.
        </p>
      </div>
    </div>
  );
}

function EmptyCanvasOverlay() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center px-8 pointer-events-none">
      <div className="size-16 rounded-full bg-primary/8 flex items-center justify-center">
        <i className="icon-grid-view size-8 text-tertiary" />
      </div>
      <div className="space-y-1">
        <p className="text-lg font-semibold text-primary">Start building your page</p>
        <p className="text-sm text-tertiary max-w-sm">
          Drag sections from the toolbar onto this canvas.
        </p>
      </div>
    </div>
  );
}
