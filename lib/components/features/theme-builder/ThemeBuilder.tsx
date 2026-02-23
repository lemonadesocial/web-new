
'use client';
import React from 'react';
import clsx from 'clsx';

import { Card, Menu, MenuItem } from '$lib/components/core';

import {
  colors, emojis, getRandomColor, getThemeName, modes, patterns,
  presets,
  shaders,
} from './store';
import { ThemeBuilderActionKind, useTheme } from './provider';
import { twMerge } from 'tailwind-merge';
import { MenuColorPicker } from './ColorPicker';
import { join, split } from 'lodash';
import {
  FileCategory,
  GetSystemFilesDocument, SystemFile
} from '$lib/graphql/generated/backend/graphql';
import { useQuery } from '$lib/graphql/request';
import { FloatingPortal } from '@floating-ui/react';
import { generateUrl } from '$lib/utils/cnd';


export function ThemeTemplate({ className }: { className?: string }) {
  const [state, dispatch] = useTheme();

  return (
    <div className={twMerge("flex flex-1 gap-3 overflow-x no-scrollbar justify-center", className)}>
      {Object.entries(presets).map(([key, value]) => (
        <div key={key} className="flex flex-col gap-2 items-center">
          <Card.Root
            key={key}
            className={clsx(
              'p-0 bg-transparent border-transparent transition-all hover:outline-2 hover:outline-offset-2 hover:outline-primary/16 rounded-sm',
              state.theme === key && 'outline-2 outline-offset-2 outline-primary!',
            )}
            onClick={(e) => {
              e.stopPropagation();
              let color = state.config.color;
              if (!color) color = getRandomColor();
              dispatch({
                type: ThemeBuilderActionKind.select_template,
                payload: { theme: key as any, config: { color } },
              });
            }}
          >
            <img src={value.image} className="rounded-sm" width={80} height={56} alt={key} />
          </Card.Root>

          <p className="capitalize font-medium text-xs">{value.name}</p>
        </div>
      ))}
    </div>
  );
}

export function PopoverColor({ disabled }: { disabled?: boolean }) {
  const [state, dispatch] = useTheme();

  return (
    <Menu.Root placement="top" disabled={disabled} strategy="fixed" className="flex-1 min-w-full md:min-w-auto">
      <Menu.Trigger>
        <div className="w-full bg-primary/8 text-tertiary px-2.5 py-2 rounded-sm flex items-center gap-2">
          <i
            className={clsx(
              'size-[24px] rounded-full',
              state.config.color === 'custom' ? 'bg-[var(--color-custom-400)]' : `${state.config.color} bg-accent-400`,
            )}
          />

          <span className="text-left flex-1  font-general-sans">Accent</span>
          <p className="flex items-center gap-1">
            <span className="capitalize">{state.config.color}</span>
            <i className="icon-chevrons-up-down text-quaternary" />
          </p>
        </div>
      </Menu.Trigger>
      <FloatingPortal>
        <Menu.Content>
          <div className="grid grid-cols-9 gap-2.5">
            {colors.map((color) => (
              <div
                key={color}
                onClick={() => {
                  dispatch({
                    type: ThemeBuilderActionKind.select_color,
                    payload: { config: { color } },
                  });
                }}
                className={twMerge(
                  'size-5 cursor-pointer hover:outline-2 outline-offset-2 rounded-full',
                  `${color} item-color-fg`,
                  clsx(color === state.config.color && 'outline-2'),
                )}
              />
            ))}
            <MenuColorPicker color={state.config.color} dispatch={dispatch} />
          </div>
        </Menu.Content>
      </FloatingPortal>
    </Menu.Root>
  );
}

export function PopoverStyle() {
  const [state] = useTheme();
  if (state.theme === 'shader') return <PopoverShaderColor />;
  if (state.theme === 'pattern') return <PopoverPattern />;
  if (state.theme === 'image') return <PopoverImage />;

  return (
    <Menu.Root disabled className="flex-1 min-w-full md:min-w-auto">
      <Menu.Trigger>
        <div className="w-full bg-primary/8 text-tertiary px-2.5 py-2 rounded-sm flex items-center gap-2">
          <div className="size-[24px] rounded-full bg-quaternary" />
          <span className="text-left flex-1 font-general-sans">Style</span>
          <p className="flex items-center gap-1">
            <span className="capitalize">-</span>
            <i className="icon-chevrons-up-down text-quaternary" />
          </p>
        </div>
      </Menu.Trigger>
    </Menu.Root>
  );
}


export function PopoverEffect() {
  const [state, dispatch] = useTheme();

  return (
    <Menu.Root className="flex-1 min-w-full md:min-w-auto" strategy="fixed" placement="top">
      <Menu.Trigger>
        <div className="w-full bg-primary/8 text-tertiary px-2.5 py-2 rounded-sm flex items-center gap-2">
          {!state.config?.effect?.name ? (
            <i className="icon-wand-shine-outline-sharp size-[24px] text-primary" />
          ) : (
            <div className="size-[24px] text-center">{emojis[state.config?.effect.name]?.emoji}</div>
          )}
          <span className="text-left flex-1 font-general-sans">Effect</span>
          <p className="flex items-center gap-1">
            <span className="capitalize">{!state.config?.effect?.name ? '-' : state.config?.effect?.name}</span>
            <i className="icon-chevrons-up-down text-quaternary" />
          </p>
        </div>
      </Menu.Trigger>
      <FloatingPortal>
        <Menu.Content>
          <div className="grid grid-cols-4 items-center gap-3 w-[324px] max-h-[250px] md:max-h-[550px] p-4 overflow-auto no-scrollbar">
            {Object.entries(emojis).map(([key, value]) => (
              <button key={key} className="flex flex-col items-center text-xs gap-2 cursor-pointer">
                <div
                  className={clsx(
                    'border-2 border-[var(--color-divider)] rounded-full px-4 py-2 w-[60px] h-[60px] hover:border-primary flex items-center justify-between',
                    key === state.config?.effect?.name && 'border border-primary',
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    let effect: any = { name: key, type: value.type, url: value.url, emoji: value.emoji };
                    if (state.config.effect?.name && key === state.config?.effect?.name) {
                      // toggle effect to remove effect
                      effect = { name: '', type: undefined, url: '', emoji: '' };
                    }

                    dispatch({
                      type: ThemeBuilderActionKind.select_effect,
                      payload: {
                        config: { effect },
                      },
                    });
                  }}
                >
                  <span className="text-xl">{value.emoji}</span>
                </div>
                <p className="capitalize font-body-default">{value.label}</p>
              </button>
            ))}
          </div>
        </Menu.Content>
      </FloatingPortal>
    </Menu.Root>
  );
}

export function PopoverFont({
  selected = 'default',
  fonts,
  label,
  onClick,
}: {
  label: string;
  selected?: string;
  fonts: Record<string, string>;
  onClick: (font: string) => void;
}) {
  return (
    <Menu.Root placement="top" strategy="fixed" className="flex-1 min-w-full md:min-w-auto">
      <Menu.Trigger>
        <div className="w-full bg-primary/8 text-tertiary px-2.5 py-2 rounded-sm flex items-center gap-2">
          <h3 style={{ fontFamily: fonts[selected] }} className="font-semibold">
            Ag
          </h3>
          <span className={clsx('flex-1 capitalize')}>{label}</span>
          <p className="flex items-center gap-1 font-general-sans">
            <span className="capitalize">
              {Object.keys(fonts)
                .find((key) => key === selected)
                ?.replaceAll('_', ' ')}
            </span>
            <i className="icon-chevrons-up-down text-quaternary" />
          </p>
        </div>
      </Menu.Trigger>
      <FloatingPortal>
        <Menu.Content className="max-h-80 w-[370px] overflow-scroll no-scrollbar">
          <div className="flex gap-4 flex-wrap">
            {Object.entries(fonts).map(([key, font]) => (
              <div
                key={key}
                className="flex flex-col items-center text-xs gap-2 cursor-pointer"
                onClick={() => onClick(key)}
              >
                <div
                  className={clsx(
                    'border rounded px-4 py-2 w-[72px] h-[56px]',
                    key === selected.toLowerCase().replaceAll(' ', '_') && 'border border-primary',
                  )}
                >
                  <h3 style={{ fontFamily: font }} className="size-10 text-xl text-center">
                    Ag
                  </h3>
                </div>
                <p className="capitalize font-general-sans">{join(split(key, '_'), ' ')}</p>
              </div>
            ))}
          </div>
        </Menu.Content>
      </FloatingPortal>
    </Menu.Root>
  );
}

function PopoverShaderColor() {
  const [state, dispatch] = useTheme();

  return (
    <Menu.Root placement="top" strategy="fixed" className="flex-1 min-w-full md:min-w-auto">
      <Menu.Trigger>
        <div className="w-full bg-primary/8 text-tertiary px-2.5 py-2 rounded-sm flex items-center gap-2">
          <div className={twMerge('size-[24px] rounded-full', `item-color-${state.config.name}`)} />

          <span className="text-left flex-1  font-general-sans">Style</span>
          <p className="flex items-center gap-1">
            <span className="capitalize">{state.config.name}</span>
            <i className="icon-chevrons-up-down text-quaternary" />
          </p>
        </div>
      </Menu.Trigger>
      <FloatingPortal>
        <Menu.Content>
          <div className="grid grid-cols-4 gap-3">
            {shaders.map((s) => (
              <div
                key={s.name}
                onClick={() => {
                  dispatch({
                    type: ThemeBuilderActionKind.select_style,
                    payload: { config: { name: s.name, color: s.accent } },
                  });
                }}
                className={twMerge(
                  'size-16 cursor-pointer hover:outline-2 outline-offset-2 rounded-full',
                  `item-color-${s.name}`,
                  clsx(s.name === state.config.name && 'outline-2'),
                )}
              />
            ))}
          </div>
        </Menu.Content>
      </FloatingPortal>
    </Menu.Root>
  );
}

function PopoverPattern() {
  const [state, dispatch] = useTheme();

  return (
    <Menu.Root placement="top" strategy="fixed" className="flex-1 min-w-full md:min-w-auto">
      <Menu.Trigger>
        <div className="w-full bg-primary/8 text-tertiary px-2.5 py-2 rounded-sm flex items-center gap-2">
          <div className="w-[24px] h-[24px] rounded-full">
            <div
              className={twMerge(
                'pattern w-full h-full rounded-full relative! opacity-100!',
                state.config.color,
                state.config.name,
              )}
            />
          </div>

          <span className="text-left flex-1  font-general-sans">Style</span>
          <p className="flex items-center gap-1">
            <span className="capitalize">{state.config.name}</span>
            <i className="icon-chevrons-up-down text-quaternary" />
          </p>
        </div>
      </Menu.Trigger>
      <FloatingPortal>
        <Menu.Content className="flex gap-3 max-w-[356px] flex-wrap">
          {patterns.map((item) => (
            <button
              key={item}
              className={clsx('capitalize flex flex-col items-center cursor-pointer gap-2', state.config.color)}
              onClick={(e) => {
                e.stopPropagation();
                dispatch({
                  type: ThemeBuilderActionKind.select_style,
                  payload: { config: { name: item } },
                });
              }}
            >
              <div
                className={clsx(
                  'w-16! h-16! rounded-full p-1 border-2 border-transparent mb-1 overflow-hidden',
                  state.config.name === item && 'border-white',
                )}
              >
                <div
                  className={twMerge('pattern rounded-full item-pattern relative! w-full h-full opacity-100!', item)}
                />
              </div>
              <p className="text-xs">{item}</p>
            </button>
          ))}
        </Menu.Content>
      </FloatingPortal>
    </Menu.Root>
  );
}


function PopoverImage() {
  const [state, dispatch] = useTheme();

  const { data } = useQuery(GetSystemFilesDocument, {
    variables: { categories: [FileCategory.SpaceDarkTheme, FileCategory.SpaceLightTheme] },
  });
  const images = (data?.getSystemFiles || []) as SystemFile[];

  React.useEffect(() => {
    if (images.length && !state.config.image?._id) {
      const randomIndex = Math.floor(Math.random() * images.length);
      const selected = images[randomIndex];
      dispatch({
        type: ThemeBuilderActionKind.select_image,
        payload: {
          config: {
            image: { _id: selected._id, url: selected.url, name: selected.name },
          },
        },
      });
    }
  }, [images.length, state.config.image?._id]);

  return (
    <Menu.Root placement="top" strategy="fixed" className="flex-1">
      <Menu.Trigger>
        <div className="w-full bg-primary/8 text-tertiary px-2.5 py-2 rounded-sm flex items-center gap-2">
          <img src={state.config?.image?.url} className="size-[24px] aspect-square rounded" />
          <span className="text-left flex-1  font-general-sans">Background</span>
          <p className="flex items-center gap-1">
            <span className="capitalize">{state.config?.image?.name || '-'}</span>
            <i className="icon-chevrons-up-down text-quaternary" />
          </p>
        </div>
      </Menu.Trigger>
      <Menu.Content className="grid grid-cols-4 gap-3">
        {images.map((item) => (
          <div
            key={item._id}
            className={clsx('flex flex-col items-center gap-1 cursor-pointer')}
            onClick={() => {
              dispatch({
                type: ThemeBuilderActionKind.select_image,
                payload: {
                  config: {
                    mode: item.category.includes('dark') ? 'dark' : 'light',
                    image: {
                      _id: item._id,
                      url: generateUrl(item, {
                        resize: { fit: 'cover', height: 1080, width: 1920 },
                      }),
                      name: item.name,
                    },
                  },
                },
              });
            }}
          >
            <div className={clsx('rounded-sm outline-offset-2', item._id === state.config?.image?._id && 'outline-2')}>
              <img src={item.url} className="aspect-[4/3] h-[48px] rounded-sm self-stretch" loading="lazy" />
            </div>
            <p className="text-xs font-normal text-tertiary">{item.name}</p>
          </div>
        ))}
      </Menu.Content>
    </Menu.Root>
  );
}

export function PopoverDisplay() {
  const [state, dispatch] = useTheme();
  const themeName = getThemeName(state);
  const mode = state.config.mode || 'dark';

  return (
    <Menu.Root
    className="flex-1 min-w-full md:min-w-auto"
    placement="top"
    strategy="fixed"
    disabled={presets[themeName]?.ui?.disabled?.mode}
  >
    <Menu.Trigger>
      <div className="w-full bg-primary/8 text-tertiary px-2.5 py-2 rounded-sm flex items-center gap-2">
        <i
          className={clsx(
            'size-[24px] rounded-full',
            modes.find((item) => item.mode === mode)?.icon,
            modes.find((item) => item.mode === mode)?.active,
          )}
        />
        <span className="text-left flex-1">Display</span>
        <p className="flex items-center gap-1">
          <span className="capitalize">{state.config?.mode}</span>
          <i className="icon-chevrons-up-down text-quaternary" />
        </p>
      </div>
    </Menu.Trigger>
    <FloatingPortal>
      <Menu.Content className="w-[300px]">
        {modes.map((item) => (
          <MenuItem
            key={item.mode}
            iconLeft={item.icon}
            title={item.label}
            onClick={() => {
              dispatch({
                type: ThemeBuilderActionKind.select_color,
                payload: { config: { mode: item.mode as any } },
              });
            }}
          />
        ))}
      </Menu.Content>
    </FloatingPortal>
  </Menu.Root>
  );
}
