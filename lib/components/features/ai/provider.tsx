'use client';
import React from 'react';

type ToolKey = 'create-event' | 'manage-event' | 'create-community' | 'manage-community';

type Tool = {
  key: ToolKey;
  icon: string;
  label: string;
};

type ChatMessage = {};

type State = {
  selectedTool?: Tool;
  tools: Tool[];
  messages: ChatMessage[];
};

const defaultState: State = {
  tools: [
    { key: 'create-event', icon: 'icon-ticket', label: 'Create Event' },
    { key: 'manage-event', icon: 'icon-crown', label: 'Create Event' },
    { key: 'create-community', icon: 'icon-community', label: 'Create Community' },
    { key: 'manage-community', icon: 'icon-settings', label: 'Manage Community' },
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
}

export type AIChatAction = { type: AIChatActionKind; payload?: Partial<State> };

function reducers(state: State, action: AIChatAction) {
  switch (action.type) {
    case AIChatActionKind.select_tool: {
      return { ...state, selectedTool: action.payload?.selectedTool };
    }

    default:
      return state;
  }
}
