'use client';
import React from 'react';
import { StylesConfig } from '@/lib/types';
import _JSXStyle from 'styled-jsx/style';

export function StyleVariables({ theme: { externals } }: { theme: StylesConfig }) {
  return (
    <_JSXStyle>
      {`
        ${externals.map((link) => `@import url('${link}')`).join('\n')}
      `}
    </_JSXStyle>
  );
}
