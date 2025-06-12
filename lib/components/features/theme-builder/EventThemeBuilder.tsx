'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { join, split } from 'lodash';
import clsx from 'clsx';

import { Card } from '$lib/components/core';
import { useMutation, useQuery } from '$lib/graphql/request';
import {
  File,
  FileCategory,
  GetSystemFilesDocument,
  SystemFile,
  UpdateEventThemeDocument,
} from '$lib/graphql/generated/backend/graphql';

import { colors, emojis, fonts, getRandomColor, patterns, presets, shaders } from './store';
import { useEventTheme, ThemeBuilderActionKind } from './provider';
import { MenuColorPicker } from './ColorPicker';
import { generateUrl } from '$lib/utils/cnd';

export function EventThemeBuilder({ eventId }: { eventId: string }) {
  const [toggle, setToggle] = React.useState(false);
  const [data, dispatch] = useEventTheme();
  const themeName = !data.theme || data.theme === 'default' ? 'minimal' : data.theme;
  const mounted = React.useRef(false);

  const [updateEventTheme] = useMutation(UpdateEventThemeDocument);

  // PERF: improve image loading
  useQuery(GetSystemFilesDocument, {
    variables: {
      categories: [
        FileCategory.SpaceDarkTheme,
        FileCategory.SpaceLightTheme,
        FileCategory.EventDarkTheme,
        FileCategory.EventLightTheme,
      ],
    },
  });

  useQuery(GetSystemFilesDocument, {
    variables: {
      categories: [
        FileCategory.SpaceDarkTheme,
        FileCategory.SpaceLightTheme,
        FileCategory.EventDarkTheme,
        FileCategory.EventLightTheme,
      ],
    },
  });

  React.useEffect(() => {
    if (mounted.current) {
      updateEventTheme({ variables: { id: eventId, input: { theme_data: data } } });
    } else {
      mounted.current = true;
    }
  }, [data]);

  return (
    <>
      <div className="flex gap-2 h-[62px]">
        <button
          className="btn btn-tertiary inline-flex px-3 py-2.5 w-full gap-2.5 rounded-sm text-left backdrop-blur-sm"
          onClick={() => setToggle(true)}
        >
          <img src={presets[themeName]?.image} className="w-[51px] h-[38px] rounded-xs" />
          <div className="flex justify-between items-center flex-1">
            <div>
              <p className="text-xs">Theme</p>
              <p className="text-primary">{presets[themeName]?.name}</p>
            </div>
            <i className="icon-chevrons-up-down size-5" />
          </div>
        </button>
        <button
          onClick={() => dispatch({ type: ThemeBuilderActionKind.random })}
          className="btn btn-tertiary inline-flex items-center justify-center p-[21px] backdrop-blur-sm rounded-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-none!"
        >
          <i className="icon-shuffle size-5" />
        </button>
      </div>

      {toggle && <EventThemeBuilderPane show={toggle} onClose={() => setToggle(false)} />}
    </>
  );
}

function EventThemeBuilderPane({ show, onClose }: { show: boolean; onClose: () => void }) {
  const [data, dispatch] = useEventTheme();

  React.useEffect(() => {
    if (!data.theme || data.theme === 'default') {
      dispatch({
        type: ThemeBuilderActionKind.select_template,
        payload: { theme: 'minimal', config: { color: 'woodsmoke' } },
      });
    }
  }, [data.theme]);

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed z-10 inset-0">
          <div className="hidden md:block fixed inset-0 z-20" onClick={onClose} />
          <div className="h-full w-full p-2">
            {/* tablet - destop view */}
            <div className="h-full hidden md:flex  relative">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ duration: 0.1 }}
                className="h-full flex gap-2 z-30"
                style={{
                  // @ts-expect-error accept variables
                  '--font-title': 'var(--font-class-display)',
                  '--font-body': 'var(--font-general-sans)',
                }}
              >
                <EventBuilderPaneOptions />
              </motion.div>
            </div>

            {/* mobile view */}
            <div className="flex h-full md:hidden">
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ duration: 0.1 }}
                onClick={onClose}
                className="w-full relative flex flex-col-reverse gap-2"
                style={{
                  // @ts-expect-error accept variables
                  '--font-title': 'var(--font-class-display)',
                  '--font-body': 'var(--font-general-sans)',
                }}
              >
                <EventBuilderPaneOptions />
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

const MAPPINGS: Record<string, React.FC> = {
  template: ThemeTemplate,
  style: ThemeStyle,
  effect: ThemeEffect,
  colors: ThemeColor,
  font_title: ThemeFontTitle,
  font_body: ThemeFontBody,
  mode: ThemeMode,
};

function EventBuilderPaneOptions() {
  const [state, setState] = React.useState<
    'template' | 'style' | 'effect' | 'colors' | 'font_title' | 'font_body' | 'mode'
  >('template');
  const [data] = useEventTheme();
  const themeName = !data.theme || data.theme === 'default' ? 'minimal' : data.theme;

  const Comp = MAPPINGS[state];

  return (
    <>
      <div
        className="bg-overlay-secondary overflow-auto no-scrollbar backdrop-blur-md rounded-sm h-[94px] md:h-full md:w-[96px] p-2 flex md:justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex md:flex-col gap-1">
          <ActionButton
            active={state === 'template'}
            onClick={() => {
              setState('template');
            }}
          >
            <img src={presets[themeName]?.image} className="h-[32px] w-[43px] rounded-xs" />
            <p className="text-xs">Template</p>
          </ActionButton>

          <ActionButton
            active={state === 'colors'}
            disabled={data.theme && presets[themeName]?.ui?.disabled?.color}
            onClick={() => setState('colors')}
          >
            <div
              className={clsx(
                'size-[32px] rounded-full',
                data.config.color === 'custom' ? 'bg-[var(--color-custom-400)]' : `${data.config.color} bg-accent-400`,
              )}
            />
            <p className="text-xs">Color</p>
          </ActionButton>

          <ActionButton
            active={state === 'style'}
            disabled={presets[themeName]?.ui?.disabled?.style}
            onClick={() => setState('style')}
          >
            <div className={clsx('size-[32px] bg-quaternary rounded-full', data.theme === 'image' && 'w-[43px]')}>
              <div
                className={clsx(
                  'w-full h-full',
                  data.theme === 'shader' && `rounded-full item-color-${data.config.name}`,
                  data.theme === 'pattern' &&
                    `pattern rounded-full ${data.config.name} ${data.config.color} relative! opacity-100!`,
                  data.theme === 'image' && 'h-[32px] w-[43px] rounded-xs bg-cover!',
                )}
                style={
                  data.theme === 'image' && data.config.image
                    ? { background: `url(${data.config.image.url})` }
                    : undefined
                }
              />
            </div>

            <p className="text-xs">Style</p>
          </ActionButton>

          <ActionButton
            active={state === 'effect'}
            disabled={presets[themeName]?.ui?.disabled?.effect}
            onClick={() => setState('effect')}
          >
            {!data.config.effect?.name ? (
              <div className="size-[32px] bg-quaternary rounded-full" />
            ) : (
              <div className="size-[32px] text-2xl">{emojis[data.config.effect.name].emoji}</div>
            )}
            <p className="text-xs">Effect</p>
          </ActionButton>

          <ActionButton active={state === 'font_title'} onClick={() => setState('font_title')}>
            <div className="size-[32px]">
              <h3 style={{ fontFamily: fonts.title[data.font_title || 'default'] }} className="font-semibold">
                Ag
              </h3>
            </div>
            <p className="text-xs capitalize">Title</p>
          </ActionButton>

          <ActionButton active={state === 'font_body'} onClick={() => setState('font_body')}>
            <div className="size-[32px]">
              <h3 style={{ fontFamily: fonts.body[data.font_body || 'default'] }} className="font-semibold">
                Ag
              </h3>
            </div>
            <p className="text-xs capitalize">Body</p>
          </ActionButton>

          <ActionButton
            active={state === 'mode'}
            disabled={data.theme && presets[themeName]?.ui?.disabled?.mode}
            onClick={() => setState('mode')}
          >
            <div className="size-[32px]">
              {data.config?.mode === 'dark' ? (
                <i className="icon-clear-night text-blue-400" />
              ) : (
                <i className="icon-dark-theme-filled size-[24px] rounded-full" />
              )}
            </div>
            <p className="text-xs">Display</p>
          </ActionButton>
        </div>
      </div>

      <div
        className="transition-all bg-overlay-secondary no-scrollbar backdrop-blur-md rounded-sm md:h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <Comp />
      </div>
    </>
  );
}

function ThemeTemplate() {
  const [data, dispatch] = useEventTheme();

  return (
    <div className="flex md:flex-col items-center gap-3 p-4 md:w-[96px]">
      {Object.entries(presets).map(([key, { image, name }]) => {
        return (
          <div key={key} className="flex flex-col items-center gap-2">
            <Card.Root
              className={clsx(
                'p-0 bg-transparent border-transparent transition-all hover:outline-2 hover:outline-offset-2 hover:outline-primary/16 rounded-sm',
                data.theme === key && 'outline-2 outline-offset-2 outline-primary!',
              )}
              onClick={(e) => {
                e.stopPropagation();
                const config: any = {};
                const themeName = !data.theme || data.theme === 'default' ? 'minimal' : data.theme;

                if (!data.config.color) config.color = getRandomColor();
                if (presets[themeName].ui?.disabled?.mode) config.mode = 'auto';

                dispatch({
                  type: ThemeBuilderActionKind.select_template,
                  payload: { theme: key as any, config },
                });
              }}
            >
              <img src={image} className="rounded-sm" width={72} height={54} />
            </Card.Root>
            <p className="text-xs">{name}</p>
          </div>
        );
      })}
    </div>
  );
}

function ThemeColor() {
  const [data, dispatch] = useEventTheme();

  return (
    <div className="flex md:flex-col items-center overflow-auto w-full md:w-[60px] gap-3 p-4">
      <button
        onClick={(e) => {
          e.stopPropagation();
          dispatch({
            type: ThemeBuilderActionKind.select_color,
            payload: { config: { color: 'woodsmoke' } },
          });
        }}
        className={twMerge(
          'size-5 min-w-5 min-h-5 cursor-pointer hover:outline-2 outline-offset-2 rounded-full woodsmoke bg-woodsmoke-400',
          clsx('woodsmoke' === data.config?.color && 'outline-2'),
        )}
      />

      {colors.map((color) => (
        <button
          key={color}
          onClick={(e) => {
            e.stopPropagation();
            dispatch({
              type: ThemeBuilderActionKind.select_color,
              payload: { config: { color } },
            });
          }}
          className={twMerge(
            'size-5 min-w-5 min-h-5 cursor-pointer hover:outline-2 outline-offset-2 rounded-full',
            `${color} item-color-fg`,
            clsx(color === data.config?.color && 'outline-2'),
          )}
        />
      ))}

      <MenuColorPicker color={data.config.color} dispatch={dispatch} strategy="fixed" />
    </div>
  );
}

function ThemeFontTitle() {
  const [data, dispatch] = useEventTheme();

  return (
    <ThemeFont
      selected={data.font_title}
      fonts={fonts.title}
      onClick={(font: string) => {
        const payload = {
          font_title: font,
          variables: { font: { '--font-title': fonts.title[font] } },
        };
        dispatch({ type: ThemeBuilderActionKind.select_font, payload });
      }}
    />
  );
}

function ThemeFontBody() {
  const [data, dispatch] = useEventTheme();
  return (
    <ThemeFont
      fonts={fonts.body}
      selected={data.font_body}
      onClick={(font: string) => {
        const payload = {
          font_body: font,
          variables: { font: { '--font-body': fonts.body[font] } },
        };
        dispatch({ type: ThemeBuilderActionKind.select_font, payload });
      }}
    />
  );
}

function ThemeFont({
  selected = 'default',
  fonts,
  onClick,
}: {
  selected?: string;
  fonts: Record<string, string>;
  onClick: (font: string) => void;
}) {
  return (
    <div className="flex md:grid md:grid-cols-2 items-center gap-3 w-full md:w-[188px] p-4 overflow-auto">
      {Object.entries(fonts).map(([key, font]) => (
        <button
          key={key}
          className="flex flex-col items-center text-xs gap-2 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onClick(key);
          }}
        >
          <div
            className={clsx(
              'border-2 border-[var(--color-divider)] rounded-sm px-4 py-2 w-[72px] h-[56px] hover:border-primary',
              key === selected.toLowerCase().replaceAll(' ', '_') && 'border border-primary',
            )}
          >
            <h3 style={{ fontFamily: font as string }} className="size-10 text-xl text-center">
              Ag
            </h3>
          </div>
          <p className="capitalize font-body-default">{join(split(key, '_'), ' ')}</p>
        </button>
      ))}
    </div>
  );
}

function ThemeStyle() {
  const [state] = useEventTheme();
  if (state.theme === 'shader') return <ThemeShader />;
  if (state.theme === 'pattern') return <ThemePattern />;
  if (state.theme === 'image') return <ThemeImage />;

  return null;
}

function ThemeShader() {
  const [state, dispatch] = useEventTheme();

  return (
    <div className="flex md:flex-col items-center gap-3 w-full md:w-[96px] overflow-auto p-4">
      {shaders.map((s) => (
        <button
          key={s.name}
          className={clsx(
            'flex flex-col gap-2 items-center',
            s.name === state.config.name ? 'text-primary' : 'text-tertiary',
          )}
          onClick={(e) => {
            e.stopPropagation();
            dispatch({
              type: ThemeBuilderActionKind.select_style,
              payload: { config: { name: s.name, color: s.accent } },
            });
          }}
        >
          <div
            className={twMerge(
              'size-[60px] cursor-pointer hover:outline-2 outline-offset-2 rounded-full',
              `item-color-${s.name}`,
              clsx(s.name === state.config.name && 'outline-2'),
            )}
          />
          <p className="text-xs capitalize">{s.name}</p>
        </button>
      ))}
    </div>
  );
}

function ThemePattern() {
  const [data, dispatch] = useEventTheme();

  return (
    <div className="flex md:flex-col items-center gap-3 w-full md:w-[96px] overflow-auto p-4">
      {patterns.map((item) => (
        <button
          key={item}
          className="capitalize flex flex-col items-center cursor-pointer gap-2"
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
              data.config.name === item && 'border-white',
            )}
          >
            <div
              className={twMerge(
                'pattern rounded-full item-pattern relative! w-full h-full opacity-100!',
                data.config.color,
                item,
              )}
            />
          </div>
          <p className="text-xs">{item}</p>
        </button>
      ))}
    </div>
  );
}

function ThemeImage() {
  const [state, dispatch] = useEventTheme();

  const { data } = useQuery(GetSystemFilesDocument, {
    variables: {
      categories: [
        FileCategory.SpaceDarkTheme,
        FileCategory.SpaceLightTheme,
        FileCategory.EventDarkTheme,
        FileCategory.EventLightTheme,
      ],
    },
  });
  const images = (data?.getSystemFiles || []) as SystemFile[];

  return (
    <div className="flex md:flex-col items-center gap-3 p-4 md:w-[96px]">
      {images.map((item) => {
        return (
          <div key={item._id} className="flex flex-col items-center gap-2">
            <Card.Root
              className={clsx(
                'p-0 bg-transparent border-transparent transition-all hover:outline-2 hover:outline-offset-2 hover:outline-primary/16 rounded-sm',
                state.config?.image?._id === item._id && 'outline-2 outline-offset-2 outline-primary!',
              )}
              onClick={(e) => {
                e.stopPropagation();

                dispatch({
                  type: ThemeBuilderActionKind.select_image,
                  payload: {
                    config: {
                      mode: item.category.includes('dark') ? 'dark' : 'light',
                      image: {
                        _id: item._id,
                        url: generateUrl(item as unknown as File, {
                          resize: { fit: 'cover', height: 1080, width: 1920 },
                        }),
                        name: item.name,
                      },
                    },
                  },
                });
              }}
            >
              <img
                src={generateUrl(item as unknown as File, { resize: { width: 72, height: 54, fit: 'cover' } })}
                className="rounded-sm"
                width={72}
                height={54}
              />
            </Card.Root>
            <p className="text-xs">{state.config?.image?.name}</p>
          </div>
        );
      })}
    </div>
  );
}

function ThemeEffect() {
  const [state, dispatch] = useEventTheme();

  return (
    <div className="flex md:grid md:grid-cols-2 items-center gap-3 w-full md:w-[188px] p-4 overflow-auto">
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
                payload: { config: { effect } },
              });
            }}
          >
            <span className="text-xl">{value.emoji}</span>
          </div>
          <p className="capitalize font-body-default">{value.label}</p>
        </button>
      ))}
    </div>
  );
}

const modes = [
  { mode: 'light', icon: 'icon-sunny', label: 'Light' },
  { mode: 'dark', icon: 'icon-clear-night', active: 'text-blue-400', label: 'Dark' },
  { mode: 'auto', icon: 'icon-dark-theme-filled', label: 'Auto' },
];

function ThemeMode() {
  const [data, dispatch] = useEventTheme();
  return (
    <div className="flex md:flex-col items-center w-full md:w-[92px] gap-3 overflow-auto p-4">
      {modes.map((item) => (
        <button
          key={item.mode}
          onClick={(e) => {
            e.stopPropagation();
            dispatch({ type: ThemeBuilderActionKind.select_color, payload: { config: { mode: item.mode as any } } });
          }}
          className={twMerge(
            'group text-tertiary hover:text-secondary flex flex-col gap-2 cursor-pointer',
            clsx(data.config?.mode === item.mode && 'text-primary'),
          )}
        >
          <div
            className={clsx(
              'border rounded-full p-3.5 border-tertiary group-hover:border-secondary',
              data.config.mode === item.mode && item.active,
            )}
          >
            <i className={item.icon} />
          </div>
          <p>{item.label}</p>
        </button>
      ))}
    </div>
  );
}

function ActionButton({
  children,
  disabled,
  active,
  onClick,
}: React.PropsWithChildren & { disabled?: boolean; active?: boolean; onClick?: () => void }) {
  return (
    <button
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className={clsx(
        'flex items-center justify-center flex-col gap-2 border border-transparent pt-3 pb-2 px-1 hover:bg-card-hover cursor-pointer rounded-sm w-[80px] font-body-default disabled:opacity-50 disabled:bg-transparent disabled:cursor-not-allowed',
        active && 'bg-card-hover!',
      )}
    >
      {children}
    </button>
  );
}
