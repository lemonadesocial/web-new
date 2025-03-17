'use client';
import React from 'react';
import { AdvancedMarker, APIProvider, Map as GoogleMap } from '@vis.gl/react-google-maps';
import { twMerge } from 'tailwind-merge';
import { darkMapTheme } from './constant';
import { GOOGLE_MAP_KEY } from '$lib/utils/constants';
import { log } from '$lib/utils/helpers';

interface MapProps {
  className?: string;
  markers?: { lat: number; lng: number }[];
  center?: { lat: number; lng: number };
}

// TODO: need to create MapId and MapStyles to use with AdvancedMarker
export function Map({ className, markers, center }: MapProps) {
  if (!GOOGLE_MAP_KEY) {
    log.warn({ message: 'Missing GOOGLE_MAP_KEY.' });
    return null;
  }

  return (
    <APIProvider apiKey={GOOGLE_MAP_KEY}>
      <GoogleMap
        mapId="DEMO_MAP_ID"
        className={twMerge('map h-full w-full outline-none', className)}
        defaultCenter={{ lat: markers?.[0]?.lat || 0, lng: markers?.[0]?.lng || 0 }}
        center={center}
        defaultZoom={2}
        minZoom={2}
        disableDefaultUI
        styles={darkMapTheme}
        colorScheme="DARK"
      >
        {markers?.map((item, idx) => (
          <AdvancedMarker key={idx} position={{ lat: item.lat, lng: item.lng }}>
            <div className="size-[12px] bg-primary-400 border rounded-full border border-tertiary"></div>
          </AdvancedMarker>
        ))}
      </GoogleMap>
    </APIProvider>
  );
}
