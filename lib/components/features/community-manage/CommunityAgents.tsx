'use client';
import React from 'react';

import { Button, Card, Skeleton, Avatar, drawer } from '$lib/components/core';
import { Space } from '$lib/graphql/generated/backend/graphql';
import type { Config } from '$lib/graphql/generated/ai/graphql';
import { GetListAiConfigDocument } from '$lib/graphql/generated/ai/graphql';
import { useQuery } from '$lib/graphql/request';
import { aiChatClient } from '$lib/graphql/request/instances';
import { CreateAgentPane } from './panes/CreateAgentPane';
import { randomEventDP } from '$lib/utils/user';

interface Props {
  space: Space;
}

const LIMIT = 15;

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
        limit: LIMIT,
      },
      skip: !space?._id,
    },
    aiChatClient,
  );

  const configs = (data?.configs?.items ?? []) as Config[];

  const openCreate = () => {
    drawer.open(CreateAgentPane, {
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
          <Button variant="tertiary-alt" size="sm" iconLeft="icon-plus" onClick={openCreate}>
            Create Agent
          </Button>
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
              <i className="icon-robot size-9 aspect-square text-quaternary" />
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
                      <i className="icon-ticket size-4 aspect-square" />
                      <span>{count}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 min-w-0">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {!config.isPublic && (
                          <div className="size-5 rounded-full flex items-center justify-center bg-accent-400/16">
                            <i className="icon-sparkles size-3 aspect-square text-accent-400" />
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
      </div>
    </div>
  );
}
