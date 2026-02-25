'use client';
import { RunResult } from '$lib/graphql/generated/ai/graphql';
import { v4 as uuidV4 } from 'uuid';
import React from 'react';
import { AI_CONFIG } from '$lib/utils/constants';

export type ToolKey = 'create_event' | 'manage_event' | 'create_community' | 'manage_community';

type Tool = {
  key: ToolKey;
  icon: string;
  label: string;
};

export type Message = Partial<RunResult> & {
  role: 'user' | 'assistant';
};

type State = {
  toggleChat: boolean;
  session: string;
  selectedTool?: Tool;
  tools: Tool[];
  messages: Message[];
  thinking?: boolean;
  openPane?: boolean;
  data?: unknown;
  config: string;
};

const session = uuidV4();
const defaultState: State = {
  toggleChat: false,
  session: session,
  config: AI_CONFIG,
  tools: [
    { key: 'create_event', icon: 'icon-ticket', label: 'Create Event' },
    { key: 'manage_event', icon: 'icon-crown', label: 'Create Event' },
    { key: 'create_community', icon: 'icon-community', label: 'Create Community' },
    { key: 'manage_community', icon: 'icon-settings', label: 'Manage Community' },
  ],
  messages: [],
};

export const AIChatContext = React.createContext(null);

export function AIChatProvider({ children }: React.PropsWithChildren) {
  const [state, dispatch] = React.useReducer(reducers, defaultState);
  const value = React.useMemo(() => [state, dispatch] as const, [state]);

  return <AIChatContext.Provider value={value}>{children}</AIChatContext.Provider>;
}

export function useAIChat(): [state: State, dispatch: React.Dispatch<AIChatAction>] {
  const context = React.useContext(AIChatContext);
  if (!context) throw new Error('useAIChat must be used within a AIChatProvider');

  return context;
}

export enum AIChatActionKind {
  'toggle_chat',
  'close_chat',
  'select_tool',
  'add_message',
  'set_thinking',
  'set_open_pane',
  'set_data_run',
  'set_config',
  'reset',
}

export type AIChatAction = { type: AIChatActionKind; payload?: Partial<State> };

function reducers(state: State, action: AIChatAction) {
  switch (action.type) {
    case AIChatActionKind.toggle_chat: {
      return { ...state, toggleChat: !state.toggleChat };
    }

    case AIChatActionKind.close_chat: {
      return { ...state, toggleChat: false };
    }

    case AIChatActionKind.select_tool: {
      return { ...state, selectedTool: action.payload?.selectedTool };
    }

    case AIChatActionKind.add_message: {
      if (action.payload?.messages) {
        return { ...state, messages: [...state.messages, action.payload?.messages[0]] };
      }

      return state;
    }

    case AIChatActionKind.set_thinking: {
      return { ...state, thinking: action.payload?.thinking };
    }

    case AIChatActionKind.set_open_pane: {
      return { ...state, openPane: action.payload?.openPane };
    }

    case AIChatActionKind.set_data_run: {
      return { ...state, data: action.payload?.data || {} };
    }

    case AIChatActionKind.set_config: {
      return { ...state, config: action.payload?.config };
    }

    case AIChatActionKind.reset: {
      return { ...defaultState };
    }

    default:
      return state;
  }
}
