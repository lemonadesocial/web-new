import { NextResponse } from 'next/server';

import { colors, fonts, patterns, shaders } from '$lib/components/features/theme-builder/store';

export async function GET() {
  return NextResponse.json({
    types: [
      { value: 'minimal', name: 'Minimal', description: 'Clean flat design, accent color only' },
      { value: 'shader', name: 'Gradient', description: 'Animated gradient background' },
      { value: 'pattern', name: 'Pattern', description: 'Repeating geometric background pattern' },
      { value: 'image', name: 'Image', description: 'Custom background image' },
    ],
    modes: [
      { value: 'dark', name: 'Dark' },
      { value: 'light', name: 'Light' },
      { value: 'auto', name: 'Auto (follows system)' },
    ],
    accent_colors: colors.map((c) => ({ value: c, name: c.charAt(0).toUpperCase() + c.slice(1) })),
    shaders: shaders.map((s) => ({ value: s.name, name: s.name.charAt(0).toUpperCase() + s.name.slice(1) })),
    patterns: patterns.map((p) => ({ value: p, name: p.charAt(0).toUpperCase() + p.slice(1) })),
    fonts_title: Object.keys(fonts.title).map((k) => ({ value: k, name: k.charAt(0).toUpperCase() + k.slice(1) })),
    fonts_body: Object.keys(fonts.body).map((k) => ({ value: k, name: k.charAt(0).toUpperCase() + k.slice(1) })),
  });
}
