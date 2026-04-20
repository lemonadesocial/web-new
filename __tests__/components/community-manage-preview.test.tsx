import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import React from 'react';

import CommunityManagePreview from '$lib/components/features/community-manage/CommunityManagePreview';
import { Space } from '$lib/graphql/generated/backend/graphql';
import { ThemeValues } from '$lib/components/features/theme-builder/store';

const themeGeneratorSpy = vi.fn();

vi.mock('$lib/components/features/community', () => ({
  Community: () => <div data-testid="community-component" />,
}));

vi.mock('$lib/components/features/theme-builder/generator', () => ({
  ThemeGenerator: (props: any) => {
    themeGeneratorSpy(props);
    return <div data-testid="theme-generator" />;
  },
}));

vi.mock('$lib/components/features/theme-builder/provider', () => ({
  ThemeProvider: ({ children }: any) => <>{children}</>,
}));

const mockSpace = {
  _id: 'space-1',
  title: 'Preview Community',
  slug: 'preview-community',
} as Space;

const mockTheme = {
  theme: 'shader',
  config: {
    mode: 'dark',
    color: 'violet',
    name: 'dreamy',
    class: '',
    effect: {
      name: '',
      url: '',
      emoji: '',
    },
  },
  font_title: 'default',
  font_body: 'default',
  variables: {
    font: {
      '--font-title': 'var(--font-class-display)',
      '--font-body': 'var(--font-general-sans)',
    },
    custom: {},
    dark: {},
    light: {},
    pattern: {},
  },
} satisfies ThemeValues;

describe('CommunityManagePreview', () => {
  afterEach(() => {
    cleanup();
    themeGeneratorSpy.mockClear();
  });

  it('scopes the theme to the preview surface and keeps community content inside the page wrapper', () => {
    const { container } = render(<CommunityManagePreview space={mockSpace} themeData={mockTheme} />);

    const main = container.querySelector('main');
    const pageWrapper = main?.querySelector('.page');

    expect(main).toBeTruthy();
    expect(main?.getAttribute('data-theme-scope')).toBe('community-preview');
    expect(main?.getAttribute('data-theme')).toBe('dark');
    expect(main?.className).toContain('shader');
    expect(main?.className).toContain('dreamy');
    expect(main?.className).toContain('violet');
    expect(main?.className).toContain('dark');
    expect(pageWrapper).toBeTruthy();
    expect(pageWrapper?.contains(screen.getByTestId('community-component'))).toBe(true);
    expect(main?.contains(screen.getByTestId('community-component'))).toBe(true);
    expect(themeGeneratorSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        data: mockTheme,
        scoped: true,
        scopeSelector: "[data-theme-scope='community-preview']",
      }),
    );
  });
});
