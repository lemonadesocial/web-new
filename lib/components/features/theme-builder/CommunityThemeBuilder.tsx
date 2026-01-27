'use client';
import React from 'react';
import { Sheet, SheetRef } from 'react-modal-sheet';
import { isEqual } from 'lodash';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

import { Button, ColorPicker, Menu, MenuItem, modal, Segment, toast } from '$lib/components/core';
import {
  FileCategory,
  GetSystemFilesDocument,
  Space,
  UpdateSpaceDocument,
} from '$lib/graphql/generated/backend/graphql';
import { useMutation, useQuery } from '$lib/graphql/request';

import { defaultTheme, fonts, getRandomColor, getRandomFont, getThemeName, modes, presets, ThemeValues } from './store';
import { ThemeBuilderActionKind, useTheme } from './provider';
import { PopoverColor, PopoverDisplay, PopoverEffect, PopoverFont, PopoverStyle, ThemeTemplate } from './ThemeBuilder';
import { FloatingPortal } from '@floating-ui/react';
import { twMerge } from 'tailwind-merge';
import getPalette from 'tailwindcss-palette-generator';

export function CommunityThemeBuilder({ themeData, spaceId }: { themeData: ThemeValues; spaceId?: string }) {
  const [toggle, setToggle] = React.useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = React.useState(false);

  // PERF: loading images
  useQuery(GetSystemFilesDocument, {
    variables: { categories: [FileCategory.SpaceDarkTheme, FileCategory.SpaceLightTheme] },
  });

  React.useEffect(() => {
    const drawerWidth = 280;
    if (isAdvancedOpen) {
      document.body.style.marginRight = `${drawerWidth}px`;
    } else {
      document.body.style.marginRight = '';
    }
    return () => {
      document.body.style.marginRight = '';
    };
  }, [isAdvancedOpen]);

  return (
    <>
      <Button icon="icon-palette-outline" outlined size="lg" onClick={() => setToggle(true)} />
      <CommunityThemeBuilderPane
        show={toggle}
        initial={themeData}
        spaceId={spaceId}
        onClose={() => setToggle(false)}
        onOpenAdvanced={() => {
          setToggle(false);
          setIsAdvancedOpen(true);
        }}
      />
      <AnimatePresence>
        {isAdvancedOpen && (
          <CommunityThemeBuilderDrawer
            initial={themeData}
            spaceId={spaceId}
            onClose={() => setIsAdvancedOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function CommunityThemeBuilderDrawer({
  initial,
  spaceId,
  onClose,
}: {
  initial: ThemeValues;
  spaceId?: string;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ duration: 0.3 }}
      className="fixed right-0 top-0 bottom-0 w-[280px] bg-overlay-primary backdrop-blur-md border-l border-divider"
      style={{
        zIndex: 10000,
        // @ts-expect-error accept variables
        '--font-title': 'var(--font-class-display)',
        '--font-body': 'var(--font-general-sans)',
      }}
    >
      <CommunityThemeBuilderPane initial={initial} spaceId={spaceId} onClose={onClose} />
    </motion.div>
  );
}

function CommunityThemeBuilderPane({
  initial,
  show,
  onClose,
  spaceId,
  onOpenAdvanced,
}: {
  initial: ThemeValues;
  show?: boolean;
  spaceId?: string;
  onClose: () => void;
  onOpenAdvanced?: () => void;
}) {
  const [state, dispatch] = useTheme();
  const sheetRef = React.useRef<SheetRef>(null);
  const themeName = getThemeName(state);
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
        dismissible: false,
      });
      sheetRef.current?.snapTo(0);
    } else {
      onClose();
    }
  };

  const colorVariables = [
    { key: 'accent', label: 'accent', cssVar: '--color-accent-400', isAccent: true },
    { key: 'page/bg', label: 'page/bg', cssVar: '--color-background' },
    { key: 'page/bg-overlay', label: 'page/bg-overlay', cssVar: '--color-page-background-overlay' },
    { key: 'page/bg-inverse', label: 'page/bg-inverse', cssVar: '--color-primary-invert' },
    { key: 'page/overlay-primary', label: 'page/overlay-primary', cssVar: '--color-overlay-primary' },
    { key: 'page/overlay-secondary', label: 'page/overlay-secondary', cssVar: '--color-overlay-secondary' },
    { key: 'page/overlay-backdrop', label: 'page/overlay-backdrop', cssVar: '--color-overlay-backdrop' },
    { key: 'card/bg', label: 'card/bg', cssVar: '--color-card' },
    { key: 'card/bg-hover', label: 'card/bg-hover', cssVar: '--color-card-hover' },
    { key: 'card/border', label: 'card/border', cssVar: '--color-card-border' },
    { key: 'card/border-hover', label: 'card/border-hover', cssVar: '--color-card-border-hover' },
    { key: 'text/primary', label: 'text/primary', cssVar: '--color-primary' },
    { key: 'text/secondary', label: 'text/secondary', cssVar: '--color-secondary' },
    { key: 'text/tertiary', label: 'text/tertiary', cssVar: '--color-tertiary' },
    { key: 'text/quaternary', label: 'text/quaternary', cssVar: '--color-quaternary' },
  ];

  const getCurrentColor = (cssVar: string, isAccent?: boolean) => {
    if (isAccent) {
      const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--color-accent-400').trim();
      if (state.config.color === 'custom' && state.variables.custom?.['--color-custom-400']) {
        return state.variables.custom['--color-custom-400'];
      }
      return accentColor;
    }
    const modeKey = mode === 'auto' ? 'dark' : mode;
    const modeVars = state.variables[modeKey === 'dark' ? 'dark' : 'light'];
    return modeVars?.[cssVar] || getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
  };

  const updateColorVariable = (cssVar: string, color: string, isAccent?: boolean) => {
    if (isAccent) {
      const palette = getPalette([
        { color: color, name: 'custom', shade: 500, shades: [50, 100, 200, 300, 400, 500, 700, 950] },
      ]) as unknown as {
        custom: {
          500: string;
          950: string;
          700: string;
          50: string;
          100: string;
          200: string;
          300: string;
          400: string;
        };
      };

      const customColors = {
        '--color-custom-50': palette.custom[50],
        '--color-custom-100': palette.custom[100],
        '--color-custom-200': palette.custom[200],
        '--color-custom-300': palette.custom[300],
        '--color-custom-400': palette.custom[400],
        '--color-custom-500': palette.custom[500],
        '--color-custom-700': palette.custom[700],
        '--color-custom-950': palette.custom[950],
      };

      dispatch({
        type: ThemeBuilderActionKind.select_color,
        payload: { config: { color: 'custom' }, variables: { custom: customColors } },
      });
      return;
    }

    const modeKey = mode === 'auto' ? 'dark' : mode;
    const currentVars = state.variables[modeKey === 'dark' ? 'dark' : 'light'] || {};
    const updatedVars = { ...currentVars, [cssVar]: color };

    const modeVarKey = modeKey === 'dark' ? 'dark' : 'light';
    dispatch({
      type: ThemeBuilderActionKind.select_color,
      payload: {
        variables: {
          ...state.variables,
          [modeVarKey]: updatedVars,
        },
      },
    });
  };

  if (onOpenAdvanced) {
    return (
      <Sheet ref={sheetRef} isOpen={show ?? false} onClose={handleCloseSheet} snapPoints={[324]} initialSnap={0}>
      <Sheet.Backdrop onTap={handleCloseSheet} />

      <Sheet.Container className="bg-overlay-primary/80! rounded-tl-lg! rounded-tr-lg! backdrop-blur-2xl">
        <Sheet.Header className="rounded-tl-lg rounded-tr-lg">
          <div className="flex justify-center items-end h-[20px]">
            <div className="bg-primary/8 rounded-xs w-[48px] h-1 cursor-row-resize"></div>
          </div>
        </Sheet.Header>
        <Sheet.Content disableDrag>
          <Sheet.Scroller draggableAt="top" className="no-scrollbar">
            <CommunityThemeContentBuilder>
              <div className="flex justify-between">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    iconLeft="icon-tune"
                    variant="tertiary-alt"
                    onClick={() => {
                      onOpenAdvanced?.();
                    }}
                  >
                    Advanced Options
                  </Button>
                </div>

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
            </CommunityThemeContentBuilder>
          </Sheet.Scroller>
        </Sheet.Content>
      </Sheet.Container>
    </Sheet>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b border-divider flex justify-between items-center flex-shrink-0">
        <p className="text-lg font-medium">Advanced Options</p>
        <i className="icon-x size-4 cursor-pointer text-tertiary hover:text-secondary" onClick={onClose} />
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="p-4 space-y-6">
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-medium">Display</h3>
            <Segment
              items={modes.map((m) => ({
                value: m.mode,
                label: '',
                icon: m.icon,
              }))}
              selected={mode}
              onSelect={(item) => {
                dispatch({
                  type: ThemeBuilderActionKind.select_color,
                  payload: { config: { mode: item.value as any } },
                });
              }}
              className="w-full"
            />
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-medium">Template</h3>
            <Menu.Root placement="bottom" strategy="fixed" className="w-full">
              <Menu.Trigger>
                <div className="w-full bg-primary/8 text-tertiary px-2.5 py-2 rounded-sm flex items-center gap-2">
                  <span className="flex-1 text-left">
                    {themeName in presets ? presets[themeName as keyof typeof presets].name : 'Default'}
                  </span>
                  <i className="icon-chevrons-up-down text-quaternary" />
                </div>
              </Menu.Trigger>
              <FloatingPortal>
                <Menu.Content>
                  {Object.entries(presets).map(([key, preset]) => (
                    <MenuItem
                      key={key}
                      title={preset.name}
                      onClick={() => {
                        let color = state.config.color;
                        if (!color) color = getRandomColor();
                        dispatch({
                          type: ThemeBuilderActionKind.select_template,
                          payload: { theme: key as any, config: { color } },
                        });
                      }}
                    />
                  ))}
                </Menu.Content>
              </FloatingPortal>
            </Menu.Root>
          </div>
        </div>

        <hr className="border-t border-divider w-full" />

        <div className="p-4 space-y-6">
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-medium">Fonts</h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <p className="text-xs text-secondary">Title</p>
                <div className="flex gap-2">
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
                  <Button icon="icon-upload-sharp" variant="tertiary-alt" onClick={() => toast.success('Upload custom font coming soon')} />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-xs text-secondary">Body</p>
                <div className="flex gap-2">
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
                  <Button icon="icon-upload-sharp" variant="tertiary-alt" onClick={() => toast.success('Upload custom font coming soon')} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-t border-divider w-full" />

        <div className="p-4 space-y-6">
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-medium">Colors</h3>
            <div className="flex flex-col gap-2">
              {colorVariables.map((colorVar) => {
                const currentColor = getCurrentColor(colorVar.cssVar, colorVar.isAccent);

                return (
                  <ColorPicker.Root key={colorVar.key} strategy="fixed">
                    <ColorPicker.Trigger>
                      <div className="flex items-center gap-3 py-1 cursor-pointer rounded-sm px-1 hover:bg-primary/8">
                        <div
                          className={clsx(
                            'size-5 rounded-full border border-card-border flex-shrink-0',
                            colorVar.isAccent && state.config.color !== 'custom' && `${state.config.color} bg-accent-400`
                          )}
                          style={
                            colorVar.isAccent && state.config.color === 'custom'
                              ? { backgroundColor: String(currentColor) }
                              : !colorVar.isAccent
                                ? { backgroundColor: String(currentColor || `var(${colorVar.cssVar})`) }
                                : undefined
                          }
                        />
                        <p className="text-sm flex-1 text-secondary">{colorVar.label}</p>
                      </div>
                    </ColorPicker.Trigger>
                    <ColorPicker.Content
                      color={String(currentColor || '#ffffff')}
                      onChange={(result) => {
                        updateColorVariable(colorVar.cssVar, result.hex, colorVar.isAccent);
                      }}
                    />
                  </ColorPicker.Root>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 border-t border-divider flex gap-2 flex-shrink-0">
        <Button
          className="w-full"
          variant="secondary"
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
          Save Changes
        </Button>
      </div>
    </div>
  );
}

export function CommunityThemeContentBuilder({
  className,
  children,
}: React.PropsWithChildren & { className?: string }) {
  const [state, dispatch] = useTheme();

  const themeName = getThemeName(state);

  return (
    <div className={twMerge('flex flex-col gap-6 max-w-[1080px] m-auto py-6 px-4', className)}>
      <ThemeTemplate />

      <div className="flex flex-col gap-2">
        <div className="flex gap-2 flex-wrap">
          <PopoverColor disabled={state.theme && themeName in presets && presets[themeName as keyof typeof presets]?.ui?.disabled?.color} />
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

          <PopoverDisplay />
        </div>
      </div>
      {children}
    </div>
  );
}

function ConfirmModal({ onDiscard }: { onDiscard: () => void }) {
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
