'use client';
import React from 'react';
import { Button, Card, Menu, MenuItem } from '$lib/components/core';
import { AIChatActionKind, useAIChat } from './provider';

export function InputChat() {
  const [state, dispatch] = useAIChat();
  const [input, setInput] = React.useState('');
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSubmit = () => {
    if (!input.trim()) {
      return;
    }
    // TODO: dispatch action to send message
    console.log('Submitting message:', input);
    setInput('');
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
          <Button icon="icon-arrow-foward-sharp -rotate-90" size="sm" onClick={handleSubmit} />
        </div>
      </Card.Content>
    </Card.Root>
  );
}
