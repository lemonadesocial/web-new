'use client';
import React from 'react';
import { AIChat } from './AIChat';
import { Pane } from '$lib/components/core/pane/pane';
import { Button } from '$lib/components/core';
import clsx from 'clsx';
import { AIChatActionKind, useAIChat } from './provider';
import { Sheet } from 'react-modal-sheet';
import { isMobile } from 'react-device-detect';

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
  const [_, chatStoreDispath] = useAIChat();

  const handleOpen = <T extends object>(opts: Option<T> = {}) => {
    chatStoreDispath({ type: AIChatActionKind.toggle_chat });
    if (isMobile) {
      setState({
        content: <AIChat {...(opts.props as T)} />,
        options: { ...opts },
      });
    } else {
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
        options: { ...opts },
      });
    }
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

  return !isMobile ? (
    <div
      className={clsx(
        'flex-1 w-full transition-all ease-in-out duration-300 z-0',
        state?.content ? 'max-w-[432px] opacity-100' : 'max-w-0 opacity-0',
      )}
    >
      {state?.content}
    </div>
  ) : (
    <Sheet avoidKeyboard isOpen={!!state?.content} onClose={() => handleClose()}>
      <Sheet.Container className="bg-overlay-primary/80! rounded-tl-lg! rounded-tr-lg! backdrop-blur-2xl">
        <Sheet.Header className="rounded-tl-lg rounded-tr-lg">
          <div className="flex justify-center items-end h-[20px]">
            <div className="bg-primary/8 rounded-xs w-[48px] h-1 cursor-row-resize"></div>
          </div>
        </Sheet.Header>
        <Sheet.Content disableDrag>
          <div className="p-4 overflow-auto h-full">{state?.content}</div>
        </Sheet.Content>
      </Sheet.Container>
    </Sheet>
  );
}
