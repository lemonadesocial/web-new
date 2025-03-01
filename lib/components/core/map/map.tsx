'use client';
import React from 'react';
import { AdvancedMarker, APIProvider, Map as GoogleMap } from '@vis.gl/react-google-maps';
import { twMerge } from 'tailwind-merge';
import { darkMapTheme } from './constant';

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY as string;
if (!API_KEY) {
  console.warn('[WARN]: Missing google api key');
}

interface MapProps {
  className?: string;
}

// TODO: need to create MapId and MapStyles to use with AdvancedMarker
export function Map({ className }: MapProps) {
  return (
    <APIProvider apiKey={API_KEY}>
      <GoogleMap
        mapId="DEMO_MAP_ID"
        className={twMerge('map h-full w-full outline-none', className)}
        defaultCenter={{ lat: 22.54992, lng: 0 }}
        defaultZoom={2}
        minZoom={2}
        disableDefaultUI
        styles={darkMapTheme}
        colorScheme="DARK"
      >
        <AdvancedMarker position={{ lat: 53.54992, lng: 10.00678 }}>
          <div className="size-[12px] bg-primary-400 border rounded-full"></div>
        </AdvancedMarker>
      </GoogleMap>
    </APIProvider>
  );
}
