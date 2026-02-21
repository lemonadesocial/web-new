import React from 'react';
import DOMPurify from 'dompurify';

import { Button, Spacer } from '$lib/components/core';
import { usePassportContext } from '../provider';

export function PassportIntro() {
  const [state] = usePassportContext();

  return (
    <div className="flex-1 h-full flex flex-col md:justify-center gap-4 md:gap-6 md:py-12">
      <div className="flex flex-col gap-4">
        <h1
          className="text-2xl md:text-7xl font-semibold leading-tight"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(state.ui?.intro?.title || '') }}
        ></h1>

        <p className="text-tertiary">{state.ui?.intro?.subtitle}</p>
      </div>

      <Spacer className="md:hidden h-2" />
    </div>
  );
}
