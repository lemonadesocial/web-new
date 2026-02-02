'use client';
import React from 'react';
import { Button, Card, drawer, Menu, MenuItem, toast } from '$lib/components/core';
import { AIChatActionKind, Message, useAIChat } from './provider';
import { useClient, useMutation } from '$lib/graphql/request';
import { RunAiChatDocument } from '$lib/graphql/generated/ai/graphql';
import { aiChatClient } from '$lib/graphql/request/instances';
import { AI_CONFIG } from '$lib/utils/constants';
import { useRouter } from 'next/navigation';
import { match } from 'ts-pattern';
import { Event, GetSpaceDocument, Space } from '$lib/graphql/generated/backend/graphql';
import { delay } from 'lodash';
import { EditEventDrawer } from '../event-manage/drawers/EditEventDrawer';

export function InputChat() {
  const router = useRouter();
  const [state, dispatch] = useAIChat();
  const [input, setInput] = React.useState('');
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const { client } = useClient();

  const [run, { loading }] = useMutation(
    RunAiChatDocument,
    {
      onComplete: (_, income) => {
        dispatch({ type: AIChatActionKind.set_thinking, payload: { thinking: false } });
        dispatch({ type: AIChatActionKind.add_message, payload: { messages: [{ ...income.run, role: 'assistant' }] } });

        const tool = income.run?.metadata?.tool;
        match(tool?.name)
          .with('create_event', () => {
            dispatch({
              type: AIChatActionKind.add_message,
              payload: { messages: [{ message: 'Redicting...', role: 'assistant' }] },
            });

            delay(() => router.push(`/agent/e/manage/${tool?.data?.shortid}`), 2000);
            delay(() => dispatch({ type: AIChatActionKind.reset }), 2500);
          })
          .with('create_space', () => {
            dispatch({
              type: AIChatActionKind.add_message,
              payload: { messages: [{ message: 'Redicting...', role: 'assistant' }] },
            });
            delay(() => router.push(`/agent/e/manage/${tool?.data?._id}`), 2000);
            delay(() => dispatch({ type: AIChatActionKind.reset }), 2500);
          })
          .with('update_space', async () => {
            const data = tool.data;
            const res = await client.query({
              query: GetSpaceDocument,
              variables: { id: data._id },
              fetchPolicy: 'network-only',
            });
            if (res.data?.getSpace) client.writeFragment({ id: `Space:${data._id}`, data: res.data.getSpace });
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
    run({ variables: { message: text, config: AI_CONFIG, session: state.session, data: state.data || {} } });
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
    </Card.Root>
  );
}

export function mockWelcomeEvent(event: Event): Message[] {
  const actions = [];
  const opts = { dismissible: false, fixed: false, showBackdrop: false, props: { event } };
  if (!event.location) {
    actions.push({
      type: 'button',
      props: {
        icon: 'icon-location-outline',
        label: 'Add Location',
        onClick: () => {
          drawer.close();
          drawer.open(EditEventDrawer, { ...opts });
        },
      },
    });
  }

  if (!event.description) {
    actions.push({
      type: 'button',
      props: {
        icon: 'icon-sort',
        label: 'Add Description',
        onClick: () => {
          drawer.close();
          drawer.open(EditEventDrawer, { ...opts });
        },
      },
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

export function mockWelcomeSpace(space: Space): Message[] {
  // const actions = [];
  // const opts = { dismissible: false, fixed: false, showBackdrop: false, props: { space } };

  // if (!space.description) {
  //   actions.push({
  //     type: 'button',
  //     props: {
  //       icon: 'icon-sort',
  //       label: 'Add Description',
  //       onClick: () => {
  //         // drawer.close();
  //         // drawer.open(Edit, { ...opts });
  //       },
  //     },
  //   });
  // }

  return [
    {
      message: `Welcome to ${space.title} Community. How can I help make your community awesome?`,
      // metadata: { actions },
      sourceDocuments: [],
      role: 'assistant',
    },
  ];
}
