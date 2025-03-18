'use client';

import React, { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { StyleRegistry, createStyleRegistry } from 'styled-jsx';
import { useAtom } from 'jotai';
import { dataTheme } from '$lib/jotai';

export default function StyledComponentsRegistry({ children }: { children: React.ReactNode }) {
  const [theme] = useAtom(dataTheme);

  const [jsxStyleRegistry] = useState(() => createStyleRegistry());

  useServerInsertedHTML(() => {
    const styles = jsxStyleRegistry.styles();
    jsxStyleRegistry.flush();
    return <>{styles}</>;
  });

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      document.documentElement.setAttribute('data-theme', 'light');
      if (e.matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    });
  }, [theme]);

  if (typeof window !== 'undefined') return <>{children}</>;

  return <StyleRegistry registry={jsxStyleRegistry}>{children}</StyleRegistry>;
}
