'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { colors, fonts, getRandomColor, patterns, presets, shaders } from './store';
import { Card } from '$lib/components/core';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { join, split } from 'lodash';
import { useEventTheme, ThemeBuilderActionKind } from './provider';

export function EventThemeBuilder() {
  const [toggle, setToggle] = React.useState(false);
  const [data] = useEventTheme();
  const themeName = !data.theme || data.theme === 'default' ? 'minimal' : data.theme;
  return (
    <>
      <div className="flex gap-2 h-[62px]">
        <button
          className="btn btn-tertiary inline-flex px-3 py-2.5 w-full gap-2.5 rounded-sm text-left"
          onClick={() => setToggle(true)}
        >
          <img src={presets[themeName].image} className="w-[51px] h-[38px] rounded-xs" />
          <div className="flex justify-between items-center flex-1">
            <div>
              <p className="text-xs">Theme</p>
              <p className="text-primary">{presets[themeName].name}</p>
            </div>
            <i className="icon-chevrons-up-down size-5" />
          </div>
        </button>
        <button className="btn btn-tertiary inline-flex items-center justify-center p-[21px] rounded-sm">
          <i className="icon-shuffle size-5" />
        </button>
      </div>

      <EventThemeBuilderPane show={toggle} onClose={() => setToggle(false)} />
    </>
  );
}

function EventThemeBuilderPane({ show, onClose }: { show: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {show && (
        <div className="fixed z-100 inset-0">
          <div className="h-full w-full p-2">
            <div className="fixed inset-0 z-0" onClick={onClose} />

            {/* tablet - destop view */}
            <div className="h-full hidden md:flex">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ duration: 0.1 }}
                className="h-full flex gap-2 z-10"
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
                className="h-full flex gap-2 z-10"
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
  effect: React.Fragment,
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
      <div className="bg-overlay-secondary overflow-auto no-scrollbar w-[96px] backdrop-blur-md rounded-sm h-full p-2 flex justify-center">
        <div className="flex flex-col gap-1">
          <ActionButton
            active={state === 'template'}
            onClick={() => {
              setState('template');
            }}
          >
            <img src={presets[themeName].image} className="h-[32px] w-[43px] rounded-xs" />
            <p className="text-xs">Template</p>
          </ActionButton>

          <ActionButton
            active={state === 'style'}
            disabled={presets[themeName].ui?.disabled?.style}
            onClick={() => setState('style')}
          >
            <div className="size-[32px] bg-quaternary rounded-full" />
            <p className="text-xs">Style</p>
          </ActionButton>

          <ActionButton
            active={state === 'effect'}
            disabled={presets[themeName].ui?.disabled?.effect}
            onClick={() => setState('effect')}
          >
            <div className="size-[32px] bg-quaternary rounded-full" />
            <p className="text-xs">Effect</p>
          </ActionButton>
          <ActionButton
            active={state === 'colors'}
            disabled={data.theme && presets[themeName].ui?.disabled?.color}
            onClick={() => setState('colors')}
          >
            <div className="size-[32px] bg-accent-400 rounded-full" />
            <p className="text-xs">Color</p>
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
              <h3 style={{ fontFamily: fonts.title[data.font_body || 'default'] }} className="font-semibold">
                Ag
              </h3>
            </div>
            <p className="text-xs capitalize">Body</p>
          </ActionButton>

          <ActionButton
            active={state === 'mode'}
            disabled={data.theme && presets[themeName].ui?.disabled?.mode}
            onClick={() => {
              setState('mode');
              // const mode = data.config?.mode === 'dark' ? 'light' : 'dark';
              // dispatch({ type: ThemeBuilderActionKind.select_mode, payload: { config: { mode } } });
            }}
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

      <div className="transition-all bg-overlay-secondary overflow-auto no-scrollbar backdrop-blur-md rounded-sm h-full py-4">
        <Comp />
      </div>
    </>
  );
}

function ThemeTemplate() {
  const [data, dispatch] = useEventTheme();

  return (
    <div className="flex flex-col items-center gap-3 w-[96px]">
      {Object.entries(presets).map(([key, { image }]) => (
        <div key={key}>
          <Card.Root
            className={clsx(
              'p-0 bg-transparent border-transparent transition-all hover:outline-2 hover:outline-offset-2 hover:outline-primary/16 rounded-sm',
              data.theme === key && 'outline-2 outline-offset-2 outline-primary!',
            )}
            onClick={() => {
              let color = data.config.color;
              if (!color) color = getRandomColor();
              dispatch({
                type: ThemeBuilderActionKind.select_template,
                payload: { theme: key as any, config: { color } },
              });
            }}
          >
            <img src={image} className="rounded-sm" width={72} height={54} />
          </Card.Root>
        </div>
      ))}
    </div>
  );
}

function ThemeColor() {
  const [data, dispatch] = useEventTheme();

  return (
    <div className="flex flex-col items-center w-[60px] gap-3">
      {colors.map((color) => (
        <button
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
            clsx(color === data.config?.color && 'outline-2'),
          )}
        />
      ))}
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
    <div className="grid grid-cols-2 items-center gap-3 w-[188px]">
      {Object.entries(fonts).map(([key, font]) => (
        <div key={key} className="flex flex-col items-center text-xs gap-2 cursor-pointer" onClick={() => onClick(key)}>
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
        </div>
      ))}
    </div>
  );
}

function ThemeStyle() {
  const [state] = useEventTheme();
  if (state.theme === 'shader') return <ThemeShader />;
  if (state.theme === 'pattern') return <ThemePattern />;

  return null;
}

function ThemeShader() {
  const [state, dispatch] = useEventTheme();

  return (
    <div className="flex flex-col items-center gap-3 w-[96px]">
      {shaders.map((s) => (
        <button
          key={s.name}
          className={clsx(
            'flex flex-col gap-2 items-center',
            s.name === state.config.name ? 'text-primary' : 'text-tertiary',
          )}
          onClick={() => {
            dispatch({
              type: ThemeBuilderActionKind.select_style,
              payload: { config: { name: s.name, fg: s.accent } },
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
    <div className="flex flex-col items-center gap-3 w-[96px]">
      {patterns.map((item) => (
        <button
          key={item}
          className="capitalize flex flex-col items-center cursor-pointer gap-2"
          onClick={() => {
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
            <div className={twMerge('pattern rounded-full item-pattern relative! w-full h-full opacity-100!', item)} />
          </div>
          <p className="text-xs">{item}</p>
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
    <div className="flex flex-col items-center w-[92px] gap-3">
      {modes.map((item) => (
        <button
          key={item.mode}
          onClick={() => {
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
      onClick={onClick}
      className={clsx(
        'flex items-center justify-center flex-col gap-2 border border-transparent pt-3 pb-2 px-1 hover:bg-card-hover aspect-4/3 cursor-pointer rounded-sm w-[80px] font-body-default disabled:opacity-50 disabled:bg-transparent disabled:cursor-not-allowed',
        active && 'bg-card-hover!',
      )}
    >
      {children}
    </button>
  );
}
