'use client';
import React from 'react';
import { Button, Card, Menu, MenuItem, toast } from '$lib/components/core';
import { AIChatActionKind, Message, useAIChat } from './provider';
import { useMutation } from '$lib/graphql/request';
import { RunAiChatDocument, RunResult } from '$lib/graphql/generated/ai/graphql';
import { aiChatClient } from '$lib/graphql/request/instances';
import { AI_CONFIG } from '$lib/utils/constants';
import { useRouter } from 'next/navigation';
import { match } from 'ts-pattern';
import { Event } from '$lib/graphql/generated/backend/graphql';

export function InputChat() {
  const router = useRouter();
  const [state, dispatch] = useAIChat();
  const [input, setInput] = React.useState('');
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const [run, { loading }] = useMutation(
    RunAiChatDocument,
    {
      onComplete: (_, income) => {
        dispatch({ type: AIChatActionKind.set_thinking, payload: { thinking: false } });
        dispatch({ type: AIChatActionKind.add_message, payload: { messages: [{ ...income.run, role: 'assistant' }] } });

        const tool = income.run?.metadata?.tool;
        match(tool?.name).with('create_event', () => {
          dispatch({ type: AIChatActionKind.reset });
          router.push(`/ai/e/manage/${tool?.data?.shortid}`);
        });
      },
      onError: (error) => {
        toast.error(error.message);
        dispatch({ type: AIChatActionKind.set_thinking, payload: { thinking: false } });
      },
    },
    aiChatClient,
  );

  React.useEffect(() => {
    if (textareaRef.current && input) {
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
    <Card.Root className="backdrop-blur-none! border-0 bg-(--btn-tertiary) rounded-lg overflow-visible">
      <Card.Content className="space-y-4 flex flex-col">
        <textarea
          disabled={loading}
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
          <Menu.Root placement={!!state.messages.length ? 'top-start' : 'bottom-start'}>
            <Menu.Trigger>
              {({ toggle }) => (
                <Button variant="tertiary-alt" onClick={() => toggle()} size="sm" iconLeft="icon-discover-tune">
                  {state.selectedTool?.label || 'Tools'}
                </Button>
              )}
            </Menu.Trigger>
            <Menu.Content className="p-1 w-[192px] backdrop-blur-md!">
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
      {/* <i className='icon-location-outline' /> */}
    </Card.Root>
  );
}

export function mockWelcomeEvent(event: Event): Message[] {
  const actions = [];
  if (!event.location) {
    actions.push({
      type: 'button',
      props: { icon: 'icon-location-outline', label: 'Add Location', tool: 'add_location' },
    });
  }

  if (!event.description) {
    actions.push({
      type: 'button',
      props: { icon: 'icon-sort', label: 'Add Description', tool: 'add_description' },
    });
  }

  return [
    {
      message: `Welcome to ${event.title} Event. How can I help make your event awesome?`,
      metadata: { actions },
      sourceDocuments: [],
      role: 'assistant',
    },
  ];
}
