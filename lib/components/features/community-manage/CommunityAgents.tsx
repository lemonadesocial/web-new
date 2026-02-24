'use client';
import React from 'react';

import { Button, Card, Skeleton, Avatar, drawer, Menu, MenuItem } from '$lib/components/core';
import { Space } from '$lib/graphql/generated/backend/graphql';
import type { Config, Document } from '$lib/graphql/generated/ai/graphql';
import { GetListAiConfigDocument } from '$lib/graphql/generated/ai/graphql';
import { useQuery } from '$lib/graphql/request';
import { aiChatClient } from '$lib/graphql/request/instances';
import { CreateAgentPane } from './panes/CreateAgentPane';
import { AddExistingAgentPane } from './panes/AddExistingAgentPane';
import { AddKnowledgeBasePane } from './panes/AddKnowledgeBasePane';
import { SelectExistingKnowledgeBasePane } from './panes/SelectExistingKnowledgeBasePane';
import { randomEventDP } from '$lib/utils/user';

interface Props {
  space: Space;
}

function getSpotlightCount(welcomeMetadata: unknown): number {
  const meta = welcomeMetadata as { events?: unknown[] } | null | undefined;
  return meta?.events?.length ?? 0;
}

export function CommunityAgents({ space }: Props) {
  const { data, loading, refetch } = useQuery(
    GetListAiConfigDocument,
    {
      variables: {
        filter: { spaces_in: [space._id] },
      },
      skip: !space?._id,
    },
    aiChatClient,
  );

  const configs = (data?.configs?.items ?? []) as Config[];

  const knowledgeBases = React.useMemo(() => {
    const uniqueDocuments = new Map<string, Pick<Document, '_id' | 'title' | 'text'>>();

    configs.forEach((config) => {
      (config.documentsExpanded ?? []).forEach((doc) => {
        if (!uniqueDocuments.has(doc._id)) {
          uniqueDocuments.set(doc._id, { _id: doc._id, title: doc.title, text: doc.text });
        }
      });
    });

    return Array.from(uniqueDocuments.values());
  }, [configs]);

  const documentsToConfigs = React.useMemo(() => {
    const map = new Map<string, Config[]>();

    configs.forEach((config) => {
      (config.documentsExpanded ?? []).forEach((doc) => {
        const existing = map.get(doc._id) ?? [];

        if (!existing.includes(config)) {
          map.set(doc._id, [...existing, config]);
        }
      });
    });
    
    return map;
  }, [configs]);

  const openCreate = () => {
    drawer.open(CreateAgentPane, {
      props: {
        space,
        onCreated: () => refetch(),
      },
    });
  };

  const openAddExisting = () => {
    drawer.open(AddExistingAgentPane, {
      props: {
        space,
        onAdded: () => refetch(),
      },
    });
  };

  const openAddKnowledgeBase = () => {
    drawer.open(AddKnowledgeBasePane, {
      props: {
        space,
        onCreated: () => refetch(),
      },
    });
  };

  const openEdit = (config: Config) => {
    drawer.open(CreateAgentPane, {
      props: {
        space,
        config,
        onCreated: () => refetch(),
      },
    });
  };

  return (
    <div className="page bg-transparent! mx-auto py-7 px-4 md:px-0">
      <div className="flex flex-col gap-5">
        <div className="flex gap-2 items-center justify-between">
          <div className="flex flex-col gap-1 flex-1">
            <h3 className="text-xl font-semibold">Agents</h3>
            <p className="text-secondary text-sm">
              Create and manage assistants that help people discover events, answer questions, and navigate your community.
            </p>
          </div>
          <Menu.Root placement="bottom-end">
            <Menu.Trigger>
              <Button variant="tertiary-alt" size="sm" iconLeft="icon-plus">
                Create Agent
              </Button>
            </Menu.Trigger>
            <Menu.Content className="p-2">
              {({ toggle }) => (
                <>
                  <MenuItem
                    title="Create New Agent"
                    iconLeft="icon-plus"
                    onClick={() => {
                      openCreate();
                      toggle();
                    }}
                  />
                  <MenuItem
                    title="Add Existing Agent"
                    iconLeft="icon-robot"
                    onClick={() => {
                      openAddExisting();
                      toggle();
                    }}
                  />
                </>
              )}
            </Menu.Content>
          </Menu.Root>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card.Root key={i} className="p-4 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <Skeleton className="size-12 aspect-square rounded-full shrink-0" animate />
                  <Skeleton className="h-4 w-8 shrink-0" animate />
                </div>
                <div className="flex flex-col gap-2 min-w-0">
                  <Skeleton className="h-5 w-24" animate />
                  <Skeleton className="h-4 w-32" animate />
                  <Skeleton className="h-4 w-full" animate />
                </div>
              </Card.Root>
            ))}
          </div>
        ) : configs.length === 0 ? (
          <Card.Root>
            <div className="p-4 flex gap-3 items-center">
              <i aria-hidden="true" className="icon-robot size-9 aspect-square text-quaternary" />
              <div className="text-tertiary space-y-0.5">
                <p>No Agents Yet</p>
                <p className="text-sm">Create your first agent to help members explore and engage with your community.</p>
              </div>
            </div>
          </Card.Root>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {configs.map((config) => {
              const count = getSpotlightCount(config.welcomeMetadata);
              const avatarSrc = config.avatar || randomEventDP(config._id);
              
              return (
                <Card.Root 
                  key={config._id} 
                  className="p-4 relative flex flex-col gap-3 cursor-pointer hover:bg-card transition-colors"
                  onClick={() => openEdit(config)}
                >
                  <div className="flex justify-between items-start gap-2">
                    <Avatar
                      src={avatarSrc}
                      className="size-12 aspect-square rounded-full shrink-0"
                    />
                    <div className="flex items-center gap-1.5 text-tertiary text-sm shrink-0">
                      <i aria-hidden="true" className="icon-ticket size-4 aspect-square" />
                      <span>{count}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 min-w-0">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {!config.isPublic && (
                          <div className="size-5 rounded-full flex items-center justify-center bg-accent-400/16">
                            <i aria-hidden="true" className="icon-sparkles size-3 aspect-square text-accent-400" />
                          </div>
                        )}
                        <p className="truncate text-lg">{config.name}</p>
                      </div>
                      <p className="text-tertiary text-sm truncate">{config.job}</p>
                    </div>
                    <p className="text-secondary text-sm line-clamp-2">{config.description}</p>
                  </div>
                </Card.Root>
              );
            })}
          </div>
        )}

        <hr className="border-t" />

        <div className="flex flex-col gap-4">
          <div className="flex gap-2 items-center justify-between">
            <div className="flex flex-col gap-1 flex-1">
              <h3 className="text-xl font-semibold">Knowledge Bases</h3>
              <p className="text-secondary text-sm">
                These knowledge sources can be shared across one or more agents.
              </p>
            </div>
            <Menu.Root>
              <Menu.Trigger>
                {({ toggle }) => (
                  <Button
                    variant="tertiary-alt"
                    size="sm"
                    iconLeft="icon-plus"
                    onClick={toggle}
                  >
                    Add
                  </Button>
                )}
              </Menu.Trigger>
              <Menu.Content className="p-1 min-w-[200px]">
                {({ toggle }) => (
                  <>
                    <MenuItem
                      title="Create New Knowledge Base"
                      iconLeft="icon-plus"
                      onClick={() => {
                        toggle();
                        openAddKnowledgeBase();
                      }}
                    />
                    <MenuItem
                      title="Add Existing Knowledge Base"
                      iconLeft="icon-book"
                      onClick={() => {
                        toggle();
                        drawer.open(SelectExistingKnowledgeBasePane, {
                          props: {
                            currentDocumentIds: knowledgeBases.map(d => d._id),
                            onSelected: (_document) => {
                              refetch();
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

          <div className="flex flex-col divide-y divide-(--color-divider) bg-card rounded-md border border-card-border">
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

            {loading ? (
              <div className="flex flex-col gap-3 px-4 py-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="size-7 rounded-sm" animate />
                    <div className="flex flex-col gap-2 min-w-0 flex-1">
                      <Skeleton className="h-4 w-28" animate />
                      <Skeleton className="h-3 w-56" animate />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              knowledgeBases.map((doc) => {
                const usedConfigs = documentsToConfigs.get(doc._id) ?? [];
                return (
                  <div key={doc._id} className="flex items-center gap-3 px-4 py-3">
                    <div className="size-7 shrink-0 rounded-sm flex items-center justify-center bg-card">
                      <i aria-hidden="true" className="icon-book size-4 text-tertiary" />
                    </div>
                    <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                      <p className="font-medium">{doc.title || 'Untitled'}</p>
                      <p className="text-sm text-tertiary line-clamp-1">{doc.text}</p>
                    </div>
                    {usedConfigs.length > 0 && (
                      <div className="flex -space-x-2 shrink-0">
                        {usedConfigs.map((config) => (
                          <div
                            key={config._id}
                            className="tooltip tooltip-top"
                            data-tip={config.name}
                          >
                            <Avatar
                              src={config.avatar || randomEventDP(config._id)}
                              className="size-6 rounded-full"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
