'use client';
import React from 'react';
import { AIChat } from './AIChat';
import { Pane } from '$lib/components/core/pane/pane';
import { Button } from '$lib/components/core';
import clsx from 'clsx';
import { AIChatActionKind, useAIChat } from './provider';

interface Option<T> {
  props?: T;
  position?: 'left' | 'right';
}

interface AIChatPane {
  content: React.ReactNode;
  options: Option<unknown>;
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
  const [state, setState] = React.useState<AIChatPane>();
  const [chatStore, chatStoreDispath] = useAIChat();

  const handleOpen = <T extends object>(opts: Option<T> = {}) => {
    chatStoreDispath({ type: AIChatActionKind.toggle_chat });
    setState({
      content: (
        <Pane.Root className="rounded-none">
          <Pane.Header.Root>
            <Pane.Header.Right>
              <Button
                size="sm"
                variant="tertiary-alt"
                icon="icon-keyboard-double-arrow-left"
                onClick={() => aiChat.close()}
              />
            </Pane.Header.Right>
          </Pane.Header.Root>
          <Pane.Content className="p-4 overflow-auto">
            <AIChat {...(opts.props as T)} />
          </Pane.Content>
        </Pane.Root>
      ),
      options: { position: 'right', ...opts },
    });
  };

  const handleClose = () => {
    setState(undefined);
    chatStoreDispath({ type: AIChatActionKind.close_chat });
  };

  React.useEffect(() => {
    aiChat.open = handleOpen;
    aiChat.close = handleClose;
  }, []);

  if (!aiChat.open || !aiChat.close) {
    return null;
  }

  return (
    <div
      className={clsx(
        'flex-1 w-full transition-all ease-in-out duration-300',
        state?.content ? 'max-w-[432px] opacity-100' : 'max-w-0 opacity-0',
      )}
    >
      {state?.content}
    </div>
  );
}
