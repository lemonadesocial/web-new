'use client';
import React from 'react';
import { delay } from 'lodash';
import { useRouter } from 'next/navigation';
import { match } from 'ts-pattern';
import { isMobile } from 'react-device-detect';

import { Button, Card, drawer, Menu, MenuItem, toast } from '$lib/components/core';

const PLACEHOLDER_PHRASES = ['create an event', 'create a community', 'launch a coin'];
const TYPING_MS = 80;
const PAUSE_AFTER_PHRASE_MS = 1500;
import { useClient, useMutation } from '$lib/graphql/request';
import { AiConfigFieldsFragment, GetListAiConfigDocument, RunAiChatDocument } from '$lib/graphql/generated/ai/graphql';
import { aiChatClient } from '$lib/graphql/request/instances';
import { AI_CONFIG } from '$lib/utils/constants';
import { Event, GetEventDocument, GetSpaceDocument, Space } from '$lib/graphql/generated/backend/graphql';
import { useUpdateEvent } from '$lib/components/features/event-manage/store';
import { EditEventDrawer } from '../event-manage/drawers/EditEventDrawer';
import { AIChatActionKind, Message, useAIChat } from './provider';

export function InputChat() {
  const router = useRouter();
  const [state, dispatch] = useAIChat();
  const [input, setInput] = React.useState('');
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const { client } = useClient();
  const updateEvent = useUpdateEvent();

  const [{ phraseIndex, charCount }, setAnim] = React.useState({ phraseIndex: 0, charCount: 0 });
  const [focused, setFocused] = React.useState(false);
  const isIdle = input.length === 0 && !focused;

  React.useEffect(() => {
    if (!isIdle) return;
    const phrase = PLACEHOLDER_PHRASES[phraseIndex];
    const isTyping = charCount < phrase.length;
    const t = setTimeout(() => {
      setAnim((prev) =>
        prev.charCount < phrase.length
          ? { ...prev, charCount: prev.charCount + 1 }
          : { charCount: 0, phraseIndex: (prev.phraseIndex + 1) % PLACEHOLDER_PHRASES.length }
      );
    }, isTyping ? TYPING_MS : PAUSE_AFTER_PHRASE_MS);
    return () => clearTimeout(t);
  }, [isIdle, phraseIndex, charCount]);

  React.useEffect(() => {
    if (!isIdle) setAnim({ phraseIndex: 0, charCount: 0 });
  }, [isIdle]);

  const [run, { loading }] = useMutation(
    RunAiChatDocument,
    {
      onComplete: (_, income) => {
        dispatch({ type: AIChatActionKind.set_thinking, payload: { thinking: false } });
        dispatch({ type: AIChatActionKind.add_message, payload: { messages: [{ ...income.run, role: 'assistant' }] } });

        const tool = income.run?.metadata?.tool;
        match(tool?.name)
          .with('create_event', async () => {
            dispatch({
              type: AIChatActionKind.add_message,
              payload: { messages: [{ message: 'Redicting...', role: 'assistant' }] },
            });

            const res = await aiChatClient.query({
              query: GetListAiConfigDocument,
              variables: { filter: { events_eq: tool.data._id } },
            });

            delay(() => router.push(`/agent/e/manage/${tool?.data?.shortid}`), 2000);
            delay(() => {
              dispatch({ type: AIChatActionKind.reset });
              if (res.data?.configs?.items?.length) {
                const config = res.data.configs.items[0] as AiConfigFieldsFragment;
                dispatch({ type: AIChatActionKind.set_config, payload: { config: config._id } });
              }
            }, 2500);
          })
          .with('update_event', async () => {
            const data = tool.data;
            const res = await client.query({
              query: GetEventDocument,
              variables: { id: data._id },
              fetchPolicy: 'network-only',
            });
            if (res.data?.getEvent) {
              client.writeFragment({ id: `Event:${data._id}`, data: res.data.getEvent });
              updateEvent(res.data.getEvent);
            }
          })
          .with('publish_event', async () => {
            const data = tool.data;
            const res = await client.query({
              query: GetEventDocument,
              variables: { id: data._id },
              fetchPolicy: 'network-only',
            });
            if (res.data?.getEvent) {
              client.writeFragment({ id: `Event:${data._id}`, data: res.data.getEvent });
              updateEvent(res.data.getEvent);
            }
          })
          .with('create_space', async () => {
            dispatch({
              type: AIChatActionKind.add_message,
              payload: { messages: [{ message: 'Redicting...', role: 'assistant' }] },
            });

            const res = await aiChatClient.query({
              query: GetListAiConfigDocument,
              variables: { filter: { spaces_eq: tool.data._id } },
            });

            delay(() => router.push(`/agent/s/manage/${tool?.data?._id}`), 2000);
            delay(() => {
              dispatch({ type: AIChatActionKind.reset });
              if (res.data?.configs?.items?.length) {
                const config = res.data.configs.items[0] as AiConfigFieldsFragment;
                dispatch({ type: AIChatActionKind.set_config, payload: { config: config._id } });
              }
            }, 2500);
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
    run({
      variables: { message: text, config: state.config || AI_CONFIG, session: state.session, data: state.data || {}, standId: state.standId },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const typingText = isIdle ? PLACEHOLDER_PHRASES[phraseIndex].slice(0, charCount) : '';

  return (
    <Card.Root className="backdrop-blur-none! border-0 bg-(--btn-tertiary) rounded-lg overflow-visible">
      <Card.Content className="space-y-4 flex flex-col">
        <div className="relative w-full">
          {isIdle && (
            <div
              className="absolute inset-0 pointer-events-none text-secondary overflow-hidden"
              aria-hidden
            >
              <span className="font-medium">
                Ask LemonAI to <span>{typingText}</span>
              </span>
              <span className="inline-block w-[1px] h-[1em] bg-current align-middle ml-[1px] animate-[blink_1s_step-end_infinite]" />
            </div>
          )}
          <textarea
            disabled={loading}
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="w-full outline-none resize-none overflow-y-auto relative bg-transparent text-primary font-medium placeholder:invisible"
            rows={1}
            style={{ maxHeight: 160 }}
            placeholder=" "
          />
        </div>
        <div className="flex justify-between items-center">
          <Menu.Root placement={!!state.messages.length ? 'top-start' : 'bottom-start'}>
            <Menu.Trigger>
              {({ toggle }) => (
                <Button
                  variant="tertiary-alt"
                  onClick={() => toggle()}
                  size="sm"
                  icon={state.selectedTool?.label ? undefined : 'icon-discover-tune'}
                  iconLeft={state.selectedTool?.label ? 'icon-discover-tune' : undefined}
                >
                  {state.selectedTool?.label}
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
  const opts = { dismissible: false, fixed: isMobile, showBackdrop: false, props: { event } };
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
