'use client';
import React from 'react';
import { Sheet } from 'react-modal-sheet';

import { Button } from '$lib/components/core';
import { Pane } from '$lib/components/core/pane/pane';

import { AIChat } from './AIChat';

type AIChatPaneProps = {
  props?: object;
  onClose: () => void;
};

function getChatProps(props?: object) {
  return (props || {}) as Partial<React.ComponentProps<typeof AIChat>>;
}

export function AIChatDesktopPane({ props, onClose }: AIChatPaneProps) {
  return (
    <Pane.Root className="rounded-none">
      <Pane.Header.Root>
        <Pane.Header.Right>
          <Button
            size="sm"
            variant="tertiary-alt"
            icon="icon-keyboard-double-arrow-left"
            onClick={onClose}
          />
        </Pane.Header.Right>
      </Pane.Header.Root>
      <Pane.Content className="p-4 overflow-auto">
        <AIChat compact {...getChatProps(props)} />
      </Pane.Content>
    </Pane.Root>
  );
}

export function AIChatMobileSheet({ props, onClose }: AIChatPaneProps) {
  return (
    <Sheet avoidKeyboard isOpen onClose={onClose}>
      <Sheet.Container className="bg-overlay-primary/80! rounded-tl-lg! rounded-tr-lg! backdrop-blur-2xl">
        <Sheet.Header className="rounded-tl-lg rounded-tr-lg">
          <div className="flex justify-center items-end h-5">
            <div className="bg-primary/8 rounded-xs w-12 h-1 cursor-row-resize" />
          </div>
        </Sheet.Header>
        <Sheet.Content disableDrag>
          <div className="p-4 overflow-auto h-full">
            <AIChat compact {...getChatProps(props)} />
          </div>
        </Sheet.Content>
      </Sheet.Container>
    </Sheet>
  );
}
