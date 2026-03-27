'use client';
import React from 'react';
import { Button, Textarea, Input, drawer, toast, Menu, MenuItem, Avatar, Skeleton } from '$lib/components/core';
import { Pane } from '$lib/components/core/pane/pane';
import { CreateDocumentDocument, GetListAiConfigDocument, UpdateAiConfigDocument, type Config, type Document, type CreateDocumentMutation } from '$lib/graphql/generated/ai/graphql';
import { useMutation, useQuery } from '$lib/graphql/request';
import { aiChatClient } from '$lib/graphql/request/instances';
import { getAiConfigFilter, getConfigAvatarSrc, type AiManageScope } from '$lib/components/features/ai/manage/shared';

interface Props {
  scope: AiManageScope;
  onCreated: (document: Document) => void;
  skipAvailableTo?: boolean;
}

export function AddKnowledgeBasePane({ scope, onCreated, skipAvailableTo = false }: Props) {
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const [selectedConfigs, setSelectedConfigs] = React.useState<Config[]>([]);
  const titleInputId = React.useId();
  const availableToLabelId = React.useId();
  const contentInputId = React.useId();

  const [createDocument, { loading: creating }] = useMutation(CreateDocumentDocument, {
    onError: (error) => {
      toast.error(error.message || 'Failed to create knowledge base');
    },
  }, aiChatClient);

  const [updateConfig] = useMutation(UpdateAiConfigDocument, {
    onError: (error) => {
      toast.error(error.message || 'Failed to attach knowledge base to agent');
    },
  }, aiChatClient);

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error('Content is required');
      return;
    }

    await createDocument({
      variables: {
        input: {
          title: title.trim() || undefined,
          text: content.trim(),
        },
      },
      onComplete: async (_client, response) => {
        const data = response as CreateDocumentMutation;
        if (data?.createDocument) {
          const documentId = data.createDocument._id;

          if (selectedConfigs.length > 0) {
            await Promise.all(
              selectedConfigs.map((config) => {
                const currentDocuments = config.documents || [];
                const updatedDocuments = [...currentDocuments, documentId];

                return updateConfig({
                  variables: {
                    input: {
                      name: config.name,
                      job: config.job,
                      description: config.description,
                      documents: updatedDocuments,
                    },
                    id: config._id,
                  },
                });
              })
            );
          }

          onCreated(data.createDocument);
          drawer.close();
          toast.success('Knowledge base added');
        }
      },
    });
  };

  return (
    <Pane.Root>
      <Pane.Header.Root>
        <Pane.Header.Left />
      </Pane.Header.Root>

      <Pane.Content className="p-4 flex flex-col gap-6 overflow-auto">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold">Add Knowledge Base</h2>
          <p className="text-secondary">
            Add written information that your agents can use to answer questions accurately.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor={titleInputId} className="text-sm font-medium text-secondary">
            Title
          </label>
          <Input
            id={titleInputId}
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Event FAQs, Community Rules"
            className="w-full"
          />
        </div>

        {!skipAvailableTo && (
          <div className="flex flex-col gap-2">
            <p id={availableToLabelId} className="text-sm font-medium text-secondary">
              Available To
            </p>
            <ConfigSelector
              labelledById={availableToLabelId}
              scope={scope}
              selectedConfigs={selectedConfigs}
              onConfigsChange={setSelectedConfigs}
            />
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label htmlFor={contentInputId} className="text-sm font-medium text-secondary">
            Content
          </label>
          <Textarea
            id={contentInputId}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            variant="outlined"
            placeholder="Our community hosts music, art, and cultural events across multiple cities. Some events require registration, while others are open to all members..."
            className="w-full"
          />
        </div>
      </Pane.Content>

      <Pane.Footer>
        <div className="p-4 border-t">
          <Button
            variant="secondary"
            onClick={handleSubmit}
            loading={creating}
            disabled={!content.trim()}
          >
            Add Knowledge Base
          </Button>
        </div>
      </Pane.Footer>
    </Pane.Root>
  );
}

function ConfigSelector({
  labelledById,
  scope,
  selectedConfigs,
  onConfigsChange,
}: {
  labelledById: string;
  scope: AiManageScope;
  selectedConfigs: Config[];
  onConfigsChange: (configs: Config[]) => void;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const configQueryVariables = React.useMemo(() => ({ filter: getAiConfigFilter(scope) }), [scope]);

  const { data: configsData, loading } = useQuery(
    GetListAiConfigDocument,
    {
      variables: configQueryVariables,
      skip: !isOpen,
      fetchPolicy: 'network-only',
    },
    aiChatClient,
  );

  const allConfigs = (configsData?.configs?.items ?? []) as Config[];

  const availableConfigs = React.useMemo(() => {
    const selectedIds = new Set(selectedConfigs.map(c => c._id));
    return allConfigs.filter(config => !selectedIds.has(config._id));
  }, [allConfigs, selectedConfigs]);

  const handleSelectConfig = (config: Config) => {
    onConfigsChange([...selectedConfigs, config]);
  };

  const handleRemoveConfig = (configId: string) => {
    onConfigsChange(selectedConfigs.filter(c => c._id !== configId));
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
            {selectedConfigs.length > 0 ? (
              selectedConfigs.map((config) => {
                const avatarSrc = getConfigAvatarSrc(config);
                return (
                  <div
                    key={config._id}
                    className="pointer-events-none flex items-center gap-1.5 rounded-xs bg-card px-2.5 py-1.5"
                  >
                    <Avatar
                      src={avatarSrc}
                      className="size-4 rounded-xs object-cover"
                    />
                    <span className="text-sm">{config.name}</span>
                    <button
                      type="button"
                      aria-label={`Remove ${config.name || 'agent'}`}
                      className="pointer-events-auto text-tertiary transition-colors hover:text-secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveConfig(config._id);
                      }}
                    >
                      <i aria-hidden="true" className="icon-x size-4" />
                    </button>
                  </div>
                );
              })
            ) : (
              <span className="ml-2 pointer-events-none font-medium text-tertiary">Select agents</span>
            )}
            </div>
            <i aria-hidden="true" className="icon-chevron-down pointer-events-none size-5 shrink-0 text-tertiary" />
          </div>
        </div>
      </Menu.Trigger>

      <Menu.Content className="w-full p-1 max-h-75 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col gap-2 p-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2">
                <Skeleton className="size-8 rounded-sm shrink-0" animate />
                <div className="flex-1 min-w-0 flex flex-col gap-2">
                  <Skeleton className="h-4 w-24" animate />
                  <Skeleton className="h-3 w-32" animate />
                </div>
              </div>
            ))}
          </div>
        ) : availableConfigs.length === 0 ? (
          <div className="px-3 py-2 text-sm text-tertiary">
            No agents available
          </div>
        ) : (
          availableConfigs.map((config) => {
            const avatarSrc = getConfigAvatarSrc(config);
            return (
              <MenuItem
                key={config._id}
                onClick={() => handleSelectConfig(config)}
                className="flex items-center gap-3 px-3 py-2 text-left w-full hover:bg-background/64 transition-colors"
              >
                <Avatar
                  src={avatarSrc}
                  className="size-8 rounded-sm object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-secondary truncate">{config.name}</p>
                  <p className="text-xs text-tertiary truncate">{config.job}</p>
                </div>
              </MenuItem>
            );
          })
        )}
      </Menu.Content>
    </Menu.Root>
  );
}
