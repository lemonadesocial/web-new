/**
 * ThemeStyleInjector — converts a ThemeConfig into CSS custom properties.
 *
 * This is a React Server Component (no 'use client'). It renders a <style> tag
 * with :root-level CSS variables that downstream section components consume
 * via `var(--pb-*)` references.
 */

import type { ThemeConfig, ThemeColors, ThemeFont } from './types';

interface ThemeStyleInjectorProps {
  theme: ThemeConfig;
}

/** Build CSS variable declarations from ThemeColors. */
function buildColorVariables(colors: ThemeColors): string {
  const standardKeys: Array<{ key: keyof ThemeColors; variable: string }> = [
    { key: 'accent', variable: '--pb-accent' },
    { key: 'background', variable: '--pb-background' },
    { key: 'card', variable: '--pb-card' },
    { key: 'text_primary', variable: '--pb-text-primary' },
    { key: 'text_secondary', variable: '--pb-text-secondary' },
    { key: 'border', variable: '--pb-border' },
  ];

  const lines: string[] = [];

  for (const { key, variable } of standardKeys) {
    const value = colors[key];
    if (value) {
      const safeVal = String(value).replace(/[;{}]/g, '');
      lines.push(`  ${variable}: ${safeVal};`);
    }
  }

  // Any additional custom colour keys (index signature entries)
  for (const [key, value] of Object.entries(colors)) {
    const isStandard = standardKeys.some((s) => s.key === key);
    if (!isStandard && value) {
      const safeCustomVal = String(value).replace(/[;{}]/g, '');
      lines.push(`  --pb-${key.replace(/_/g, '-')}: ${safeCustomVal};`);
    }
  }

  return lines.join('\n');
}

/** Build CSS variable declarations from a ThemeFont. */
function buildFontVariables(
  font: ThemeFont,
  prefix: 'title' | 'body',
): string {
  const lines: string[] = [];

  if (font.family) {
    lines.push(`  --pb-font-${prefix}: ${String(font.family).replace(/[;{}]/g, '')};`);
  }

  if (font.weight !== undefined) {
    lines.push(`  --pb-font-${prefix}-weight: ${font.weight};`);
  }

  if (font.size_scale !== undefined) {
    lines.push(`  --pb-font-${prefix}-scale: ${font.size_scale};`);
  }

  return lines.join('\n');
}

/** Build background CSS from ThemeBackground. */
function buildBackgroundCSS(
  theme: ThemeConfig,
): string {
  const lines: string[] = [];

  if (!theme.background) return '';

  const { type, value } = theme.background;

  switch (type) {
    case 'color':
      lines.push(`  --pb-bg-type: color;`);
      lines.push(`  --pb-bg-value: ${String(value).replace(/[;{}]/g, '')};`);
      break;
    case 'image':
      lines.push(`  --pb-bg-type: image;`);
      lines.push(`  --pb-bg-value: url(${value});`);
      break;
    case 'shader':
      lines.push(`  --pb-bg-type: shader;`);
      lines.push(`  --pb-bg-value: ${String(value).replace(/[;{}]/g, '')};`);
      break;
    case 'pattern':
      lines.push(`  --pb-bg-type: pattern;`);
      lines.push(`  --pb-bg-value: ${String(value).replace(/[;{}]/g, '')};`);
      break;
    case 'video':
      // Video backgrounds are handled by a separate element, not CSS.
      // Store the URL as a variable so JS can pick it up if needed.
      lines.push(`  --pb-bg-type: video;`);
      lines.push(`  --pb-bg-value: ${String(value).replace(/[;{}]/g, '')};`);
      break;
  }

  return lines.join('\n');
}

/** Build pass-through CSS variable declarations from css_variables map. */
function buildCustomVariables(
  cssVariables: Record<string, string>,
): string {
  return Object.entries(cssVariables)
    .map(([key, value]) => {
      // Ensure keys are prefixed with '--' for valid CSS custom properties
      const varName = key.startsWith('--') ? key : `--${key}`;
      // Strip characters that could break out of a CSS declaration
      const safeValue = String(value).replace(/[;{}]/g, '');
      return `  ${varName}: ${safeValue};`;
    })
    .join('\n');
}

/** Build @import rules for Google Fonts when font URLs are provided. */
function buildFontImports(theme: ThemeConfig): string {
  const urls: string[] = [];

  if (theme.fonts.title.url) {
    urls.push(theme.fonts.title.url);
  }
  if (theme.fonts.body.url && theme.fonts.body.url !== theme.fonts.title.url) {
    urls.push(theme.fonts.body.url);
  }

  if (urls.length === 0) return '';

  return urls
    .filter((url) => {
      try {
        const parsed = new URL(url);
        return parsed.protocol === 'https:' || parsed.protocol === 'http:';
      } catch {
        return false;
      }
    })
    .map((url) => {
      // Escape single quotes and closing parens to prevent CSS injection
      const safeUrl = url.replace(/'/g, '%27').replace(/\)/g, '%29');
      return `@import url('${safeUrl}');`;
    })
    .join('\n');
}

export function ThemeStyleInjector({ theme }: ThemeStyleInjectorProps) {
  const sections: string[] = [];

  // Font imports (must come before :root block)
  const fontImports = buildFontImports(theme);

  // Color variables
  const colorCSS = buildColorVariables(theme.colors);
  if (colorCSS) sections.push(colorCSS);

  // Font variables
  const titleFontCSS = buildFontVariables(theme.fonts.title, 'title');
  if (titleFontCSS) sections.push(titleFontCSS);

  const bodyFontCSS = buildFontVariables(theme.fonts.body, 'body');
  if (bodyFontCSS) sections.push(bodyFontCSS);

  // Theme mode
  sections.push(`  --pb-mode: ${theme.mode};`);

  // Background
  const bgCSS = buildBackgroundCSS(theme);
  if (bgCSS) sections.push(bgCSS);

  // Custom CSS variables (pass-through)
  if (theme.css_variables && Object.keys(theme.css_variables).length > 0) {
    const customCSS = buildCustomVariables(theme.css_variables);
    if (customCSS) sections.push(customCSS);
  }

  const rootBlock = `:root {\n${sections.join('\n')}\n}`;
  const fullCSS = fontImports
    ? `${fontImports}\n\n${rootBlock}`
    : rootBlock;

  return (
    <style
      dangerouslySetInnerHTML={{ __html: fullCSS }}
      data-page-builder-theme=""
    />
  );
}
