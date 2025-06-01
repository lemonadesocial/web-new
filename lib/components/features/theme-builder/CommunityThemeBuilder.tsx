'use client';
import React from 'react';
import clsx from 'clsx';

import { Button, Card, Menu, MenuItem, modal } from '$lib/components/core';

import {
  colors,
  defaultTheme,
  emojis,
  fonts,
  getRandomColor,
  getRandomFont,
  modes,
  patterns,
  presets,
  shaders,
  ThemeValues,
} from './store';
import { ThemeBuilderActionKind, useCommunityTheme } from './provider';
import { Sheet, SheetRef } from 'react-modal-sheet';
import { twMerge } from 'tailwind-merge';
import { MenuColorPicker } from './ColorPicker';
import { isEqual, join, split } from 'lodash';
import { Space, UpdateSpaceDocument } from '$lib/graphql/generated/backend/graphql';
import { useMutation } from '$lib/graphql/request';
import { FloatingPortal } from '@floating-ui/react';

export function CommunityThemeBuilder({ themeData, spaceId }: { themeData: ThemeValues; spaceId?: string }) {
  const [toggle, setToggle] = React.useState(false);

  return (
    <>
      <Button icon="icon-palette-outline" outlined size="lg" onClick={() => setToggle(true)} />
      <CommunityThemeBuilderPane show={toggle} initial={themeData} spaceId={spaceId} onClose={() => setToggle(false)} />
    </>
  );
}

function CommunityThemeBuilderPane({
  initial,
  show,
  onClose,
  spaceId,
}: {
  initial: ThemeValues;
  show: boolean;
  spaceId?: string;
  onClose: () => void;
}) {
  const [state, dispatch] = useCommunityTheme();
  const sheetRef = React.useRef<SheetRef>(null);

  const themeName = !state.theme || state.theme === 'default' ? 'minimal' : state.theme;
  const mode = state.config.mode || 'dark';

  const [updateCommunity, { loading }] = useMutation(UpdateSpaceDocument);

  const handleCloseSheet = () => {
    const dirty = !isEqual(state, initial);
    if (dirty) {
      modal.open(ConfirmModal, {
        props: {
          onDiscard: () => {
            onClose();
            dispatch({ type: ThemeBuilderActionKind.reset, payload: initial });
          },
        },
      });
      sheetRef.current?.snapTo(0);
    } else {
      onClose();
    }
  };

  return (
    <Sheet ref={sheetRef} isOpen={show} onClose={handleCloseSheet} snapPoints={[324]} initialSnap={0}>
      <Sheet.Backdrop onTap={handleCloseSheet} />

      <Sheet.Container className="bg-overlay-primary/80! rounded-tl-lg! rounded-tr-lg! backdrop-blur-2xl">
        <Sheet.Header className="rounded-tl-lg rounded-tr-lg">
          <div className="flex justify-center items-end h-[20px]">
            <div className="bg-primary/8 rounded-xs w-[48px] h-1 cursor-row-resize"></div>
          </div>
        </Sheet.Header>
        <Sheet.Content disableDrag>
          <Sheet.Scroller draggableAt="top" className="no-scrollbar">
            <div className="flex flex-col gap-6 max-w-[1080px] m-auto py-6 px-4">
              <ThemeTemplate />

              <div className="flex flex-col gap-2">
                <div className="flex gap-2 flex-wrap">
                  <PopoverColor disabled={state.theme && presets[themeName].ui?.disabled?.color} />
                  <PopoverStyle />
                  <PopoverEffect />
                </div>

                <div className="flex flex-wrap gap-2">
                  <PopoverFont
                    fonts={fonts.title}
                    label="Title"
                    selected={state.font_title}
                    onClick={(font) => {
                      const payload = {
                        font_title: font,
                        variables: { font: { '--font-title': fonts.title[font] } },
                      };
                      dispatch({ type: ThemeBuilderActionKind.select_font, payload });
                    }}
                  />
                  <PopoverFont
                    fonts={fonts.body}
                    label="Body"
                    selected={state.font_body}
                    onClick={(font) => {
                      const payload = {
                        font_body: font,
                        variables: { font: { '--font-body': fonts.body[font] } },
                      };
                      dispatch({ type: ThemeBuilderActionKind.select_font, payload });
                    }}
                  />

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
                </div>
              </div>

              <div className="flex justify-between">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    icon="icon-recent"
                    variant="tertiary-alt"
                    onClick={async () => {
                      if (spaceId) {
                        await updateCommunity({
                          variables: { id: spaceId, input: { theme_data: null } },
                          onComplete: (client) => {
                            client.writeFragment<Space>({ id: `Space:${spaceId}`, data: { theme_data: null } });
                            dispatch({ type: ThemeBuilderActionKind.reset, payload: defaultTheme });
                          },
                        });
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    icon="icon-shuffle"
                    variant="tertiary-alt"
                    disabled={themeName !== 'minimal'}
                    onClick={async () => {
                      const [fontTitle, fontTitleVariable] = getRandomFont('title');
                      const [fontBody, fontBodyVariable] = getRandomFont('body');
                      const payload = {
                        font_title: fontTitle,
                        font_body: fontBody,
                        variables: { font: { '--font-title': fontTitleVariable, '--font-body': fontBodyVariable } },
                      };
                      dispatch({ type: ThemeBuilderActionKind.select_font, payload });
                      dispatch({
                        type: ThemeBuilderActionKind.select_template,
                        payload: { theme: 'minimal', config: { color: getRandomColor() } },
                      });
                    }}
                  />
                </div>

                <div className="flex gap-2">
                  {/* <Button variant="tertiary" size="sm"> */}
                  {/*   Save Theme */}
                  {/* </Button> */}
                  <Button
                    size="sm"
                    loading={loading}
                    onClick={async () => {
                      if (spaceId) {
                        await updateCommunity({
                          variables: { id: spaceId, input: { theme_data: state } },
                          onComplete: (client) => {
                            client.writeFragment<Space>({ id: `Space:${spaceId}`, data: { theme_data: state } });
                          },
                        });
                      }
                    }}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          </Sheet.Scroller>
        </Sheet.Content>
      </Sheet.Container>
    </Sheet>
  );
}

function ThemeTemplate() {
  const [state, dispatch] = useCommunityTheme();

  return (
    <div className="flex flex-1 gap-3 overflow-x no-scrollbar justify-center">
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

function PopoverColor({ disabled }: { disabled?: boolean }) {
  const [state, dispatch] = useCommunityTheme();

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

function PopoverStyle() {
  const [state] = useCommunityTheme();
  if (state.theme === 'shader') return <PopoverShaderColor />;
  if (state.theme === 'pattern') return <PopoverPattern />;

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

export function PopoverShaderColor() {
  const [state, dispatch] = useCommunityTheme();

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

export function PopoverPattern() {
  const [state, dispatch] = useCommunityTheme();

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

export function PopoverEffect() {
  const [state, dispatch] = useCommunityTheme();

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

export function ConfirmModal({ onDiscard }: { onDiscard: () => void }) {
  return (
    <div className="p-4 flex flex-col gap-4 max-w-[308px]">
      <div className="p-3 rounded-full bg-danger-400/16 w-fit">
        <i className="icon-info text-danger-400" />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-lg font-medium">Discard Customizations?</p>
        <p className="text-sm font-medium text-secondary">
          Your theme changes haven’t been applied. Discard them or go back to keep editing.
        </p>
      </div>
      <div className="flex gap-3">
        <Button
          variant="tertiary"
          className="flex-1"
          onClick={() => {
            modal.close();
          }}
        >
          Cancel
        </Button>
        <Button
          variant="danger"
          className="flex-1"
          onClick={() => {
            modal.close();
            onDiscard();
          }}
        >
          Discard
        </Button>
      </div>
    </div>
  );
}
