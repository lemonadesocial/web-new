'use client';
import React from 'react';
import clsx from 'clsx';
import { useAIChat, AIChatActionKind } from './provider';

export function AgentsSidebar() {
  const [state, dispatch] = useAIChat();

  if (state.configs.length <= 1) return null;

  return (
    <div className="hidden md:flex w-[320px] border-r h-full flex-col bg-background">
      <div className="p-6">
        <h2 className="text-xl font-semibold">Agents</h2>
        <p className="text-sm text-tertiary mt-1">
          Chat with AI assistants to explore and get help across the community.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-3">
        {state.configs.map((agent: any) => {
          const isActive = state.config === agent._id;
          return (
            <div
              key={agent._id}
              onClick={() => dispatch({ type: AIChatActionKind.set_config, payload: { config: agent._id } })}
              className={clsx(
                'flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors mb-1',
                isActive ? 'bg-primary/8 border border-primary/10' : 'hover:bg-primary/4'
              )}
            >
              <img
                src={agent.avatar || '/assets/default-bot.png'}
                className="w-10 h-10 rounded-full object-cover shrink-0"
                alt={agent.name}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium truncate">{agent.name}</p>
                  <i className="icon-info-outline text-tertiary size-4" />
                </div>
                <p className="text-xs text-tertiary truncate">{agent.job || agent.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-6 flex justify-center">
        <div className="size-24 rounded-full bg-primary/4 flex items-center justify-center border-2 border-dashed border-primary/10">
          <span className="text-4xl font-bold text-primary/10">D</span>
        </div>
      </div>
    </div>
  );
}
