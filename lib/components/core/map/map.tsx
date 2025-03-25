'use client';
import React from 'react';
import { AdvancedMarker, APIProvider, Map as GoogleMap, Marker } from '@vis.gl/react-google-maps';
import { twMerge } from 'tailwind-merge';
import { darkMapTheme } from './constant';
import { GOOGLE_MAP_KEY } from '$lib/utils/constants';
import { log } from '$lib/utils/helpers';

interface MapProps {
  className?: string;
  markers?: { lat: number; lng: number }[];
  center?: { lat: number; lng: number };
  colorscheme?: 'DARK' | 'LIGHT';
  defaultZoom?: number;
  marker?: 'marker' | 'advanced';
}

// TODO: need to create MapId and MapStyles to use with AdvancedMarker
export function Map({
  className,
  markers,
  center,
  colorscheme = 'DARK',
  defaultZoom = 2,
  marker = 'marker',
}: MapProps) {
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
        defaultZoom={defaultZoom}
        minZoom={2}
        disableDefaultUI
        styles={colorscheme == 'DARK' ? darkMapTheme : undefined}
        colorScheme={colorscheme}
      >
        {markers?.map((item, idx) => {
          if (marker == 'advanced') {
            return (
              <AdvancedMarker key={idx} position={{ lat: item.lat, lng: item.lng }}>
                <div className="size-[12px] bg-primary-400 border rounded-full  border-tertiary"></div>
              </AdvancedMarker>
            );
          }

          return <Marker key={idx} position={{ lat: item.lat, lng: item.lng }} />;
        })}
      </GoogleMap>
    </APIProvider>
  );
}
