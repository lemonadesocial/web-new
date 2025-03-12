import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import Image from 'next/image';

import { generateCssVariables } from '$lib/utils/fetchers';
import { Button, Card } from '$lib/components/core';
import { Menu } from '$lib/components/core/menu';

import MinimalPreview from './themes_preview/minimal.png';
import { join, split } from 'lodash';
import { useMutation } from '$lib/request';
import { Space, UpdateSpaceDocument } from '$lib/generated/backend/graphql';

const preview = {
  minimal: {
    prefersColor: true,
    image: MinimalPreview,
    font: {
      '--font-title': 'var(--font-class-display)',
      '--font-body': 'var(--font-general-sans)',
    },
    dark: {
      '--color-background': 'var(--color-woodsmoke-950)',
      '--color-primary-500': 'var(--color-violet-500)',
    },
    light: {
      '--color-primary-500': 'var(--color-violet-500)',
      '--color-background': 'var(--color-woodsmoke-50)',
    },
  },
};

const defaultTheme = {
  prefersColor: true,
  font: {
    '--font-title': 'var(--font-class-display)',
    '--font-body': 'var(--font-general-sans)',
  },
  dark: {
    '--color-background': 'var(--color-woodsmoke-950)',
    '--color-primary-500': 'var(--color-violet-500)',
  },
  light: {
    '--color-background': 'var(--color-woodsmoke-50)',
    '--color-primary-500': 'var(--color-violet-500)',
  },
};

const colors: Record<string, { light: string; dark: string; default: string }> = {
  violet: { light: 'bg-violet-50', default: 'bg-violet-500', dark: 'bg-violet-950' },
  red: { light: 'bg-red-50', default: 'bg-red-500', dark: 'bg-red-950' },
  orange: { light: 'bg-orange-50', default: 'bg-orange-500', dark: 'bg-orange-950' },
  amber: { light: 'bg-amber-50', default: 'bg-amber-500', dark: 'bg-amber-950' },
  yellow: { light: 'bg-yellow-50', default: 'bg-yellow-500', dark: 'bg-yellow-950' },
  lime: { light: 'bg-lime-50', default: 'bg-lime-500', dark: 'bg-lime-950' },
  green: { light: 'bg-green-50', default: 'bg-green-500', dark: 'bg-green-950' },
  emerald: { light: 'bg-emerald-50', default: 'bg-emerald-500', dark: 'bg-emerald-950' },
  teal: { light: 'bg-teal-50', default: 'bg-teal-500', dark: 'bg-teal-950' },
  cyan: { light: 'bg-cyan-50', default: 'bg-cyan-500', dark: 'bg-cyan-950' },
  sky: { light: 'bg-sky-50', default: 'bg-sky-500', dark: 'bg-sky-950' },
  blue: { light: 'bg-blue-50', default: 'bg-blue-500', dark: 'bg-blue-950' },
  indigo: { light: 'bg-indigo-50', default: 'bg-indigo-500', dark: 'bg-indigo-950' },
  purple: { light: 'bg-purple-50', default: 'bg-purple-500', dark: 'bg-purple-950' },
  fuchsia: { light: 'bg-fuchsia-50', default: 'bg-fuchsia-500', dark: 'bg-fuchsia-950' },
  pink: { light: 'bg-pink-50', default: 'bg-pink-500', dark: 'bg-pink-950' },
  rose: { light: 'bg-rose-50', default: 'bg-rose-500', dark: 'bg-rose-950' },
};

const fonts: { title: Record<string, string>; body: Record<string, string> } = {
  title: {
    default: 'var(--font-class-display)',
    aktura: 'var(--font-aktura)',
    array: 'var(--font-array)',
    sarpanch: 'var(--font-sarpanch)',
    chillax: 'var(--font-chillax)',
    chubbo: 'var(--font-chubbo)',
    comico: 'var(--font-comico)',
    khand: 'var(--font-khand)',
    melodrama: 'var(--font-melodrama)',
    poppins: 'var(--font-poppins)',
    quilon: 'var(--font-quilon)',
    sharpie: 'var(--font-sharpie)',
    rubik_dirt: 'var(--font-rubik-dirt)',
    stencil: 'var(--font-stencil)',
    tanker: 'var(--font-tanker)',
    technor: 'var(--font-technor)',
    zina: 'var(--font-zina)',
    zodiak: 'var(--font-zodiak)',
  },
  body: {
    default: 'var(--font-general-sans)',
    archivo: 'var(--font-archivo)',
    azeret_mono: 'var(--font-azeret-mono)',
    ranade: 'var(--font-ranade)',
    sentient: 'var(--font-sentient)',
    spline_sans: 'var(--font-spline-sans)',
    supreme: 'var(--font-supreme)',
    synonym: 'var(--font-synonym)',
  },
};

type Styled = {
  font: Record<string, string>;
  dark: Record<string, string>;
  light: Record<string, string>;
  prefersColor: boolean;
};

export default function ThemeBuilder({ space }: { space?: Space | null }) {
  const [mode] = React.useState<'light' | 'dark'>('dark');
  const [styled, setStyled] = React.useState<Styled>(space?.theme_data || defaultTheme);

  const [forceground, setForceground] = React.useState('violet');
  const [background, setBackground] = React.useState('violet');
  const [fontTitle, setFontTitle] = React.useState('default');
  const [fontBody, setFontBody] = React.useState('default');

  const [updateCommunity, { loading }] = useMutation(UpdateSpaceDocument);

  return (
    <>
      {styled && (
        <style jsx global>
          {`
            body {
              ${generateCssVariables(styled.font)}
            }

            @media (prefers-color-scheme: dark) {
              :root {
                ${generateCssVariables(styled.dark)}
              }
            }

            @media (prefers-color-scheme: light) {
              :root {
                ${generateCssVariables(styled.light)}
              }
            }
          `}
        </style>
      )}

      <div className="flex flex-col gap-6 w-[1080px] m-auto py-6">
        <div className="flex flex-1 gap-3 overflow-x no-scrollbar justify-center">
          {Object.entries(preview).map(([key, value]) => (
            <div key={key} className="flex flex-col gap-2 items-center">
              <Card
                key={key}
                className={clsx(
                  'p-0 bg-transparent border-transparent outline-2 outline-offset-2 ring-tertiary hover:ring-tertiary rounded-sm',
                  // selected === key && ' outline-offset-2 ring-tertiary',
                )}
                onClick={() => {
                  setStyled(value);
                  // setSelected(key);
                }}
              >
                <Image src={value.image} width={80} height={56} alt={key} />
              </Card>

              <p className="capitalize font-medium text-xs">{key === 'violet' ? 'default' : key}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 w-full">
          <PopoverColor
            label="Accent"
            name={forceground}
            color={colors[forceground].default}
            onSelect={(color) => {
              setForceground(color);
              setStyled((prev) => ({
                ...prev,
                dark: {
                  ...prev.dark,
                  '--color-primary-500': `var(--color-${color}-500)`,
                },
                light: {
                  ...prev.light,
                  '--color-primary-500': `var(--color-${color}-500)`,
                },
              }));
            }}
          />
          <PopoverColor
            label="Background"
            color={colors[background][mode]}
            name={background}
            onSelect={(color) => {
              setBackground(color);
              setStyled((prev) => ({
                ...prev,
                dark: {
                  ...prev.dark,
                  '--color-background': `var(--color-${color}-950)`,
                },
                light: {
                  ...prev.light,
                  '--color-background': `var(--color-${color}-50)`,
                  '--color-forceground': `var(--color-black)`,
                  '--color-tertiary': `var(--color-black)`,
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
            name={fontTitle}
            fonts={fonts.title}
            onSelect={(font) => {
              setFontTitle(font);
              setStyled((prev) => ({
                ...prev,
                font: { '--font-title': fonts.title[font.toLowerCase().replaceAll(' ', '_')] },
              }));
            }}
          />
          <PopoverFont
            label="body"
            name={fontBody}
            fonts={fonts.body}
            onSelect={(font) => {
              setFontBody(font);
              setStyled((prev) => ({
                ...prev,
                font: { '--font-body': fonts.body[font.toLowerCase().replaceAll(' ', '_')] },
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
                  updateCommunity({
                    variables: { id: space._id, input: { theme_data: styled } },
                    onComplete: (client) => {
                      client.writeFragment<Space>({ id: `Space:${space._id}`, data: { theme_data: styled } });
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
  color,
  onSelect,
}: {
  label: string;
  name: string;
  color: string;
  onSelect: (color: string) => void;
}) {
  return (
    <Menu className="flex-1">
      <Menu.Trigger>
        <div className="w-full bg-tertiary/8 text-tertiary/56 px-2.5 py-2 rounded-sm flex items-center gap-2">
          <i className={twMerge('size-[24px] rounded-full', color)} />
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
          {label === 'title' && <h3 className="font-semibold">Ag</h3>}
          {label === 'body' && <span className="font-medium"> Ag</span>}
          <span
            className={clsx(
              'flex-1 capitalize',
              label === 'title' ? 'font-title font-semibold' : 'font-body font-medium',
            )}
          >
            {label}
          </span>
          <p className="flex items-center gap-1 font-general-sans">
            <span className="capitalize">{name}</span>
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
              style={{ [`--font-${label}`]: font }}
              onClick={() => onSelect(join(split(key, '_'), ' '))}
            >
              <div
                className={clsx(
                  'border rounded px-4 py-2',
                  key === name.toLowerCase().replaceAll(' ', '_') && 'border border-tertiary',
                )}
              >
                <h3>Ag</h3>
              </div>
              <p className="capitalize font-general-sans">{join(split(key, '_'), ' ')}</p>
            </div>
          ))}
        </div>
      </Menu.Content>
    </Menu>
  );
}
