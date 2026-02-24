'use client';
import React from 'react';

import { Button, drawer, toast, Avatar, Skeleton, Card } from '$lib/components/core';
import { Pane } from '$lib/components/core/pane/pane';
import { Space } from '$lib/graphql/generated/backend/graphql';
import { GetListAiConfigDocument, UpdateAiConfigDocument, type Config } from '$lib/graphql/generated/ai/graphql';
import { useQuery, useMutation } from '$lib/graphql/request';
import { aiChatClient } from '$lib/graphql/request/instances';
import { randomEventDP } from '$lib/utils/user';

interface Props {
  space: Space;
  onAdded?: () => void;
}

export function AddExistingAgentPane({ space, onAdded }: Props) {
  const [selectedAgentId, setSelectedAgentId] = React.useState<string | null>(null);

  const { data, loading } = useQuery(
    GetListAiConfigDocument,
    {},
    aiChatClient,
  );

  const allConfigs = (data?.configs?.items ?? []) as Config[];

  const availableConfigs = React.useMemo(() => {
    return allConfigs.filter((config) => {
      const configSpaces = config.spaces || [];
      return !configSpaces.includes(space._id);
    });
  }, [allConfigs, space._id]);

  const [updateAgent, { loading: updating }] = useMutation(UpdateAiConfigDocument, {
    onComplete: () => {
      toast.success('Agent added successfully');
      onAdded?.();
      drawer.close();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to add agent');
    },
  }, aiChatClient);

  const handleAddAgent = async () => {
    if (!selectedAgentId) {
      toast.error('Please select an agent');
      return;
    }

    const config = availableConfigs.find(c => c._id === selectedAgentId);
    if (!config) {
      toast.error('Selected agent not found');
      return;
    }

    const currentSpaces = config.spaces || [];

    if (currentSpaces.includes(space._id)) {
      toast.error('Agent is already in this space');
      return;
    }

    const input = {
      name: config.name,
      job: config.job,
      description: config.description,
      spaces: [...currentSpaces, space._id],
    };

    await updateAgent({
      variables: {
        input,
        id: config._id,
      },
    });
  };

  return (
    <Pane.Root>
      <Pane.Header.Root>
        <Pane.Header.Left />
      </Pane.Header.Root>

      <Pane.Content className="p-4 flex flex-col gap-4 overflow-auto">
        <div>
          <h3 className="text-xl font-semibold">Existing Agents</h3>
          <p className="text-secondary">
            Add a bot that already exists to this community.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-md bg-card">
                <Skeleton className="size-12 aspect-square rounded-full shrink-0" animate />
                <div className="flex-1 min-w-0 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-24" animate />
                    <Skeleton className="h-4 w-8" animate />
                  </div>
                  <Skeleton className="h-4 w-32" animate />
                </div>
                <Skeleton className="size-5 rounded-full shrink-0" animate />
              </div>
            ))}
          </div>
        ) : availableConfigs.length === 0 ? (
          <Card.Root>
            <div className="p-4 flex gap-3 items-center">
              <i aria-hidden="true" className="icon-robot size-9 aspect-square text-quaternary" />
              <div className="text-tertiary space-y-0.5">
                <p>No Agents Available</p>
                <p className="text-sm">All available agents are already in this space.</p>
              </div>
            </div>
          </Card.Root>
        ) : (
          <div className="flex flex-col gap-2">
            {availableConfigs.map((config) => {
              const avatarSrc = config.avatar || randomEventDP(config._id);
              const spotlightCount = (config.welcomeMetadata as { events?: unknown[] } | null | undefined)?.events?.length ?? 0;

              return (
                <label
                  key={config._id}
                  htmlFor={`agent-${config._id}`}
                  className="flex items-center gap-3 p-3 rounded-md bg-card hover:bg-card/80 transition-colors cursor-pointer"
                >
                  <Avatar
                    src={avatarSrc}
                    className="size-12 aspect-square rounded-full shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-base font-medium truncate">{config.name}</p>
                      <div className="px-2 py-0.5 rounded bg-quaternary/20 text-sm text-secondary">
                        {spotlightCount}
                      </div>
                    </div>
                    <p className="text-sm text-tertiary truncate mt-0.5">{config.job}</p>
                  </div>
                  <div className="relative flex items-center justify-center shrink-0">
                    <input
                      type="radio"
                      id={`agent-${config._id}`}
                      name="agent-selection"
                      value={config._id}
                      checked={selectedAgentId === config._id}
                      onChange={(e) => setSelectedAgentId(e.target.value)}
                      className="sr-only peer"
                    />
                    {selectedAgentId === config._id ? (
                      <i aria-hidden="true" className="icon-check size-5 text-primary" />
                    ) : (
                      <i aria-hidden="true" className="icon-circle-outline size-5 text-quaternary" />
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        )}
      </Pane.Content>

      <Pane.Footer>
        <div className="p-4 border-t">
          <Button
            variant="secondary"
            onClick={handleAddAgent}
            loading={updating}
            disabled={!selectedAgentId}
          >
            Add Agents
          </Button>
        </div>
      </Pane.Footer>
    </Pane.Root>
  );
}
