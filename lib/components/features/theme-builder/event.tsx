'use client';
import React from 'react';
import { useAtom } from 'jotai';
import { motion, AnimatePresence } from 'framer-motion';

import { colors, fonts, presets, themeAtom } from './store';
import { Card, Spacer } from '$lib/components/core';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { join, split } from 'lodash';

export function EventBuilder() {
  const [toggle, setToggle] = React.useState(false);
  const [data] = useAtom(themeAtom);

  return (
    <>
      <div className="flex gap-2 h-[62px]">
        <button
          className="btn btn-tertiary inline-flex px-3 py-2.5 w-full gap-2.5 rounded-sm text-left"
          onClick={() => setToggle(true)}
        >
          <img src={presets[data.theme || 'minimal'].image} className="w-[51px] h-[38px] rounded-xs" />
          <div className="flex justify-between items-center flex-1">
            <div>
              <p className="text-xs">Theme</p>
              <p className="text-primary">{presets[data.theme || 'minimal'].name}</p>
            </div>
            <i className="icon-chevrons-up-down size-5" />
          </div>
        </button>
        <button className="btn btn-tertiary inline-flex items-center justify-center p-[21px] rounded-sm">
          <i className="icon-shuffle size-5" />
        </button>
      </div>

      <EventBuilderPane show={toggle} onClose={() => setToggle(false)} />
    </>
  );
}

function EventBuilderPane({ show, onClose }: { show: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {show && (
        <div className="fixed z-100 inset-0">
          <div className="h-full w-full p-2">
            <div className="fixed inset-0 z-0" onClick={onClose} />
            <div className="flex h-full">
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
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

const MAPPINGS = {
  template: ThemeTemplate,
  colors: ThemeColor,
  font_title: ThemeFontTitle,
  font_body: ThemeFontBody,
};

function EventBuilderPaneOptions() {
  const [state, setState] = React.useState<
    'template' | 'style' | 'effect' | 'colors' | 'font_title' | 'font_body' | 'mode'
  >('template');
  const [data] = useAtom(themeAtom);

  const Comp = MAPPINGS[state];

  return (
    <>
      <div className="bg-overlay-secondary overflow-auto no-scrollbar w-[96px] backdrop-blur-md rounded-sm h-full p-2 flex justify-center">
        <div className="flex flex-col gap-1">
          <ActionButton active={state === 'template'} onClick={() => setState('template')}>
            <img src={presets[data.theme || 'minimal'].image} className="h-[32px] w-[43px] rounded-xs" />
            <p className="text-xs">Template</p>
          </ActionButton>

          <ActionButton active={state === 'style'} onClick={() => setState('style')}>
            <div className="size-[32px] bg-quaternary rounded-full" />
            <p className="text-xs">Style</p>
          </ActionButton>

          <ActionButton active={state === 'effect'} onClick={() => setState('effect')}>
            <div className="size-[32px] bg-quaternary rounded-full" />
            <p className="text-xs">Effect</p>
          </ActionButton>
          <ActionButton active={state === 'colors'} onClick={() => setState('colors')}>
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
          <ActionButton active={state === 'mode'} onClick={() => setState('mode')}>
            <div className="size-[32px]">
              {data.config.mode === 'dark' ? (
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
  const [data] = useAtom(themeAtom);

  return (
    <div className="flex flex-col items-center gap-3 w-[96px]">
      {Object.entries(presets).map(([key, { image }]) => (
        <div key={key}>
          <Card.Root
            className={clsx(
              'p-0 bg-transparent border-transparent transition-all hover:outline-2 hover:outline-offset-2 hover:outline-primary/16 rounded-sm',
              data.theme === key && 'outline-2 outline-offset-2 outline-primary!',
            )}
          >
            <img src={image} className="rounded-sm" width={72} height={54} />
          </Card.Root>
        </div>
      ))}
    </div>
  );
}

function ThemeColor() {
  return (
    <div className="flex flex-col items-center w-[60px] gap-3">
      {colors.map((color) => (
        <div
          key={color}
          onClick={() => {}}
          className={twMerge(
            'size-5 cursor-pointer hover:outline-2 outline-offset-2 rounded-full',
            `${color} item-color-fg`,
            // clsx(c === selected && 'outline-2'),
          )}
        />
      ))}
    </div>
  );
}

function ThemeFontTitle() {
  return <ThemeFont data={fonts.title} />;
}
function ThemeFontBody() {
  return <ThemeFont data={fonts.body} />;
}

function ThemeFont({ data }) {
  return (
    <div className="grid grid-cols-2 items-center gap-3 w-[188px]">
      {Object.entries(data).map(([key, font]) => (
        <div
          key={key}
          className="flex flex-col items-center text-xs gap-2 cursor-pointer"
          // onClick={() => onSelect(key)}
        >
          <div
            className={clsx(
              'border-2 border-[var(--color-divider)] rounded-sm px-4 py-2 w-[72px] h-[56px] hover:border-primary',
              // key === selected.toLowerCase().replaceAll(' ', '_') && 'border border-primary',
            )}
          >
            <h3 style={{ fontFamily: font as string }} className="size-10 text-xl text-center">
              Ag
            </h3>
          </div>
          <p className="capitalize font-general-sans">{join(split(key, '_'), ' ')}</p>
        </div>
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
        'flex items-center justify-center flex-col gap-2 border border-transparent pt-3 pb-2 px-1 hover:bg-card-hover aspect-4/3 cursor-pointer rounded-sm w-[80px]',
        active && 'bg-card-hover!',
      )}
    >
      {children}
    </button>
  );
}
