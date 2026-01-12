'use client';

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
  console.log(state.messages);

  return (
    <div className="space-y-8 flex flex-col h-full pb-25 md:pb-10">
      {!state.messages.length && <div className="flex-1" />}

      {!!state.messages.length ? <Messages /> : <WelcomeChat />}

      <div className="space-y-4">
        <InputChat />
        <ToolsSuggest />
      </div>
      {!state.messages.length && <div className="flex-1" />}
    </div>
  );
}
