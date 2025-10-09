import React from 'react';

import { Button } from '$lib/components/core';
import { ASSET_PREFIX } from '$lib/utils/constants';

export function PassportIntro() {
  return (
    <div className="max-w-[1200px] mx-auto flex items-center gap-18 h-full">
      <div className="flex flex-col gap-6 flex-1 justify-center">
        <div className="flex flex-col gap-4">
          <h1 className="text-7xl font-semibold leading-tight">
            Join the <br /> United Stands of Lemonade
          </h1>

          <p className="text-tertiary">
            Become part of a new world built for creators and communities. Your free passport unlocks access across the Lemonade universe.
          </p>
        </div>

        <Button variant="tertiary" iconRight="icon-arrow-outward" className="w-fit">
          Learn More
        </Button>
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
