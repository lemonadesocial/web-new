import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import Image from 'next/image';

import { generateCssVariables } from '$lib/utils/fetchers';
import { Button, Card } from '$lib/components/core';
import { Menu } from '$lib/components/core/menu';

import { join, split } from 'lodash';
import { useMutation } from '$lib/request';
import { Space, UpdateSpaceDocument } from '$lib/generated/backend/graphql';
import { ColorPreset, fonts, presets } from './themes_preset/constants';

type Styled = {
  font: Record<string, string>;
  dark: Record<string, string>;
  light: Record<string, string>;
  prefersColor: boolean;
};

type KeyPreset = 'minimal' | 'gradient';

export default function ThemeBuilder({ space }: { space?: Space | null }) {
  const [variables, setVariables] = React.useState<Styled>(space?.theme_data?.variables);
  const [selected, setSelected] = React.useState<KeyPreset>(space?.theme_data?.name || 'minimal');
  const [color, setColor] = React.useState<{
    forceground: keyof ColorPreset;
    background: keyof ColorPreset;
    mode: 'default' | 'dark' | 'light';
  }>({
    forceground: space?.theme_data?.forceground || 'violet',
    background: space?.theme_data?.background || 'violet',
    mode: 'dark',
  });

  const [font, setFont] = React.useState<{ title: string; body: string }>({
    title: 'default',
    body: 'default',
  });

  const [updateCommunity, { loading }] = useMutation(UpdateSpaceDocument);
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
                ${variables.light && generateCssVariables(variables.light)}
              }
            }
          `}
        </style>
      )}

      <div className="flex flex-col gap-6 w-[1080px] m-auto py-6">
        <div className="flex flex-1 gap-3 overflow-x no-scrollbar justify-center">
          {Object.entries(presets).map(([key, value]) => (
            <div key={key} className="flex flex-col gap-2 items-center">
              <Card
                key={key}
                className={clsx(
                  'p-0 bg-transparent border-transparent transition-all hover:outline-2 hover:outline-offset-2 hover:ring-tertiary rounded-sm',
                  selected === key && 'outline-2 outline-offset-2 ring-tertiary',
                )}
                onClick={() => {
                  // setStyled(value);
                  setSelected(key as KeyPreset);
                }}
              >
                <Image src={value.image} className="rounded-sm" width={80} height={56} alt={key} />
              </Card>

              <p className="capitalize font-medium text-xs">{key === 'violet' ? 'default' : key}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 w-full">
          <PopoverColor
            label="Accent"
            name={color.forceground}
            mode="default"
            colors={presets[selected].colors}
            onSelect={(color) => {
              setColor((prev) => ({ ...prev, forceground: color }));
              setVariables((prev) => ({
                ...prev,
                dark: {
                  ...prev?.dark,
                  '--color-primary-500': `var(--color-${color}-500)`,
                },
                light: {
                  ...prev?.light,
                  '--color-primary-500': `var(--color-${color}-500)`,
                },
              }));
            }}
          />

          <PopoverColor
            label="Background"
            name={color.background}
            mode={color.mode}
            colors={presets[selected].colors}
            onSelect={(color) => {
              setColor((prev) => ({ ...prev, background: color }));

              setVariables((prev) => ({
                ...prev,
                dark: {
                  ...prev?.dark,
                  '--color-background': `var(--color-${color}-950)`,
                },
                light: {
                  ...prev?.light,
                  '--color-tertiary': `var(--color-black)`,
                  '--color-forceground': `var(--color-black)`,
                  '--color-background': `var(--color-${color}-50)`,
                },
              }));
            }}
          />

          <Menu className="flex-1" disabled>
            <Menu.Trigger>
              <div className="w-full bg-tertiary/8 text-tertiary/56 px-2.5 py-2 rounded-sm flex items-center gap-2">
                <i className="size-[24px] rounded-full bg-tertiary/24" />
                <span className="text-left flex-1">Display</span>
                <p className="flex items-center gap-1">
                  <span className="capitalize">Auto</span>
                  <i className="icon-chevrons-up-down text-tertiary/24" />
                </p>
              </div>
            </Menu.Trigger>
          </Menu>
        </div>

        <div className="flex gap-2 w-full">
          <PopoverFont
            label="title"
            name={font.title}
            fonts={fonts.title}
            onSelect={(font) => {
              setFont((prev) => ({ ...prev, title: font }));
              setVariables((prev) => ({
                ...prev,
                font: { ...prev.font, '--font-title': fonts.title[font] },
              }));
            }}
          />
          <PopoverFont
            label="body"
            name={font.body}
            fonts={fonts.body}
            onSelect={(font) => {
              console.log(font);
              setFont((prev) => ({ ...prev, body: font }));
              setVariables((prev) => ({
                ...prev,
                font: { ...prev.font, '--font-body': fonts.body[font] },
              }));
            }}
          />

          <Menu className="flex-1" disabled>
            <Menu.Trigger>
              <div className="w-full bg-tertiary/8 text-tertiary/56 px-2.5 py-2 rounded-sm flex items-center gap-2">
                <i className="icon-dark-theme-filled size-[24px] rounded-full" />
                <span className="text-left flex-1">Display</span>
                <p className="flex items-center gap-1">
                  <span className="capitalize">Auto</span>
                  <i className="icon-chevrons-up-down text-tertiary/24" />
                </p>
              </div>
            </Menu.Trigger>
          </Menu>
        </div>

        <div className="flex justify-between">
          <div>
            <Button
              size="sm"
              icon="icon-shuffle"
              variant="flat"
              className="bg-tertiary/8 hover:bg-tertiary/16 text-tertiary/56"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="tertiary" size="sm">
              Save Theme
            </Button>
            <Button
              size="sm"
              loading={loading}
              onClick={() => {
                if (space) {
                  const theme_data = { name: selected, color, variables };
                  console.log(theme_data);
                  updateCommunity({
                    variables: { id: space._id, input: { theme_data } },
                    onComplete: (client) => {
                      client.writeFragment<Space>({ id: `Space:${space._id}`, data: { theme_data } });
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
    </>
  );
}

function PopoverColor({
  label,
  name,
  colors,
  mode,
  onSelect,
}: {
  label: string;
  name: string;
  mode?: 'default' | 'dark' | 'light';
  colors: ColorPreset;
  onSelect: (color: string) => void;
}) {
  return (
    <Menu className="flex-1">
      <Menu.Trigger>
        <div className="w-full bg-tertiary/8 text-tertiary/56 px-2.5 py-2 rounded-sm flex items-center gap-2">
          <i className={twMerge('size-[24px] rounded-full', colors[name][mode])} />
          <span className="text-left flex-1  font-general-sans">{label}</span>
          <p className="flex items-center gap-1">
            <span className="capitalize">{name}</span>
            <i className="icon-chevrons-up-down text-tertiary/24" />
          </p>
        </div>
      </Menu.Trigger>

      <Menu.Content>
        <div className="flex flex-wrap items-center gap-2.5">
          {Object.entries(colors).map(([key, value]) => (
            <div
              key={key}
              onClick={() => onSelect(key)}
              className={twMerge(
                value.default,
                'size-5 cursor-pointer hover:outline-2 outline-offset-2 rounded-full',
                clsx(name === key && 'outline-2'),
              )}
            ></div>
          ))}
        </div>
      </Menu.Content>
    </Menu>
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
    <Menu className="flex-1" contentClass="max-h-38 overflow-scroll no-scrollbar">
      <Menu.Trigger>
        <div className="w-full bg-tertiary/8 text-tertiary/56 px-2.5 py-2 rounded-sm flex items-center gap-2">
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
            <i className="icon-chevrons-up-down text-tertiary/24" />
          </p>
        </div>
      </Menu.Trigger>

      <Menu.Content>
        <div className="grid grid-cols-4 gap-5">
          {Object.entries(fonts).map(([key, font]) => (
            <div
              key={key}
              className="flex flex-col items-center text-xs gap-2 cursor-pointer"
              onClick={() => onSelect(key)}
            >
              <div
                className={clsx(
                  'border rounded px-4 py-2',
                  key === name.toLowerCase().replaceAll(' ', '_') && 'border border-tertiary',
                )}
              >
                <h3 style={{ fontFamily: font }}>Ag</h3>
              </div>
              <p className="capitalize font-general-sans">{join(split(key, '_'), ' ')}</p>
            </div>
          ))}
        </div>
      </Menu.Content>
    </Menu>
  );
}
