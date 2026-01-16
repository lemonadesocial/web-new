'use client';
import { RunResult } from '$lib/graphql/generated/ai/graphql';
import { v4 as uuidV4 } from 'uuid';
import React from 'react';
import { Space, Event } from '$lib/graphql/generated/backend/graphql';

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
  session: string;
  selectedTool?: Tool;
  tools: Tool[];
  messages: Message[];
  thinking?: boolean;
  toggleDetail?: {
    action: ToolKey;
    props: {
      title: string;
      data: Partial<Space | Event>;
    };
  };
};

const session = uuidV4();
const defaultState: State = {
  session: session,
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
  const value: any = React.useMemo(() => [state, dispatch], [state]);

  return <AIChatContext.Provider value={value}>{children}</AIChatContext.Provider>;
}

export function useAIChat(): [state: State, dispatch: React.Dispatch<AIChatAction>] {
  const context = React.useContext(AIChatContext);
  if (!context) throw new Error('useAIChat must be used within a AIChatProvider');

  return context;
}

export enum AIChatActionKind {
  'select_tool',
  'add_message',
  'set_thinking',
  'toggle_detail',
}

export type AIChatAction = { type: AIChatActionKind; payload?: Partial<State> };

function reducers(state: State, action: AIChatAction) {
  switch (action.type) {
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

    case AIChatActionKind.toggle_detail: {
      return { ...state, toggleDetail: action.payload?.toggleDetail };
    }

    default:
      return state;
  }
}
