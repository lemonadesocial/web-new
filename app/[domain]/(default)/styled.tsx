'use client';
import React from 'react';
import { StylesConfig } from '$lib/types';
import _JSXStyle from 'styled-jsx/style';

function generate(variables: { [key: string]: string }) {
  return Object.entries(variables)
    .map(([key, value]) => `${key}: ${value};`)
    .join('\n');
}

export function StyleVariables({ theme: { variables, externals } }: { theme: StylesConfig }) {
  return (
    <_JSXStyle>
      {`
        ${externals.map((link) => `@import url('${link}');`).join('\n')}
        
        :root {
          ${generate(variables)}
        }
      `}
    </_JSXStyle>
  );
}
