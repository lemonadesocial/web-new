'use client';
import { RunResult } from '$lib/graphql/generated/ai/graphql';
import { match, P } from 'ts-pattern';
import { Message, useAIChat } from './provider';

export function Messages() {
  const [state] = useAIChat();
  return (
    <div className="flex-1 flex flex-col gap-6 ">
      {state.messages.map((message, idx) => (
        <MessageItem key={idx} message={message} />
      ))}

      {state.thinking && (
        <div className="flex gap-4 max-w-2/3">
          <div className="relative flex items-center justify-center">
            <i className="absolute icon-loader-thin text-primary animate-spin" />
            <i className="icon-lemon-ai size-4 aspect-square text-warning-300" />
          </div>
          <p className="text-tertiary">Thinking...</p>{' '}
        </div>
      )}
    </div>
  );
}

function MessageItem({ message: item }: { message: Message }) {
  return match(item.role)
    .with('assistant', () => (
      <div className="flex gap-4">
        <div className="relative flex items-center justify-center">
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
