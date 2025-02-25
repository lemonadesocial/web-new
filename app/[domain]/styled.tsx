'use client';
import React from 'react';
import { StylesConfig } from '$utils/types';
import _JSXStyle from 'styled-jsx/style';

function generate(variables: { [key: string]: string }) {
  return Object.entries(variables)
    .map(([key, value]) => `${key}: ${value};`)
    .join('\n');
}

export function StyleVariables({ theme: { variables, externals } }: { theme: StylesConfig }) {
  // console.log(generate());
  console.log(variables);
  return (
    <_JSXStyle>
      {`
        ${externals.map((link: string) => `@import url('${link}');`).join('\n')}
        
        [data-theme='dark'] {
          color-scheme: dark;
          ${generate(variables)}
        }       
      `}
    </_JSXStyle>
  );
}
