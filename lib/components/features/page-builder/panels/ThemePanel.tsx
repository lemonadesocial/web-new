'use client';

import React from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import clsx from 'clsx';

import { Button, ColorPicker } from '$lib/components/core';
import { InputField } from '$lib/components/core/input/input-field';
import { Dropdown, type Option } from '$lib/components/core/input/dropdown';
import { Segment } from '$lib/components/core/segment/segment';
import { Pane } from '$lib/components/core/pane/pane';
import { drawer } from '$lib/components/core/dialog';

import { pageConfigAtom, isDirtyAtom } from '../store';
import type { ThemeConfig, ThemeMode, ThemeType, ThemeColors } from '../types';
import {
  fonts,
  colors as themeColorNames,
  shaders,
  patterns,
  presets,
  modes,
} from '$lib/components/features/theme-builder/store';

// ---------------------------------------------------------------------------
// Color palette: map color names from theme-builder to hex values
// ---------------------------------------------------------------------------

const COLOR_MAP: Record<string, string> = {
  violet: '#8b5cf6',
  red: '#ef4444',
  orange: '#f97316',
  amber: '#f59e0b',
  yellow: '#eab308',
  lime: '#84cc16',
  green: '#22c55e',
  emerald: '#10b981',
  teal: '#14b8a6',
  cyan: '#06b6d4',
  sky: '#0ea5e9',
  blue: '#3b82f6',
  indigo: '#6366f1',
  purple: '#a855f6',
  fuchsia: '#d946ef',
  pink: '#ec4899',
  rose: '#f43f5e',
};

// ---------------------------------------------------------------------------
// Theme type presets for the grid
// ---------------------------------------------------------------------------

const THEME_TYPE_OPTIONS: { value: ThemeType; label: string; presetKey: keyof typeof presets }[] = [
  { value: 'minimal', label: 'Minimal', presetKey: 'minimal' },
  { value: 'shader', label: 'Gradient', presetKey: 'shader' },
  { value: 'pattern', label: 'Pattern', presetKey: 'pattern' },
  { value: 'image', label: 'Image', presetKey: 'image' },
];

// ---------------------------------------------------------------------------
// Font weight options
// ---------------------------------------------------------------------------

const WEIGHT_OPTIONS = [400, 500, 600, 700, 800] as const;

// ---------------------------------------------------------------------------
// Custom color fields
// ---------------------------------------------------------------------------

const CUSTOM_COLOR_FIELDS: { key: keyof ThemeColors; label: string }[] = [
  { key: 'background', label: 'Background' },
  { key: 'card', label: 'Card' },
  { key: 'text_primary', label: 'Text Primary' },
  { key: 'text_secondary', label: 'Text Secondary' },
  { key: 'border', label: 'Border' },
  { key: 'accent', label: 'Accent' },
];

// ---------------------------------------------------------------------------
// Font option builders
// ---------------------------------------------------------------------------

function buildFontOptions(fontMap: Record<string, string>): Option[] {
  return Object.keys(fontMap).map((key) => ({
    key,
    value: key === 'default' ? 'Default' : key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
  }));
}

const TITLE_FONT_OPTIONS = buildFontOptions(fonts.title);
const BODY_FONT_OPTIONS = buildFontOptions(fonts.body);

// ---------------------------------------------------------------------------
// ThemePanel
// ---------------------------------------------------------------------------

export function ThemePanel() {
  const config = useAtomValue(pageConfigAtom);
  const setPageConfig = useSetAtom(pageConfigAtom);
  const setIsDirty = useSetAtom(isDirtyAtom);

  const theme = config?.theme;

  // -- Updater helper --

  const updateTheme = React.useCallback(
    (updates: Partial<ThemeConfig>) => {
      setPageConfig((prev) =>
        prev ? { ...prev, theme: { ...prev.theme, ...updates } } : prev,
      );
      setIsDirty(true);
    },
    [setPageConfig, setIsDirty],
  );

  const updateColors = React.useCallback(
    (colorUpdates: Partial<ThemeColors>) => {
      setPageConfig((prev) =>
        prev
          ? {
              ...prev,
              theme: {
                ...prev.theme,
                colors: { ...prev.theme.colors, ...colorUpdates },
              },
            }
          : prev,
      );
      setIsDirty(true);
    },
    [setPageConfig, setIsDirty],
  );

  if (!theme) {
    return (
      <Pane.Root className="rounded-none">
        <PanelHeader />
        <Pane.Content className="p-6">
          <div className="text-center py-8">
            <p className="text-sm text-tertiary">No page config loaded.</p>
          </div>
        </Pane.Content>
      </Pane.Root>
    );
  }

  return (
    <Pane.Root className="rounded-none">
      <PanelHeader />
      <Pane.Content className="p-4 space-y-6 overflow-auto">
        {/* ---- Theme Type ---- */}
        <ThemeTypeSection type={theme.type} onChange={(type) => updateTheme({ type })} />

        {/* ---- Mode Toggle ---- */}
        <ModeSection mode={theme.mode} onChange={(mode) => updateTheme({ mode })} />

        {/* ---- Accent Color ---- */}
        <AccentColorSection
          accent={theme.colors.accent}
          onChange={(accent) => updateColors({ accent })}
        />

        {/* ---- Custom Colors ---- */}
        <CustomColorsSection colors={theme.colors} onChange={updateColors} />

        {/* ---- Fonts ---- */}
        <FontsSection theme={theme} updateTheme={updateTheme} />

        {/* ---- Background (conditional) ---- */}
        {(theme.type === 'shader' || theme.type === 'pattern' || theme.type === 'image') && (
          <BackgroundSection theme={theme} updateTheme={updateTheme} />
        )}

        {/* ---- Effects ---- */}
        <EffectsSection theme={theme} updateTheme={updateTheme} />
      </Pane.Content>
    </Pane.Root>
  );
}

// ---------------------------------------------------------------------------
// Header
// ---------------------------------------------------------------------------

function PanelHeader() {
  return (
    <Pane.Header.Root>
      <Pane.Header.Left showBackButton={false}>
        <span className="text-sm font-semibold text-primary">Theme</span>
      </Pane.Header.Left>
      <Pane.Header.Right>
        <Button icon="icon-x" variant="flat" size="xs" onClick={() => drawer.close()} />
      </Pane.Header.Right>
    </Pane.Header.Root>
  );
}

// ---------------------------------------------------------------------------
// Theme Type Section
// ---------------------------------------------------------------------------

function ThemeTypeSection({
  type,
  onChange,
}: {
  type: ThemeType;
  onChange: (type: ThemeType) => void;
}) {
  return (
    <section className="space-y-2">
      <label className="text-xs font-medium text-secondary">Theme Type</label>
      <div className="grid grid-cols-4 gap-2">
        {THEME_TYPE_OPTIONS.map((opt) => {
          const preset = presets[opt.presetKey];
          const isActive = type === opt.value;
          return (
            <button
              key={opt.value}
              className={clsx(
                'flex flex-col items-center gap-1.5 p-2 rounded-sm border transition cursor-pointer',
                isActive
                  ? 'border-accent-500 ring-1 ring-accent-500 bg-primary/8'
                  : 'border-transparent hover:bg-primary/4',
              )}
              onClick={() => onChange(opt.value)}
            >
              <div className="w-full aspect-[4/3] rounded-xs overflow-hidden bg-primary/8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preset.image}
                  alt={opt.label}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs font-medium text-primary">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Mode Section
// ---------------------------------------------------------------------------

function ModeSection({
  mode,
  onChange,
}: {
  mode: ThemeMode;
  onChange: (mode: ThemeMode) => void;
}) {
  const segmentItems = modes.map((m) => ({
    value: m.mode as ThemeMode,
    iconLeft: m.icon,
    label: m.label,
  }));

  return (
    <section className="space-y-2">
      <label className="text-xs font-medium text-secondary">Mode</label>
      <Segment
        items={segmentItems}
        selected={mode}
        onSelect={(item) => onChange(item.value)}
        className="w-full"
        size="sm"
      />
    </section>
  );
}

// ---------------------------------------------------------------------------
// Accent Color Section
// ---------------------------------------------------------------------------

function AccentColorSection({
  accent,
  onChange,
}: {
  accent: string;
  onChange: (hex: string) => void;
}) {
  // Find active color name by comparing hex values
  const activeColorName = React.useMemo(() => {
    const lowerAccent = accent?.toLowerCase();
    return (
      themeColorNames.find((name) => COLOR_MAP[name]?.toLowerCase() === lowerAccent) ?? null
    );
  }, [accent]);

  return (
    <section className="space-y-2">
      <label className="text-xs font-medium text-secondary">Accent Color</label>
      <div className="flex flex-wrap gap-1.5">
        {themeColorNames.map((name) => {
          const hex = COLOR_MAP[name];
          const isActive = activeColorName === name;
          return (
            <button
              key={name}
              className={clsx(
                'relative size-7 rounded-full border-2 transition cursor-pointer flex items-center justify-center',
                isActive ? 'border-white' : 'border-transparent hover:border-white/40',
              )}
              style={{ backgroundColor: hex }}
              onClick={() => onChange(hex)}
              title={name}
            >
              {isActive && <i className="icon-richtext-check size-3.5 text-white" />}
            </button>
          );
        })}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Custom Colors Section
// ---------------------------------------------------------------------------

function CustomColorsSection({
  colors,
  onChange,
}: {
  colors: ThemeColors;
  onChange: (updates: Partial<ThemeColors>) => void;
}) {
  return (
    <section className="space-y-2">
      <label className="text-xs font-medium text-secondary">Custom Colors</label>
      <div className="space-y-2">
        {CUSTOM_COLOR_FIELDS.map((field) => (
          <div key={field.key} className="flex items-center gap-2">
            <ColorPicker.Root>
              <ColorPicker.Trigger>
                <div
                  className="size-7 rounded-sm border border-card-border cursor-pointer shrink-0"
                  style={{ backgroundColor: colors[field.key] || '#000' }}
                />
              </ColorPicker.Trigger>
              <ColorPicker.Content
                color={colors[field.key] || '#000000'}
                onChange={(result) => onChange({ [field.key]: result.hex })}
              />
            </ColorPicker.Root>
            <div className="flex-1 min-w-0">
              <InputField
                placeholder={`#000000`}
                value={colors[field.key] || ''}
                onChangeText={(val) => onChange({ [field.key]: val })}
                className="text-xs"
              />
            </div>
            <span className="text-xs text-tertiary w-20 shrink-0 truncate">{field.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Fonts Section
// ---------------------------------------------------------------------------

function FontsSection({
  theme,
  updateTheme,
}: {
  theme: ThemeConfig;
  updateTheme: (updates: Partial<ThemeConfig>) => void;
}) {
  const currentTitleFont = theme.fonts.title.family || 'default';
  const currentBodyFont = theme.fonts.body.family || 'default';
  const currentWeight = theme.fonts.title.weight ?? 700;

  const handleTitleFontChange = (opt: Option) => {
    updateTheme({
      fonts: {
        ...theme.fonts,
        title: { ...theme.fonts.title, family: opt.key as string },
      },
    });
  };

  const handleBodyFontChange = (opt: Option) => {
    updateTheme({
      fonts: {
        ...theme.fonts,
        body: { ...theme.fonts.body, family: opt.key as string },
      },
    });
  };

  const handleWeightChange = (weight: number) => {
    updateTheme({
      fonts: {
        ...theme.fonts,
        title: { ...theme.fonts.title, weight },
      },
    });
  };

  return (
    <section className="space-y-3">
      <label className="text-xs font-medium text-secondary">Fonts</label>

      {/* Title Font */}
      <Dropdown
        label="Title Font"
        placeholder="Select font..."
        options={TITLE_FONT_OPTIONS}
        value={TITLE_FONT_OPTIONS.find((o) => o.key === currentTitleFont)}
        onSelect={handleTitleFontChange}
      />

      {/* Body Font */}
      <Dropdown
        label="Body Font"
        placeholder="Select font..."
        options={BODY_FONT_OPTIONS}
        value={BODY_FONT_OPTIONS.find((o) => o.key === currentBodyFont)}
        onSelect={handleBodyFontChange}
      />

      {/* Title Weight */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-tertiary">Title Weight</label>
        <div className="flex gap-1">
          {WEIGHT_OPTIONS.map((w) => (
            <button
              key={w}
              className={clsx(
                'flex-1 px-1.5 py-1.5 rounded-sm text-xs font-medium transition cursor-pointer',
                currentWeight === w
                  ? 'bg-primary/12 text-primary'
                  : 'text-tertiary hover:bg-primary/4',
              )}
              onClick={() => handleWeightChange(w)}
            >
              {w}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Background Section (conditional on theme type)
// ---------------------------------------------------------------------------

function BackgroundSection({
  theme,
  updateTheme,
}: {
  theme: ThemeConfig;
  updateTheme: (updates: Partial<ThemeConfig>) => void;
}) {
  return (
    <section className="space-y-2">
      <label className="text-xs font-medium text-secondary">Background</label>

      {theme.type === 'shader' && (
        <div className="grid grid-cols-4 gap-2">
          {shaders.map((shader) => {
            const isActive = theme.background?.value === shader.name;
            const shaderHex = COLOR_MAP[shader.accent] || '#8b5cf6';
            return (
              <button
                key={shader.name}
                className={clsx(
                  'flex flex-col items-center gap-1 p-2 rounded-sm border transition cursor-pointer',
                  isActive
                    ? 'border-accent-500 ring-1 ring-accent-500 bg-primary/8'
                    : 'border-transparent hover:bg-primary/4',
                )}
                onClick={() =>
                  updateTheme({
                    background: { type: 'shader', value: shader.name },
                  })
                }
              >
                <div
                  className="w-full aspect-square rounded-xs"
                  style={{
                    background: `linear-gradient(135deg, ${shaderHex}, ${shaderHex}40)`,
                  }}
                />
                <span className="text-xs text-primary capitalize">{shader.name}</span>
              </button>
            );
          })}
        </div>
      )}

      {theme.type === 'pattern' && (
        <div className="grid grid-cols-3 gap-2">
          {patterns.map((pattern) => {
            const isActive = theme.background?.value === pattern;
            return (
              <button
                key={pattern}
                className={clsx(
                  'flex flex-col items-center gap-1 p-2 rounded-sm border transition cursor-pointer',
                  isActive
                    ? 'border-accent-500 ring-1 ring-accent-500 bg-primary/8'
                    : 'border-transparent hover:bg-primary/4',
                )}
                onClick={() =>
                  updateTheme({
                    background: { type: 'pattern', value: pattern },
                  })
                }
              >
                <div className="w-full aspect-square rounded-xs bg-primary/8 flex items-center justify-center">
                  <i className="icon-pattern size-6 text-tertiary" />
                </div>
                <span className="text-xs text-primary capitalize">{pattern}</span>
              </button>
            );
          })}
        </div>
      )}

      {theme.type === 'image' && (
        <div className="space-y-2">
          <InputField
            label="Image URL"
            placeholder="https://example.com/image.jpg"
            value={theme.background?.value || ''}
            onChangeText={(val) =>
              updateTheme({
                background: { type: 'image', value: val },
              })
            }
          />
          {theme.background?.value && (
            <div className="w-full aspect-video rounded-sm overflow-hidden bg-primary/8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={theme.background.value}
                alt="Background preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Effects Section
// ---------------------------------------------------------------------------

function EffectsSection({
  theme,
  updateTheme,
}: {
  theme: ThemeConfig;
  updateTheme: (updates: Partial<ThemeConfig>) => void;
}) {
  const currentEffect = theme.effects?.type || 'none';
  const effectTypes: { value: 'video' | 'float' | 'particles' | 'none'; label: string }[] = [
    { value: 'none', label: 'None' },
    { value: 'float', label: 'Float' },
    { value: 'particles', label: 'Particles' },
    { value: 'video', label: 'Video' },
  ];

  return (
    <section className="space-y-2">
      <label className="text-xs font-medium text-secondary">Effects</label>
      <div className="flex gap-1">
        {effectTypes.map((eff) => (
          <button
            key={eff.value}
            className={clsx(
              'flex-1 px-2 py-1.5 rounded-sm text-xs font-medium transition cursor-pointer',
              currentEffect === eff.value
                ? 'bg-primary/12 text-primary'
                : 'text-tertiary hover:bg-primary/4',
            )}
            onClick={() =>
              updateTheme({
                effects: { type: eff.value },
              })
            }
          >
            {eff.label}
          </button>
        ))}
      </div>

      {currentEffect === 'video' && (
        <InputField
          label="Video URL"
          placeholder="https://example.com/video.mp4"
          value={theme.effects?.value || ''}
          onChangeText={(val) =>
            updateTheme({
              effects: { type: 'video', value: val },
            })
          }
        />
      )}
    </section>
  );
}
