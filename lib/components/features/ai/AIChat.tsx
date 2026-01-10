'use client';
import { useMcp } from 'use-mcp/react';

import { useMe } from '$lib/hooks/useMe';
import { InputChat } from './InputChat';
import { Messages } from './Messages';
import { useAIChat } from './provider';
import { ToolsSuggest } from './ToolsSuggest';
import { WelcomeChat } from './WelcomeChat';

export function AIChat() {
  const me = useMe();
  const [state] = useAIChat();

  const { tools } = useMcp({
    url: 'https://ai.staging.lemonade.social/mcp',
    // clientName: 'My App',
    debug: true,
    autoReconnect: true,
  });

  console.log(tools);

  if (!me) return null;

  return (
    <div className="space-y-8 flex flex-col h-full">
      {!state.messages.length && <div className="flex-1" />}

      <WelcomeChat />
      {!!state.messages.length && <Messages />}

      <div className="space-y-4">
        <InputChat />
        <ToolsSuggest />
      </div>
      {!state.messages.length && <div className="flex-1" />}
    </div>
  );
}
