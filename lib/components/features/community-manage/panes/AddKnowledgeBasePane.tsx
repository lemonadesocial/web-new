'use client';
import React from 'react';
import { Button, Textarea, Input, drawer, toast, Menu, MenuItem, Avatar, Skeleton } from '$lib/components/core';
import { Pane } from '$lib/components/core/pane/pane';
import { CreateDocumentDocument, GetListAiConfigDocument, UpdateAiConfigDocument, type Config, type Document, type CreateDocumentMutation } from '$lib/graphql/generated/ai/graphql';
import { Space } from '$lib/graphql/generated/backend/graphql';
import { useMutation, useQuery } from '$lib/graphql/request';
import { aiChatClient } from '$lib/graphql/request/instances';
import { randomEventDP } from '$lib/utils/user';
import { ASSET_PREFIX } from '$lib/utils/constants';

interface Props {
  space: Space;
  onCreated: (document: Document) => void;
  skipAvailableTo?: boolean;
}

export function AddKnowledgeBasePane({ space, onCreated, skipAvailableTo = false }: Props) {
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const [selectedConfigs, setSelectedConfigs] = React.useState<Config[]>([]);

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
          <label className="text-sm font-medium text-secondary">Title</label>
          <Input
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Event FAQs, Community Rules"
            className="w-full"
          />
        </div>

        {!skipAvailableTo && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-secondary">Available To</label>
            <ConfigSelector
              space={space}
              selectedConfigs={selectedConfigs}
              onConfigsChange={setSelectedConfigs}
            />
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-secondary">Content</label>
          <Textarea
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

function ConfigSelector({ space, selectedConfigs, onConfigsChange }: { space: Space; selectedConfigs: Config[]; onConfigsChange: (configs: Config[]) => void }) {
  const [isOpen, setIsOpen] = React.useState(false);

  const { data: configsData, loading } = useQuery(
    GetListAiConfigDocument,
    {
      variables: {
        filter: { spaces_in: [space._id] },
      },
      skip: !isOpen || !space?._id,
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
          className="h-10 w-full rounded-sm bg-background/64 border border-primary/8 hover:border-primary focus-within:border-primary p-1 flex items-center gap-2 cursor-pointer transition-colors"
          onClick={() => setIsOpen(true)}
        >
          <div className="flex-1 flex flex-wrap gap-0.5 items-center">
            {selectedConfigs.length > 0 ? (
              selectedConfigs.map((config) => {
                const avatarSrc = config.avatar || randomEventDP(config._id);
                return (
                  <div
                    key={config._id}
                    className="flex items-center gap-1.5 bg-card rounded-xs px-2.5 py-1.5"
                  >
                    <Avatar
                      src={avatarSrc}
                      className="size-4 rounded-xs object-cover"
                    />
                    <span className="text-sm">{config.name}</span>
                    <i
                      className="icon-x size-4 text-tertiary cursor-pointer hover:text-secondary transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveConfig(config._id);
                      }}
                    />
                  </div>
                );
              })
            ) : (
              <span className="text-tertiary font-medium ml-2">Select agents</span>
            )}
          </div>
          <i aria-hidden="true" className="icon-chevron-down size-5 text-tertiary shrink-0" />
        </div>
      </Menu.Trigger>

      <Menu.Content className="w-full p-1 max-h-[300px] overflow-y-auto">
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
            const avatarSrc = config.avatar || randomEventDP(config._id) || `${ASSET_PREFIX}/assets/images/agent.png`;
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
