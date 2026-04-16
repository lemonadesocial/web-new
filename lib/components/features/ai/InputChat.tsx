'use client';
import React from 'react';
import { delay } from 'lodash';
import { useRouter } from 'next/navigation';
import { match } from 'ts-pattern';
import { isMobile } from 'react-device-detect';
import clsx from 'clsx';
import Image from 'next/image';

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
import { getAIPageEditTriggers } from '$lib/components/features/page-builder/hooks/ai-page-edit-bridge';

const PLACEHOLDER_PHRASES = ['create an event', 'create a community', 'launch a coin'];
const TYPING_MS = 80;
const PAUSE_AFTER_PHRASE_MS = 1500;

type InputChatProps = {
  variant?: 'default' | 'home';
  showTools?: boolean;
  readOnly?: boolean;
  compact?: boolean;
  configOverride?: string;
};

export function InputChat({
  variant = 'default',
  showTools = true,
  readOnly,
  compact,
  configOverride,
}: InputChatProps) {
  const router = useRouter();
  const [state, dispatch] = useAIChat();
  const [input, setInput] = React.useState('');
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const { client } = useClient();
  const updateEvent = useUpdateEvent();

  const [{ phraseIndex, charCount }, setAnim] = React.useState({ phraseIndex: 0, charCount: 0 });
  const hasActivity = !!state.messages.length || !!state.thinking;
  const isIdle = input.length === 0 && !hasActivity;
  const isCompact = isMobile || compact;

  React.useEffect(() => {
    if (!isIdle) return;
    const phrase = PLACEHOLDER_PHRASES[phraseIndex];
    const isTyping = charCount < phrase.length;
    const t = setTimeout(
      () => {
        setAnim((prev) =>
          prev.charCount < phrase.length
            ? { ...prev, charCount: prev.charCount + 1 }
            : { charCount: 0, phraseIndex: (prev.phraseIndex + 1) % PLACEHOLDER_PHRASES.length },
        );
      },
      isTyping ? TYPING_MS : PAUSE_AFTER_PHRASE_MS,
    );
    return () => clearTimeout(t);
  }, [isIdle, phraseIndex, charCount]);

  React.useEffect(() => {
    if (!isIdle) setAnim({ phraseIndex: 0, charCount: 0 });
  }, [isIdle]);

  const applyPageDesign = async (payload: unknown, message: string) => {
    const triggers = getAIPageEditTriggers();
    if (!triggers) {
      console.warn('[AI Designer] Editor bridge not available — page design not applied');
      return;
    }
    if (!payload) return;

    // New format: { sections: [...], theme: {...} }
    if (payload && typeof payload === 'object' && !Array.isArray(payload) && 'sections' in payload) {
      const { sections, theme } = payload as { sections: unknown[]; theme?: Record<string, unknown> };
      triggers.applySections(sections as any);
      if (theme) triggers.applyTheme(theme);
    } else if (Array.isArray(payload)) {
      // Bare sections array (backward compat)
      triggers.applySections(payload as any);
    } else {
      // Legacy fallback: raw CraftJS JSON string
      const data = typeof payload === 'string' ? payload : JSON.stringify(payload);
      triggers.applyStructureData(data);
    }
    toast.success(message);
  };

  const applySectionUpdate = async (section: unknown, message: string) => {
    const triggers = getAIPageEditTriggers();
    if (!triggers || !section) {
      console.warn('[AI Designer] Editor bridge not available — section update not applied');
      return;
    }
    triggers.applySectionUpdate(section as any);
    toast.success(message);
  };

  const [run, { loading }] = useMutation(
    RunAiChatDocument,
    {
      onComplete: (_, income) => {
        dispatch({ type: AIChatActionKind.set_thinking, payload: { thinking: false } });

        let runResult = income.run;
        if (typeof runResult.metadata === 'string') {
          try {
            runResult = { ...runResult, metadata: JSON.parse(runResult.metadata) };
          } catch (e) {
            console.error('Failed to parse metadata', e);
          }
        }

        dispatch({ type: AIChatActionKind.add_message, payload: { messages: [{ ...runResult, role: 'assistant' }] } });

        const tool = runResult.metadata?.tool;
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
              updateEvent(res.data.getEvent as Partial<Event>);
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
              updateEvent(res.data.getEvent as Partial<Event>);
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
          })
          .with('create_page_config', async () => {
            await applyPageDesign(tool.data, 'Design applied!');
          })
          .with('page_designer', async () => {
            await applyPageDesign(tool.data, 'Design applied!');
          })
          .with('generate_page_from_description', async () => {
            await applyPageDesign(tool.data, 'Design applied!');
          })
          .with('update_page_config_section', async () => {
            await applyPageDesign(tool.data, 'Design updated!');
          })
          .with('section_designer', async () => {
            await applySectionUpdate(tool.data, 'Section updated!');
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
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    if (textareaRef.current && input) {
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
      variables: {
        message: text,
        config: configOverride || state.config || AI_CONFIG,
        session: state.session,
        data: state.data || {},
        standId: state.standId,
      },
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
    'relative min-h-6 w-full resize-none overflow-y-auto bg-transparent text-base leading-6 text-primary font-medium outline-none';
  const textareaClass = isIdle && !isCompact ? `${textareaBaseClass} placeholder:invisible` : textareaBaseClass;
  const rootClassName =
    variant === 'home'
      ? 'backdrop-blur! border border-white bg-[rgba(20,19,23,0.64)]'
      : 'backdrop-blur-none! border-0 bg-(--btn-tertiary)';

  return (
    <Card.Root className={clsx('rounded-lg overflow-visible!', rootClassName)}>
      <Card.Content className="flex flex-col space-y-2 p-4">
        <div className="relative w-full">
          {isIdle && !isCompact && (
            <div
              className="pointer-events-none absolute inset-0 overflow-hidden text-base leading-6 text-quaternary"
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
        <div className="flex items-center gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            {showTools && (
              <Menu.Root placement={state.messages.length ? 'top-start' : 'bottom-start'}>
                <Menu.Trigger>
                  {({ toggle }) => (
                    <Button
                      variant="tertiary-alt"
                      onClick={() => toggle()}
                      size="sm"
                      icon={isCompact || !state.selectedTool?.label ? 'icon-discover-tune' : undefined}
                      iconLeft={!isCompact && state.selectedTool?.label ? 'icon-discover-tune' : undefined}
                    >
                      {!isCompact && state.selectedTool?.label}
                    </Button>
                  )}
                </Menu.Trigger>
                <Menu.Content className="w-48 p-1 backdrop-blur-md!">
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
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <SpaceSelector
              compact={isCompact}
              readOnly={readOnly}
              currentSpaceId={(state.data as { space_id?: string } | undefined)?.space_id || state.standId}
              onSelectSpace={(space) =>
                dispatch({
                  type: AIChatActionKind.set_data_run,
                  payload: { data: { space_id: space._id } },
                })
              }
            />
            <Button
              icon="icon-arrow-foward-sharp -rotate-90"
              size="sm"
              onClick={handleSubmit}
              loading={loading}
              disabled={!input.trim()}
            />
          </div>
        </div>
      </Card.Content>
    </Card.Root>
  );
}

type SpaceSelectorProps = {
  currentSpaceId?: string;
  onSelectSpace: (space: Space) => void;
  readOnly?: boolean;
  compact?: boolean;
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

function SpaceSelector({ currentSpaceId, onSelectSpace, readOnly, compact }: SpaceSelectorProps) {
  const router = useRouter();
  const me = useMe();

  const { data } = useQuery(GetSpacesDocument, {
    variables: { with_my_spaces: true, roles: [SpaceRole.Creator, SpaceRole.Admin] },
    fetchPolicy: 'cache-and-network',
    skip: !me,
  });

  const { data: dataSpace } = useQuery(GetSpaceDocument, {
    variables: { id: currentSpaceId },
    skip: !readOnly && !currentSpaceId,
  });

  const spaces = (data?.listSpaces || []) as Space[];

  if (readOnly && dataSpace?.getSpace) {
    spaces.push(dataSpace.getSpace as Space);
  }

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

  if (!spaces.length) return null;

  return (
    <div className="flex items-center gap-2">
      <Menu.Root placement="top-start" readonly={readOnly}>
        <Menu.Trigger>
          {({ toggle }) => (
            <button
              type="button"
              onClick={() => toggle()}
              disabled={readOnly}
              className={clsx(
                'h-8 px-2.5 flex items-center gap-1.5 rounded-sm bg-primary/8 border border-card-border',
                !readOnly && 'cursor-pointer',
              )}
            >
              <Image
                src={communityAvatar(selectedSpace)}
                width={16}
                height={16}
                className="rounded-full object-cover"
                alt={selectedSpace?.title || 'Community avatar'}
              />
              <p
                className={clsx(
                  'text-sm max-w-33 truncate text-tertiary',
                  compact || isMobile ? 'hidden' : 'hidden md:block',
                )}
              >
                {selectedSpace?.title || 'Select community'}
              </p>
              {!readOnly && <i className="icon-chevron-down size-4 text-tertiary" aria-hidden />}
            </button>
          )}
        </Menu.Trigger>
        <Menu.Content className="p-1 w-56 max-h-70 overflow-y-auto no-scrollbar overscroll-contain backdrop-blur-md!">
          {({ toggle }) => (
            <>
              {spaces.map((space) => (
                <MenuItem
                  key={space._id}
                  title={space.title}
                  onClick={() => {
                    onSelectSpace(space);
                    toggle();
                  }}
                />
              ))}
            </>
          )}
        </Menu.Content>
      </Menu.Root>

      <button
        disabled={readOnly}
        type="button"
        className="h-8 px-2.5 rounded-sm bg-(--btn-tertiary) text-tertiary text-sm font-medium inline-flex items-center justify-center gap-1.5 hover:bg-(--btn-tertiary-hover) disabled:cursor-default"
        onClick={() => {
          if (readOnly) return;
          if (selectedSpace?._id) {
            router.push(`/upgrade/${selectedSpace.slug || selectedSpace._id}`);
            return;
          }
        }}
        title="Upgrade to Pro"
      >
        <svg className="size-4 -rotate-90 shrink-0" viewBox="0 0 16 16" aria-hidden>
          <circle
            cx="8"
            cy="8"
            r={ringRadius}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-quaternary"
          />
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
        <span className={clsx(compact || isMobile ? 'hidden' : 'hidden md:inline')}>
          {formatCredits(selectedSpace?.credits)} / {formatCredits(selectedSpace?.credits_high_water_mark)}
        </span>
      </button>
    </div>
  );
}

export function mockWelcomeEvent(event: Event): Message[] {
  const actions = [];
  const opts = { dismissible: false, fixed: isMobile, showBackdrop: false, props: { event } };
  if (!event.address) {
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
