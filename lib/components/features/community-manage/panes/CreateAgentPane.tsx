'use client';
import React from 'react';
import { useForm } from 'react-hook-form';

import { Button, Textarea, FileInput, Menu, MenuItem, Input, Divider, drawer, modal, toast } from '$lib/components/core';
import { Pane } from '$lib/components/core/pane/pane';
import {
  Space,
  Event,
  GetEventsDocument,
  GetSpacesDocument,
  SearchSpacesDocument,
  SpaceFragmentDoc,
} from '$lib/graphql/generated/backend/graphql';
import { useFragment } from '$lib/graphql/generated/backend/fragment-masking';
import { CreateAiConfigDocument, UpdateAiConfigDocument } from '$lib/graphql/generated/ai/graphql';
import { WelcomeMessagePane } from './WelcomeMessagePane';
import { BackstoryPane } from './BackstoryPane';
import { AddKnowledgeBasePane } from './AddKnowledgeBasePane';
import { SelectExistingKnowledgeBasePane } from './SelectExistingKnowledgeBasePane';
import { AnswerStylePane, AnswerStyleValue, ANSWER_STYLES } from './AnswerStylePane';
import { OpenAIKeyPane } from './OpenAIKeyPane';
import { ASSET_PREFIX } from '$lib/utils/constants';
import { useQuery, useMutation } from '$lib/graphql/request';
import { getDefaultActiveSpaces, getScopeSpace, type AiManageScope } from '$lib/components/features/ai/manage/shared';
import { communityAvatar } from '$lib/utils/community';
import { uploadFiles } from '$lib/utils/file';
import { aiChatClient } from '$lib/graphql/request/instances';
import type { Config, Document } from '$lib/graphql/generated/ai/graphql';
import type { SpaceFragment } from '$lib/graphql/generated/backend/graphql';

interface Props {
  scope: AiManageScope;
  config?: Config;
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
  documents: Array<Pick<Document, '_id' | 'title' | 'text'>>;
};

const ANSWER_STYLE_MAPPING: Record<AnswerStyleValue, { temperature: number; topP: number }> = {
  very_direct: { temperature: 0.25, topP: 0.50 },
  direct: { temperature: 0.45, topP: 0.70 },
  friendly: { temperature: 0.65, topP: 0.90 },
  expressive: { temperature: 0.80, topP: 0.95 },
  very_expressive: { temperature: 0.95, topP: 1.00 },
};

function getAnswerStyleFromConfig(temperature?: number | null, topP?: number | null): AnswerStyleValue | undefined {
  if (!temperature || !topP) return undefined;

  for (const [style, config] of Object.entries(ANSWER_STYLE_MAPPING)) {
    if (Math.abs(config.temperature - temperature) < 0.01 && Math.abs(config.topP - topP) < 0.01) {
      return style as AnswerStyleValue;
    }
  }
  return undefined;
}

export function CreateAgentPane({ scope, config, onCreated }: Props) {
  const [avatar, setAvatar] = React.useState<File | null>(null);
  const isEditMode = !!config;
  const scopeSpace = getScopeSpace(scope);
  const defaultActiveSpaces = React.useMemo(() => getDefaultActiveSpaces(scope), [scope]);
  const nameInputId = React.useId();
  const jobTitleInputId = React.useId();
  const shortBioInputId = React.useId();
  const activeInLabelId = React.useId();

  const welcomeMetadata = config?.welcomeMetadata as { events?: string[] } | null | undefined;
  const spotlightEventIds = welcomeMetadata?.events || [];
  const eventQueryVariables = React.useMemo(
    () => ({
      id: spotlightEventIds.length > 0 ? spotlightEventIds : undefined,
      limit: spotlightEventIds.length || 100,
    }),
    [spotlightEventIds],
  );

  const { data: eventsData } = useQuery(GetEventsDocument, {
    variables: eventQueryVariables,
    skip: !isEditMode || spotlightEventIds.length === 0,
  });

  const initialSpotlightEvents = React.useMemo(() => {
    if (!isEditMode || !eventsData?.getEvents) return [];
    return eventsData.getEvents as Event[];
  }, [isEditMode, eventsData]);

  const shouldLoadActiveSpaces = isEditMode && (config?.spaces?.length ?? 0) > 0;
  const mySpacesQueryVariables = React.useMemo(() => ({ with_my_spaces: true }), []);
  const { data: mySpacesData } = useQuery(GetSpacesDocument, {
    variables: mySpacesQueryVariables,
    skip: !shouldLoadActiveSpaces,
    fetchPolicy: 'network-only',
  });

  const resolvedActiveSpaces = React.useMemo(() => {
    if (!shouldLoadActiveSpaces) {
      return null;
    }

    const allSpaces = (mySpacesData?.listSpaces as Space[]) || [];
    const activeSpaceIds = new Set(config?.spaces ?? []);

    return allSpaces.filter((item) => activeSpaceIds.has(item._id));
  }, [config?.spaces, mySpacesData?.listSpaces, shouldLoadActiveSpaces]);

  const { register, watch, setValue, handleSubmit, formState: { errors } } = useForm<AgentFormData>({
    defaultValues: {
      name: config?.name || '',
      jobTitle: config?.job || '',
      shortBio: config?.description || '',
      isPublic: config?.isPublic ?? true,
      welcomeMessage: config?.welcomeMessage || '',
      backstory: config?.backstory || '',
      spotlightEvents: [],
      activeIn: defaultActiveSpaces,
      answerStyle: getAnswerStyleFromConfig(config?.temperature, config?.topP),
      openAIKey: config?.openaiApiKey || undefined,
      documents: (config?.documentsExpanded ?? []).map((d) => ({ _id: d._id, title: d.title, text: d.text })),
    },
  });
  const setFormValue = setValue as (
    field: keyof AgentFormData,
    value: AgentFormData[keyof AgentFormData],
  ) => void;

  React.useEffect(() => {
    if (isEditMode && initialSpotlightEvents.length > 0) {
      setFormValue('spotlightEvents', initialSpotlightEvents);
    }
  }, [initialSpotlightEvents, isEditMode, setValue]);

  React.useEffect(() => {
    if (!resolvedActiveSpaces) {
      return;
    }

    setFormValue('activeIn', resolvedActiveSpaces.length > 0 ? resolvedActiveSpaces : defaultActiveSpaces);
  }, [defaultActiveSpaces, resolvedActiveSpaces, setValue]);

  const avatarPreviewUrl = React.useMemo(() => (avatar ? URL.createObjectURL(avatar) : null), [avatar]);

  React.useEffect(() => {
    return () => {
      if (avatarPreviewUrl) {
        URL.revokeObjectURL(avatarPreviewUrl);
      }
    };
  }, [avatarPreviewUrl]);

  const [createAgent, { loading: creating }] = useMutation(CreateAiConfigDocument, {
    onComplete: () => {
      toast.success('Agent created successfully');
      onCreated?.();
      drawer.close();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create agent');
    },
  }, aiChatClient);

  const [updateAgent, { loading: updating }] = useMutation(UpdateAiConfigDocument, {
    onComplete: () => {
      toast.success('Agent updated successfully');
      onCreated?.();
      drawer.close();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update agent');
    },
  }, aiChatClient);

  const loading = creating || updating;

  const isPublic = watch('isPublic');
  const welcomeMessage = watch('welcomeMessage');
  const backstory = watch('backstory');
  const answerStyle = watch('answerStyle');
  const openAIKey = watch('openAIKey');
  const activeIn = watch('activeIn') || [];
  const spotlightEvents = watch('spotlightEvents') || [];
  const documents = watch('documents') || [];
  const appendDocument = React.useCallback((document: Pick<Document, '_id' | 'title' | 'text'>) => {
    const nextDocuments: AgentFormData['documents'] = [
      ...documents,
      { _id: document._id, title: document.title, text: document.text },
    ];
    setFormValue('documents', nextDocuments);
  }, [documents, setFormValue]);

  const onSubmit = async (data: AgentFormData) => {
    try {
      let avatarUrl: string | undefined;
      if (avatar) {
        const uploadedFiles = await uploadFiles([avatar], 'community');
        avatarUrl = uploadedFiles[0]?.url;
      } else if (isEditMode && config?.avatar) {
        avatarUrl = config.avatar;
      }

      const answerStyleConfig = answerStyle ? ANSWER_STYLE_MAPPING[answerStyle] : undefined;

      const welcomeMetadata = spotlightEvents.length > 0
        ? { events: spotlightEvents.map(event => event._id) }
        : undefined;

      const input = {
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
        documents: documents.length > 0 ? documents.map(d => d._id) : undefined,
      };

      if (isEditMode) {
        await updateAgent({
          variables: {
            input,
            id: config._id,
          },
        });

        return;
      }

      await createAgent({
        variables: {
          input,
        },
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : `Failed to ${isEditMode ? 'update' : 'create'} agent`);
    }
  };

  return (
    <Pane.Root>
      <Pane.Header.Root>
        <Pane.Header.Left className="flex items-center gap-3">
          <p>{isEditMode ? 'Edit Agent' : 'Create Agent'}</p>
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
                      <div className="size-15.5 rounded-full flex items-center justify-center border-2 border-card-border">
                        <img
                          src={avatarPreviewUrl || config?.avatar || `${ASSET_PREFIX}/assets/images/agent.png`}
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
                <label htmlFor={nameInputId} className="text-sm font-medium text-secondary">
                  Name <span className="text-error-500">*</span>
                </label>
                <div className="flex gap-2">
                  <Input
                    id={nameInputId}
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
                    <Menu.Content className="p-1 min-w-30">
                      {({ toggle }) => (
                        <>
                          <MenuItem
                            title="Public"
                            iconLeft="icon-globe"
                            iconRight={isPublic ? 'icon-done' : ''}
                            onClick={() => {
                              setFormValue('isPublic', true);
                              toggle();
                            }}
                          />
                          <MenuItem
                            title="Private"
                            iconLeft="icon-sparkles"
                            iconRight={!isPublic ? 'icon-done' : ''}
                            onClick={() => {
                              setFormValue('isPublic', false);
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
                <label htmlFor={jobTitleInputId} className="text-sm font-medium text-secondary">
                  Job Title <span className="text-error-500">*</span>
                </label>
                <i aria-hidden="true" className="icon-help-circle size-4 text-tertiary" />
              </div>
              <Input
                id={jobTitleInputId}
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
                <label htmlFor={shortBioInputId} className="text-sm font-medium text-secondary">
                  Short Bio <span className="text-error-500">*</span>
                </label>
                <i aria-hidden="true" className="icon-help-circle size-4 text-tertiary" />
              </div>
              <Textarea
                id={shortBioInputId}
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
                <p id={activeInLabelId} className="text-sm font-medium text-secondary">
                  Active In
                </p>
                <i aria-hidden="true" className="icon-help-circle size-4 text-tertiary" />
              </div>
              <CommunitySelector
                labelledById={activeInLabelId}
                selectedSpaces={activeIn}
                onSpacesChange={(spaces) => setFormValue('activeIn', spaces)}
              />
            </div>
          </div>

          <Divider />

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <p className="text-lg">Knowledge Base</p>
              <Menu.Root>
                <Menu.Trigger>
                  {({ toggle }) => (
                    <Button
                      variant="tertiary"
                      size="sm"
                      iconLeft="icon-plus"
                      onClick={toggle}
                    >
                      Add
                    </Button>
                  )}
                </Menu.Trigger>
                <Menu.Content className="p-1 min-w-50">
                  {({ toggle }) => (
                    <>
                      <MenuItem
                        title="Create New Knowledge Base"
                        iconLeft="icon-plus"
                        onClick={() => {
                        toggle();
                        drawer.open(AddKnowledgeBasePane, {
                          props: {
                            scope,
                            skipAvailableTo: true,
                            onCreated: (document) => {
                              appendDocument(document);
                            },
                          },
                        });
                        }}
                      />
                      <MenuItem
                        title="Add Existing Knowledge Base"
                        iconLeft="icon-book"
                        onClick={() => {
                          toggle();
                          drawer.open(SelectExistingKnowledgeBasePane, {
                            props: {
                              scope,
                              currentDocumentIds: documents.map(d => d._id),
                              onSelected: (document) => {
                                appendDocument(document);
                              },
                            },
                          });
                        }}
                      />
                    </>
                  )}
                </Menu.Content>
              </Menu.Root>
            </div>
            <div className="flex flex-col divide-y divide-card-border rounded-md border border-card-border bg-card">
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="size-7 rounded-sm flex items-center justify-center bg-card">
                  <i aria-hidden="true" className="icon-info size-4 text-tertiary" />
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <p className="font-medium">Community Details</p>
                  <p className="text-sm text-tertiary">
                    Core information about your community, events, and more.
                  </p>
                </div>
              </div>
              {!!documents.length && documents.map((doc) => (
                <div
                  key={doc._id}
                  className="flex items-center gap-3 px-4 py-3"
                >
                  <div className="size-7 rounded-sm flex items-center justify-center bg-card">
                    <i aria-hidden="true" className="icon-book size-4 text-tertiary" />
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                    <p className="font-medium">{doc.title || 'Untitled'}</p>
                    <p className="text-sm text-tertiary line-clamp-1">
                      {doc.text}
                    </p>
                  </div>
                  <Menu.Root>
                    <Menu.Trigger>
                      {({ toggle }) => (
                        <button
                          type="button"
                          aria-label={`Open actions for ${doc.title || 'knowledge base'}`}
                          className="text-tertiary hover:text-primary"
                          onClick={toggle}
                        >
                          <i aria-hidden="true" className="icon-more-horiz size-5" />
                        </button>
                      )}
                    </Menu.Trigger>
                    <Menu.Content className="p-1">
                      {({ toggle }) => (
                        <MenuItem
                          title="Remove"
                          iconLeft="icon-delete"
                          onClick={() => {
                            setFormValue(
                              'documents',
                              documents.filter((d) => d._id !== doc._id),
                            );
                            toggle();
                          }}
                        />
                      )}
                    </Menu.Content>
                  </Menu.Root>
                </div>
              ))}
            </div>
          </div>

          <Divider />

          <div className="flex flex-col gap-4">
            <p className="text-lg">Advanced Settings</p>
            <div className="rounded-md border border-card-border bg-card divide-y divide-card-border">
              <button
                onClick={() => {
                  drawer.open(WelcomeMessagePane, {
                    props: {
                      initialValue: welcomeMessage,
                      initialSpotlightEvents: spotlightEvents,
                      space: activeIn[0] || scopeSpace,
                      onSave: (value: string, spotlightEvents: Event[]) => {
                        setFormValue('welcomeMessage', value);
                        setFormValue('spotlightEvents', spotlightEvents);
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
                <i aria-hidden="true" className="icon-chevron-right size-5 text-tertiary shrink-0" />
              </button>

              <button
                onClick={() => {
                  modal.open(BackstoryPane, {
                    props: {
                      initialValue: backstory,
                      onSave: (value: string) => {
                        setFormValue('backstory', value);
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
                <i aria-hidden="true" className="icon-chevron-right size-5 text-tertiary shrink-0" />
              </button>

              <button
                onClick={() => {
                  modal.open(AnswerStylePane, {
                    props: {
                      initialValue: answerStyle,
                      onSave: (value: AnswerStyleValue) => {
                        setFormValue('answerStyle', value);
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
                <i aria-hidden="true" className="icon-chevron-right size-5 text-tertiary shrink-0" />
              </button>

              <button
                onClick={() => {
                  modal.open(OpenAIKeyPane, {
                    props: {
                      initialValue: openAIKey ?? '',
                      onSave: (value: string) => {
                        setFormValue('openAIKey', value);
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
                <i aria-hidden="true" className="icon-chevron-right size-5 text-tertiary shrink-0" />
              </button>
            </div>
          </div>
        </div>
      </Pane.Content>

      <Pane.Footer>
        <div className="p-4 border-t">
          <Button variant="secondary" onClick={handleSubmit(onSubmit)} loading={loading}>
            {isEditMode ? 'Update Agent' : 'Create Agent'}
          </Button>
        </div>
      </Pane.Footer>
    </Pane.Root>
  );
}

function CommunitySelector({
  labelledById,
  selectedSpaces,
  onSpacesChange,
}: {
  labelledById: string;
  selectedSpaces: Space[];
  onSpacesChange: (spaces: Space[]) => void;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const searchSpacesVariables = React.useMemo(
    () => ({
      input: { with_my_spaces: true },
      limit: 50,
      skip: 0,
    }),
    [],
  );

  const { data, loading } = useQuery(SearchSpacesDocument, {
    variables: searchSpacesVariables,
    skip: !isOpen,
    fetchPolicy: 'network-only',
  });
  const searchableSpaces = useFragment(SpaceFragmentDoc, data?.searchSpaces?.items ?? []);

  const availableSpaces = React.useMemo(() => {
    const selectedIds = new Set(selectedSpaces.map(s => s._id));
    return searchableSpaces.filter(space => !selectedIds.has(space._id));
  }, [searchableSpaces, selectedSpaces]);

  const handleSelectSpace = (space: SpaceFragment) => {
    onSpacesChange([...selectedSpaces, space as Space]);
  };

  const handleRemoveSpace = (spaceId: string) => {
    onSpacesChange(selectedSpaces.filter(s => s._id !== spaceId));
  };

  return (
    <Menu.Root isOpen={isOpen} onOpenChange={setIsOpen} placement="bottom-start">
      <Menu.Trigger className="w-full">
        <div
          className="relative h-10 w-full rounded-sm border border-primary/8 bg-background/64 p-1 transition-colors hover:border-primary focus-within:border-primary"
        >
          <button
            type="button"
            aria-expanded={isOpen}
            aria-haspopup="menu"
            aria-labelledby={labelledById}
            className="absolute inset-0 rounded-sm"
            onClick={() => setIsOpen(true)}
          />
          <div className="relative z-10 flex h-full items-center gap-2">
            <div className="flex-1 flex flex-wrap gap-0.5 items-center min-w-0">
            {selectedSpaces.length > 0 ? (
              selectedSpaces.map((space) => (
                <div
                  key={space._id}
                  className="pointer-events-none flex items-center gap-1.5 rounded-xs bg-card px-2.5 py-1.5"
                >
                  <img
                    src={communityAvatar(space)}
                    alt={space.title || ''}
                    className="size-4 rounded-xs object-cover"
                  />
                  <span className="text-sm">{space.title}</span>
                  <button
                    type="button"
                    aria-label={`Remove ${space.title || 'community'}`}
                    className="pointer-events-auto text-tertiary transition-colors hover:text-secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveSpace(space._id);
                    }}
                  >
                    <i aria-hidden="true" className="icon-x size-4" />
                  </button>
                </div>
              ))
            ) : (
              <span className="ml-2 pointer-events-none font-medium text-tertiary">Select communities</span>
            )}
            </div>
            <i aria-hidden="true" className="icon-chevron-down pointer-events-none size-5 shrink-0 text-tertiary" />
          </div>
        </div>
      </Menu.Trigger>

      <Menu.Content className="w-full p-1 max-h-75 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <i aria-hidden="true" className="icon-loader animate-spin size-5 text-tertiary" />
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
                src={communityAvatar(space as Space)}
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
