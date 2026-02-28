'use client';

import React from 'react';
import { useAtom } from 'jotai';
import clsx from 'clsx';

import { Button } from '$lib/components/core';
import { devicePreviewAtom, zoomAtom } from './store';
import type { DevicePreview } from './types';

const ZOOM_MIN = 25;
const ZOOM_MAX = 200;
const ZOOM_STEP = 25;

const DEVICE_OPTIONS: { value: DevicePreview; icon: string; label: string }[] = [
  { value: 'desktop', icon: 'icon-computer', label: 'Desktop' },
  { value: 'tablet', icon: 'icon-tablet', label: 'Tablet' },
  { value: 'mobile', icon: 'icon-smartphone', label: 'Mobile' },
];

/**
 * BottomBar — sits at the bottom of the editor canvas area.
 * Provides device-preview toggle (Desktop / Tablet / Mobile) and zoom
 * controls (minus, percentage display, plus).
 */
export function BottomBar() {
  const [device, setDevice] = useAtom(devicePreviewAtom);
  const [zoom, setZoom] = useAtom(zoomAtom);

  const handleZoomIn = () => setZoom((z) => Math.min(z + ZOOM_STEP, ZOOM_MAX));
  const handleZoomOut = () => setZoom((z) => Math.max(z - ZOOM_STEP, ZOOM_MIN));
  const handleResetZoom = () => setZoom(100);

  return (
    <div className="sticky bottom-0 z-10 flex items-center justify-between px-4 py-2 border-t bg-overlay-primary/80 backdrop-blur-md">
      {/* Device toggle */}
      <div className="flex items-center gap-1">
        {DEVICE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            className={clsx(
              'flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm text-sm font-medium transition cursor-pointer',
              device === opt.value
                ? 'bg-primary/12 text-primary'
                : 'text-tertiary hover:text-secondary hover:bg-primary/4',
            )}
            onClick={() => setDevice(opt.value)}
            title={opt.label}
          >
            <i className={clsx(opt.icon, 'size-4')} />
            <span className="hidden md:inline">{opt.label}</span>
          </button>
        ))}
      </div>

      {/* Zoom controls */}
      <div className="flex items-center gap-1">
        <Button
          icon="icon-minus"
          variant="flat"
          size="xs"
          disabled={zoom <= ZOOM_MIN}
          onClick={handleZoomOut}
        />
        <button
          className="min-w-[52px] text-center text-xs font-medium text-secondary px-1.5 py-1 rounded-xs hover:bg-primary/4 transition cursor-pointer"
          onClick={handleResetZoom}
          title="Reset to 100%"
        >
          {zoom}%
        </button>
        <Button
          icon="icon-plus"
          variant="flat"
          size="xs"
          disabled={zoom >= ZOOM_MAX}
          onClick={handleZoomIn}
        />
      </div>
    </div>
  );
}
