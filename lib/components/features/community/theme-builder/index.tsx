'use client';
import React from 'react';
import { useAtom } from 'jotai';
import clsx from 'clsx';
import getPalette from 'tailwindcss-palette-generator';
import { merge } from 'lodash';

import { useMutation, useQuery } from '$lib/graphql/request';
import {
  FileCategory,
  GetSystemFilesDocument,
  GetSystemFilesQuery,
  GetSystemFilesQueryVariables,
  Space,
  SystemFileBase,
  UpdateSpaceDocument,
} from '$lib/graphql/generated/backend/graphql';
import { Button, Card, Menu, MenuItem } from '$lib/components/core';

import {
  themeAtom,
  presets,
  ThemeValues,
  fonts,
  getRandomColor,
  getRandomFont,
  patterns,
  shaders,
  defaultTheme,
} from './store';
import { PopoverFont } from './popover-font';
import { PopoverColor, PopoverShaderColor } from './popover-color';
import { PopoverEmpty, PopoverPattern } from './popover-style';
import { PopoverImage } from './popover-image';

type Props = {
  space?: Space | null;
  onClose: (saved: boolean) => void;
  onSave: () => void;
};

export function ThemeBuilder({ space, onClose, onSave }: Props) {
  const [updateCommunity, { loading }] = useMutation(UpdateSpaceDocument);

  const [saved, setSaved] = React.useState(true);
  const [data, onChange] = useAtom(themeAtom);
  const { theme, font_title, font_body, config, variables } = data;

  const { data: dataImages, loading: loadingImages } = useQuery<GetSystemFilesQuery, GetSystemFilesQueryVariables>(
    GetSystemFilesDocument,
    {
      variables: { categories: [FileCategory.SpaceDarkTheme, FileCategory.SpaceLightTheme] },
    },
  );
  const images = (dataImages?.getSystemFiles || []) as SystemFileBase[];

  const handleChange = (values: Partial<ThemeValues>) => {
    setSaved(false);
    onChange((prev) => merge({ ...prev, ...values }));
  };

  React.useEffect(() => {
    onClose(saved);
  }, [onClose, saved]);

  return (
    <div className="flex flex-col gap-6 max-w-[1080px] m-auto py-6 px-4">
      <div className="flex flex-1 gap-3 overflow-x no-scrollbar justify-center">
        {Object.entries(presets).map(([key, value]) => (
          <div key={key} className="flex flex-col gap-2 items-center">
            <Card.Root
              key={key}
              className={clsx(
                'p-0 bg-transparent border-transparent transition-all hover:outline-2 hover:outline-offset-2 hover:outline-primary/16 rounded-sm',
                theme === key && 'outline-2 outline-offset-2 outline-primary!',
              )}
              onClick={() => {
                const mainEl = document.querySelector('main');

                switch (key) {
                  case 'shader':
                    let shaderName = space?.theme_data?.config?.name;
                    let fg = space?.theme_data?.config?.fg;
                    if (!shaderName || !shaders.includes(shaderName)) {
                      const index = Math.floor(Math.random() * shaders.length);
                      shaderName = shaders[index].name;
                      fg = shaders[index].accent;
                    }

                    mainEl?.removeAttribute('style');
                    handleChange({ theme: 'shader', config: { name: shaderName, fg, mode: 'dark' } });
                    document.getElementById(space?._id)?.setAttribute('class', config?.mode || 'dark');
                    break;

                  case 'pattern':
                    let patternName = space?.theme_data?.class || space?.theme_data?.config?.name;

                    if (!patternName || !patterns.includes(patternName)) {
                      const index = Math.floor(Math.random() * patterns.length);
                      patternName = patterns[index];
                    }
                    document.getElementById(space?._id)?.setAttribute('class', 'dark');
                    handleChange({ theme: key as any, config: { mode: 'dark', name: patternName } });
                    break;

                  case 'image':
                    let imageId = space?.theme_data?.config?.name;
                    let bg = space?.theme_data?.config?.bg;
                    let mode = space?.theme_data?.config?.mode;
                    if (!imageId) {
                      const index = Math.floor(Math.random() * images.length);
                      imageId = images[index]?._id;
                      bg = images[index]?.url;
                      mode = images[index]?.category === FileCategory.SpaceLightTheme ? 'light' : 'dark';
                    }

                    mainEl?.removeAttribute('style');
                    document.getElementById(space?._id)?.setAttribute('class', mode);
                    mainEl?.style.setProperty('--color-background', `url(${bg})`);
                    handleChange({
                      theme: 'image',
                      config: { ...config, name: imageId, bg, mode },
                      variables: { ...variables, image: { '--color-background': `url(${bg})` } },
                    });

                    break;

                  default:
                    // should set default dark when switch theme
                    mainEl?.removeAttribute('style');
                    document.getElementById(space?._id)?.setAttribute('class', 'dark');
                    handleChange({ theme: key as any, config: { mode: 'dark' } });
                    break;
                }
              }}
            >
              <img src={value.image} className="rounded-sm" width={80} height={56} alt={key} />
            </Card.Root>

            <p className="capitalize font-medium text-xs">{value.name}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex gap-2 flex-wrap">
          <PopoverColor
            label="Accent"
            colorClass="item-color-fg"
            selected={config?.fg}
            disabled={theme && presets[theme].ui?.disabled?.fg}
            onSelect={(color, hex) => {
              let customColors: Record<string, string> = {};
              if (color === 'custom' && hex) {
                const palette = getPalette([
                  { color: hex, name: 'custom', shade: 500, shades: [50, 100, 200, 300, 500, 700, 950] },
                ]) as unknown as {
                  custom: { 500: string; 950: string; 700: string; 50: string; 100: string; 200: string; 300: string };
                };
                const el: any = document.querySelector(':root');
                el?.style.setProperty('--color-custom-50', palette.custom[50]);
                el?.style.setProperty('--color-custom-100', palette.custom[100]);
                el?.style.setProperty('--color-custom-200', palette.custom[200]);
                el?.style.setProperty('--color-custom-300', palette.custom[300]);
                el?.style.setProperty('--color-custom-500', palette.custom[500]);
                el?.style.setProperty('--color-custom-700', palette.custom[700]);
                el?.style.setProperty('--color-custom-950', palette.custom[950]);

                customColors = {
                  '--color-custom-50': palette.custom[50],
                  '--color-custom-100': palette.custom[100],
                  '--color-custom-200': palette.custom[200],
                  '--color-custom-300': palette.custom[300],
                  '--color-custom-500': palette.custom[500],
                  '--color-custom-700': palette.custom[700],
                  '--color-custom-950': palette.custom[950],
                };
              }

              const conf = {
                config: { ...config, fg: color },
                variables: { ...variables, custom: { ...customColors } },
              };

              if (theme === 'minimal') {
                conf.config.name = color;
                conf.config.bg = color;
              }

              handleChange(conf);
            }}
          />

          {(!theme || ['minimal', 'pattern'].includes(theme)) && (
            <PopoverColor
              label="Background"
              colorClass="item-color-bg"
              selected={config?.bg}
              disabled={theme && presets[theme] && presets[theme].ui?.disabled?.bg}
              onSelect={(color, hex) => {
                let customColors: Record<string, string> = {};

                if (color === 'custom' && hex) {
                  const palette = getPalette([
                    { color: hex, name: 'custom', shade: 500, shades: [50, 500, 100, 200, 300, 700, 950] },
                  ]) as unknown as {
                    custom: {
                      500: string;
                      950: string;
                      700: string;
                      50: string;
                      100: string;
                      200: string;
                      300: string;
                    };
                  };
                  const el: any = document.querySelector(':root');
                  el?.style.setProperty('--color-custom-50', palette.custom[50]);
                  el?.style.setProperty('--color-custom-100', palette.custom[100]);
                  el?.style.setProperty('--color-custom-200', palette.custom[200]);
                  el?.style.setProperty('--color-custom-300', palette.custom[300]);
                  el?.style.setProperty('--color-custom-950', palette.custom[950]);

                  customColors = {
                    '--color-custom-50': palette.custom[50],
                    '--color-custom-100': palette.custom[100],
                    '--color-custom-200': palette.custom[200],
                    '--color-custom-300': palette.custom[300],
                    '--color-custom-950': palette.custom[950],
                  };
                }

                handleChange({
                  config: { ...config, bg: color },
                  variables: { ...variables, custom: { ...variables.custom, ...customColors } },
                });
              }}
            />
          )}

          {theme === 'image' && (
            <PopoverImage
              images={images}
              selected={images.find((item) => config.name === item._id)}
              onSelect={(value) => {
                const mode = value?.category === FileCategory.SpaceLightTheme ? 'light' : 'dark';
                document.getElementById(space?._id)?.setAttribute('class', mode);
                const el: any = document.querySelector('main');
                el?.style.setProperty('--color-background', `url(${value.url})`);
                handleChange({
                  config: { ...config, bg: value.url, name: value._id, mode },
                  variables: { ...variables, image: { '--color-background': `url(${value.url})` } },
                });
              }}
            />
          )}

          {(!theme || ['minimal', 'image'].includes(theme)) && <PopoverEmpty />}

          {theme === 'shader' && (
            <>
              <PopoverShaderColor
                label="Background"
                selected={config?.name}
                onSelect={(item) =>
                  handleChange({ config: { ...config, name: item.name, fg: item.accent, bg: item.accent } })
                }
              />
              <PopoverEmpty />
            </>
          )}

          {theme === 'pattern' && (
            <PopoverPattern
              label="Pattern"
              colorClass={config?.fg}
              selected={config?.name}
              onSelect={(name) => handleChange({ config: { ...config, name: name } })}
            />
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex gap-2 flex-wrap">
          <PopoverFont
            label="Title"
            fonts={fonts.title}
            selected={font_title}
            onSelect={(font) =>
              handleChange({
                font_title: font,
                variables: { ...variables, font: { ...variables.font, '--font-title': fonts.title[font] } },
              })
            }
          />
          <PopoverFont
            label="Body"
            fonts={fonts.body}
            selected={font_body}
            onSelect={(font) =>
              handleChange({
                font_body: font,
                variables: { ...variables, font: { ...variables.font, '--font-body': fonts.title[font] } },
              })
            }
          />

          <Menu.Root
            className="flex-1 mix-w-1/3"
            placement="top"
            strategy="fixed"
            disabled={theme && presets[theme] && presets[theme].ui?.disabled?.mode}
          >
            <Menu.Trigger>
              <div
                className="w-full bg-primary/8 text-tertiary px-2.5 py-2 rounded-sm flex items-center gap-2"
                onClick={(e) => {
                  if (theme && presets[theme] && presets[theme].ui?.disabled?.mode) {
                    e.preventDefault();
                    return;
                  }

                  if (['light', 'auto'].includes(config.mode as string)) {
                    document.getElementById(space?._id)?.setAttribute('class', 'dark');
                    handleChange({ config: { ...config, mode: 'dark' } });
                  } else {
                    document.getElementById(space?._id)?.setAttribute('class', 'light');
                    handleChange({ config: { ...config, mode: 'light' } });
                  }
                }}
              >
                {config.mode === 'dark' ? (
                  <i className="icon-clear-night text-blue-400" />
                ) : (
                  <i className="icon-dark-theme-filled size-[24px] rounded-full" />
                )}

                <span className="text-left flex-1">Display</span>
                <p className="flex items-center gap-1">
                  <span className="capitalize">{config?.mode === 'system' ? 'auto' : config?.mode}</span>
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
              if (space?._id) {
                await updateCommunity({
                  variables: { id: space._id, input: { theme_data: null } },
                  onComplete: (client) => {
                    handleChange(defaultTheme);
                    document.getElementById(space._id)?.setAttribute('class', 'dark');
                    const el = document.querySelector('main');
                    el?.removeAttribute('style');
                    setSaved(true);
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
            disabled={theme !== 'minimal'}
            onClick={async () => {
              const [fontTitle, fontTitleValue] = getRandomFont('title');
              const [fontBody, fontBodyValue] = getRandomFont('body');

              const color = getRandomColor();
              handleChange({
                font_title: fontTitle,
                font_body: fontBody,
                config: { fg: color, bg: color, name: color },
                variables: {
                  ...variables,
                  font: {
                    '--font-title': fontTitleValue,
                    '--font-body': fontBodyValue,
                  },
                },
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
              if (space?._id) {
                await updateCommunity({
                  variables: { id: space._id, input: { theme_data: data } },
                  onComplete: (client) => {
                    client.writeFragment<Space>({ id: `Space:${space._id}`, data: { theme_data: data } });
                    onSave();
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
  );
}
