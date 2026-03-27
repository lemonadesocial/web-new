'use client';
import React from 'react';

import { Button, Card, Menu, MenuItem, drawer } from '$lib/components/core';
import { Space } from '$lib/graphql/generated/backend/graphql';
import type { Config, Document } from '$lib/graphql/generated/ai/graphql';
import { GetListAiConfigDocument } from '$lib/graphql/generated/ai/graphql';
import { useQuery } from '$lib/graphql/request';
import { aiChatClient } from '$lib/graphql/request/instances';
import { AgentDashboardCard, AgentDashboardCardSkeleton } from '$lib/components/features/ai/manage/AgentDashboardCard';
import { KnowledgeBaseListRow, KnowledgeBaseListRowSkeleton } from '$lib/components/features/ai/manage/KnowledgeBaseListRow';
import { getAiConfigFilter, getConfigAvatarSrc, type AiManageScope } from '$lib/components/features/ai/manage/shared';
import { CreateAgentPane } from './panes/CreateAgentPane';
import { AddExistingAgentPane } from './panes/AddExistingAgentPane';
import { AddKnowledgeBasePane } from './panes/AddKnowledgeBasePane';
import { SelectExistingKnowledgeBasePane } from './panes/SelectExistingKnowledgeBasePane';

interface Props {
  space: Space;
}

function getSpotlightCount(welcomeMetadata: unknown): number {
  const meta = welcomeMetadata as { events?: unknown[] } | null | undefined;
  return meta?.events?.length ?? 0;
}

export function CommunityAgents({ space }: Props) {
  const scope = React.useMemo<AiManageScope>(() => ({ type: 'space', space }), [space]);
  const configQueryVariables = React.useMemo(() => ({ filter: getAiConfigFilter(scope) }), [scope]);

  const { data, loading, refetch } = useQuery(
    GetListAiConfigDocument,
    {
      variables: configQueryVariables,
      skip: !space?._id,
    },
    aiChatClient,
  );

  const configs = (data?.configs?.items ?? []) as Config[];
  const configsById = React.useMemo(() => new Map(configs.map((config) => [config._id, config])), [configs]);

  const { knowledgeBases, knowledgeBaseIds, knowledgeBaseAgentsById } = React.useMemo(() => {
    const uniqueDocuments = new Map<string, Pick<Document, '_id' | 'title' | 'text'>>();
    const nextKnowledgeBaseAgentsById = new Map<
      string,
      Array<{ _id: string; avatar?: string | null; name?: string | null }>
    >();

    configs.forEach((config) => {
      (config.documentsExpanded ?? []).forEach((doc) => {
        if (!uniqueDocuments.has(doc._id)) {
          uniqueDocuments.set(doc._id, { _id: doc._id, title: doc.title, text: doc.text });
        }

        const existing = nextKnowledgeBaseAgentsById.get(doc._id);
        const agent = {
          _id: config._id,
          avatar: getConfigAvatarSrc(config),
          name: config.name,
        };

        if (existing) {
          existing.push(agent);
          return;
        }

        nextKnowledgeBaseAgentsById.set(doc._id, [agent]);
      });
    });

    const nextKnowledgeBases = Array.from(uniqueDocuments.values());

    return {
      knowledgeBases: nextKnowledgeBases,
      knowledgeBaseIds: nextKnowledgeBases.map((document) => document._id),
      knowledgeBaseAgentsById: nextKnowledgeBaseAgentsById,
    };
  }, [configs]);

  const handleRefetch = React.useCallback(() => {
    void refetch();
  }, [refetch]);

  const openCreate = React.useCallback(() => {
    drawer.open(CreateAgentPane, {
      props: {
        scope,
        onCreated: handleRefetch,
      },
    });
  }, [handleRefetch, scope]);

  const openAddExisting = React.useCallback(() => {
    drawer.open(AddExistingAgentPane, {
      props: {
        space,
        onAdded: handleRefetch,
      },
    });
  }, [handleRefetch, space]);

  const openAddKnowledgeBase = React.useCallback(() => {
    drawer.open(AddKnowledgeBasePane, {
      props: {
        scope,
        onCreated: handleRefetch,
      },
    });
  }, [handleRefetch, scope]);

  const openEdit = React.useCallback((configId: string) => {
    const config = configsById.get(configId);

    if (!config) {
      return;
    }

    drawer.open(CreateAgentPane, {
      props: {
        scope,
        config,
        onCreated: handleRefetch,
      },
    });
  }, [configsById, handleRefetch, scope]);

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
              <AgentDashboardCardSkeleton key={i} />
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
              const avatarSrc = getConfigAvatarSrc(config);

              return (
                <AgentDashboardCard
                  key={config._id}
                  id={config._id}
                  avatarSrc={avatarSrc}
                  count={count}
                  countIcon="icon-ticket"
                  description={config.description}
                  isPrivate={!config.isPublic}
                  job={config.job}
                  name={config.name}
                  onClick={openEdit}
                />
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
              <Menu.Content className="p-1 min-w-50">
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
                            scope,
                            currentDocumentIds: knowledgeBaseIds,
                            onSelected: (_document) => {
                              handleRefetch();
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

            {loading ? (
              <div className="flex flex-col">
                {Array.from({ length: 2 }).map((_, i) => (
                  <KnowledgeBaseListRowSkeleton key={i} />
                ))}
              </div>
            ) : (
              knowledgeBases.map((doc) => {
                return (
                  <KnowledgeBaseListRow
                    key={doc._id}
                    agents={knowledgeBaseAgentsById.get(doc._id)}
                    text={doc.text}
                    title={doc.title}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
