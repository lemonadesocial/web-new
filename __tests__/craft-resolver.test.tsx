import { expect, it, describe, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import React from 'react';

// ---------------------------------------------------------------------------
// Mocks — must be defined before importing resolver.tsx
// ---------------------------------------------------------------------------

// jsdom does NOT provide localStorage — mock explicitly (see CLAUDE.md warning)
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

// Controllable craft.js state — flipped per-test to exercise read-only (disabled) mode.
// Disabled (enabled=false) is what end users see on the published page, which is the
// branch Karen's findings (066af446, 175b0c9d, a2ffdef7) exercise: sections must render
// cleanly without edit chrome, empty states return null, Spacer renders as a plain div.
let mockEnabled = false;
let mockSelected = false;

vi.mock('@craftjs/core', () => {
  return {
    useNode: (selector?: (node: any) => any) => {
      const node = { events: { selected: mockSelected }, data: { props: {}, parent: null, nodes: [] } };
      const selected = selector ? selector(node) : node;
      return {
        id: 'node-test',
        connectors: { connect: (ref: any) => ref, drag: (ref: any) => ref },
        actions: { setProp: vi.fn() },
        ...selected,
      };
    },
    useEditor: (selector?: (state: any) => any) => {
      const state = { options: { enabled: mockEnabled } };
      const selected = selector ? selector(state) : state;
      return {
        ...selected,
        actions: {
          selectNode: vi.fn(),
          addNodeTree: vi.fn(),
          delete: vi.fn(),
          move: vi.fn(),
        },
        query: {
          parseReactElement: () => ({ toNodeTree: () => ({}) }),
          node: () => ({ get: () => ({ data: { parent: null, nodes: [] } }) }),
        },
      };
    },
    Element: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  };
});

// Mock the layout store to provide a controllable event
const defaultEvent: Record<string, unknown> = {
  _id: 'evt-1',
  title: 'Test Event',
  subevent_enabled: false,
  new_new_photos_expanded: [],
  address: null,
  virtual_url: null,
  space: null,
};
let mockEventData: Record<string, unknown> | null = { ...defaultEvent };
vi.mock('$lib/components/features/ai/manage/store', () => ({
  useStoreManageLayout: () => ({ data: mockEventData }),
  storeManageLayout: { setData: vi.fn() },
}));

// Mock SettingsPanel — its hook is used only inside *Settings components we don't render here
vi.mock('$lib/components/features/ai/manage/SettingsPanel', () => ({
  useSettings: () => ({ actions: { setProp: vi.fn() }, props: {} }),
  SettingsPanel: () => null,
}));

// Mock heavy feature sections — we only care that the wrapper renders, not the inner section.
vi.mock('$lib/components/features/event/SubEventSection', () => ({
  SubEventSection: ({ title }: { title?: string }) => (
    <div data-testid="sub-event-section">{title || 'Schedule'}</div>
  ),
}));
vi.mock('$lib/components/features/event/GallerySection', () => ({
  GallerySection: ({ title }: { title?: string }) => (
    <div data-testid="gallery-section">{title || 'Gallery'}</div>
  ),
}));
vi.mock('$lib/components/features/event/AboutSection', () => ({
  AboutSection: () => <div data-testid="about-section" />,
}));
vi.mock('$lib/components/features/event/LocationSection', () => ({
  LocationSection: () => <div data-testid="location-section" />,
}));
vi.mock('$lib/components/features/event-access/EventAccess', () => ({
  EventAccess: () => <div data-testid="event-access" />,
}));
vi.mock('$lib/components/features/event-collectibles/EventCollectibles', () => ({
  EventCollectibles: () => <div data-testid="event-collectibles" />,
}));
vi.mock('$lib/components/features/event/EventDateTimeBlock', () => ({
  EventDateTimeBlock: () => <div data-testid="datetime-block" />,
}));
vi.mock('$lib/components/features/event/EventLocationBlock', () => ({
  EventLocationBlock: () => <div data-testid="location-block" />,
}));
vi.mock('$lib/components/features/event/CommunitySection', () => ({
  CommunitySection: () => <div data-testid="community-section" />,
}));
vi.mock('$lib/components/features/event/HostedBySection', () => ({
  HostedBySection: () => <div data-testid="hosted-by-section" />,
}));
vi.mock('$lib/components/features/event/AttendeesSection', () => ({
  AttendeesSection: () => <div data-testid="attendees-section" />,
}));

// Mock core components (Button/Input/Accordion etc.) — keep them as minimal stand-ins.
vi.mock('$lib/components/core', () => ({
  Button: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => (
    <button {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}>{children}</button>
  ),
  Input: (props: Record<string, unknown>) => <input {...(props as React.InputHTMLAttributes<HTMLInputElement>)} />,
  Textarea: (props: Record<string, unknown>) => <textarea {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)} />,
  Toggle: () => <div data-testid="toggle" />,
  Segment: () => <div data-testid="segment" />,
  TextEditor: () => <div data-testid="text-editor" />,
  PlaceAutoComplete: () => <div data-testid="place-autocomplete" />,
  FileInput: ({ children }: { children: (open: () => void) => React.ReactNode }) => (
    <>{children(() => {})}</>
  ),
  Accordion: {
    Root: ({ children }: React.PropsWithChildren) => <div data-testid="accordion-root">{children}</div>,
    Header: ({ children }: React.PropsWithChildren) => <div data-testid="accordion-header">{children}</div>,
    Content: ({ children }: React.PropsWithChildren) => <div data-testid="accordion-content">{children}</div>,
  },
}));

vi.mock('$lib/components/core/calendar', () => ({
  DateTimeGroup: () => <div data-testid="dtg" />,
  Timezone: () => <div data-testid="tz" />,
}));

vi.mock('$lib/components/core/toast', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock('$lib/utils/event', () => ({
  getEventCohosts: () => [],
}));
vi.mock('$lib/utils/user', () => ({
  randomEventDP: () => 'https://example.com/default.jpg',
}));
vi.mock('$lib/utils/file', () => ({
  uploadFiles: vi.fn(),
}));
vi.mock('$lib/utils/cnd', () => ({
  generateUrl: (_x: unknown, _y: unknown) => 'https://example.com/image.jpg',
  EDIT_KEY: { EVENT_PHOTO: 'EVENT_PHOTO' },
}));

// ---------------------------------------------------------------------------
// Imports (AFTER mocks)
// ---------------------------------------------------------------------------

import {
  CraftSpacer,
  CraftTabs,
  CraftTab,
  CraftAccordion,
  CraftAccordionItem,
  CraftSubEventSection,
  CraftGallerySection,
} from '$lib/components/features/ai/manage/craft/resolver';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

afterEach(() => {
  cleanup();
});

beforeEach(() => {
  localStorageMock.clear();
  mockEnabled = false;
  mockSelected = false;
  mockEventData = { ...defaultEvent };
});

// ---------------------------------------------------------------------------
// Tests — disabled (read-only) mode is what end users see on published pages
// ---------------------------------------------------------------------------

describe('CraftSpacer (read-only mode)', () => {
  it('renders a plain div with specified height when disabled', () => {
    const { container } = render(<CraftSpacer height="80" />);

    const spacer = container.firstElementChild as HTMLElement | null;
    expect(spacer).not.toBeNull();
    expect(spacer?.tagName).toBe('DIV');
    expect(spacer?.style.height).toBe('80px');
    // In disabled mode there must be no edit chrome ("Spacer" label)
    expect(spacer?.textContent).toBe('');
  });

  it('falls back to 40px when no height prop is provided', () => {
    const { container } = render(<CraftSpacer />);
    const spacer = container.firstElementChild as HTMLElement | null;
    expect(spacer?.style.height).toBe('40px');
  });

  it('renders edit chrome with "Spacer" label when enabled (editor mode)', () => {
    mockEnabled = true;
    const { container } = render(<CraftSpacer height="60" />);
    // Edit-mode markup includes a visible label
    expect(container.textContent?.toLowerCase()).toContain('spacer');
  });

  it('matches snapshot (disabled)', () => {
    const { container } = render(<CraftSpacer height="40" />);
    expect(container.firstChild).toMatchSnapshot();
  });
});

describe('CraftTabs (read-only mode)', () => {
  it('mounts without crashing with no children', () => {
    const { container } = render(<CraftTabs />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it('renders tab buttons from child labels', () => {
    const { getByText } = render(
      <CraftTabs>
        <CraftTab label="First">content 1</CraftTab>
        <CraftTab label="Second">content 2</CraftTab>
      </CraftTabs>,
    );
    expect(getByText('First')).toBeDefined();
    expect(getByText('Second')).toBeDefined();
  });

  it('does not render the "add tab" button when disabled', () => {
    const { container } = render(
      <CraftTabs>
        <CraftTab label="Only">only</CraftTab>
      </CraftTabs>,
    );
    // Only the label button should exist, no "+" action button
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBe(1);
  });

  it('matches snapshot (disabled, two tabs)', () => {
    const { container } = render(
      <CraftTabs>
        <CraftTab label="A">a</CraftTab>
        <CraftTab label="B">b</CraftTab>
      </CraftTabs>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

describe('CraftTab (read-only mode)', () => {
  it('mounts and renders its children', () => {
    const { getByText } = render(<CraftTab label="tab-1">Hello tab</CraftTab>);
    expect(getByText('Hello tab')).toBeDefined();
  });

  it('does not render the drop-target hint in disabled mode', () => {
    const { container } = render(<CraftTab label="empty" />);
    // "Drop sections here" hint is only shown when enabled
    expect(container.textContent).not.toContain('Drop sections here');
  });
});

describe('CraftAccordion (read-only mode)', () => {
  it('mounts without crashing with no items', () => {
    const { container } = render(<CraftAccordion />);
    expect(container.firstElementChild).not.toBeNull();
  });

  it('renders accordion items passed as children', () => {
    const { getByText } = render(
      <CraftAccordion>
        <CraftAccordionItem title="Q1">A1</CraftAccordionItem>
        <CraftAccordionItem title="Q2">A2</CraftAccordionItem>
      </CraftAccordion>,
    );
    expect(getByText('Q1')).toBeDefined();
    expect(getByText('Q2')).toBeDefined();
  });

  it('does not render the "Add Item" button when disabled', () => {
    const { queryByText } = render(<CraftAccordion />);
    expect(queryByText('Add Item')).toBeNull();
  });
});

describe('CraftAccordionItem (read-only mode)', () => {
  it('mounts and displays its title', () => {
    const { getByText } = render(
      <CraftAccordionItem title="Frequently Asked">
        answer body
      </CraftAccordionItem>,
    );
    expect(getByText('Frequently Asked')).toBeDefined();
  });

  it('falls back to default title when none provided', () => {
    const { getByText } = render(<CraftAccordionItem>body</CraftAccordionItem>);
    expect(getByText('Accordion Item')).toBeDefined();
  });
});

describe('CraftSubEventSection (read-only mode)', () => {
  it('returns null when subevents are disabled AND editor is disabled (end-user view)', () => {
    mockEventData = { ...defaultEvent, subevent_enabled: false };
    const { container } = render(<CraftSubEventSection />);
    // Empty sections must be hidden from end users — PR fix 066af446
    expect(container.innerHTML).toBe('');
  });

  it('renders the SubEventSection when subevents are enabled', () => {
    mockEventData = { ...defaultEvent, subevent_enabled: true };
    const { getByTestId } = render(<CraftSubEventSection title="Agenda" />);
    const section = getByTestId('sub-event-section');
    expect(section).toBeDefined();
    // Title prop is forwarded (PR feat a2ffdef7)
    expect(section.textContent).toBe('Agenda');
  });
});

describe('CraftGallerySection (read-only mode)', () => {
  it('returns null when photos array has fewer than 2 images AND editor is disabled', () => {
    mockEventData = { ...defaultEvent, new_new_photos_expanded: [{ _id: 'p1' }] };
    const { container } = render(<CraftGallerySection />);
    // Empty/insufficient gallery must be hidden from end users — PR fix 066af446
    expect(container.innerHTML).toBe('');
  });

  it('renders the GallerySection with title when gallery has multiple photos', () => {
    mockEventData = {
      ...defaultEvent,
      new_new_photos_expanded: [{ _id: 'p1' }, { _id: 'p2' }, { _id: 'p3' }],
    };
    const { getByTestId } = render(<CraftGallerySection title="Photo Wall" />);
    const gallery = getByTestId('gallery-section');
    expect(gallery).toBeDefined();
    // Title prop is forwarded (PR feat 175b0c9d)
    expect(gallery.textContent).toBe('Photo Wall');
  });
});
