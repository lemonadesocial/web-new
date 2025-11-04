import React from 'react';

import { Button, Spacer } from '$lib/components/core';

export function PassportIntro() {
  return (
    <div className="flex-1 h-full flex flex-col md:justify-center gap-4 md:gap-6 md:py-12">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl md:text-7xl font-semibold leading-tight">
          Join the <br /> United Stands of Lemonade
        </h1>

        <p className="text-tertiary">
          Become part of a new world built for creators and communities. Your free passport unlocks access across the
          Lemonade universe.
        </p>
      </div>

      <Spacer className="md:hidden h-2" />
    </div>
  );
}
