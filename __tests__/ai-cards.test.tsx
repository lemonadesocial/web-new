import { expect, it, describe, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import React from 'react';

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

// jsdom does NOT provide localStorage — mock explicitly
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

// jsdom does NOT provide scrollIntoView — mock it
Element.prototype.scrollIntoView = vi.fn();

// Mock next/link — render a plain <a>
vi.mock('next/link', () => ({
  __esModule: true,
  default: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

// Mock next/image — render a plain <img>
vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={props.src as string}
      alt={props.alt as string}
      data-testid="next-image"
    />
  ),
}));

// Mock react-markdown — render children as plain text
vi.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }: { children: string }) => <div data-testid="markdown">{children}</div>,
}));

// Mock remark-gfm
vi.mock('remark-gfm', () => ({
  __esModule: true,
  default: {},
}));

// Mock framer-motion AnimatePresence and motion
vi.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: {
    div: ({
      children,
      ...props
    }: React.PropsWithChildren<Record<string, unknown>>) => (
      <div {...(props as React.HTMLAttributes<HTMLDivElement>)}>{children}</div>
    ),
  },
}));

// Mock the drawer export from core (Messages.tsx imports { Button, drawer })
vi.mock('$lib/components/core', async (importOriginal) => {
  const orig = (await importOriginal()) as Record<string, unknown>;
  return {
    ...orig,
    drawer: { open: vi.fn() },
    Button: ({
      children,
      ...props
    }: React.PropsWithChildren<Record<string, unknown>>) => (
      <button {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
        {children}
      </button>
    ),
  };
});

// Mock EventPane and EditEventDrawer (imported by Messages.tsx but not used in tests)
vi.mock('$lib/components/features/pane', () => ({
  EventPane: () => null,
}));
vi.mock(
  '$lib/components/features/event-manage/drawers/EditEventDrawer',
  () => ({
    EditEventDrawer: () => null,
  }),
);

// Provider mock — returns a controllable state
let mockState: Record<string, unknown> = { messages: [], thinking: false };
vi.mock('$lib/components/features/ai/provider', () => ({
  useAIChat: () => [mockState, vi.fn()],
  AIChatActionKind: { add_message: 0 },
}));

// ---------------------------------------------------------------------------
// Imports (AFTER mocks)
// ---------------------------------------------------------------------------

import { EventCard } from '$lib/components/features/ai/cards/EventCard';
import { TicketCard } from '$lib/components/features/ai/cards/TicketCard';
import { SpaceCard } from '$lib/components/features/ai/cards/SpaceCard';
import { GuestRow } from '$lib/components/features/ai/cards/GuestRow';
import { CardList } from '$lib/components/features/ai/cards/CardList';
import type {
  EventCardData,
  TicketCardData,
  SpaceCardData,
  GuestCardData,
  CardItem,
} from '$lib/components/features/ai/cards/utils';
import { Messages } from '$lib/components/features/ai/Messages';

// ---------------------------------------------------------------------------
// Test data factories
// ---------------------------------------------------------------------------

function makeEvent(overrides?: Partial<EventCardData>): EventCardData {
  return {
    _id: 'evt-1',
    shortid: 'abc123',
    title: 'Summer Music Fest',
    start: '2026-03-15T18:00:00Z',
    address: 'New York',
    published: true,
    cover: 'https://img.example.com/cover.jpg',
    attending_count: 142,
    ...overrides,
  };
}

function makeTicket(overrides?: Partial<TicketCardData>): TicketCardData {
  return {
    event_id: 'evt-1',
    event_title: 'Summer Music Fest',
    event_start: '2026-03-15T18:00:00Z',
    ticket_type_title: 'VIP Pass',
    status: 'confirmed',
    ...overrides,
  };
}

function makeSpace(overrides?: Partial<SpaceCardData>): SpaceCardData {
  return {
    _id: 'space-1',
    slug: 'lemonade-community',
    title: 'Lemonade Community',
    private: false,
    image_avatar_url: 'https://img.example.com/avatar.jpg',
    member_count: 1200,
    event_count: 45,
    ...overrides,
  };
}

function makeGuest(overrides?: Partial<GuestCardData>): GuestCardData {
  return {
    name: 'Jane Smith',
    email: 'jane@example.com',
    status: 'going',
    ticket_type_title: 'VIP',
    checked_in: true,
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

afterEach(() => {
  cleanup();
});

beforeEach(() => {
  localStorageMock.clear();
  mockState = { messages: [], thinking: false };
});

// ---- EventCard ----

describe('EventCard', () => {
  it('renders title, formatted date, and attendee count with full data', () => {
    render(<EventCard data={makeEvent()} />);

    expect(screen.getByText('Summer Music Fest')).toBeDefined();
    expect(screen.getByText(/Mar 15, 2026/)).toBeDefined();
    expect(screen.getByText('142 attending')).toBeDefined();
  });

  it('renders letter placeholder when cover is missing', () => {
    render(<EventCard data={makeEvent({ cover: undefined })} />);

    // No <img> should be rendered
    expect(screen.queryByTestId('next-image')).toBeNull();
    // Letter placeholder — first letter of "Summer Music Fest" = S
    expect(screen.getByText('S')).toBeDefined();
  });

  it('renders "Draft" badge when published is false', () => {
    render(<EventCard data={makeEvent({ published: false })} />);

    expect(screen.getByText('Draft')).toBeDefined();
    expect(screen.queryByText('Published')).toBeNull();
  });
});

// ---- TicketCard ----

describe('TicketCard', () => {
  it('renders ticket type title, event name, and status badge with full data', () => {
    render(<TicketCard data={makeTicket()} />);

    expect(screen.getByText('VIP Pass')).toBeDefined();
    expect(screen.getByText(/Summer Music Fest/)).toBeDefined();
    expect(screen.getByText('confirmed')).toBeDefined();
  });

  it('status text has capitalize class (Karen NIT fix verification)', () => {
    const { container } = render(<TicketCard data={makeTicket()} />);

    const statusSpan = container.querySelector('span.capitalize');
    expect(statusSpan).not.toBeNull();
    expect(statusSpan?.textContent).toBe('confirmed');
  });

  it('renders muted/non-clickable when event_title is missing', () => {
    const { container } = render(
      <TicketCard data={makeTicket({ event_title: '' })} />,
    );

    expect(screen.getByText('Event unavailable')).toBeDefined();
    // Should have opacity-50 and pointer-events-none
    const card = container.querySelector('.opacity-50');
    expect(card).not.toBeNull();
    const noClick = container.querySelector('.pointer-events-none');
    expect(noClick).not.toBeNull();
  });
});

// ---- SpaceCard ----

describe('SpaceCard', () => {
  it('renders title, member count, and event count with full data', () => {
    render(<SpaceCard data={makeSpace()} />);

    expect(screen.getByText('Lemonade Community')).toBeDefined();
    expect(screen.getByText(/1200 members/)).toBeDefined();
    expect(screen.getByText(/45 events/)).toBeDefined();
  });

  it('renders letter placeholder circle when image_avatar_url is missing', () => {
    render(
      <SpaceCard data={makeSpace({ image_avatar_url: undefined })} />,
    );

    expect(screen.queryByTestId('next-image')).toBeNull();
    // Letter placeholder — first letter of "Lemonade Community" = L
    expect(screen.getByText('L')).toBeDefined();
  });
});

// ---- GuestRow ----

describe('GuestRow', () => {
  it('displays name when present', () => {
    render(<GuestRow data={makeGuest()} />);

    expect(screen.getByText('Jane Smith')).toBeDefined();
  });

  it('falls back to email when name is missing', () => {
    render(<GuestRow data={makeGuest({ name: undefined })} />);

    expect(screen.getByText('jane@example.com')).toBeDefined();
  });

  it('falls back to "Anonymous guest" when both name and email are missing', () => {
    render(
      <GuestRow
        data={makeGuest({ name: undefined, email: undefined })}
      />,
    );

    expect(screen.getByText('Anonymous guest')).toBeDefined();
  });
});

// ---- CardList ----

describe('CardList', () => {
  it('renders correct number of cards (up to 5)', () => {
    const cards: CardItem[] = Array.from({ length: 5 }, (_, i) => ({
      type: 'event' as const,
      data: makeEvent({ _id: `evt-${i}`, shortid: `s${i}`, title: `Event ${i}` }),
    }));

    const { container } = render(<CardList cards={cards} />);

    // Each EventCard wraps in a Link (<a>), so count the <a> tags
    const links = container.querySelectorAll('a');
    expect(links.length).toBe(5);
  });

  it('shows overflow link when overflow prop is provided', () => {
    const cards: CardItem[] = [
      { type: 'event', data: makeEvent() },
    ];
    const overflow = {
      total: 12,
      shown: 5,
      viewAllLink: '/events',
      viewAllLabel: 'View all 12 events',
    };

    render(<CardList cards={cards} overflow={overflow} />);

    const overflowLink = screen.getByText(/View all 12 events/);
    expect(overflowLink).toBeDefined();
    expect(overflowLink.closest('a')?.getAttribute('href')).toBe('/events');
  });

  it('returns null when cards array is empty', () => {
    const { container } = render(<CardList cards={[]} />);

    expect(container.innerHTML).toBe('');
  });
});

// ---- Messages.tsx integration ----

describe('Messages integration', () => {
  it('renders CardList when metadata.cards is present on assistant message', () => {
    mockState = {
      messages: [
        {
          role: 'assistant',
          message: 'Here are your events:',
          metadata: {
            cards: [
              {
                type: 'event',
                data: makeEvent(),
              },
            ],
          },
        },
      ],
      thinking: false,
    };

    render(<Messages />);

    // Markdown text renders
    expect(screen.getByText('Here are your events:')).toBeDefined();
    // Card title renders
    expect(screen.getByText('Summer Music Fest')).toBeDefined();
  });

  it('renders plain markdown (no CardList) when metadata.cards is absent (backward compatibility)', () => {
    mockState = {
      messages: [
        {
          role: 'assistant',
          message: 'Hello, how can I help you?',
          metadata: {},
        },
      ],
      thinking: false,
    };

    render(<Messages />);

    expect(screen.getByText('Hello, how can I help you?')).toBeDefined();
    // No card components should render
    expect(screen.queryByText('Summer Music Fest')).toBeNull();
  });
});
