'use client';
import React from 'react';
import { defaultTheme, ThemeValues } from './store';

export const EventThemeContext = React.createContext(null);

export function EventThemeProvider({ themeData, children }: React.PropsWithChildren & { themeData?: ThemeValues }) {
  const [state, dispatch] = React.useReducer(reducers, themeData || defaultTheme);
  const value: any = React.useMemo(() => [state, dispatch], [state]);

  return <EventThemeContext.Provider value={value}>{children}</EventThemeContext.Provider>;
}

export function useEventTheme(): [state: ThemeValues, dispatch: React.Dispatch<ThemeBuilderAction>] {
  const context = React.useContext(EventThemeContext);
  if (!context) throw new Error('useEventTheme must be used within a EventThemeProvider');

  return context;
}

// Community builder context
export const CommunityThemeContext = React.createContext(null);

export function CommunityThemeProvider({ themeData, children }: React.PropsWithChildren & { themeData?: ThemeValues }) {
  const [state, dispatch] = React.useReducer(reducers, themeData || defaultTheme);
  const value: any = React.useMemo(() => [state, dispatch], [state]);

  return <CommunityThemeContext.Provider value={value}>{children}</CommunityThemeContext.Provider>;
}

export function useCommunityTheme(): [state: ThemeValues, dispatch: React.Dispatch<ThemeBuilderAction>] {
  const context = React.useContext(CommunityThemeContext);
  if (!context) throw new Error('useCommunityTheme must be used within a EventThemeProvider');

  return context;
}

export enum ThemeBuilderActionKind {
  'select_template',
  'select_color',
  'select_font',
  'select_mode',
  'select_style',
  'reset',
}

export type ThemeBuilderAction = { type: ThemeBuilderActionKind; payload: Partial<ThemeValues> };

function reducers(state: ThemeValues, action: ThemeBuilderAction) {
  switch (action.type) {
    case ThemeBuilderActionKind.select_template: {
      return { ...state, theme: action.payload.theme, config: { ...state.config, ...action.payload.config } };
    }

    case ThemeBuilderActionKind.select_color: {
      return {
        ...state,
        config: { ...state.config, ...action.payload.config },
        variables: { ...state.variables, ...action.payload.variables },
      };
    }

    case ThemeBuilderActionKind.select_font: {
      return {
        ...state,
        ...action.payload,
        variables: {
          ...state.variables,
          ...action.payload.variables,
        },
      };
    }

    case ThemeBuilderActionKind.select_mode: {
      return {
        ...state,
        config: { ...state.config, ...action.payload.config },
      };
    }

    case ThemeBuilderActionKind.select_style: {
      return {
        ...state,
        config: { ...state.config, ...action.payload.config },
      };
    }

    case ThemeBuilderActionKind.reset: {
      return action.payload || defaultTheme;
    }

    default:
      console.warn('Unknown action: ' + action.type);
      return state;
  }
}
