import React from 'react';
import { expect, it, describe, vi } from 'vitest';
import { render } from '@testing-library/react';

import type {
  PageConfig,
  PageSection,
  ThemeConfig,
  SectionType,
} from '$lib/components/features/page-builder/types';
import { DEFAULT_THEME } from '$lib/components/features/page-builder/types';

// ---------------------------------------------------------------------------
// Mock the runtime resolver — replace real components with stubs that render
// a `data-testid` so we can assert which sections are rendered without
// importing all 37 section components.
// ---------------------------------------------------------------------------

vi.mock('$lib/components/features/page-builder/runtime-resolver', () => {
  const handler: ProxyHandler<Record<string, React.FC<Record<string, unknown>>>> = {
    get(_target, prop: string) {
      // Return a simple stub component for every section type.
      // Exclude `children` from data-props to avoid circular JSON from React elements.
      const Stub: React.FC<Record<string, unknown>> = ({ children, ...rest }) => (
        <div data-testid={`section-${prop}`} data-props={JSON.stringify(rest)}>
          {children as React.ReactNode}
        </div>
      );
      Stub.displayName = `Stub_${prop}`;
      return Stub;
    },
  };

  return {
    runtimeResolver: new Proxy({}, handler),
  };
});

// Mock next/script — it's a client component that doesn't render in jsdom
vi.mock('next/script', () => ({
  __esModule: true,
  default: ({ id, src, ...rest }: Record<string, unknown>) => (
    <script data-testid={id as string} src={src as string} {...rest} />
  ),
}));

// Now import ConfigRuntime AFTER mocks are set up
import { ConfigRuntime } from '$lib/components/features/page-builder/ConfigRuntime';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function makeSection(overrides: Partial<PageSection> & { id: string; type: SectionType }): PageSection {
  return {
    order: 0,
    hidden: false,
    layout: { width: 'contained', padding: 'md' },
    props: {},
    ...overrides,
  };
}

const BASE_CONFIG: PageConfig = {
  _id: 'cfg-1',
  owner_type: 'event',
  owner_id: 'event-1',
  created_by: 'user-1',
  status: 'published',
  version: 1,
  theme: DEFAULT_THEME,
  sections: [],
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('ConfigRuntime', () => {
  describe('basic rendering', () => {
    it('renders the runtime container with data attribute', () => {
      const { container } = render(<ConfigRuntime config={BASE_CONFIG} />);
      const root = container.querySelector('[data-page-builder-runtime]');
      expect(root).toBeDefined();
      expect(root).not.toBeNull();
    });

    it('applies custom className', () => {
      const { container } = render(
        <ConfigRuntime config={BASE_CONFIG} className="my-custom-class" />,
      );
      const root = container.querySelector('[data-page-builder-runtime]')!;
      expect(root.className).toContain('my-custom-class');
    });

    it('renders a <main> element for sections', () => {
      const { container } = render(<ConfigRuntime config={BASE_CONFIG} />);
      expect(container.querySelector('main')).not.toBeNull();
    });
  });

  describe('section rendering', () => {
    it('renders sections in order', () => {
      const config: PageConfig = {
        ...BASE_CONFIG,
        sections: [
          makeSection({ id: 's1', type: 'rich_text', order: 2 }),
          makeSection({ id: 's2', type: 'cta_block', order: 0 }),
          makeSection({ id: 's3', type: 'spacer', order: 1 }),
        ],
      };

      const { container } = render(<ConfigRuntime config={config} />);
      const sectionDivs = container.querySelectorAll('[data-section-id]');

      expect(sectionDivs).toHaveLength(3);
      // Should be sorted: s2 (order 0), s3 (order 1), s1 (order 2)
      expect(sectionDivs[0].getAttribute('data-section-id')).toBe('s2');
      expect(sectionDivs[1].getAttribute('data-section-id')).toBe('s3');
      expect(sectionDivs[2].getAttribute('data-section-id')).toBe('s1');
    });

    it('skips hidden sections', () => {
      const config: PageConfig = {
        ...BASE_CONFIG,
        sections: [
          makeSection({ id: 'visible', type: 'rich_text', order: 0 }),
          makeSection({ id: 'hidden', type: 'spacer', order: 1, hidden: true }),
        ],
      };

      const { container } = render(<ConfigRuntime config={config} />);
      const sectionDivs = container.querySelectorAll('[data-section-id]');

      expect(sectionDivs).toHaveLength(1);
      expect(sectionDivs[0].getAttribute('data-section-id')).toBe('visible');
    });

    it('renders empty <main> when there are no sections', () => {
      const { container } = render(<ConfigRuntime config={BASE_CONFIG} />);
      const main = container.querySelector('main')!;

      expect(main.children).toHaveLength(0);
    });

    it('passes section props and layout to the component', () => {
      const config: PageConfig = {
        ...BASE_CONFIG,
        sections: [
          makeSection({
            id: 's1',
            type: 'rich_text',
            order: 0,
            props: { content: '<p>Hello</p>' },
            layout: { width: 'full', padding: 'lg' },
          }),
        ],
      };

      const { container } = render(<ConfigRuntime config={config} />);
      const stub = container.querySelector('[data-testid="section-rich_text"]')!;
      const passedProps = JSON.parse(stub.getAttribute('data-props')!);

      expect(passedProps.content).toBe('<p>Hello</p>');
      expect(passedProps.layout.width).toBe('full');
      expect(passedProps.layout.padding).toBe('lg');
    });

    it('passes data_binding to the component', () => {
      const config: PageConfig = {
        ...BASE_CONFIG,
        sections: [
          makeSection({
            id: 's1',
            type: 'event_about',
            order: 0,
            data_binding: {
              mode: 'auto',
              source: { type: 'event', field: 'description' },
            },
          }),
        ],
      };

      const { container } = render(<ConfigRuntime config={config} />);
      const stub = container.querySelector('[data-testid="section-event_about"]')!;
      const passedProps = JSON.parse(stub.getAttribute('data-props')!);

      expect(passedProps.data_binding.mode).toBe('auto');
      expect(passedProps.data_binding.source.type).toBe('event');
    });
  });

  describe('layout classes', () => {
    it('applies width classes to the section wrapper', () => {
      const config: PageConfig = {
        ...BASE_CONFIG,
        sections: [
          makeSection({ id: 's1', type: 'rich_text', order: 0, layout: { width: 'full', padding: 'md' } }),
          makeSection({ id: 's2', type: 'spacer', order: 1, layout: { width: 'narrow', padding: 'md' } }),
          makeSection({ id: 's3', type: 'cta_block', order: 2, layout: { width: 'contained', padding: 'md' } }),
        ],
      };

      const { container } = render(<ConfigRuntime config={config} />);
      const wrappers = container.querySelectorAll('[data-section-id]');

      expect(wrappers[0].className).toContain('w-full');
      expect(wrappers[1].className).toContain('max-w-3xl');
      expect(wrappers[2].className).toContain('max-w-7xl');
    });

    it('applies padding classes', () => {
      const config: PageConfig = {
        ...BASE_CONFIG,
        sections: [
          makeSection({ id: 's1', type: 'spacer', order: 0, layout: { width: 'full', padding: 'none' } }),
          makeSection({ id: 's2', type: 'spacer', order: 1, layout: { width: 'full', padding: 'xl' } }),
        ],
      };

      const { container } = render(<ConfigRuntime config={config} />);
      const wrappers = container.querySelectorAll('[data-section-id]');

      expect(wrappers[0].className).toContain('py-0');
      expect(wrappers[1].className).toContain('py-24');
    });

    it('applies alignment class when provided', () => {
      const config: PageConfig = {
        ...BASE_CONFIG,
        sections: [
          makeSection({ id: 's1', type: 'rich_text', order: 0, layout: { width: 'contained', padding: 'md', alignment: 'center' } }),
        ],
      };

      const { container } = render(<ConfigRuntime config={config} />);
      const wrapper = container.querySelector('[data-section-id="s1"]')!;

      expect(wrapper.className).toContain('text-center');
    });

    it('does not apply alignment class when omitted', () => {
      const config: PageConfig = {
        ...BASE_CONFIG,
        sections: [
          makeSection({ id: 's1', type: 'rich_text', order: 0, layout: { width: 'contained', padding: 'md' } }),
        ],
      };

      const { container } = render(<ConfigRuntime config={config} />);
      const wrapper = container.querySelector('[data-section-id="s1"]')!;

      expect(wrapper.className).not.toContain('text-left');
      expect(wrapper.className).not.toContain('text-center');
      expect(wrapper.className).not.toContain('text-right');
    });
  });

  describe('background styles', () => {
    it('applies color background', () => {
      const config: PageConfig = {
        ...BASE_CONFIG,
        sections: [
          makeSection({
            id: 's1',
            type: 'rich_text',
            order: 0,
            layout: {
              width: 'full',
              padding: 'md',
              background: { type: 'color', value: '#ff0000' },
            },
          }),
        ],
      };

      const { container } = render(<ConfigRuntime config={config} />);
      const wrapper = container.querySelector('[data-section-id="s1"]') as HTMLElement;

      expect(wrapper.style.backgroundColor).toBe('rgb(255, 0, 0)');
    });

    it('applies image background with valid URL', () => {
      const config: PageConfig = {
        ...BASE_CONFIG,
        sections: [
          makeSection({
            id: 's1',
            type: 'rich_text',
            order: 0,
            layout: {
              width: 'full',
              padding: 'md',
              background: { type: 'image', value: 'https://example.com/bg.jpg' },
            },
          }),
        ],
      };

      const { container } = render(<ConfigRuntime config={config} />);
      const wrapper = container.querySelector('[data-section-id="s1"]') as HTMLElement;

      expect(wrapper.style.backgroundImage).toBe('url(https://example.com/bg.jpg)');
      expect(wrapper.style.backgroundSize).toBe('cover');
      expect(wrapper.style.backgroundPosition).toBe('center');
    });

    it('applies min_height style', () => {
      const config: PageConfig = {
        ...BASE_CONFIG,
        sections: [
          makeSection({
            id: 's1',
            type: 'rich_text',
            order: 0,
            layout: { width: 'full', padding: 'md', min_height: '400px' },
          }),
        ],
      };

      const { container } = render(<ConfigRuntime config={config} />);
      const wrapper = container.querySelector('[data-section-id="s1"]') as HTMLElement;

      expect(wrapper.style.minHeight).toBe('400px');
    });
  });

  describe('ThemeStyleInjector', () => {
    it('renders a <style> tag with theme CSS variables', () => {
      const { container } = render(<ConfigRuntime config={BASE_CONFIG} />);
      const styleTag = container.querySelector('style[data-page-builder-theme]');

      expect(styleTag).not.toBeNull();
      const css = styleTag!.textContent!;

      expect(css).toContain('--pb-accent: #9333ea');
      expect(css).toContain('--pb-background: #0a0a0a');
      expect(css).toContain('--pb-text-primary: #fafafa');
      expect(css).toContain('--pb-font-title: Inter');
      expect(css).toContain('--pb-mode: dark');
    });

    it('includes font imports when font URLs are provided', () => {
      const themeWithUrls: ThemeConfig = {
        ...DEFAULT_THEME,
        fonts: {
          title: { family: 'Poppins', weight: 700, url: 'https://fonts.googleapis.com/css2?family=Poppins' },
          body: { family: 'Open Sans', weight: 400, url: 'https://fonts.googleapis.com/css2?family=Open+Sans' },
        },
      };

      const config: PageConfig = { ...BASE_CONFIG, theme: themeWithUrls };
      const { container } = render(<ConfigRuntime config={config} />);
      const css = container.querySelector('style[data-page-builder-theme]')!.textContent!;

      expect(css).toContain("@import url('https://fonts.googleapis.com/css2?family=Poppins')");
      expect(css).toContain("@import url('https://fonts.googleapis.com/css2?family=Open+Sans')");
    });
  });

  describe('custom code', () => {
    it('does not render custom code elements when custom_code is absent', () => {
      const { container } = render(<ConfigRuntime config={BASE_CONFIG} />);

      expect(container.querySelector('[data-page-builder-custom-css]')).toBeNull();
      expect(container.querySelector('[data-page-builder-head-html]')).toBeNull();
      expect(container.querySelector('[data-page-builder-body-html]')).toBeNull();
    });

    it('renders custom CSS', () => {
      const config: PageConfig = {
        ...BASE_CONFIG,
        custom_code: { css: '.hero { color: red; }' },
      };

      const { container } = render(<ConfigRuntime config={config} />);
      const styleTag = container.querySelector('[data-page-builder-custom-css]');

      expect(styleTag).not.toBeNull();
      expect(styleTag!.textContent).toBe('.hero { color: red; }');
    });

    it('renders head HTML (hidden)', () => {
      const config: PageConfig = {
        ...BASE_CONFIG,
        custom_code: { head_html: '<meta name="custom" content="value" />' },
      };

      const { container } = render(<ConfigRuntime config={config} />);
      const headDiv = container.querySelector('[data-page-builder-head-html]') as HTMLElement;

      expect(headDiv).not.toBeNull();
      expect(headDiv.style.display).toBe('none');
    });

    it('renders body HTML', () => {
      const config: PageConfig = {
        ...BASE_CONFIG,
        custom_code: { body_html: '<div class="custom-widget">Widget</div>' },
      };

      const { container } = render(<ConfigRuntime config={config} />);
      const bodyDiv = container.querySelector('[data-page-builder-body-html]');

      expect(bodyDiv).not.toBeNull();
      expect(bodyDiv!.innerHTML).toContain('custom-widget');
    });
  });

  describe('container sections with children', () => {
    it('renders child sections recursively', () => {
      const config: PageConfig = {
        ...BASE_CONFIG,
        sections: [
          makeSection({
            id: 'cols-1',
            type: 'columns',
            order: 0,
            layout: { width: 'contained', padding: 'md', columns: 2 },
            children: [
              makeSection({ id: 'child-0', type: 'rich_text', order: 0, props: { content: 'Left' } }),
              makeSection({ id: 'child-1', type: 'cta_block', order: 1, props: { text: 'Right' } }),
            ],
          }),
        ],
      };

      const { container } = render(<ConfigRuntime config={config} />);

      // Parent columns component is rendered
      expect(container.querySelector('[data-testid="section-columns"]')).not.toBeNull();

      // Children are rendered inside
      const childWrappers = container.querySelectorAll('[data-section-id]');
      // cols-1 + child-0 + child-1
      expect(childWrappers).toHaveLength(3);
    });

    it('sorts children by order', () => {
      const config: PageConfig = {
        ...BASE_CONFIG,
        sections: [
          makeSection({
            id: 'cols-1',
            type: 'columns',
            order: 0,
            layout: { width: 'contained', padding: 'md', columns: 2 },
            children: [
              makeSection({ id: 'second', type: 'cta_block', order: 1 }),
              makeSection({ id: 'first', type: 'rich_text', order: 0 }),
            ],
          }),
        ],
      };

      const { container } = render(<ConfigRuntime config={config} />);
      // Get child section wrappers (exclude the parent columns wrapper)
      const allWrappers = container.querySelectorAll('[data-section-type]');
      // The columns wrapper is first, then children sorted by order
      const childTypes = Array.from(allWrappers).map((el) => el.getAttribute('data-section-type'));

      expect(childTypes[0]).toBe('columns');
      // Within the columns component's children, rich_text (order 0) comes before cta_block (order 1)
      expect(childTypes.indexOf('rich_text')).toBeLessThan(childTypes.indexOf('cta_block'));
    });

    it('skips hidden children', () => {
      const config: PageConfig = {
        ...BASE_CONFIG,
        sections: [
          makeSection({
            id: 'cols-1',
            type: 'columns',
            order: 0,
            layout: { width: 'contained', padding: 'md', columns: 2 },
            children: [
              makeSection({ id: 'visible-child', type: 'rich_text', order: 0 }),
              makeSection({ id: 'hidden-child', type: 'spacer', order: 1, hidden: true }),
            ],
          }),
        ],
      };

      const { container } = render(<ConfigRuntime config={config} />);
      // Parent + 1 visible child = 2
      const wrappers = container.querySelectorAll('[data-section-id]');
      expect(wrappers).toHaveLength(2);
    });
  });

  describe('data attributes', () => {
    it('sets data-section-id and data-section-type on each wrapper', () => {
      const config: PageConfig = {
        ...BASE_CONFIG,
        sections: [
          makeSection({ id: 'hero-1', type: 'event_hero', order: 0 }),
        ],
      };

      const { container } = render(<ConfigRuntime config={config} />);
      const wrapper = container.querySelector('[data-section-id="hero-1"]')!;

      expect(wrapper.getAttribute('data-section-type')).toBe('event_hero');
    });
  });
});
