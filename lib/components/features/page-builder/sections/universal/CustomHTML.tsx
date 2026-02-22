'use client';

import React from 'react';

import { SectionWrapper } from '../SectionWrapper';
import { sanitizeHtml } from '../../utils/sanitize-html';
import type { SectionWidth, SectionPadding, SectionAlignment, SectionBackground } from '../../types';

interface CustomHTMLProps {
  width?: SectionWidth;
  padding?: SectionPadding;
  alignment?: SectionAlignment;
  min_height?: string;
  background?: SectionBackground;
  html_content?: string;
  css_content?: string;
}

function _CustomHTML({
  width = 'contained',
  padding = 'md',
  alignment,
  min_height,
  background,
  html_content = '',
  css_content = '',
}: CustomHTMLProps) {
  const hasContent = html_content.trim().length > 0;

  return (
    <SectionWrapper
      width={width}
      padding={padding}
      alignment={alignment}
      min_height={min_height}
      background={background}
    >
      {hasContent ? (
        <div className="rounded-lg border border-dashed border-card-border/50">
          {css_content.trim().length > 0 && (
            <style dangerouslySetInnerHTML={{ __html: sanitizeHtml(css_content) }} />
          )}
          <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(html_content) }} />
        </div>
      ) : (
        <div className="flex items-center justify-center border border-dashed border-card-border rounded-lg bg-overlay-primary/40 min-h-[120px] px-6 py-8">
          <div className="flex flex-col items-center gap-2 text-center">
            <i className="icon-code size-6 text-tertiary" />
            <p className="text-sm text-secondary">Add custom HTML</p>
            <p className="text-xs text-tertiary">
              Embed custom HTML and CSS in this section
            </p>
          </div>
        </div>
      )}
    </SectionWrapper>
  );
}

export const CustomHTML = React.memo(_CustomHTML);
CustomHTML.craft = {
  displayName: 'CustomHTML',
  props: {
    width: 'contained',
    padding: 'md',
    html_content: '',
    css_content: '',
  },
};
