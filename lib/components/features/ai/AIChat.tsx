'use client';
import { motion, AnimatePresence } from 'framer-motion';

import { useMe } from '$lib/hooks/useMe';
import { InputChat } from './InputChat';
import { Messages } from './Messages';
import { useAIChat } from './provider';
import { ToolsSuggest } from './ToolsSuggest';
import { WelcomeChat } from './WelcomeChat';

export function AIChat() {
  const me = useMe();
  const [state] = useAIChat();

  if (!me) return null;

  return (
    <div className="space-y-8 flex flex-col h-full pb-25 md:pb-10">
      <AnimatePresence mode="wait">
        {!state.messages.length && <motion.div key="spacer-top" className="flex-1" exit={{ opacity: 0 }} />}

        {!!state.messages.length ? (
          <motion.div
            key="messages"
            className="flex-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <Messages />
          </motion.div>
        ) : (
          <motion.div key="welcome" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <WelcomeChat />
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.3,
          ease: 'easeOut',
          delay: state.messages.length ? 0.3 : 0,
        }}
      >
        <InputChat />
        <ToolsSuggest />
      </motion.div>
      <AnimatePresence mode="wait">
        {!state.messages.length && <motion.div key="spacer-bottom" className="flex-1" exit={{ opacity: 0 }} />}
      </AnimatePresence>
    </div>
  );
}
