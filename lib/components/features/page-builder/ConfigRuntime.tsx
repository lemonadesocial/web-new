/**
 * ConfigRuntime — SSR-compatible renderer for published PageConfig pages.
 *
 * This component renders a published page WITHOUT any editor chrome or
 * Craft.js dependency. It is designed as a React Server Component (no
 * 'use client' directive) so it can be rendered on the server for fast
 * first-paint and SEO.
 *
 * Child section components may be 'use client' — Next.js handles the
 * server/client boundary automatically.
 */

import type React from 'react';
import Script from 'next/script';
import clsx from 'clsx';

import type {
  PageConfig,
  PageSection,
  SectionBackground,
  SectionWidth,
  SectionPadding,
  SectionAlignment,
  CustomCode,
  CustomCodeScript,
} from './types';
import { runtimeResolver } from './runtime-resolver';
import { ThemeStyleInjector } from './ThemeStyleInjector';

// ---------------------------------------------------------------------------
// Layout utility maps
// ---------------------------------------------------------------------------

// NOTE: These must stay in sync with SectionWrapper.tsx (editor preview).
const widthClasses: Record<SectionWidth, string> = {
  full: 'w-full',
  contained: 'w-full max-w-5xl mx-auto',
  narrow: 'w-full max-w-2xl mx-auto',
};

// NOTE: These must stay in sync with SectionWrapper.tsx (editor preview).
const paddingClasses: Record<SectionPadding, string> = {
  none: '',
  sm: 'px-4 py-4',
  md: 'px-6 py-8',
  lg: 'px-8 py-12',
  xl: 'px-10 py-16',
};

const alignmentClasses: Record<SectionAlignment, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

// ---------------------------------------------------------------------------
// Background style builder
// ---------------------------------------------------------------------------

function isValidUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function buildBackgroundStyle(
  background: SectionBackground,
): React.CSSProperties {
  switch (background.type) {
    case 'color':
      return { backgroundColor: background.value };
    case 'image': {
      // Only wrap in url() if the value is a valid URL; otherwise treat as
      // a raw CSS value (e.g. a color or gradient fallback).
      if (!isValidUrl(background.value)) {
        return { background: background.value };
      }
      const safeBgUrl = String(background.value).replace(/'/g, '%27').replace(/\)/g, '%29').replace(/"/g, '%22');
      return {
        backgroundImage: `url('${safeBgUrl}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      };
    }
    case 'gradient':
      return { backgroundImage: background.value };
    default:
      return {};
  }
}

// ---------------------------------------------------------------------------
// SectionWrapper — applies SectionLayout to each rendered section
// ---------------------------------------------------------------------------

interface SectionWrapperProps {
  section: PageSection;
  children: React.ReactNode;
}

function SectionWrapper({ section, children }: SectionWrapperProps) {
  const { layout } = section;

  const inlineStyle: React.CSSProperties = {};

  // Min-height
  if (layout.min_height) {
    inlineStyle.minHeight = layout.min_height;
  }

  // Section-level background
  if (layout.background) {
    Object.assign(inlineStyle, buildBackgroundStyle(layout.background));
  }

  return (
    <div
      data-section-id={section.id}
      data-section-type={section.type}
      className={clsx(
        widthClasses[layout.width],
        paddingClasses[layout.padding],
        layout.alignment && alignmentClasses[layout.alignment],
      )}
      style={Object.keys(inlineStyle).length > 0 ? inlineStyle : undefined}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Recursive section renderer
// ---------------------------------------------------------------------------

function renderSection(section: PageSection): React.ReactNode {
  // Skip hidden sections
  if (section.hidden) {
    return null;
  }

  const Component = runtimeResolver[section.type];

  // Gracefully skip unknown section types (e.g. if a new type is added to the
  // backend but the frontend hasn't been updated yet)
  if (!Component) {
    if (process.env.NODE_ENV === 'development') {
      return (
        <div
          key={section.id}
          data-section-id={section.id}
          className="py-4 px-6 border border-dashed border-yellow-500/40 rounded-md text-sm text-yellow-400"
        >
          Unknown section type: <code>{section.type}</code>
        </div>
      );
    }
    return null;
  }

  // Build children for container sections (columns, tabs, accordion)
  const renderedChildren = section.children?.length
    ? section.children
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((child) => renderSection(child))
    : undefined;

  return (
    <SectionWrapper key={section.id} section={section}>
      <Component
        {...section.props}
        layout={section.layout}
        data_binding={section.data_binding}
      >
        {renderedChildren}
      </Component>
    </SectionWrapper>
  );
}

// ---------------------------------------------------------------------------
// CustomCode renderer
// ---------------------------------------------------------------------------

/**
 * SECURITY MODEL: Custom Code Injection
 *
 * Custom code (CSS, HTML, scripts) is rendered WITHOUT sanitization.
 * This is an INTENTIONAL design decision matching Squarespace/Webflow behavior.
 *
 * Mitigations:
 * 1. Only page OWNERS can add custom code (enforced by backend assertConfigPermission)
 * 2. Template cloning MUST strip custom_code (verified in backend cloneTemplateToConfig)
 * 3. Backend enforces size limits: 50KB CSS, 10KB HTML, 10 scripts max
 * 4. Section components (EventAbout, RichText, etc.) use DOMPurify -- only this
 *    custom code area is intentionally unsanitized
 *
 * WARNING: If template cloning does NOT strip custom_code, this is an XSS vector.
 * Verify backend implementation before enabling template marketplace.
 */

interface CustomCodeRendererProps {
  customCode: CustomCode;
}

/* eslint-disable react/no-danger -- Custom code injection is an intentional feature for page owners */
function CustomCodeRenderer({ customCode }: CustomCodeRendererProps) {
  return (
    <>
      {/* Custom CSS */}
      {customCode.css && (
        <style
          dangerouslySetInnerHTML={{ __html: customCode.css }}
          data-page-builder-custom-css=""
        />
      )}

      {/* Head HTML — rendered inline; in a real app this could be pushed to
          <head> via Next.js metadata or a portal, but the style/link tags
          within will still work when rendered in the body. */}
      {customCode.head_html && (
        <div
          dangerouslySetInnerHTML={{ __html: customCode.head_html }}
          data-page-builder-head-html=""
          style={{ display: 'none' }}
        />
      )}

      {/* Body HTML */}
      {customCode.body_html && (
        <div
          dangerouslySetInnerHTML={{ __html: customCode.body_html }}
          data-page-builder-body-html=""
        />
      )}

      {/* Scripts — use next/script for proper loading strategies */}
      {customCode.scripts?.map((script, index) => (
        <ScriptTag key={script.src || `inline-${index}`} script={script} index={index} />
      ))}
    </>
  );
}
/* eslint-enable react/no-danger */

interface ScriptTagProps {
  script: CustomCodeScript;
  index: number;
}

function ScriptTag({ script, index }: ScriptTagProps) {
  if (script.src) {
    return (
      <Script
        id={`pb-script-${index}`}
        src={script.src}
        strategy={script.strategy}
      />
    );
  }

  if (script.content) {
    return (
      <Script
        id={`pb-script-${index}`}
        strategy={script.strategy}
        dangerouslySetInnerHTML={{ __html: script.content }}
      />
    );
  }

  return null;
}

// ---------------------------------------------------------------------------
// ConfigRuntime — main export
// ---------------------------------------------------------------------------

interface ConfigRuntimeProps {
  config: PageConfig;
  className?: string;
}

export function ConfigRuntime({ config, className }: ConfigRuntimeProps) {
  // Sort sections by their `order` field
  const sortedSections = config.sections
    .slice()
    .sort((a, b) => a.order - b.order);

  return (
    <div
      className={clsx('relative w-full', className)}
      data-page-builder-runtime=""
    >
      {/* 1. Inject theme CSS variables */}
      <ThemeStyleInjector theme={config.theme} />

      {/* 2. Render sections in order */}
      <main>
        {sortedSections.map((section) => renderSection(section))}
      </main>

      {/* 3. Inject custom code (CSS, HTML, scripts) */}
      {config.custom_code && (
        <CustomCodeRenderer customCode={config.custom_code} />
      )}
    </div>
  );
}
