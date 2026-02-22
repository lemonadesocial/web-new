'use client';

import React, { useState, useCallback } from 'react';
import clsx from 'clsx';
import { SectionWrapper } from '../SectionWrapper';
import type {
  SectionWidth,
  SectionPadding,
  SectionAlignment,
  SectionBackground,
} from '../../types';

interface FAQItem {
  question: string;
  answer: string;
}

function EventFAQInner({
  width,
  padding,
  alignment,
  min_height,
  background,
  heading,
  faqs,
  allow_multiple_open,
  ..._rest
}: Record<string, unknown> & {
  width?: SectionWidth;
  padding?: SectionPadding;
  alignment?: SectionAlignment;
  min_height?: string;
  background?: SectionBackground;
  heading?: string;
  faqs?: FAQItem[];
  allow_multiple_open?: boolean;
}) {
  const displayHeading = heading || 'Frequently Asked Questions';
  const faqList = Array.isArray(faqs) ? (faqs as FAQItem[]) : [];
  const hasFaqs = faqList.length > 0;

  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set());

  const toggleFaq = useCallback(
    (index: number) => {
      setOpenIndices((prev) => {
        const next = new Set(prev);
        if (next.has(index)) {
          next.delete(index);
        } else {
          if (!allow_multiple_open) {
            next.clear();
          }
          next.add(index);
        }
        return next;
      });
    },
    [allow_multiple_open],
  );

  return (
    <SectionWrapper
      width={width}
      padding={padding}
      alignment={alignment}
      min_height={min_height}
      background={background}
    >
      <div className="flex flex-col gap-8">
        {/* Header */}
        <h2 className="text-2xl sm:text-3xl font-bold text-primary">
          {displayHeading}
        </h2>

        {hasFaqs ? (
          <div className="flex flex-col divide-y divide-card-border">
            {faqList.map((faq, index) => {
              const isOpen = openIndices.has(index);
              return (
                <div key={`faq-${index}`} className="py-4 first:pt-0 last:pb-0">
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${index}`}
                    className="flex w-full items-center justify-between gap-4 text-left"
                  >
                    <h3 className="text-base font-semibold text-primary">
                      {faq.question || 'Untitled Question'}
                    </h3>
                    <svg
                      className={clsx(
                        'size-5 shrink-0 text-tertiary transition-transform duration-200',
                        isOpen && 'rotate-180',
                      )}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path d="m19 9-7 7-7-7" />
                    </svg>
                  </button>

                  {isOpen && (
                    <div id={`faq-answer-${index}`} className="mt-3 text-sm text-secondary leading-relaxed pr-8">
                      {faq.answer || 'No answer provided.'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty placeholder */
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-card-border bg-primary/4 px-6 py-12">
            <svg
              className="size-8 text-tertiary mb-3"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
            </svg>
            <p className="text-sm font-medium text-secondary">
              No FAQs added
            </p>
            <p className="text-xs text-tertiary mt-1">
              Add frequently asked questions to help attendees
            </p>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}

export const EventFAQ = React.memo(EventFAQInner);
EventFAQ.craft = {
  displayName: 'EventFAQ',
  props: {
    width: 'contained',
    padding: 'lg',
    heading: 'Frequently Asked Questions',
    faqs: [],
    allow_multiple_open: false,
  },
};
