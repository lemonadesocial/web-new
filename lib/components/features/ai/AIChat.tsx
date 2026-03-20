'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { useMe } from '$lib/hooks/useMe';
import { InputChat } from './InputChat';
import { Messages } from './Messages';
import { useAIChat } from './provider';
import { ToolsSuggest } from './ToolsSuggest';
import { WelcomeChat } from './WelcomeChat';

type AIChatProps = {
  variant?: 'default' | 'home';
  showTools?: boolean;
  readonly?: boolean;
  hideHeader?: boolean;
};

export function AIChat({ variant = 'default', showTools = true, readonly }: AIChatProps) {
  const me = useMe();
  const [state] = useAIChat();

  if (!me) return null;

  return (
    <div className="flex flex-col h-full relative isolate">
      <div className="flex-1 overflow-hidden flex flex-col px-6">
        <AnimatePresence mode="wait">
          <React.Fragment>
            {!state.messages.length && !state.thinking && (
              <motion.div key="spacer-top" className="flex-1" exit={{ opacity: 0 }} />
            )}

            {!!state.messages.length || state.thinking ? (
              <motion.div
                key="messages"
                layout
                className="flex-1 pt-8 overflow-y-auto no-scrollbar max-w-4xl mx-auto w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <Messages />
              </motion.div>
            ) : (
              <motion.div
                key="welcome"
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1"
              >
                <WelcomeChat />
              </motion.div>
            )}

            <motion.div
              className="space-y-4 pb-6 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                ease: 'easeOut',
                delay: state.messages.length || state.thinking ? 0.3 : 0,
              }}
            >
              <div className="relative z-10 max-w-4xl mx-auto w-full">
                <InputChat variant={variant} showTools={showTools} readonly={readonly} />
              </div>
              {showTools && (
                <div className="flex justify-center">
                  <ToolsSuggest />
                </div>
              )}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.3,
                  ease: 'easeOut',
                  delay: 0.3,
                }}
              >
                <p className="text-center text-xs text-tertiary">
                  LemonAI can make mistakes, so please double-check it.
                </p>
              </motion.div>
            </motion.div>

            {!state.messages.length && !state.thinking && (
              <motion.div key="spacer-bottom" className="flex-1" exit={{ opacity: 0 }} />
            )}
          </React.Fragment>
        </AnimatePresence>
      </div>
    </div>
  );
}
