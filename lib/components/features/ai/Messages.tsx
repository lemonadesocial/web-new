'use client';
import React from 'react';
import { match } from 'ts-pattern';
import { motion, AnimatePresence } from 'framer-motion';
import { Message, useAIChat } from './provider';

export function Messages() {
  const [state] = useAIChat();

  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [state.messages]);

  return (
    <div className="flex-1 flex flex-col gap-6 px-1 overflow-auto no-scrollbar">
      {state.messages.map((message, idx) => (
        <MessageItem key={idx} message={message} />
      ))}
      <AnimatePresence mode="wait">
        {state.thinking && (
          <motion.div
            className="flex gap-4 max-w-2/3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.3 } }}
            exit={{ opacity: 0, transition: { duration: 0 } }}
          >
            <div className="relative flex items-center justify-center">
              <i className="absolute icon-loader-thin text-primary animate-spin" />
              <i className="icon-lemon-ai size-4 aspect-square text-warning-300" />
            </div>
            <p className="text-tertiary animate-text-shimmer">Thinking...</p>
          </motion.div>
        )}
      </AnimatePresence>
      <div ref={messagesEndRef} />
    </div>
  );
}

function MessageItem({ message: item }: { message: Message }) {
  return match(item.role)
    .with('assistant', () => (
      <div className="flex items-start gap-4">
        <div className="relative flex mt-1 items-center justify-center">
          <i className="icon-lemon-ai size-4 aspect-square text-warning-300" />
        </div>
        <p>{item.message}</p>
      </div>
    ))
    .otherwise(() => (
      <div className="w-full flex justify-end">
        <div className="w-fit bg-(--btn-tertiary) text-secondary py-2 px-3 rounded-sm rounded-tr-none">
          <p>{item.message}</p>
        </div>
      </div>
    ));
}
