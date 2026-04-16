/**
 * Adapters between:
 *   ThemeValues  — frontend runtime format used by EventThemeProvider / ThemeGenerator
 *   PageTheme    — stored format in PageConfig.theme (lemonade-backend)
 *
 * PageTheme stores *named* values (e.g. accent: "violet", background.value: "ocean")
 * rather than resolved hex codes. The frontend ThemeGenerator derives the actual
 * CSS variables from these names at render time.
 */

import type { ThemeValues } from '$lib/components/features/theme-builder/store';

// Partial mirror of the backend PageTheme type.
// The generated graphql.ts types will be updated once codegen is re-run after
// the backend schema change (fields become optional). Using a local partial type
// here avoids a hard compile-time dependency on the stale generated types.
export type StoredPageTheme = {
  type?: string;
  mode?: string;
  colors?: { accent?: string };
  background?: { type?: string; value?: string; config?: Record<string, unknown> };
  fonts?: { title?: { family?: string }; body?: { family?: string } };
  effects?: { type?: string; value?: string; config?: Record<string, unknown> };
  css_variables?: Record<string, string>;
};

// ─── ThemeValues → StoredPageTheme ───────────────────────────────────────────

export function themeValuesToPageTheme(data: ThemeValues): StoredPageTheme {
  const preset = data.theme === 'default' || !data.theme ? 'minimal' : data.theme;
  const config = data.config ?? {};

  const theme: StoredPageTheme = {
    type: preset,
    mode: config.mode ?? 'dark',
  };

  if (config.color) {
    theme.colors = { accent: config.color };
  }

  // Background: shader or pattern uses config.name; image uses config.image.url
  if (preset === 'shader' && config.name) {
    theme.background = { type: 'shader', value: config.name };
  } else if (preset === 'pattern' && config.name) {
    theme.background = { type: 'pattern', value: config.name };
  } else if (preset === 'image') {
    const img = config.image as { url?: string } | undefined;
    if (img?.url) theme.background = { type: 'image', value: img.url };
  }

  if (data.font_title || data.font_body) {
    theme.fonts = {
      ...(data.font_title ? { title: { family: data.font_title } } : {}),
      ...(data.font_body ? { body: { family: data.font_body } } : {}),
    };
  }

  // Effects
  const effect = config.effect as { name?: string; type?: string; url?: string } | undefined;
  if (effect?.name) {
    theme.effects = {
      type: effect.type ?? 'float',
      value: effect.name,
      ...(effect.url ? { config: { url: effect.url } } : {}),
    };
  }

  return theme;
}

// ─── StoredPageTheme → ThemeValues ───────────────────────────────────────────

export function pageThemeToThemeValues(theme: StoredPageTheme): ThemeValues {
  const preset = (theme.type ?? 'minimal') as ThemeValues['theme'];
  const mode = (theme.mode ?? 'dark') as 'dark' | 'light' | 'auto';

  const config: ThemeValues['config'] = { mode };

  if (theme.colors?.accent) {
    config.color = theme.colors.accent;
  }

  // Shader / pattern name lives in background.value
  if (theme.background?.value) {
    if (theme.type === 'shader' || theme.type === 'pattern') {
      config.name = theme.background.value;
    } else if (theme.type === 'image') {
      config.image = { name: '', _id: '', url: theme.background.value };
    }
  }

  // Effects
  if (theme.effects?.value) {
    config.effect = {
      name: theme.effects.value,
      type: (theme.effects.type ?? 'float') as 'video' | 'float',
      ...(theme.effects.config?.url ? { url: theme.effects.config.url as string } : {}),
    };
  }

  return {
    theme: preset,
    config,
    font_title: theme.fonts?.title?.family ?? 'default',
    font_body: theme.fonts?.body?.family ?? 'default',
    variables: {},
  };
}
