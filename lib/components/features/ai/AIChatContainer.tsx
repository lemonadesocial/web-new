'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import clsx from 'clsx';

import { AIChatActionKind, useAIChat } from './provider';

type AIChatPaneComponentProps = {
  props?: object;
  onClose: () => void;
};

const AIChatDesktopPane = dynamic<AIChatPaneComponentProps>(() => import('./AIChatPane').then((mod) => mod.AIChatDesktopPane), {
  ssr: false,
});
const AIChatMobileSheet = dynamic<AIChatPaneComponentProps>(() => import('./AIChatPane').then((mod) => mod.AIChatMobileSheet), {
  ssr: false,
});

interface Option<T extends object = Record<string, unknown>> {
  props?: T;
  position?: 'left' | 'right';
}

interface AIChatPaneState {
  options: Option;
}

interface AIChatPaneAPI {
  open: <T extends object>(options?: Option<T>) => void;
  close: (id?: number) => void;
}

export const aiChat: AIChatPaneAPI = {
  open: () => {
    throw new Error('Drawer not initialized');
  },
  close: () => {
    throw new Error('Drawer not initialized');
  },
};

export function AIChatContainer() {
  const [state, setState] = React.useState<AIChatPaneState>();
  const [isMobileView, setIsMobileView] = React.useState(false);
  const [, chatStoreDispatch] = useAIChat();

  const handleClose = React.useCallback(() => {
    setState(undefined);
    chatStoreDispatch({ type: AIChatActionKind.close_chat });
  }, [chatStoreDispatch]);

  const handleOpen = React.useCallback(
    <T extends object>(opts: Option<T> = {}) => {
      chatStoreDispatch({ type: AIChatActionKind.toggle_chat });
      setState({ options: opts as Option });
    },
    [chatStoreDispatch],
  );

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const handleChange = () => setIsMobileView(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  React.useEffect(() => {
    aiChat.open = handleOpen;
    aiChat.close = handleClose;
  }, [handleClose, handleOpen]);

  if (isMobileView) {
    return state ? (
      <AIChatMobileSheet props={state.options.props} onClose={handleClose} />
    ) : null;
  }

  return (
    <div
      className={clsx(
        'flex-1 w-full transition-all ease-in-out duration-300 z-0',
        state ? 'max-w-108 opacity-100' : 'max-w-0 opacity-0',
      )}
    >
      {state && <AIChatDesktopPane props={state.options.props} onClose={handleClose} />}
    </div>
  );
}
