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

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

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

// Mock only the core exports this suite exercises.
vi.mock('$lib/components/core', () => ({
  drawer: { open: vi.fn() },
  Button: ({
    children,
    iconLeft: _iconLeft,
    iconRight: _iconRight,
    variant: _variant,
    size: _size,
    ...props
  }: React.PropsWithChildren<Record<string, unknown>>) => (
    <button {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  ),
}));

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

vi.mock('$lib/components/features/modals/GetVerifiedModal', () => ({
  GetVerifiedModal: () => null,
}));

// Mock EventCardItem (used by spotlight_event in CardList)
vi.mock('$lib/components/features/EventList', () => ({
  EventCardItem: ({ item }: { item: any }) => <div data-testid="event-card-item">{item.title}</div>,
}));

// Provider mock — returns a controllable state
let mockState: Record<string, unknown> = { messages: [], thinking: false, configs: [], config: '' };
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
import type { CardItem } from '$lib/components/features/ai/cards/utils';
import type {
  Event,
  EventGuestDetail,
  Space,
  Ticket,
} from '$lib/graphql/generated/backend/graphql';
import { Messages } from '$lib/components/features/ai/Messages';

function makeEvent(overrides?: Partial<Event>): Event {
  return {
    _id: 'evt-1',
    shortid: 'abc123',
    title: 'Summer Music Fest',
    start: '2026-03-15T18:00:00Z',
    cover: 'https://img.example.com/cover.jpg',
    active: true,
    end: '',
    host: '',
    payment_fee: 0,
    slug: 'summer-music-fest',
    stamp: '',
    state: 'created',
    ...overrides,
  } as Event;
}

function makeTicket(overrides?: Partial<Ticket>): Ticket {
  return {
    _id: 'ticket-1',
    event: 'evt-1',
    shortid: 't1',
    created_at: '',
    event_expanded: {
      title: 'Summer Music Fest',
      start: '2026-03-15T18:00:00Z',
      shortid: 'abc123',
    } as Event,
    type_expanded: {
      title: 'VIP Pass',
      _id: 'tt1',
      event: '',
      prices: [{ cost: '0', currency: 'USD' }],
    },
    checkin: { active: true, _id: 'c1', created_at: '', event: '', ticket: '' },
    ...overrides,
  } as Ticket;
}

function makeSpace(overrides?: Partial<Space>): Space {
  return {
    _id: 'space-1',
    slug: 'lemonade-community',
    title: 'Lemonade Community',
    private: false,
    state: 'active',
    creator: '',
    followers_count: 1200,
    image_avatar_expanded:
      overrides?.image_avatar_expanded !== undefined
        ? overrides.image_avatar_expanded
        : { bucket: 'b', key: 'k', url: 'https://img.example.com/avatar.jpg', type: 'image' },
    ...overrides,
  } as Space;
}

function makeGuest(overrides?: Partial<EventGuestDetail>): EventGuestDetail {
  return {
    user: {
      name: 'Jane Smith',
      display_name: 'Jane',
      email: 'jane@example.com',
    },
    ticket: {
      type_expanded: {
        title: 'VIP',
        _id: 'tt1',
        event: '',
        prices: [{ cost: '0', currency: 'USD' }],
      },
      checkin: { active: true, _id: 'c1', created_at: '', event: '', ticket: '' },
      _id: 't1',
      event: '',
      shortid: 't1',
      created_at: '',
      type: '',
    } as Ticket,
    join_request: {
      state: 'approved',
      _id: 'jr1',
      created_at: '',
      event: '',
    },
    ...overrides,
  } as EventGuestDetail;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

afterEach(() => {
  cleanup();
});

beforeEach(() => {
  localStorageMock.clear();
  mockState = { messages: [], thinking: false, configs: [], config: '' };
});

// ---- EventCard ----

describe('EventCard', () => {
  it('renders title and formatted date with full data', () => {
    render(<EventCard data={makeEvent()} />);

    expect(screen.getByText('Summer Music Fest')).toBeDefined();
    expect(screen.getByText(/Mar/)).toBeDefined();
  });

  it('renders placeholder image when cover is missing', () => {
    render(<EventCard data={makeEvent({ cover: undefined })} />);

    const img = screen.getByRole('img', { name: 'Summer Music Fest' });
    expect(img).toBeDefined();
    expect(img.getAttribute('src')).toBeTruthy();
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

  it('renders muted/non-clickable when event_expanded is missing', () => {
    const { container } = render(
      <TicketCard data={makeTicket({ event_expanded: undefined })} />,
    );

    expect(screen.getByText('Event unavailable')).toBeDefined();
    const card = container.querySelector('.opacity-50');
    expect(card).not.toBeNull();
    const noClick = container.querySelector('.pointer-events-none');
    expect(noClick).not.toBeNull();
  });
});

// ---- SpaceCard ----

describe('SpaceCard', () => {
  it('renders title and followers count with full data', () => {
    render(<SpaceCard data={makeSpace()} />);

    expect(screen.getByText('Lemonade Community')).toBeDefined();
    expect(screen.getByText(/1200 followers/)).toBeDefined();
  });

  it('renders random avatar when image_avatar_expanded is missing', () => {
    render(
      <SpaceCard data={makeSpace({ image_avatar_expanded: undefined })} />,
    );

    const img = screen.getByRole('img', { name: 'Lemonade Community' });
    expect(img).toBeDefined();
    expect(img.getAttribute('src')).toBeTruthy();
  });
});

// ---- GuestRow ----

describe('GuestRow', () => {
  it('displays name when present', () => {
    render(<GuestRow data={makeGuest()} />);

    expect(screen.getByText('Jane')).toBeDefined();
  });

  it('falls back to email when name is missing', () => {
    render(
      <GuestRow data={makeGuest({ user: { name: undefined, display_name: undefined, email: 'jane@example.com' } })} />,
    );

    expect(screen.getByText('jane@example.com')).toBeDefined();
  });

  it('falls back to "Anonymous guest" when both name and email are missing', () => {
    render(
      <GuestRow
        data={makeGuest({
          user: { name: undefined, display_name: undefined, email: undefined },
        })}
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

  it('shows overflow button when overflow prop is provided', () => {
    const cards: CardItem[] = [{ type: 'event', data: makeEvent() }];
    const overflow = {
      total: 12,
      shown: 5,
      viewAllLink: '/events',
      viewAllLabel: 'View all 12 events',
    };

    render(<CardList cards={cards} overflow={overflow} />);

    const overflowButton = screen.getByText(/View all 12 events/);
    expect(overflowButton).toBeDefined();
  });

  it('returns null when cards array is empty', () => {
    const { container } = render(<CardList cards={[]} />);

    expect(container.innerHTML).toBe('');
  });

  it('renders spotlight_event card type', () => {
    const cards: CardItem[] = [
      {
        type: 'spotlight_event',
        data: makeEvent({ title: 'Spotlight Event' }),
      },
    ];

    render(<CardList cards={cards} />);

    expect(screen.getByTestId('event-card-item')).toBeDefined();
    expect(screen.getByText('Spotlight Event')).toBeDefined();
  });

  it('renders title when provided', () => {
    const cards: CardItem[] = [{ type: 'event', data: makeEvent() }];
    render(<CardList cards={cards} title="Recommended for you" />);

    expect(screen.getByText('Recommended for you')).toBeDefined();
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
      configs: [],
      config: '',
    };

    render(<Messages />);

    // Markdown text renders
    expect(screen.getByText('Here are your events:')).toBeDefined();
    // Card title renders
    expect(screen.getByText('Summer Music Fest')).toBeDefined();
  });

  it('renders CardList with title when metadata.title is present', () => {
    mockState = {
      messages: [
        {
          role: 'assistant',
          message: 'Check this out:',
          metadata: {
            title: 'Featured Events',
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
      configs: [],
      config: '',
    };

    render(<Messages />);

    expect(screen.getByText('Featured Events')).toBeDefined();
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
      configs: [],
      config: '',
    };

    render(<Messages />);

    expect(screen.getByText('Hello, how can I help you?')).toBeDefined();
    // No card components should render
    expect(screen.queryByText('Summer Music Fest')).toBeNull();
  });
});
