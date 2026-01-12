'use client';
import React from 'react';
import { Button, Card, Menu, MenuItem, toast } from '$lib/components/core';
import { AIChatActionKind, useAIChat } from './provider';
import { useMutation } from '$lib/graphql/request';
import { RunAiChatDocument } from '$lib/graphql/generated/ai/graphql';
import { aiChatClient } from '$lib/graphql/request/instances';
import { AI_CONFIG } from '$lib/utils/constants';

export function InputChat() {
  const [state, dispatch] = useAIChat();
  const [input, setInput] = React.useState('');
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const [run, { loading }] = useMutation(
    RunAiChatDocument,
    {
      onComplete: (_, income) => {
        dispatch({ type: AIChatActionKind.set_thinking, payload: { thinking: false } });
        dispatch({ type: AIChatActionKind.add_message, payload: { messages: [{ ...income.run, role: 'assistant' }] } });
      },
      onError: (error) => {
        toast.error(error.message);
        dispatch({ type: AIChatActionKind.set_thinking, payload: { thinking: false } });
      },
    },
    aiChatClient,
  );

  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSubmit = async () => {
    const text = input.trim();
    if (!text) {
      return;
    }
    dispatch({ type: AIChatActionKind.add_message, payload: { messages: [{ message: text, role: 'user' }] } });
    dispatch({ type: AIChatActionKind.set_thinking, payload: { thinking: true } });
    setInput('');
    run({ variables: { message: text, config: AI_CONFIG, session: state.session } });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Card.Root className="border-0 bg-(--btn-tertiary) rounded-lg overflow-visible">
      <Card.Content className="space-y-4 flex flex-col">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter a prompt here. Use Shift+Enter for new lines."
          className="w-full outline-none resize-none overflow-y-auto"
          rows={1}
          style={{ maxHeight: 160 }}
        />
        <div className="flex justify-between items-center">
          <Menu.Root placement="bottom-start">
            <Menu.Trigger>
              {({ toggle }) => (
                <Button variant="tertiary-alt" onClick={() => toggle()} size="sm" iconLeft="icon-discover-tune">
                  {state.selectedTool?.label || 'Tools'}
                </Button>
              )}
            </Menu.Trigger>
            <Menu.Content className="p-1 w-[192px]">
              {({ toggle }) => (
                <>
                  {state.tools.map((tool) => (
                    <MenuItem
                      key={tool.key}
                      iconLeft={tool.icon}
                      title={tool.label}
                      onClick={() => {
                        dispatch({ type: AIChatActionKind.select_tool, payload: { selectedTool: tool } });
                        toggle();
                      }}
                    />
                  ))}
                </>
              )}
            </Menu.Content>
          </Menu.Root>
          <Button icon="icon-arrow-foward-sharp -rotate-90" size="sm" onClick={handleSubmit} loading={loading} />
        </div>
      </Card.Content>
    </Card.Root>
  );
}
