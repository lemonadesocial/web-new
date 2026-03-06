'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { join, split } from 'lodash';
import clsx from 'clsx';

import { Card, Menu } from '$lib/components/core';
import { useMutation, useQuery } from '$lib/graphql/request';
import {
  FileCategory,
  GetSystemFilesDocument,
  SystemFile,
  UpdateEventThemeDocument,
} from '$lib/graphql/generated/backend/graphql';

import { colors, emojis, fonts, getRandomColor, getThemeName, patterns, presets, shaders } from './store';
import { useEventTheme, ThemeBuilderActionKind } from './provider';
import { MenuColorPicker } from './ColorPicker';
import { generateUrl } from '$lib/utils/cnd';
import { FloatingPortal } from '@floating-ui/react';

export function EventThemeBuilder({
  eventId,
  autoSave = true,
  inline = false,
  menuInPortal = true,
}: {
  eventId?: string;
  autoSave?: boolean;
  inline?: boolean;
  menuInPortal?: boolean;
}) {
  const [toggle, setToggle] = React.useState(false);
  const [data, dispatch] = useEventTheme();
  const themeName = getThemeName(data);
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
    if (mounted.current && autoSave && eventId) {
      updateEventTheme({ variables: { id: eventId, input: { theme_data: data } } });
    } else {
      mounted.current = true;
    }
  }, [autoSave, data, eventId]);

  if (inline) {
    return <InlineEventThemeBuilderPanel menuInPortal={menuInPortal} />;
  }

  return (
    <>
      <div className="flex gap-2 h-[62px]">
        <button
          type="button"
          className="btn btn-tertiary inline-flex px-3 py-2.5 w-full gap-2.5 rounded-sm text-left backdrop-blur-sm"
          onClick={() => setToggle(true)}
        >
          <img src={presets[themeName]?.image} className="w-[51px] h-[38px] rounded-xs" />
          <div className="flex justify-between items-center flex-1">
            <div>
              <p className="text-xs">Theme</p>
              <p className="text-primary">{presets[themeName]?.name}</p>
            </div>
            <i aria-hidden="true" className="icon-chevrons-up-down size-5" />
          </div>
        </button>
        <button
          type="button"
          onClick={() => dispatch({ type: ThemeBuilderActionKind.random })}
          className="btn btn-tertiary inline-flex items-center justify-center p-[21px] backdrop-blur-sm rounded-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-none!"
        >
          <i aria-hidden="true" className="icon-shuffle size-5" />
        </button>
      </div>

      {toggle && <EventThemeBuilderPane show={toggle} onClose={() => setToggle(false)} />}
    </>
  );
}

function InlineEventThemeBuilderPanel({ menuInPortal = true }: { menuInPortal?: boolean }) {
  const [data, dispatch] = useEventTheme();
  const themeName = getThemeName(data);
  const menuStrategy = menuInPortal ? 'fixed' : 'absolute';
  const menuPlacement = menuInPortal ? 'right-start' : 'bottom-start';
  const menuWithFlip = !menuInPortal;
  const mode = data.config.mode || 'auto';
  const styleDisabled = !!presets[themeName]?.ui?.disabled?.style;
  const effectDisabled = !!presets[themeName]?.ui?.disabled?.effect;
  const displayDisabled = !!presets[themeName]?.ui?.disabled?.mode;

  const { data: dataGetSystemFiles } = useQuery(GetSystemFilesDocument, {
    variables: {
      categories: [
        FileCategory.SpaceDarkTheme,
        FileCategory.SpaceLightTheme,
        FileCategory.EventDarkTheme,
        FileCategory.EventLightTheme,
      ],
    },
    skip: themeName !== 'image',
  });
  const images = (dataGetSystemFiles?.getSystemFiles || []) as SystemFile[];

  return (
    <div
      className={clsx(
        'h-full bg-overlay-secondary backdrop-blur-md rounded-md p-2 pt-4 no-scrollbar space-y-3',
        menuInPortal ? 'overflow-auto' : 'overflow-visible',
      )}
      style={
        {
          // @ts-expect-error accept variables
          '--font-title': 'var(--font-class-display)',
          '--font-body': 'var(--font-general-sans)',
        } as React.CSSProperties
      }
    >
      <div className="flex gap-2 overflow-x-auto no-scrollbar px-1 py-1">
        {Object.entries(presets).map(([key, preset]) => {
          const active = themeName === key;
          return (
            <button
              key={key}
              type="button"
              className="flex flex-col items-center gap-1 min-w-[72px]"
              onClick={() => {
                const config: any = {};
                if (!data.config.color) config.color = getRandomColor();
                if (preset.ui?.disabled?.mode) config.mode = 'auto';

                dispatch({
                  type: ThemeBuilderActionKind.select_template,
                  payload: { theme: key as any, config },
                });
              }}
            >
              <img
                src={preset.image}
                alt={preset.name}
                className={clsx(
                  'h-[48px] w-[72px] rounded-sm border border-transparent',
                  active && 'outline-2 outline-offset-2 outline-primary',
                )}
              />
              <p className={clsx('text-[11px]', active ? 'text-primary' : 'text-tertiary')}>{preset.name}</p>
            </button>
          );
        })}
      </div>

      <Menu.Root strategy={menuStrategy} placement={menuPlacement} withFlip={menuWithFlip} className="w-full">
        <Menu.Trigger>
          <SettingRow
            icon={
              <i
                className={clsx(
                  'size-6 rounded-full',
                  data.config.color === 'custom' ? 'bg-[var(--color-custom-400)]' : `${data.config.color} bg-accent-400`,
                )}
              />
            }
            label="Color"
            value={data.config.color === 'custom' ? 'Custom' : capitalize(data.config.color || 'Default')}
          />
        </Menu.Trigger>
        <MaybeFloatingPortal enabled={menuInPortal}>
          <Menu.Content className="w-[260px]">
            <div className="grid grid-cols-8 gap-2.5">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => dispatch({ type: ThemeBuilderActionKind.select_color, payload: { config: { color } } })}
                  className={twMerge(
                    'size-5 cursor-pointer hover:outline-2 outline-offset-2 rounded-full',
                    `${color} item-color-fg`,
                    clsx(color === data.config.color && 'outline-2'),
                  )}
                />
              ))}
              <MenuColorPicker color={data.config.color} dispatch={dispatch} strategy={menuStrategy} />
            </div>
          </Menu.Content>
        </MaybeFloatingPortal>
      </Menu.Root>

      <Menu.Root strategy={menuStrategy} placement={menuPlacement} withFlip={menuWithFlip} className="w-full" disabled={styleDisabled}>
        <Menu.Trigger>
          <SettingRow
            icon={
              data.theme === 'shader' ? (
                <div className={twMerge('size-6 rounded-full', `item-color-${data.config.name}`)} />
              ) : data.theme === 'pattern' ? (
                <div className="size-6 rounded-full p-[2px]">
                  <div
                    className={twMerge(
                      'pattern w-full h-full rounded-full relative! opacity-100!',
                      data.config.color,
                      data.config.name,
                    )}
                  />
                </div>
              ) : data.theme === 'image' ? (
                <img src={data.config.image?.url} className="size-6 rounded-full object-cover" />
              ) : (
                <div className="size-6 rounded-full bg-quaternary" />
              )
            }
            label="Style"
            value={capitalize(data.config.name || data.config.image?.name || '-')}
            disabled={styleDisabled}
          />
        </Menu.Trigger>
        <MaybeFloatingPortal enabled={menuInPortal}>
          <Menu.Content className="w-[300px]">
            {themeName === 'shader' && (
              <div className="grid grid-cols-4 gap-3">
                {shaders.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() =>
                      dispatch({
                        type: ThemeBuilderActionKind.select_style,
                        payload: { config: { name: item.name, color: item.accent } },
                      })
                    }
                    className={twMerge(
                      'size-12 cursor-pointer hover:outline-2 outline-offset-2 rounded-full',
                      `item-color-${item.name}`,
                      clsx(item.name === data.config.name && 'outline-2'),
                    )}
                  />
                ))}
              </div>
            )}
            {themeName === 'pattern' && (
              <div className="grid grid-cols-3 gap-3">
                {patterns.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="flex flex-col items-center gap-2 cursor-pointer"
                    onClick={() =>
                      dispatch({
                        type: ThemeBuilderActionKind.select_style,
                        payload: { config: { name: item } },
                      })
                    }
                  >
                    <div
                      className={clsx(
                        'w-12 h-12 rounded-full p-[2px] border border-transparent',
                        data.config.name === item && 'border-primary',
                      )}
                    >
                      <div className={twMerge('pattern w-full h-full rounded-full opacity-100! relative!', data.config.color, item)} />
                    </div>
                    <p className="text-xs capitalize">{item}</p>
                  </button>
                ))}
              </div>
            )}
            {themeName === 'image' && (
              <div className="grid grid-cols-3 gap-3">
                {images.map((item) => (
                  <button
                    key={item._id}
                    type="button"
                    className="flex flex-col items-center gap-1 cursor-pointer"
                    onClick={() =>
                      dispatch({
                        type: ThemeBuilderActionKind.select_image,
                        payload: {
                          config: {
                            mode: item.category.includes('dark') ? 'dark' : 'light',
                            image: {
                              _id: item._id,
                              url: generateUrl(item, { resize: { fit: 'cover', height: 1080, width: 1920 } }),
                              name: item.name,
                            },
                          },
                        },
                      })
                    }
                  >
                    <img src={item.url} className="h-10 w-14 rounded-sm object-cover" />
                    <p className="text-[10px] text-tertiary">{item.name}</p>
                  </button>
                ))}
              </div>
            )}
          </Menu.Content>
        </MaybeFloatingPortal>
      </Menu.Root>

      <Menu.Root strategy={menuStrategy} placement={menuPlacement} withFlip={menuWithFlip} className="w-full" disabled={effectDisabled}>
        <Menu.Trigger>
          <SettingRow
            icon={
              data.config.effect?.name ? (
                <div className="size-7 text-xl leading-7 text-center">{emojis[data.config.effect.name]?.emoji}</div>
              ) : (
                <i aria-hidden="true" className="icon-wand-shine-outline-sharp size-6 text-primary" />
              )
            }
            label="Effect"
            value={data.config.effect?.name ? capitalize(data.config.effect.name) : '-'}
            disabled={effectDisabled}
          />
        </Menu.Trigger>
        <MaybeFloatingPortal enabled={menuInPortal}>
          <Menu.Content className="w-[300px]">
            <div className="grid grid-cols-4 gap-3">
              {Object.entries(emojis).map(([key, item]) => (
                <button
                  key={key}
                  type="button"
                  className={clsx(
                    'border rounded-full w-11 h-11 flex items-center justify-center text-xl',
                    key === data.config.effect?.name && 'border-primary',
                  )}
                  onClick={() => {
                    const effect =
                      key === data.config.effect?.name
                        ? { name: '', type: undefined, url: '', emoji: '' }
                        : { name: key, type: item.type, url: item.url, emoji: item.emoji };
                    dispatch({ type: ThemeBuilderActionKind.select_effect, payload: { config: { effect } } });
                  }}
                >
                  {item.emoji}
                </button>
              ))}
            </div>
          </Menu.Content>
        </MaybeFloatingPortal>
      </Menu.Root>

      <Menu.Root strategy={menuStrategy} placement={menuPlacement} withFlip={menuWithFlip} className="w-full">
        <Menu.Trigger>
          <SettingRow
            icon={
              <span style={{ fontFamily: fonts.title[data.font_title || 'default'] }} className="size-6 inline-flex items-center justify-center leading-none">
                Ag
              </span>
            }
            label="Title"
            value={capitalize(join(split(data.font_title || 'default', '_'), ' '))}
          />
        </Menu.Trigger>
        <MaybeFloatingPortal enabled={menuInPortal}>
          <Menu.Content className="w-[300px] max-h-80 overflow-auto no-scrollbar p-1">
            {Object.entries(fonts.title).map(([key]) => (
              <button
                key={key}
                type="button"
                className="w-full text-left text-sm px-2 py-1.5 rounded-sm hover:bg-card-hover"
                onClick={() =>
                  dispatch({
                    type: ThemeBuilderActionKind.select_font,
                    payload: { font_title: key, variables: { font: { '--font-title': fonts.title[key] } } },
                  })
                }
              >
                {capitalize(join(split(key, '_'), ' '))}
              </button>
            ))}
          </Menu.Content>
        </MaybeFloatingPortal>
      </Menu.Root>

      <Menu.Root strategy={menuStrategy} placement={menuPlacement} withFlip={menuWithFlip} className="w-full">
        <Menu.Trigger>
          <SettingRow
            icon={
              <span style={{ fontFamily: fonts.body[data.font_body || 'default'] }} className="size-6 inline-flex items-center justify-center leading-none">
                Ag
              </span>
            }
            label="Body"
            value={capitalize(join(split(data.font_body || 'default', '_'), ' '))}
          />
        </Menu.Trigger>
        <MaybeFloatingPortal enabled={menuInPortal}>
          <Menu.Content className="w-[300px] max-h-80 overflow-auto no-scrollbar p-1">
            {Object.entries(fonts.body).map(([key]) => (
              <button
                key={key}
                type="button"
                className="w-full text-left text-sm px-2 py-1.5 rounded-sm hover:bg-card-hover"
                onClick={() =>
                  dispatch({
                    type: ThemeBuilderActionKind.select_font,
                    payload: { font_body: key, variables: { font: { '--font-body': fonts.body[key] } } },
                  })
                }
              >
                {capitalize(join(split(key, '_'), ' '))}
              </button>
            ))}
          </Menu.Content>
        </MaybeFloatingPortal>
      </Menu.Root>

      <Menu.Root strategy={menuStrategy} placement={menuPlacement} withFlip={menuWithFlip} className="w-full" disabled={displayDisabled}>
        <Menu.Trigger>
          <SettingRow
            icon={
              <i
                className={clsx(
                  'size-6 rounded-full',
                  modes.find((item) => item.mode === mode)?.icon,
                  modes.find((item) => item.mode === mode)?.active,
                )}
              />
            }
            label="Display"
            value={capitalize(mode)}
            disabled={displayDisabled}
          />
        </Menu.Trigger>
        <MaybeFloatingPortal enabled={menuInPortal}>
          <Menu.Content className="w-[220px] p-1">
            {modes.map((item) => (
              <button
                key={item.mode}
                type="button"
                className="w-full text-left text-sm px-2 py-1.5 rounded-sm hover:bg-card-hover flex items-center gap-2"
                onClick={() =>
                  dispatch({
                    type: ThemeBuilderActionKind.select_color,
                    payload: { config: { mode: item.mode as any } },
                  })
                }
              >
                <i aria-hidden="true" className={item.icon} />
                <span>{item.label}</span>
              </button>
            ))}
          </Menu.Content>
        </MaybeFloatingPortal>
      </Menu.Root>
    </div>
  );
}

function MaybeFloatingPortal({ enabled, children }: { enabled: boolean; children: React.ReactNode }) {
  if (!enabled) return <>{children}</>;
  return <FloatingPortal>{children}</FloatingPortal>;
}

function SettingRow({
  icon,
  label,
  value,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  disabled?: boolean;
}) {
  return (
    <div
      className={clsx(
        'w-full h-10 rounded-sm bg-primary/8 px-2 flex items-center gap-1.5',
        disabled && 'opacity-50 cursor-not-allowed',
      )}
    >
      <div className="shrink-0 flex items-center justify-center size-6">{icon}</div>
      <p className="text-tertiary flex-1">{label}</p>
      <p className="text-tertiary truncate max-w-[92px]">{value}</p>
      <i aria-hidden="true" className="icon-chevrons-up-down text-quaternary size-3.5" />
    </div>
  );
}

function capitalize(value: string) {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
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
  const themeName = getThemeName(data);

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
            <div
              className={clsx(
                'size-[32px] bg-quaternary rounded-full',
                data.theme === 'image' && 'w-[43px] rounded-xs',
              )}
            >
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
                <i aria-hidden="true" className="icon-clear-night text-blue-400" />
              ) : (
                <i aria-hidden="true" className="icon-dark-theme-filled size-[24px] rounded-full" />
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
                const themeName = getThemeName(data);

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
        type="button"
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
          type="button"
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
          type="button"
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
          type="button"
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
          type="button"
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
              <img
                src={generateUrl(item, { resize: { width: 72, height: 54, fit: 'cover' } })}
                className="rounded-sm"
                width={72}
                height={54}
              />
            </Card.Root>
            <p className="text-xs">{item?.name}</p>
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
        <button type="button" key={key} className="flex flex-col items-center text-xs gap-2 cursor-pointer">
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
          type="button"
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
            <i aria-hidden="true" className={item.icon} />
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
      type="button"
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
