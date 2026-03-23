'use client';
import React from 'react';
import { delay } from 'lodash';
import { useRouter } from 'next/navigation';
import { match } from 'ts-pattern';
import { isMobile } from 'react-device-detect';

import { Button, Card, drawer, Menu, MenuItem, toast } from '$lib/components/core';

import { useClient, useMutation, useQuery } from '$lib/graphql/request';
import { AiConfigFieldsFragment, GetListAiConfigDocument, RunAiChatDocument } from '$lib/graphql/generated/ai/graphql';
import { aiChatClient } from '$lib/graphql/request/instances';
import { AI_CONFIG } from '$lib/utils/constants';
import {
  Event,
  GetEventDocument,
  GetSpaceDocument,
  GetSpacesDocument,
  Space,
  SpaceRole,
} from '$lib/graphql/generated/backend/graphql';
import { useUpdateEvent } from '$lib/components/features/event-manage/store';
import { EditEventDrawer } from '../event-manage/drawers/EditEventDrawer';
import { AIChatActionKind, Message, useAIChat } from './provider';
import { communityAvatar } from '$lib/utils/community';
import { useMe } from '$lib/hooks/useMe';

const PLACEHOLDER_PHRASES = ['create an event', 'create a community', 'launch a coin'];
const TYPING_MS = 80;
const PAUSE_AFTER_PHRASE_MS = 1500;

type InputChatProps = {
  variant?: 'default' | 'home';
};

export function InputChat({ variant = 'default' }: InputChatProps) {
  const me = useMe();
  const router = useRouter();
  const [state, dispatch] = useAIChat();
  const [input, setInput] = React.useState('');
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const { client } = useClient();
  const updateEvent = useUpdateEvent();

  const [{ phraseIndex, charCount }, setAnim] = React.useState({ phraseIndex: 0, charCount: 0 });
  const hasActivity = !!state.messages.length || !!state.thinking;
  const isIdle = input.length === 0 && !hasActivity;

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
  const textareaBaseClass =
    'w-full outline-none resize-none overflow-y-auto relative bg-transparent text-primary font-medium';
  const textareaClass = isIdle ? `${textareaBaseClass} placeholder:invisible` : textareaBaseClass;
  const rootClassName =
    variant === 'home'
      ? 'backdrop-blur-[8px]! border border-white bg-[rgba(20,19,23,0.64)] rounded-[16px] overflow-visible'
      : 'backdrop-blur-none! border-0 bg-(--btn-tertiary) rounded-lg overflow-visible';

  return (
    <Card.Root className={rootClassName}>
      <Card.Content className="space-y-4 flex flex-col">
        <div className="relative w-full">
          {isIdle && (
            <div
              className="absolute inset-0 pointer-events-none text-quaternary overflow-hidden"
              aria-hidden
            >
              <span className="font-medium">
                Ask LemonAI to <span>{typingText}</span>
              </span>
            </div>
          )}
          <textarea
            disabled={loading}
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className={textareaClass}
            rows={1}
            style={{ maxHeight: 160 }}
            placeholder="Ask anything..."
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
          <div className="flex items-center gap-2">
            {me && (
              <SpaceSelector
                currentSpaceId={(state.data as { space_id?: string } | undefined)?.space_id}
                onSelectSpace={(space) =>
                  dispatch({
                    type: AIChatActionKind.set_data_run,
                    payload: { data: { space_id: space._id } },
                  })
                }
              />
            )}
            <Button icon="icon-arrow-foward-sharp -rotate-90" size="sm" onClick={handleSubmit} loading={loading} />
          </div>
        </div>
      </Card.Content>
    </Card.Root>
  );
}

type SpaceSelectorProps = {
  currentSpaceId?: string;
  onSelectSpace: (space: Space) => void;
};

function formatCredits(value?: number | null) {
  if (typeof value !== 'number' || Number.isNaN(value)) return 0;
  return Math.max(0, Math.floor(value));
}

function getCreditFillPercent(credits?: number | null, highWaterMark?: number | null) {
  if (typeof credits !== 'number' || Number.isNaN(credits)) return 0;
  if (typeof highWaterMark !== 'number' || Number.isNaN(highWaterMark) || highWaterMark <= 0) return 0;
  const percent = (credits / highWaterMark) * 100;
  return Math.max(0, Math.min(100, percent));
}

function SpaceSelector({ currentSpaceId, onSelectSpace }: SpaceSelectorProps) {
  const router = useRouter();
  const { data } = useQuery(GetSpacesDocument, {
    variables: { with_my_spaces: true, roles: [SpaceRole.Creator, SpaceRole.Admin] },
    fetchPolicy: 'cache-and-network',
  });

  const spaces = (data?.listSpaces || []) as Space[];
  const personalSpace = spaces.find((space) => space.personal);
  const selectedSpace = spaces.find((space) => space._id === currentSpaceId) || personalSpace;
  const creditFillPercent = getCreditFillPercent(selectedSpace?.credits, selectedSpace?.credits_high_water_mark);
  const ringRadius = 6;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference * (1 - creditFillPercent / 100);

  React.useEffect(() => {
    if (!currentSpaceId && personalSpace) {
      onSelectSpace(personalSpace);
    }
  }, [currentSpaceId, personalSpace, onSelectSpace]);

  return (
    <div className="flex items-center gap-2">
      <Menu.Root placement="top-start">
        <Menu.Trigger>
          {({ toggle }) => (
            <div
              onClick={() => toggle()}
              className="h-8 px-2.5 flex items-center gap-1.5 rounded-sm bg-primary/8 border border-card-border cursor-pointer"
            >
              <img
                src={communityAvatar(selectedSpace)}
                className="w-4 h-4 rounded-full object-cover"
                alt={selectedSpace?.title || 'Community avatar'}
              />
              <p className="text-sm max-w-[132px] truncate text-tertiary">
                {selectedSpace?.title || 'Select community'}
              </p>
              <i className="icon-chevron-down size-4 text-tertiary" aria-hidden />
            </div>
          )}
        </Menu.Trigger>
        <Menu.Content className="p-1 w-[224px] max-h-[280px] overflow-y-auto no-scrollbar overscroll-contain backdrop-blur-md!">
          {() => (
            <>
              {spaces.map((space) => (
                <MenuItem
                  key={space._id}
                  title={space.title}
                  onClick={() => {
                    onSelectSpace(space);
                  }}
                />
              ))}
            </>
          )}
        </Menu.Content>
      </Menu.Root>

      <button
        type="button"
        className="h-8 px-2.5 rounded-sm bg-(--btn-tertiary) text-tertiary text-sm font-medium inline-flex items-center justify-center gap-1.5 hover:bg-(--btn-tertiary-hover)"
        onClick={() => {
          if (selectedSpace?._id) {
            router.push(`/upgrade-to-pro?space=${selectedSpace._id}`);
            return;
          }
          router.push('/upgrade-to-pro');
        }}
        title="Upgrade to Pro"
      >
        <svg className="size-4 -rotate-90 shrink-0" viewBox="0 0 16 16" aria-hidden>
          <circle cx="8" cy="8" r={ringRadius} fill="none" stroke="currentColor" strokeWidth="1" className="text-quaternary" />
          <circle
            cx="8"
            cy="8"
            r={ringRadius}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="text-primary transition-[stroke-dashoffset] duration-300"
            strokeDasharray={ringCircumference}
            strokeDashoffset={ringOffset}
          />
        </svg>
        <span>
          {formatCredits(selectedSpace?.credits)} / {formatCredits(selectedSpace?.credits_high_water_mark)}
        </span>
      </button>
    </div>
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
