'use client';
import React from 'react';
import { useAtom } from 'jotai';
import { motion, AnimatePresence } from 'framer-motion';

import { fonts, presets, themeAtom } from './store';
import { Spacer } from '$lib/components/core';

export function EventBuilder() {
  const [toggle, setToggle] = React.useState(false);
  const [data] = useAtom(themeAtom);
  const { theme, font_title, font_body, config, variables } = data;

  return (
    <>
      <div className="flex gap-2 h-[62px]">
        <button
          className="btn btn-tertiary inline-flex px-3 py-2.5 w-full gap-2.5 rounded-sm text-left"
          onClick={() => setToggle(true)}
        >
          <img src={presets[theme || 'minimal'].image} className="w-[51px] h-[38px] rounded-xs" />
          <div className="flex justify-between items-center flex-1">
            <div>
              <p className="text-xs">Theme</p>
              <p className="text-primary">{presets[theme || 'minimal'].name}</p>
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

function EventBuilderPaneOptions() {
  const [data] = useAtom(themeAtom);

  return (
    <>
      <div className="bg-overlay-secondary overflow-auto no-scrollbar w-[96px] backdrop-blur-md rounded-sm h-full p-2 flex justify-center">
        <div>
          <button className="flex items-center justify-center flex-col gap-2 border border-transparent pt-3 pb-2 px-1 hover:bg-card-hover aspect-4/3 cursor-pointer rounded-sm w-[80px]">
            <img src={presets[data.theme || 'minimal'].image} className="h-[32px] w-[43px] rounded-xs" />
            <p className="text-xs">Template</p>
          </button>
          <button
            disabled
            className="flex items-center justify-center flex-col gap-2 border border-transparent pt-3 pb-2 px-1 hover:bg-card-hover aspect-4/3 cursor-pointer rounded-sm w-[80px]"
          >
            <div className="size-[32px] bg-quaternary rounded-full" />
            <p className="text-xs">Style</p>
          </button>
          <button
            disabled
            className="flex items-center justify-center flex-col gap-2 border border-transparent pt-3 pb-2 px-1 hover:bg-card-hover aspect-4/3 cursor-pointer rounded-sm w-[80px]"
          >
            <div className="size-[32px] bg-quaternary rounded-full" />
            <p className="text-xs">Effect</p>
          </button>
          <button className="flex items-center justify-center flex-col gap-2 border border-transparent pt-3 pb-2 px-1 hover:bg-card-hover aspect-4/3 cursor-pointer rounded-sm w-[80px]">
            <div className="size-[32px] bg-accent-400 rounded-full" />
            <p className="text-xs">Color</p>
          </button>

          <button className="flex items-center justify-center flex-col gap-2 border border-transparent pt-3 pb-2 px-1 hover:bg-card-hover aspect-4/3 cursor-pointer rounded-sm w-[80px]">
            <div className="size-[32px]">
              <h3 style={{ fontFamily: fonts.title[data.font_title || 'default'] }} className="font-semibold">
                Ag
              </h3>
            </div>
            <p className="text-xs capitalize">Title</p>
          </button>

          <button className="flex items-center justify-center flex-col gap-2 border border-transparent pt-3 pb-2 px-1 hover:bg-card-hover aspect-4/3 cursor-pointer rounded-sm w-[80px]">
            <div className="size-[32px]">
              <h3 style={{ fontFamily: fonts.title[data.font_body || 'default'] }} className="font-semibold">
                Ag
              </h3>
            </div>
            <p className="text-xs capitalize">Body</p>
          </button>
          <button className="flex items-center justify-center flex-col gap-2 border border-transparent pt-3 pb-2 px-1 hover:bg-card-hover aspect-4/3 cursor-pointer rounded-sm w-[80px]">
            <div className="size-[32px] bg-accent-400 rounded-full" />
            <p className="text-xs">Display</p>
          </button>
        </div>
      </div>
      <div className="bg-overlay-secondary overflow-auto no-scrollbar w-[80px] backdrop-blur-md rounded-sm h-full">
        content
      </div>
    </>
  );
}
