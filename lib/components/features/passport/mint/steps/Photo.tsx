import React from 'react';

import { ASSET_PREFIX } from '$lib/utils/constants';
import { LemonheadCard, FluffleCard } from './PhotoCards';

export function PassportPhoto() {
  return (
    <div className="max-w-[1200px] mx-auto flex items-center gap-18 h-full">
      <div className="flex flex-col gap-6 flex-1 justify-center">
        <div className="flex flex-col gap-4">
          <h1 className="text-5xl font-semibold leading-tight">
            Show the world who you are.
          </h1>
          <p className="text-tertiary">
            Select your LemonHead or Fluffle to make your passport uniquely yours.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <LemonheadCard />
          <FluffleCard />
        </div>
      </div>
      <div
        className="flex-1 h-full pt-6 bb-12 flex items-center justify-center"
      >
        <div
          className="bg-contain bg-no-repeat w-full h-full max-h-[596px] rounded-md overflow-hidden bg-primary/8 p-12 box-content flex items-center justify-center"
          style={{ backgroundImage: `url(${ASSET_PREFIX}/assets/images/preview-bg.png)` }}
        >
          <img src={`${ASSET_PREFIX}/assets/images/passport.png`} className="w-full object-cover" />
        </div>
      </div>
    </div>
  );
}

