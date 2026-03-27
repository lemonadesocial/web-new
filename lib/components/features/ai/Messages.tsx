'use client';
import React from 'react';
import { match } from 'ts-pattern';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';
import { Button } from '$lib/components/core';
import { Message, useAIChat } from './provider';
import { CardList } from './cards';

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
    <div className="flex-1 flex flex-col gap-6 px-1">
      {state.messages.map((message, idx) => (
        <MessageItem key={idx} message={message} />
      ))}
      <AnimatePresence mode="wait">
        {state.thinking && (
          <motion.div
            className="flex gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.3 } }}
            exit={{ opacity: 0, transition: { duration: 0 } }}
          >
            <div className="relative flex items-center justify-center">
              <i aria-hidden="true" className="absolute icon-loader-thin text-primary animate-spin" />
              <i aria-hidden="true" className="icon-lemon-ai size-4 aspect-square text-warning-300" />
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
  const [state] = useAIChat();
  const currentAgent = state.configs.find((c) => c._id === state.config);

  const messageContent =
    item.role === 'assistant' && item.metadata?.cards ? (item.message?.split('\n\n')[0] ?? item.message) : item.message;

  return match(item.role)
    .with('assistant', () => (
      <div className="flex items-start gap-4">
        <div className="relative flex mt-1 shrink-0 items-center justify-center">
          {currentAgent?.avatar ? (
            <Image
              src={currentAgent.avatar}
              width={24}
              height={24}
              className="rounded-full object-cover aspect-square"
              alt={currentAgent.name || 'Agent'}
            />
          ) : (
            <i aria-hidden="true" className="icon-lemon-ai size-4 aspect-square text-warning-300" />
          )}
        </div>
        <div className="whitespace-break-spaces flex flex-col gap-6 flex-1">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold text-tertiary uppercase tracking-wider">
              {currentAgent?.name || 'LemonAI'}
            </p>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{messageContent}</ReactMarkdown>
          </div>

          {item.metadata?.cards && (
            <CardList title={item.metadata.title} cards={item.metadata.cards} overflow={item.metadata.overflow} />
          )}

          <div className="flex gap-2">
            {item.metadata?.actions?.map((action, idx) =>
              match(action.type)
                .with('button', () => (
                  <Button
                    key={idx}
                    onClick={action.props?.onClick}
                    variant="tertiary-alt"
                    size="sm"
                    iconLeft={action.props.icon}
                  >
                    {action.props?.label}
                  </Button>
                ))
                .otherwise(() => <>Action unsupported</>),
            )}
          </div>
        </div>
      </div>
    ))
    .otherwise(() => (
      <div className="w-full flex justify-end">
        <div className="w-fit bg-(--btn-tertiary) text-secondary py-2 px-3 rounded-sm rounded-tr-none">
          <p className="whitespace-break-spaces">{messageContent}</p>
        </div>
      </div>
    ));
}
