'use client';
import React from 'react';
import { match } from 'ts-pattern';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '$lib/components/core';
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
        <div className="whitespace-break-spaces flex flex-col gap-6">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.message}</ReactMarkdown>

          <div className="flex gap-2">
            {item.metadata?.actions?.map((action) =>
              match(action.type)
                .with('button', () => (
                  <Button variant="tertiary-alt" size="sm" iconLeft={action.props.icon}>
                    {action.props.label}
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
          <p className="whitespace-break-spaces">{item.message}</p>
        </div>
      </div>
    ));
}

// function CardDetail({ tool }: { tool: any }) {
//   if (tool.type === 'lemonade_backend') {
//     return (
//       <Card.Root>
//         <Card.Content className="p-2 flex justify-between items-center gap-3">
//           <div className="bg-tertiary size-[38px] rounded-sm" />
//           <div className="flex-1 space-y-0.5">
//             <p>{tool.data?.shortid}</p>
//             <p className="text-xs text-tertiary capitalize">{tool.name?.replace('_', ' ')}</p>
//           </div>
//           <Button
//             icon="icon-chevron-right"
//             variant="tertiary-alt"
//             className="rounded-full"
//             onClick={() => {
//               match(tool.name).with('create_event', () =>
//                 windowPane.open(BrowserPreview, {
//                   props: { url: `e/manage/${tool.data?.shortid || tool.data?._id}` },
//                 }),
//               );
//             }}
//           />
//         </Card.Content>
//       </Card.Root>
//     );
//   }
//
//   console.log('Tool call unsupported.');
//   return null;
// }
