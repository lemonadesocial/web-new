'use client';
import React from 'react';
import { TopVolume } from './TopVolume';
import { TopMarket } from './TopMarket';
import { TopTrades } from './TopTrades';

export function TopPerformers() {
  return (
    <div className="flex flex-col gap-5 relative">
      <p className="text-xl font-semibold">Top Performers</p>
      <div className="flex flex-col md:flex-row gap-4">
        <TopVolume />
        <TopMarket />
        <TopTrades />
      </div>
    </div>
  );
}
