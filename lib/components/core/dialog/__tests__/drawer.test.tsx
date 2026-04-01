import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, it, vi, expect } from 'vitest';

vi.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
      <div {...(props as React.HTMLAttributes<HTMLDivElement>)}>{children}</div>
    ),
  },
}));

import { DrawerContainer, drawer } from '../drawer';

function DrawerContent() {
  return <div>Drawer content</div>;
}

function DrawerHarness({ dismissible }: { dismissible?: boolean }) {
  return (
    <button type="button" onClick={() => drawer.open(DrawerContent, dismissible === undefined ? undefined : { dismissible })}>
      Open drawer
    </button>
  );
}

afterEach(() => {
  cleanup();
});

describe('DrawerContainer', () => {
  it('dismisses the drawer on backdrop click by default', () => {
    render(
      <>
        <DrawerHarness />
        <DrawerContainer />
      </>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open drawer' }));

    const panel = screen.getByRole('dialog');
    const backdrop = panel.parentElement?.previousElementSibling;

    expect(backdrop).not.toBeNull();

    fireEvent.mouseDown(backdrop as Element);

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('keeps the drawer open when dismissible is explicitly false', () => {
    render(
      <>
        <DrawerHarness dismissible={false} />
        <DrawerContainer />
      </>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Open drawer' }));

    const panel = screen.getByRole('dialog');
    const backdrop = panel.parentElement?.previousElementSibling;

    expect(backdrop).not.toBeNull();

    fireEvent.mouseDown(backdrop as Element);

    expect(screen.queryByRole('dialog')).toBeDefined();
  });
});
