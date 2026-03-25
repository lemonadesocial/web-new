'use client';

import { type ListSpaceNewslettersQuery } from '$lib/graphql/generated/backend/graphql';
import { htmlToInlineText } from '$lib/utils/string';
import { format } from 'date-fns';

type NewsletterListItem = ListSpaceNewslettersQuery['listSpaceNewsletters'][number];

function formatDateLabel(newsletter: NewsletterListItem) {
  const value = newsletter.sent_at || newsletter.created_at;
  if (!value) return '';

  return format(new Date(value), "MMM d, yyyy 'at' h:mm a");
}

export function NewsletterEmailPreviewModal({
  newsletter,
  recipient,
}: {
  newsletter: NewsletterListItem;
  recipient: string;
}) {
  const subject = htmlToInlineText(newsletter.custom_subject_html) || 'Untitled';
  const sentCount = newsletter.recipients?.length || 0;
  const dateLabel = formatDateLabel(newsletter);

  return (
    <div className="w-120 max-w-full overflow-hidden rounded-[18px] border border-card-border bg-overlay-primary shadow-[0_8px_24px_rgba(0,0,0,0.32)]">
      <div className="border-b border-primary/8 px-4 py-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-lg leading-7 font-medium text-primary">{subject}</p>
            <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm leading-5 text-tertiary">
              {dateLabel ? <span>{dateLabel}</span> : null}
              {dateLabel && recipient ? <span className="text-primary/20">·</span> : null}
              {recipient ? <span>To: {recipient}</span> : null}
            </div>
          </div>

          <div className="flex items-center">
            <span className="inline-flex h-8 shrink-0 items-center rounded-sm bg-primary/8 px-3 text-sm font-medium text-secondary">
              {sentCount} Sent
            </span>
          </div>
        </div>
      </div>

      <div className="max-h-105 overflow-auto bg-white text-[#111111] p-7">
        <div
          className="
            [&_a]:text-[#2563eb]
            [&_a]:underline
            [&_h1]:m-0
            [&_h1]:text-xl
            [&_h1]:leading-tight
            [&_h1]:font-medium
            [&_h1]:text-[#111111]
            [&_h2]:m-0
            [&_h2]:text-lg
            [&_h2]:leading-tight
            [&_h2]:font-medium
            [&_h2]:text-[#111111]
            [&_img]:h-auto
            [&_img]:max-w-full
            [&_p]:m-0
            [&_p]:text-md
            [&_p]:leading-8
            [&_p]:text-[#6a6a6a]
            [&_ul]:m-0
            [&_ul]:pl-6
          "
          dangerouslySetInnerHTML={{ __html: newsletter.custom_body_html || '' }}
        />
      </div>
    </div>
  );
}
