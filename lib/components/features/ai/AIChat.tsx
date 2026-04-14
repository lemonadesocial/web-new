'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { useMe } from '$lib/hooks/useMe';
import { InputChat } from './InputChat';
import { Messages } from './Messages';
import { useAIChat } from './provider';
import { WelcomeChat } from './WelcomeChat';

type AIChatProps = {
  variant?: 'default' | 'home';
  showTools?: boolean;
  readOnly?: boolean;
  allowGuest?: boolean;
  compact?: boolean;
  hideSpaceSelector?: boolean;
  fixedSpaceId?: string;
};

export function AIChat({
  variant = 'default',
  showTools = true,
  readOnly,
  allowGuest = false,
  compact,
  hideSpaceSelector,
  fixedSpaceId,
}: AIChatProps) {
  const me = useMe();
  const [state] = useAIChat();
  const hasActivity = !!state.messages.length || !!state.thinking;

  if (!me && !allowGuest) return null;

  return (
    <div className="relative isolate flex h-full flex-col">
      <div className="flex flex-1 flex-col overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          {hasActivity ? (
            <motion.div
              key="messages"
              className="flex h-full flex-col"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                layout
                className="flex-1 overflow-y-auto no-scrollbar pt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <div className="mx-auto w-full max-w-4xl">
                  <Messages />
                </div>
              </motion.div>

              <motion.div
                className="space-y-4 pb-6 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  ease: 'easeOut',
                  delay: 0.3,
                }}
              >
                <div className="relative z-10 mx-auto w-full max-w-4xl">
                  <InputChat
                    variant={variant}
                    showTools={showTools}
                    readOnly={readOnly}
                    compact={compact}
                    hideSpaceSelector={hideSpaceSelector}
                    fixedSpaceId={fixedSpaceId}
                  />
                </div>
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
            </motion.div>
          ) : (
            <motion.div
              key="welcome"
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={`flex flex-1 flex-col justify-center ${variant === 'home' ? 'py-8 md:py-10' : 'py-6'}`}
            >
              <div className="mx-auto w-full max-w-4xl space-y-8">
                <WelcomeChat />

                <div className="space-y-4">
                  <InputChat
                    variant={variant}
                    showTools={showTools}
                    readOnly={readOnly}
                    compact={compact}
                    hideSpaceSelector={hideSpaceSelector}
                    fixedSpaceId={fixedSpaceId}
                  />
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.3,
                      ease: 'easeOut',
                      delay: 0.2,
                    }}
                  >
                    <p className="text-center text-xs text-tertiary">
                      LemonAI can make mistakes, so please double-check it.
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
