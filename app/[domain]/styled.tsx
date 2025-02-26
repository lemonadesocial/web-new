'use client';
import React from 'react';
import _JSXStyle from 'styled-jsx/style';

import { generateCssVariables } from '$utils/fetchers';
import { StylesConfig } from '$utils/types';

export function StyleVariables({ theme: { variables, externals } }: { theme: StylesConfig }) {
  return (
    <_JSXStyle>
      {`
        ${externals.map((link: string) => `@import url('${link}');`).join('\n')}
        
        [data-theme='dark'] {
          color-scheme: dark;
          ${generateCssVariables(variables)}
        }       
      `}
    </_JSXStyle>
  );
}
