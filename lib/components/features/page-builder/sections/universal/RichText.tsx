'use client';

import React from 'react';

import clsx from 'clsx';
import { SectionWrapper } from '../SectionWrapper';
import { sanitizeHtml } from '../../utils/sanitize-html';
import type { SectionWidth, SectionPadding, SectionAlignment, SectionBackground } from '../../types';

interface RichTextProps {
  width?: SectionWidth;
  padding?: SectionPadding;
  alignment?: SectionAlignment;
  min_height?: string;
  background?: SectionBackground;
  content?: string;
}

function _RichText({
  width = 'contained',
  padding = 'md',
  alignment,
  min_height,
  background,
  content = '',
}: RichTextProps) {
  const hasContent = content.trim().length > 0;

  return (
    <SectionWrapper
      width={width}
      padding={padding}
      alignment={alignment}
      min_height={min_height}
      background={background}
    >
      {hasContent ? (
        <div
          className={clsx(
            'prose prose-invert max-w-none',
            'prose-headings:text-primary prose-p:text-secondary',
            'prose-a:text-accent prose-a:no-underline hover:prose-a:underline',
            'prose-strong:text-primary',
            'prose-blockquote:border-l-accent prose-blockquote:text-secondary',
            'prose-code:text-accent prose-code:bg-overlay-primary prose-code:rounded prose-code:px-1.5 prose-code:py-0.5',
            'prose-pre:bg-overlay-primary prose-pre:border prose-pre:border-card-border',
            'prose-img:rounded-lg',
            'prose-hr:border-card-border',
          )}
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
        />
      ) : (
        <div className="flex items-center justify-center border border-dashed border-card-border rounded-lg bg-overlay-primary/40 min-h-[120px] px-6 py-8">
          <div className="flex flex-col items-center gap-2 text-center">
            <i className="icon-text-fields size-6 text-tertiary" />
            <p className="text-sm text-secondary">Add your content here...</p>
            <p className="text-xs text-tertiary">
              Rich text content will appear in this section
            </p>
          </div>
        </div>
      )}
    </SectionWrapper>
  );
}

export const RichText = React.memo(_RichText);
RichText.craft = {
  displayName: 'RichText',
  props: {
    width: 'contained',
    padding: 'md',
    content: '',
  },
};
