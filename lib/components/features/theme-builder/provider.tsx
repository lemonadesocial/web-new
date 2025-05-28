'use client';
import React from 'react';
import { defaultTheme, getRandomColor, getRandomFont, patterns, shaders, ThemeValues } from './store';
import { merge } from 'lodash';

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
  'random',
  'reset',
}

export type ThemeBuilderAction = { type: ThemeBuilderActionKind; payload?: Partial<ThemeValues> };

function reducers(state: ThemeValues, action: ThemeBuilderAction) {
  switch (action.type) {
    case ThemeBuilderActionKind.select_template: {
      let payload = { ...action.payload };

      if (payload.theme === 'minimal') {
        payload = { ...payload, config: { ...payload.config, name: '' } };
      }

      if (payload.theme === 'shader' && !shaders.map((item) => item.name).includes(state.config.name as string)) {
        const index = Math.floor(Math.random() * shaders.length);
        const shader = shaders[index];
        payload = { ...payload, config: { ...payload.config, name: shader.name, color: shader.accent } };
      }

      if (payload.theme === 'pattern' && !patterns.includes(state.config.name as string)) {
        const index = Math.floor(Math.random() * patterns.length);
        const pattern = patterns[index];
        payload = { ...payload, config: { ...payload.config, name: pattern } };
      }

      return { ...merge(state, payload) };
    }

    case ThemeBuilderActionKind.select_color: {
      return { ...merge(state, action.payload) };
    }

    case ThemeBuilderActionKind.select_font: {
      return { ...merge(state, action.payload) };
    }

    case ThemeBuilderActionKind.select_mode: {
      return { ...merge(state, action.payload) };
    }

    case ThemeBuilderActionKind.select_style: {
      return { ...merge(state, action.payload) };
    }

    case ThemeBuilderActionKind.random: {
      const [fontTitle, fontTitleVariable] = getRandomFont('title');
      const [fontBody, fontBodyVariable] = getRandomFont('body');

      let payload = {
        ...state,
        font_title: fontTitle,
        font_body: fontBody,
        variables: { ...state.variables, font: { '--font-title': fontTitleVariable, '--font-body': fontBodyVariable } },
      };

      if (payload.theme === 'minimal') {
        payload = { ...payload, config: { ...payload.config, color: getRandomColor(), name: '' } };
      }

      if (payload.theme === 'shader') {
        const index = Math.floor(Math.random() * shaders.length);
        const shader = shaders[index];
        payload = { ...payload, config: { ...payload.config, name: shader.name, color: shader.accent } };
      }

      if (payload.theme === 'pattern') {
        const index = Math.floor(Math.random() * patterns.length);
        const pattern = patterns[index];
        payload = { ...payload, config: { ...payload.config, name: pattern } };
      }

      return { ...payload };
    }

    case ThemeBuilderActionKind.reset: {
      return { ...merge(defaultTheme, action.payload) };
    }

    default:
      console.warn('Unknown action: ' + action.type);
      return state;
  }
}
