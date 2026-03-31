'use client';
import React from 'react';
import clsx from 'clsx';
import Image from 'next/image';
import { useAIChat, AIChatActionKind } from './provider';
import { randomEventDP, userAvatar } from '$lib/utils/user';
import { Button, modal, ModalContent } from '$lib/components/core';
import { Config } from '$lib/graphql/generated/ai/graphql';

export function AgentsSidebar() {
  const [state] = useAIChat();

  if (state.configs.length <= 1) return null;

  return (
    <div className="hidden md:flex w-80 border-r h-full flex-col px-6 gap-5 pt-6">
      <h2 className="text-xl font-semibold">Agents</h2>
      <AgentList />
    </div>
  );
}

export function AgentList({ onSelectAgent }: { onSelectAgent?: () => void }) {
  const [state, dispatch] = useAIChat();

  return (
    <div className="flex-1 overflow-y-auto flex flex-col gap-2">
      {state.configs.map((agent) => {
        const isActive = state.config === agent._id;
        return (
          <div
            key={agent._id}
            onClick={() => {
              dispatch({ type: AIChatActionKind.set_config, payload: { config: agent._id } });
              onSelectAgent?.();
            }}
            className={clsx(
              'flex items-center gap-3 p-3 rounded-sm cursor-pointer transition-colors bg-(--btn-tertiary) hover:bg-quaternary',
              isActive && 'border border-primary hover:bg-(--btn-tertiary)!',
            )}
          >
            <Image
              src={agent.avatar || randomEventDP(agent._id)}
              width={40}
              height={40}
              className="rounded-full object-cover shrink-0 aspect-square"
              alt={agent.name}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="truncate">{agent.name}</p>
                <i className="icon-info-outline text-tertiary size-4" />
              </div>
              <p className="text-sm text-tertiary truncate">{agent.job}</p>
            </div>
            <i
              className="icon-info size-5 aspect-square text-quaternary"
              onClick={(e) => {
                e.stopPropagation();
                modal.open(AgentInfoModal, {
                  props: {
                    agent,
                    onSelectAgent: () => {
                      if (agent._id !== state.config) {
                        dispatch({ type: AIChatActionKind.set_config, payload: { config: agent._id } });
                      }
                      modal.close();
                    },
                  },
                });
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

export function AgentInfoModal({ agent, onSelectAgent }: { agent: Config; onSelectAgent: () => void }) {
  if (!agent) return null;

  return (
    <ModalContent
      className="**:data-icon:bg-transparent"
      icon={
        <Image
          src={agent.avatar || randomEventDP(agent._id)}
          width={48}
          height={48}
          className="rounded-full object-cover shrink-0"
          data-icon
          alt={agent.name}
        />
      }
      onClose={() => modal.close()}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="space-y-1 text-lg">
            <p>{agent.name}</p>
            <p className="text-tertiary">{agent.job}</p>
          </div>
          <p className="text-sm text-secondary">{agent.description}</p>
          <div className="flex gap-2 text-sm text-tertiary items-center">
            <span>By</span>
            <div className="flex gap-1.5 items-center">
              <Image
                src={agent.userExpanded?.image_avatar || userAvatar(agent.userExpanded)}
                width={16}
                height={16}
                className="rounded-full aspect-square"
                alt={agent.userExpanded?.name || 'User'}
              />
              <p>{agent.userExpanded?.name}</p>
            </div>
          </div>
        </div>

        <Button variant="secondary" className="w-full" onClick={() => onSelectAgent()}>
          Chat
        </Button>
      </div>
    </ModalContent>
  );
}
