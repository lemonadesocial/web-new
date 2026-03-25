'use client';

import React from 'react';
import { Button } from '$lib/components/core/button/button';
import { modal } from '$lib/components/core/dialog/modal';
import { Pane } from '$lib/components/core/pane/pane';
import { type ListSpaceNewslettersQuery } from '$lib/graphql/generated/backend/graphql';
import { NewsletterEmailPreviewModal } from '../modals/NewsletterEmailPreviewModal';

type RecipientStatus = 'opened' | 'delivered';

type RecipientRow = {
  email: string;
  name: string;
  status: RecipientStatus;
};

type NewsletterListItem = ListSpaceNewslettersQuery['listSpaceNewsletters'][number];
const EMAIL_PREVIEW_MODAL_CLASS_NAME = 'w-120 max-w-[calc(100vw-32px)]';

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function formatRecipientName(email: string) {
  const localPart = normalizeEmail(email).split('@')[0] || 'Guest';

  return localPart
    .split(/[._+-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

function getAvatarStyle(seed: string) {
  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = seed.charCodeAt(index) + ((hash << 5) - hash);
  }

  const hue = Math.abs(hash % 360);

  return {
    backgroundColor: `hsla(${hue}, 72%, 56%, 0.18)`,
    color: `hsl(${hue}, 82%, 72%)`,
  };
}

function buildRecipientRows(newsletter: NewsletterListItem) {
  const openedEmails = new Set(
    (newsletter.opened || []).map((item) => normalizeEmail(item.email)).filter(Boolean),
  );
  const sentEmails = Array.from(
    new Set((newsletter.recipients || []).map((email) => normalizeEmail(email)).filter(Boolean)),
  );

  const openedRows: RecipientRow[] = [];
  const deliveredRows: RecipientRow[] = [];

  sentEmails.forEach((email) => {
    const row = {
      email,
      name: formatRecipientName(email),
      status: openedEmails.has(email) ? 'opened' : 'delivered',
    } satisfies RecipientRow;

    if (row.status === 'opened') {
      openedRows.push(row);
      return;
    }

    deliveredRows.push(row);
  });

  return [...openedRows, ...deliveredRows];
}

function RecipientStatusBadge({ status }: { status: RecipientStatus }) {
  if (status === 'opened') {
    return (
      <span className="inline-flex h-7 items-center rounded-full bg-success-500/16 px-3 text-sm font-medium text-success-400">
        Opened
      </span>
    );
  }

  return (
    <span className="inline-flex h-7 items-center rounded-full bg-warning-500/16 px-3 text-sm font-medium text-warning-300">
      Delivered
    </span>
  );
}

export function NewsletterStatsPane({
  newsletter,
}: {
  newsletter: NewsletterListItem;
}) {
  const [search, setSearch] = React.useState('');

  const recipientRows = React.useMemo(() => buildRecipientRows(newsletter), [newsletter]);

  const openedCount = React.useMemo(
    () => new Set((newsletter.opened || []).map((item) => normalizeEmail(item.email))).size,
    [newsletter.opened],
  );
  const sentCount = recipientRows.length;
  const deliveredCount = Math.max(sentCount - openedCount, 0);
  const openRate = sentCount > 0 ? Math.round((openedCount / sentCount) * 100) : 0;

  const filteredRows = React.useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return recipientRows;

    return recipientRows.filter(
      (row) => row.name.toLowerCase().includes(query) || row.email.toLowerCase().includes(query),
    );
  }, [recipientRows, search]);

  const previewRecipient = filteredRows[0]?.email || recipientRows[0]?.email || '';

  return (
    <Pane.Root>
      <Pane.Header.Root>
        <Pane.Header.Left className="flex items-center gap-3">
          <p className="truncate pt-1 text-base font-medium">Email Stats</p>
        </Pane.Header.Left>
        <Pane.Header.Right>
          <Button
            type="button"
            size="sm"
            variant="tertiary"
            iconRight="icon-chevron-right"
            className="rounded-xs bg-primary/8 px-3 text-sm font-medium text-secondary hover:bg-primary/12"
            disabled={!previewRecipient}
            onClick={() =>
              modal.open(NewsletterEmailPreviewModal, {
                props: {
                  newsletter,
                  recipient: previewRecipient,
                },
                className: EMAIL_PREVIEW_MODAL_CLASS_NAME,
              })
            }
          >
            View Email
          </Button>
        </Pane.Header.Right>
      </Pane.Header.Root>

      <Pane.Content className="flex flex-col overflow-auto p-4">
        <section className="space-y-4 pb-5">
          <div className="flex items-end justify-between gap-3">
            <div className="flex items-baseline gap-1">
              <p className="text-xl leading-none font-semibold tracking-tight text-success-400">{openRate}%</p>
              <p className="text-sm leading-6 font-medium text-success-400">Open Rate</p>
            </div>
            <p className="pb-1 text-sm leading-6 font-medium text-tertiary">{sentCount} Sent</p>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-primary/8">
            <div className="flex h-full w-full">
              <div className="bg-success-400" style={{ width: `${openRate}%` }} />
              <div className="bg-warning-300" style={{ width: `${Math.max(100 - openRate, 0)}%` }} />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm leading-5">
            <div className="flex items-center gap-2 font-medium text-success-400">
              <span className="size-2 rounded-full bg-current" />
              <span>{openedCount} Opened</span>
            </div>
            <div className="flex items-center gap-2 font-medium text-warning-300">
              <span className="size-2 rounded-full bg-current" />
              <span>{deliveredCount} Delivered</span>
            </div>
          </div>
        </section>

        <section className="-mx-4 space-y-3 border-t border-primary/8 px-4 pt-4">
          <p className="text-lg leading-8 font-medium text-primary">Recipients</p>

          <div className="flex h-10 items-center gap-2 rounded-sm border border-primary/8 bg-background/64 px-3">
            <i aria-hidden="true" className="icon-search size-4 text-quaternary" />
            <input
              type="search"
              aria-label="Search recipients"
              value={search}
              placeholder="Search"
              className="w-full bg-transparent text-md outline-none placeholder:text-quaternary"
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="overflow-hidden rounded-md border border-card-border bg-card">
            {filteredRows.length > 0 ? (
              filteredRows.map((recipient, index) => {
                const avatarStyle = getAvatarStyle(recipient.email);

                return (
                  <div
                    key={recipient.email}
                    className={`flex items-center gap-3 px-4 py-3.5 ${index > 0 ? 'border-t border-primary/8' : ''}`}
                  >
                    <div
                      className="flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-medium"
                      style={avatarStyle}
                    >
                      {getInitials(recipient.name)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base leading-6 font-medium text-primary">{recipient.name}</p>
                      <p className="truncate pt-0.5 text-md leading-5 text-tertiary">{recipient.email}</p>
                    </div>

                    <RecipientStatusBadge status={recipient.status} />
                  </div>
                );
              })
            ) : (
              <p className="px-4 py-10 text-center text-sm text-tertiary">
                No recipients match your search.
              </p>
            )}
          </div>
        </section>
      </Pane.Content>
    </Pane.Root>
  );
}
