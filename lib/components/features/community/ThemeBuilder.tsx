'use client';
import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import getPalette from 'tailwindcss-palette-generator';
import { useForm, Controller } from 'react-hook-form';
import { merge } from 'lodash';

import { generateCssVariables } from '$lib/utils/fetchers';
import { Button, Card } from '$lib/components/core';
import { Menu } from '$lib/components/core/menu';

import { join, split } from 'lodash';
import { useMutation } from '$lib/request';
import { Space, UpdateSpaceDocument } from '$lib/generated/backend/graphql';
import { ColorPreset, fonts, getRandomColor, getRandomFont, PresetKey, presets } from './themes_preset/constants';
import { ColorPicker } from '$lib/components/core/color-picker/color-picker';
// import { ShaderGradient } from './themes_preset/shader';

type FormValues = {
  theme: PresetKey;
  mode: 'dark' | 'light';
  class?: string;
  foreground: { key: string; value: string };
  background: { key: string; value: string };
  font_title: string;
  font_body: string;
  variables: {
    font: Record<string, string>;
    dark: Record<string, string | number>;
    light: Record<string, string | number>;
    pattern: Record<string, string>;
  };
};

const defaultValues: FormValues = {
  theme: 'minimal',
  class: '',
  mode: 'dark',
  foreground: { key: 'violet', value: 'violet' },
  background: { key: 'violet', value: 'violet' },
  font_title: 'default',
  font_body: 'default',
  variables: {
    font: {},
    dark: { '--pattern-opacity': 0.3 },
    light: {
      '--pattern-opacity': 0,
    },
    pattern: {
      '--pattern-50': `var(--color-accent-50)`,
      '--pattern-100': `var(--color-accent-100)`,
      '--pattern-200': `var(--color-accent-200)`,
      '--pattern-300': `var(--color-accent-300)`,
    },
  },
};

export default function ThemeBuilder({
  space,
  onClose,
  onSave,
}: {
  space?: Space | null;
  onClose: (saved: boolean) => void;
  onSave: () => void;
}) {
  const themeData = space?.theme_data;
  const form = useForm<FormValues>({ defaultValues: merge(defaultValues, themeData) });
  const variables = form.watch('variables');
  const theme = form.watch('theme');

  const [updateCommunity, { loading }] = useMutation(UpdateSpaceDocument);

  const onSubmit = async (values: FormValues) => {
    if (space?._id) {
      await updateCommunity({
        variables: { id: space._id, input: { theme_data: values } },
        onComplete: (client) => {
          client.writeFragment<Space>({ id: `Space:${space._id}`, data: { theme_data: values } });
        },
      });
    }
    onSave();
  };

  React.useEffect(() => {
    onClose(!form.formState.isDirty);
  }, [onClose, form.formState.isDirty]);

  return (
    <>
      {variables && (
        <style jsx global>
          {`
            body {
              ${variables.font && generateCssVariables(variables.font)}
            }

            @media (prefers-color-scheme: dark) {
              :root {
                main {
                  ${variables.dark && generateCssVariables(variables.dark)}
                }
              }
            }

            @media (prefers-color-scheme: light) {
              :root {
                main {
                  ${variables.light && generateCssVariables(variables.light)}
                }
              }
            }

            :root {
              main {
                ${variables.pattern && generateCssVariables(variables.pattern)}
              }
            }
          `}
        </style>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6 max-w-[1080px] m-auto py-6 px-4">
          <Controller
            name="theme"
            control={form.control}
            render={({ field }) => (
              <div className="flex flex-1 gap-3 overflow-x no-scrollbar justify-center">
                {Object.entries(presets).map(([key, value]) => (
                  <div key={key} className="flex flex-col gap-2 items-center">
                    <Card.Root
                      key={key}
                      className={clsx(
                        'p-0 bg-transparent border-transparent transition-all hover:outline-2 hover:outline-offset-2 hover:ring-tertiary rounded-sm',
                        field.value === key && 'outline-2 outline-offset-2 ring-tertiary',
                      )}
                      onClick={() => {
                        if (key === 'pattern') {
                          const assets = presets.pattern.assets || [];

                          const index = Math.floor(Math.random() * assets.length);
                          const value = assets[index];
                          form.setValue('class', value);
                          document.getElementById('pattern')?.setAttribute('class', `pattern ${value}`);
                        } else {
                          // TODO: support minimal and pattern for now. Need to check when add more theme
                          document.getElementById('pattern')?.removeAttribute('class');
                        }

                        form.setValue('theme', key as PresetKey);
                      }}
                    >
                      <img src={value.image} className="rounded-sm" width={80} height={56} alt={key} />
                    </Card.Root>

                    <p className="capitalize font-medium text-xs">{key === 'violet' ? 'default' : key}</p>
                  </div>
                ))}
              </div>
            )}
          />

          <div className="flex flex-col gap-2">
            <div className="flex gap-2 flex-wrap w-full">
              <Controller
                name="foreground"
                control={form.control}
                render={({ field }) => {
                  const values = form.getValues();
                  const colors = presets[theme].colors;
                  const mode = values.mode;

                  return (
                    <PopoverColor
                      label="Accent"
                      name={field?.value?.key}
                      mode="default"
                      defaultValue={field?.value?.value}
                      colors={colors}
                      onSelect={({ key, color }) => {
                        let bgColor = color;
                        form.setValue('foreground', { key, value: color });
                        let cssVars = {
                          dark: {
                            '--color-accent-500': `var(--color-${key}-500)`,
                            '--color-accent-700': `var(--color-${key}-700)`,
                            '--color-background': `var(--color-${key}-950)`,
                          },
                          light: {
                            '--color-accent-500': `var(--color-${key}-500)`,
                            '--color-accent-700': `var(--color-${key}-700)`,
                            '--color-background': `var(--color-${key}-50)`,
                          },
                          pattern: {
                            '--pattern-50': `var(--color-${key}-50)`,
                            '--pattern-100': `var(--color-${key}-100)`,
                            '--pattern-200': `var(--color-${key}-200)`,
                            '--pattern-300': `var(--color-${key}-300)`,
                          },
                        };

                        if (key === 'custom' && color) {
                          const palette = getPalette([
                            { color, name: key, shade: 500, shades: [50, 100, 200, 300, 500, 700, 950] },
                          ]) as unknown as {
                            custom: {
                              500: string;
                              700: string;
                              950: string;
                              50: string;
                              100: string;
                              200: string;
                              300: string;
                            };
                          };
                          bgColor = palette.custom[mode === 'dark' ? 950 : 50];

                          cssVars = {
                            dark: {
                              '--color-accent-500': palette.custom[500],
                              '--color-accent-700': palette.custom[700],
                              '--color-background': palette.custom[950],
                            },
                            light: {
                              '--color-accent-500': palette.custom[500],
                              '--color-accent-700': palette.custom[700],
                              '--color-background': palette.custom[50],
                            },
                            pattern: {
                              '--pattern-50': palette.custom[50],
                              '--pattern-100': palette.custom[100],
                              '--pattern-200': palette.custom[200],
                              '--pattern-300': palette.custom[300],
                            },
                          };
                        }

                        form.setValue('background', { key, value: bgColor });
                        form.setValue('variables', merge(variables, cssVars), { shouldDirty: true });
                      }}
                    />
                  );
                }}
              />

              <Controller
                name="background"
                control={form.control}
                render={({ field }) => {
                  const values = form.getValues();
                  const colors = presets[theme].colors;
                  const mode = values.mode;

                  return (
                    <PopoverColor
                      label="Background"
                      name={field?.value?.key}
                      defaultValue={field?.value?.value}
                      mode={mode}
                      colors={colors}
                      onSelect={({ key, color }) => {
                        form.setValue('background', { key, value: color });
                        let cssVars = {
                          dark: {
                            '--color-background': `var(--color-${key}-950)`,
                          },
                          light: {
                            '--color-tertiary': `var(--color-black)`,
                            '--color-foreground': `var(--color-black)`,
                            '--color-background': `var(--color-${key}-50)`,
                          },
                        };

                        if (key === 'custom' && color) {
                          const palette = getPalette([
                            { color, name: key, shade: 500, shades: [50, 500, 950] },
                          ]) as unknown as { custom: { 500: string; 950: string; 50: string } };

                          cssVars = {
                            dark: {
                              '--color-background': palette.custom[950],
                            },
                            light: {
                              '--color-tertiary': `var(--color-black)`,
                              '--color-foreground': `var(--color-black)`,
                              '--color-background': palette.custom[50],
                            },
                          };
                        }

                        form.setValue('variables', merge(variables, cssVars), { shouldDirty: true });
                      }}
                    />
                  );
                }}
              />

              <Controller
                name="class"
                control={form.control}
                render={({ field }) => {
                  return (
                    <Menu.Root className="flex-1" disabled={!presets[theme].assets} strategy="fixed" placement="top">
                      <Menu.Trigger>
                        <div className="w-full bg-primary/8 text-tertiary px-2.5 py-2 rounded-sm flex items-center gap-2">
                          <div className="w-[24px] h-[24px] rounded-full">
                            <div
                              // @ts-expect-error allow vars inline
                              style={{ ...variables.pattern, '--pattern-opacity': 1 }}
                              className={`pattern ${field.value} rounded-full w-full h-full relative!`}
                            />
                          </div>
                          <span className="text-left flex-1">Pattern</span>
                          <p className="flex items-center gap-1">
                            <span className="capitalize">{field.value}</span>
                            <i className="icon-chevrons-up-down text-quaternary" />
                          </p>
                        </div>
                      </Menu.Trigger>
                      <Menu.Content className="flex gap-3 max-w-[356px] flex-wrap">
                        {presets[theme].assets?.map((item) => (
                          <div
                            key={item}
                            className="capitalize flex flex-col items-center cursor-pointer"
                            onClick={() => {
                              form.setValue('class', item);
                              const cssVars = {
                                dark: {
                                  '--pattern-opacity': 0.3,
                                },
                                light: {
                                  '--pattern-opacity': 0,
                                },
                              };
                              document.getElementById('pattern')?.setAttribute('class', `pattern ${item}`);
                              form.setValue('variables', merge(variables, cssVars), { shouldDirty: true });
                            }}
                          >
                            <div
                              className={clsx(
                                'w-16! h-16! rounded-full p-1 border-2 border-transparent mb-1 overflow-hidden',
                                field.value === item && 'border-white',
                              )}
                            >
                              <div
                                // @ts-expect-error allow vars inline
                                style={{ ...variables.pattern, '--pattern-opacity': 1 }}
                                className={twMerge('pattern rounded-full relative! w-full h-full', item)}
                              />
                            </div>
                            {item}
                          </div>
                        ))}
                      </Menu.Content>
                    </Menu.Root>
                  );
                }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex gap-2 flex-wrap w-full">
              <Controller
                name="font_title"
                control={form.control}
                render={({ field }) => {
                  return (
                    <PopoverFont
                      label="title"
                      name={field.value}
                      fonts={fonts.title}
                      onSelect={(font) => {
                        form.setValue('font_title', font, { shouldDirty: true });
                        form.setValue('variables', merge(variables, { font: { '--font-title': fonts.title[font] } }), {
                          shouldDirty: true,
                        });
                      }}
                    />
                  );
                }}
              />

              <Controller
                name="font_body"
                control={form.control}
                render={({ field }) => {
                  return (
                    <PopoverFont
                      label="body"
                      name={field.value}
                      fonts={fonts.body}
                      onSelect={(font) => {
                        form.setValue('font_body', font, { shouldDirty: true });
                        form.setValue('variables', merge(variables, { font: { '--font-body': fonts.body[font] } }), {
                          shouldDirty: true,
                        });
                      }}
                    />
                  );
                }}
              />

              <Menu.Root className="flex-1" disabled>
                <Menu.Trigger>
                  <div className="w-full bg-primary/8 text-tertiary px-2.5 py-2 rounded-sm flex items-center gap-2">
                    <i className="icon-dark-theme-filled size-[24px] rounded-full" />
                    <span className="text-left flex-1">Display</span>
                    <p className="flex items-center gap-1">
                      <span className="capitalize">Auto</span>
                      <i className="icon-chevrons-up-down text-quaternary" />
                    </p>
                  </div>
                </Menu.Trigger>
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
                  form.reset(defaultValues);
                  if (space?._id) {
                    await updateCommunity({
                      variables: { id: space._id, input: { theme_data: null } },
                      onComplete: (client) => {
                        client.writeFragment<Space>({ id: `Space:${space._id}`, data: { theme_data: null } });
                      },
                    });
                  }
                }}
              />
              <Button
                size="sm"
                icon="icon-shuffle"
                variant="tertiary-alt"
                onClick={async () => {
                  const [name, color] = getRandomColor();

                  const random = {
                    font: {
                      '--font-title': getRandomFont('title'),
                      '--font-body': getRandomFont('body'),
                    },
                    dark: {
                      '--pattern-opacity': 0.3,
                      '--color-background': `var(--${color.dark.replace('bg-', 'color-')})`,
                      '--color-accent-500': `var(--${color.default.replace('bg-', 'color-')})`,
                    },
                    light: {
                      '--pattern-opacity': 0,
                      '--color-background': `var(--${color.light.replace('bg-', 'color-')})`,
                      '--color-accent-500': `var(--${color.default.replace('bg-', 'color-')})`,
                    },
                    pattern: {
                      '--pattern-50': `var(--color-${name}-50)`,
                      '--pattern-100': `var(--color-${name}-100)`,
                      '--pattern-200': `var(--color-${name}-200)`,
                      '--pattern-300': `var(--color-${name}-300)`,
                    },
                  };

                  form.setValue('theme', 'minimal');
                  form.setValue('foreground', { key: name, value: name }, { shouldDirty: true });
                  form.setValue('background', { key: name, value: name }, { shouldDirty: true });
                  form.setValue('variables', random, { shouldDirty: true });
                  document.getElementById('pattern')?.removeAttribute('class');
                }}
              />
            </div>
            <div className="flex gap-2">
              {/* <Button variant="tertiary" size="sm"> */}
              {/*   Save Theme */}
              {/* </Button> */}
              <Button size="sm" type="submit" loading={loading}>
                Apply
              </Button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

function PopoverColor({
  label,
  name,
  colors,
  mode = 'default',
  defaultValue,
  disabled = false,
  onSelect,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  mode?: 'default' | 'dark' | 'light';
  disabled?: boolean;
  colors: ColorPreset;
  onSelect: (params: { key: string; color: string }) => void;
}) {
  const [customColor, setCustomColor] = React.useState('');

  React.useEffect(() => {
    if (defaultValue) setCustomColor(defaultValue);
  }, [defaultValue]);

  return (
    <Menu.Root className="flex-1" placement="top" strategy="fixed" disabled={disabled}>
      <Menu.Trigger>
        <div className="w-full bg-primary/8 text-tertiary px-2.5 py-2 rounded-sm flex items-center gap-2">
          <i
            className={twMerge('size-[24px] rounded-full', name !== 'custom' && colors[name] && colors[name][mode])}
            style={customColor && name === 'custom' ? { backgroundColor: customColor } : undefined}
          />

          <span className="text-left flex-1  font-general-sans">{label}</span>
          <p className="flex items-center gap-1">
            <span className="capitalize">{name}</span>
            <i className="icon-chevrons-up-down text-quaternary" />
          </p>
        </div>
      </Menu.Trigger>

      <Menu.Content className="w-fit">
        <div className="grid grid-cols-9 gap-2.5">
          {Object.entries(colors).map(([key, value]) => (
            <div
              key={key}
              onClick={() => {
                onSelect({ key: key, color: key });
                setCustomColor('');
              }}
              className={twMerge(
                value.default,
                'size-5 cursor-pointer hover:outline-2 outline-offset-2 rounded-full',
                clsx(name === key && 'outline-2'),
              )}
            ></div>
          ))}

          <ColorPicker.Root>
            <ColorPicker.Trigger>
              <div
                onClick={() => {
                  if (name === 'custom' && customColor) onSelect({ key: 'custom', color: customColor });
                }}
                className={twMerge(
                  'size-5 cursor-pointer hover:outline-2 outline-offset-2 rounded-full',
                  clsx(name === 'custom' && 'outline-2'),
                )}
                style={{
                  background:
                    (name === 'custom' && customColor) ||
                    'conic-gradient(from 180deg at 50% 50%, rgb(222, 97, 134) 0deg, rgb(197, 95, 205) 58.12deg, rgb(175, 145, 246) 114.38deg, rgb(53, 130, 245) 168.75deg, rgb(69, 194, 121) 208.13deg, rgb(243, 209, 90) 243.75deg, rgb(247, 145, 62) 285deg, rgb(244, 87, 95) 360deg)',
                }}
              ></div>
            </ColorPicker.Trigger>
            <ColorPicker.Content
              color={customColor}
              onChange={(result) => {
                setCustomColor(result.hex);
                onSelect({ key: 'custom', color: result.hex });
              }}
            />
          </ColorPicker.Root>
        </div>
      </Menu.Content>
    </Menu.Root>
  );
}

function PopoverFont({
  label,
  name,
  fonts,
  onSelect,
}: {
  label: 'title' | 'body';
  name: string;
  fonts: Record<string, string>;
  onSelect: (font: string) => void;
}) {
  return (
    <Menu.Root className="flex-1" placement="top" strategy="fixed">
      <Menu.Trigger>
        <div className="w-full bg-primary/8 text-tertiary px-2.5 py-2 rounded-sm flex items-center gap-2">
          <h3 style={{ fontFamily: fonts[name] }} className={clsx(label === 'title' ? 'font-semibold' : 'font-medium')}>
            Ag
          </h3>
          <span className={clsx('flex-1 capitalize')}>{label}</span>
          <p className="flex items-center gap-1 font-general-sans">
            <span className="capitalize">
              {Object.keys(fonts)
                .find((key) => key === name)
                ?.replaceAll('_', ' ')}
            </span>
            <i className="icon-chevrons-up-down text-quaternary" />
          </p>
        </div>
      </Menu.Trigger>

      <Menu.Content className="max-h-80 w-[370px] overflow-scroll no-scrollbar">
        <div className="flex gap-4 flex-wrap">
          {Object.entries(fonts).map(([key, font]) => (
            <div
              key={key}
              className="flex flex-col items-center text-xs gap-2 cursor-pointer"
              onClick={() => onSelect(key)}
            >
              <div
                className={clsx(
                  'border rounded px-4 py-2 w-[72px] h-[56px]',
                  key === name.toLowerCase().replaceAll(' ', '_') && 'border border-primary',
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
    </Menu.Root>
  );
}
