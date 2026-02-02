'use client';
import React from 'react';
import { useForm } from 'react-hook-form';

import { Button, Textarea, FileInput, Card, Menu, MenuItem, Input, Divider, drawer, modal, toast } from '$lib/components/core';
import { Pane } from '$lib/components/core/pane/pane';
import { Space, Event, SearchSpacesDocument } from '$lib/graphql/generated/backend/graphql';
import { CreateAiConfigDocument } from '$lib/graphql/generated/ai/graphql';
import { WelcomeMessagePane } from './WelcomeMessagePane';
import { BackstoryPane } from './BackstoryPane';
import { AnswerStylePane, AnswerStyleValue, ANSWER_STYLES } from './AnswerStylePane';
import { OpenAIKeyPane } from './OpenAIKeyPane';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { useQuery, useMutation } from '$lib/graphql/request';
import { communityAvatar } from '$lib/utils/community';
import { uploadFiles } from '$lib/utils/file';
import { aiChatClient } from '$lib/graphql/request/instances';

interface Props {
  space: Space;
  onCreated?: () => void;
}

type AgentFormData = {
  name: string;
  jobTitle: string;
  shortBio: string;
  isPublic: boolean;
  welcomeMessage: string;
  backstory: string;
  answerStyle?: AnswerStyleValue;
  openAIKey?: string;
  spotlightEvents: Event[];
  activeIn: Space[];
};

const ANSWER_STYLE_MAPPING: Record<AnswerStyleValue, { temperature: number; topP: number }> = {
  very_direct: { temperature: 0.25, topP: 0.50 },
  direct: { temperature: 0.45, topP: 0.70 },
  friendly: { temperature: 0.65, topP: 0.90 },
  expressive: { temperature: 0.80, topP: 0.95 },
  very_expressive: { temperature: 0.95, topP: 1.00 },
};

export function CreateAgentPane({ space, onCreated }: Props) {
  const [avatar, setAvatar] = React.useState<File | null>(null);

  const { register, watch, setValue, handleSubmit, formState: { errors } } = useForm<AgentFormData>({
    defaultValues: {
      name: '',
      jobTitle: '',
      shortBio: '',
      isPublic: true,
      welcomeMessage: '',
      backstory: '',
      spotlightEvents: [],
      activeIn: [space],
    },
  });

  const [createAgent, { loading }] = useMutation(CreateAiConfigDocument, {
    onComplete: () => {
      toast.success('Agent created successfully');
      onCreated?.();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create agent');
    },
  }, aiChatClient);

  const isPublic = watch('isPublic');
  const welcomeMessage = watch('welcomeMessage');
  const backstory = watch('backstory');
  const answerStyle = watch('answerStyle');
  const openAIKey = watch('openAIKey');
  const activeIn = watch('activeIn') || [];
  const spotlightEvents = watch('spotlightEvents') || [];

  const onSubmit = async (data: AgentFormData) => {
    try {
      let avatarUrl: string | undefined;
      if (avatar) {
        const uploadedFiles = await uploadFiles([avatar], 'community');
        avatarUrl = uploadedFiles[0]?.url;
      }

      const answerStyleConfig = answerStyle ? ANSWER_STYLE_MAPPING[answerStyle] : undefined;

      const welcomeMetadata = spotlightEvents.length > 0
        ? { events: spotlightEvents.map(event => event._id) }
        : undefined;

      await createAgent({
        variables: {
          input: {
            name: data.name,
            job: data.jobTitle,
            description: data.shortBio,
            isPublic: data.isPublic,
            avatar: avatarUrl,
            backstory: data.backstory || undefined,
            welcomeMessage: data.welcomeMessage || undefined,
            welcomeMetadata,
            temperature: answerStyleConfig?.temperature,
            topP: answerStyleConfig?.topP,
            openaiApiKey: data.openAIKey || undefined,
            spaces: activeIn.map(s => s._id),
          },
        },
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create agent');
    }
  };

  return (
    <Pane.Root>
      <Pane.Header.Root>
        <Pane.Header.Left className="flex items-center gap-3">
          <p>Create Agent</p>
        </Pane.Header.Left>
      </Pane.Header.Root>

      <Pane.Content className="p-4 flex flex-col gap-6 overflow-auto">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <div className="relative">
                <FileInput
                  onChange={(files) => {
                    if (files && files.length > 0) {
                      setAvatar(files[0]);
                    }
                  }}
                  accept="image/*"
                >
                  {(open) => (
                    <>
                      <div className="size-[62px] rounded-full flex items-center justify-center border-2 border-card-border">
                        <img
                          src={avatar ? URL.createObjectURL(avatar) : `${ASSET_PREFIX}/assets/images/agent.png`}
                          alt="Agent avatar"
                          className="size-full rounded-full object-cover"
                        />
                      </div>
                      <Button
                        onClick={open}
                        variant="secondary"
                        size="sm"
                        className="absolute bottom-0 right-0 size-6 rounded-full p-0"
                        icon="icon-upload-sharp"
                      />
                    </>
                  )}
                </FileInput>
              </div>

              <div className="flex-1 flex flex-col gap-2">
                <label className="text-sm font-medium text-secondary">
                  Name <span className="text-error-500">*</span>
                </label>
                <div className="flex gap-2">
                  <Input
                    variant="outlined"
                    {...register('name', { required: 'Name is required' })}
                    placeholder="Culture Fest Agent"
                    className="flex-1"
                  />
                  <Menu.Root>
                    <Menu.Trigger>
                      {({ toggle }) => (
                        <Button
                          variant="tertiary-alt"
                          icon={isPublic ? 'icon-globe' : 'icon-sparkles'}
                          iconRight="icon-chevron-down"
                          onClick={toggle}
                          className="h-10"
                        />
                      )}
                    </Menu.Trigger>
                    <Menu.Content className="p-1 min-w-[120px]">
                      {({ toggle }) => (
                        <>
                          <MenuItem
                            title="Public"
                            iconLeft="icon-globe"
                            iconRight={isPublic ? 'icon-done' : ''}
                            onClick={() => {
                              setValue('isPublic', true);
                              toggle();
                            }}
                          />
                          <MenuItem
                            title="Private"
                            iconLeft="icon-sparkles"
                            iconRight={!isPublic ? 'icon-done' : ''}
                            onClick={() => {
                              setValue('isPublic', false);
                              toggle();
                            }}
                          />
                        </>
                      )}
                    </Menu.Content>
                  </Menu.Root>
                </div>
                {errors.name && (
                  <p className="text-sm text-error-500">{errors.name.message}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1">
                <label className="text-sm font-medium text-secondary">
                  Job Title <span className="text-error-500">*</span>
                </label>
                <i className="icon-help-circle size-4 text-tertiary" />
              </div>
              <Input
                variant="outlined"
                {...register('jobTitle', { required: 'Job Title is required' })}
                placeholder="General Assistant"
                error={!!errors.jobTitle}
              />
              {errors.jobTitle && (
                <p className="text-sm text-error-500">{errors.jobTitle.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1">
                <label className="text-sm font-medium text-secondary">
                  Short Bio <span className="text-error-500">*</span>
                </label>
                <i className="icon-help-circle size-4 text-tertiary" />
              </div>
              <Textarea
                {...register('shortBio', { required: 'Short Bio is required' })}
                rows={3}
                variant="outlined"
                placeholder="Helps you find events and explore the Culture Fest community."
              />
              {errors.shortBio && (
                <p className="text-sm text-error-500">{errors.shortBio.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1">
                <label className="text-sm font-medium text-secondary">Active In</label>
                <i className="icon-help-circle size-4 text-tertiary" />
              </div>
              <CommunitySelector
                selectedSpaces={activeIn}
                onSpacesChange={(spaces) => setValue('activeIn', spaces)}
                space={space}
              />
            </div>
          </div>

          <Divider />

          <div className="flex flex-col gap-4">
            <p className="text-lg">Advanced Settings</p>
            <div className="bg-card rounded-md border border-card-border divide-y divide-(--color-divider)">
              <button
                onClick={() => {
                  drawer.open(WelcomeMessagePane, {
                    props: {
                      initialValue: welcomeMessage,
                      initialSpotlightEvents: spotlightEvents,
                      space,
                      onSave: (value: string, spotlightEvents: Event[]) => {
                        setValue('welcomeMessage', value);
                        setValue('spotlightEvents', spotlightEvents);
                      },
                    },
                  });
                }}
                className="flex items-center justify-between p-3 hover:bg-card transition-colors w-full"
              >
                <div className="flex flex-col gap-0.5 items-start flex-1 min-w-0">
                  <p>Welcome Message</p>
                  <p className={`text-sm line-clamp-1 text-left ${welcomeMessage ? 'text-secondary' : 'text-tertiary'}`}>
                    {welcomeMessage || 'This is the first message members see when they open the chat.'}
                  </p>
                </div>
                <i className="icon-chevron-right size-5 text-tertiary shrink-0" />
              </button>

              <button
                onClick={() => {
                  modal.open(BackstoryPane, {
                    props: {
                      initialValue: backstory,
                      onSave: (value: string) => {
                        setValue('backstory', value);
                      },
                    },
                  });
                }}
                className="flex items-center justify-between p-3 hover:bg-card transition-colors w-full"
              >
                <div className="flex flex-col gap-0.5 items-start flex-1 min-w-0">
                  <p>Backstory</p>
                  <p className={`text-sm line-clamp-1 text-left ${backstory ? 'text-secondary' : 'text-tertiary'}`}>
                    {backstory || 'Add deeper context that shapes how the agent responds.'}
                  </p>
                </div>
                <i className="icon-chevron-right size-5 text-tertiary shrink-0" />
              </button>

              <button
                onClick={() => {
                  modal.open(AnswerStylePane, {
                    props: {
                      initialValue: answerStyle,
                      onSave: (value: AnswerStyleValue) => {
                        setValue('answerStyle', value);
                      },
                    },
                  });
                }}
                className="flex items-center justify-between p-3 hover:bg-card transition-colors w-full"
              >
                <div className="flex flex-col gap-0.5 items-start flex-1 min-w-0">
                  <p>Answer Style</p>
                  <p className={`text-sm line-clamp-1 text-left ${answerStyle ? 'text-secondary' : 'text-tertiary'}`}>
                    {answerStyle ? ANSWER_STYLES.find(style => style.value === answerStyle)?.label : "Controls how direct or expressive the agent's responses feel."}
                  </p>
                </div>
                <i className="icon-chevron-right size-5 text-tertiary shrink-0" />
              </button>

              <button
                onClick={() => {
                  modal.open(OpenAIKeyPane, {
                    props: {
                      initialValue: openAIKey ?? '',
                      onSave: (value: string) => {
                        setValue('openAIKey', value);
                      },
                    },
                  });
                }}
                className="flex items-center justify-between p-3 hover:bg-card transition-colors w-full"
              >
                <div className="flex flex-col gap-0.5 items-start flex-1 min-w-0">
                  <p>OpenAI Key</p>
                  {
                    openAIKey ? (
                      <p className="text-success-500 text-sm">Connected</p>
                    ) : (
                      <p className="text-sm text-tertiary">Use your own OpenAI key to manage usage and limits.</p>
                    )
                  }
                </div>
                <i className="icon-chevron-right size-5 text-tertiary shrink-0" />
              </button>
            </div>
          </div>
        </div>
      </Pane.Content>

      <Pane.Footer>
        <div className="p-4 border-t">
          <Button variant="secondary" onClick={handleSubmit(onSubmit)} loading={loading}>
            Create Agent
          </Button>
        </div>
      </Pane.Footer>
    </Pane.Root>
  );
}

function CommunitySelector({ selectedSpaces, onSpacesChange, space }: { selectedSpaces: Space[]; onSpacesChange: (spaces: Space[]) => void; space: Space }) {
  const [isOpen, setIsOpen] = React.useState(false);

  const { data, loading } = useQuery(SearchSpacesDocument, {
    variables: {
      input: { with_my_spaces: true },
      limit: 50,
      skip: 0,
    },
    skip: !isOpen,
    fetchPolicy: 'network-only',
  });

  const availableSpaces = React.useMemo(() => {
    const spaces = data?.searchSpaces?.items || [];
    const selectedIds = new Set(selectedSpaces.map(s => s._id));
    return spaces.filter(space => !selectedIds.has(space._id));
  }, [data, selectedSpaces]);

  const handleSelectSpace = (space: Space) => {
    onSpacesChange([...selectedSpaces, space]);
  };

  const handleRemoveSpace = (spaceId: string) => {
    onSpacesChange(selectedSpaces.filter(s => s._id !== spaceId));
  };

  return (
    <Menu.Root isOpen={isOpen} onOpenChange={setIsOpen} placement="bottom-start">
      <Menu.Trigger className="w-full">
        <div
          className="h-10 w-full rounded-sm bg-background/64 border border-primary/8 hover:border-primary focus-within:border-primary p-1 flex items-center gap-2 cursor-pointer transition-colors"
          onClick={() => setIsOpen(true)}
        >
          <div className="flex-1 flex flex-wrap gap-0.5 items-center">
            {selectedSpaces.length > 0 ? (
              selectedSpaces.map((space) => (
                <div
                  key={space._id}
                  className="flex items-center gap-1.5 bg-card rounded-xs px-2.5 py-1.5"
                >
                  <img
                    src={communityAvatar(space)}
                    alt={space.title || ''}
                    className="size-4 rounded-xs object-cover"
                  />
                  <span className="text-sm">{space.title}</span>
                  <i
                    className="icon-x size-4 text-tertiary cursor-pointer hover:text-secondary transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveSpace(space._id);
                    }}
                  />
                </div>
              ))
            ) : (
              <span className="text-tertiary font-medium ml-2">Select communities</span>
            )}
          </div>
          <i className="icon-chevron-down size-5 text-tertiary shrink-0" />
        </div>
      </Menu.Trigger>

      <Menu.Content className="w-full p-1 max-h-[300px] overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <i className="icon-loader animate-spin size-5 text-tertiary" />
          </div>
        ) : availableSpaces.length === 0 ? (
          <div className="px-3 py-2 text-sm text-tertiary">
            No communities available
          </div>
        ) : (
          availableSpaces.map((space) => (
            <MenuItem
              key={space._id}
              onClick={() => handleSelectSpace(space)}
              className="flex items-center gap-3 px-3 py-2 text-left w-full hover:bg-background/64 transition-colors"
            >
              <img
                src={communityAvatar(space)}
                alt={space.title || ''}
                className="size-8 rounded-sm object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-secondary truncate">{space.title}</p>
              </div>
            </MenuItem>
          ))
        )}
      </Menu.Content>
    </Menu.Root>
  );
}
