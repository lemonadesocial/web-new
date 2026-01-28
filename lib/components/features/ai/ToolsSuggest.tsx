'use client';

import { Button } from '$lib/components/core';
import { AIChatActionKind, useAIChat } from './provider';

export function ToolsSuggest() {
  const [state, dispatch] = useAIChat();
  return (
    <div className="flex gap-2 items-center">
      {state.tools
        .filter((item) => ['create-event', 'create-community'].includes(item.key))
        .map((item) => (
          <Button
            key={item.key}
            variant="tertiary-alt"
            iconLeft={item.icon}
            size="sm"
            className="rounded-full"
            onClick={() => {
              dispatch({ type: AIChatActionKind.select_tool, payload: { selectedTool: item } });
            }}
          >
            {item.label}
          </Button>
        ))}
    </div>
  );
}
