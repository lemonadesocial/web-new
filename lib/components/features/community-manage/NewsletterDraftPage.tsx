'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { Button, TextEditor, toast } from '$lib/components/core';
import {
  DeleteSpaceNewsletterDocument,
  GetSpaceDocument,
  GetSpaceNewsletterDocument,
  GetSpaceSendingQuotaDocument,
  Space,
  UpdateSpaceNewsletterDocument,
} from '$lib/graphql/generated/backend/graphql';
import { useMutation, useQuery } from '$lib/graphql/request';
import { isObjectId } from '$lib/utils/helpers';
import Header from '$lib/components/layouts/header';

type SaveStatus = 'idle' | 'saving' | 'saved';

function getPlainText(value: string) {
  return value.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
}

function QuotaRing({ available, total }: { available: number; total: number }) {
  const usedPercent = total > 0 ? Math.min(Math.max(((total - available) / total) * 100, 0), 100) : 0;
  const radius = 8;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="group relative flex items-center">
      <button
        type="button"
        className="relative flex size-5 items-center justify-center text-primary"
        aria-label={`${available} / ${total} sends available`}
      >
        <svg className="-rotate-90 size-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="10" cy="10" r={radius} stroke="currentColor" strokeOpacity="0.24" strokeWidth="2" />
          <circle
            cx="10"
            cy="10"
            r={radius}
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (circumference * usedPercent) / 100}
          />
        </svg>
      </button>

      <div className="pointer-events-none absolute left-1/2 top-full z-20 mt-3 -translate-x-1/2 opacity-0 transition-opacity group-hover:opacity-100">
        <div className="relative whitespace-nowrap rounded-sm bg-primary px-2 py-1 text-sm font-medium text-background shadow-[0_2px_4px_rgba(0,0,0,0.24)]">
          {available} / {total} Sends Available
          <div className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-primary" />
        </div>
      </div>
    </div>
  );
}

export function NewsletterDraftPage({ uid, draftId }: { uid: string; draftId: string }) {
  const router = useRouter();

  const spaceVariables = isObjectId(uid) ? { id: uid, slug: uid } : { slug: uid };
  const { data: spaceData, loading: loadingSpace } = useQuery(GetSpaceDocument, {
    variables: spaceVariables,
    skip: !uid,
    fetchPolicy: 'cache-and-network',
  });

  const space = spaceData?.getSpace as Space;

  const { data: newsletterData, loading: loadingNewsletter } = useQuery(GetSpaceNewsletterDocument, {
    variables: { space: space?._id || '', id: draftId },
    skip: !space?._id || !draftId,
    fetchPolicy: 'cache-and-network',
  });

  const { data: quotaData } = useQuery(GetSpaceSendingQuotaDocument, {
    variables: { space: space?._id || '' },
    skip: !space?._id,
    fetchPolicy: 'cache-and-network',
  });

  const newsletter = newsletterData?.getSpaceNewsletter;
  const sendingQuota = quotaData?.getSpaceSendingQuota;

  const [subject, setSubject] = React.useState('');
  const [body, setBody] = React.useState('');
  const [saveStatus, setSaveStatus] = React.useState<SaveStatus>('idle');
  const subjectRef = React.useRef<HTMLTextAreaElement>(null);

  const lastSavedRef = React.useRef({ subject: '', body: '' });
  const loadedDraftIdRef = React.useRef<string | null>(null);
  const saveStateTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const listHref = `/s/manage/${uid}/newsletters`;
  const readOnly = !!newsletter?.sent_at;
  const availableSends = Math.max((sendingQuota?.total ?? 0) - (sendingQuota?.used ?? 0), 0);
  const isEmptyDraft = !subject.trim() && !getPlainText(body);
  const hasContent = !isEmptyDraft;
  const hasChanges = subject !== lastSavedRef.current.subject || body !== lastSavedRef.current.body;

  const [updateDraft] = useMutation(UpdateSpaceNewsletterDocument, {
    onError: () => {
      toast.error('Unable to save draft');
      setSaveStatus('idle');
    },
  });

  const [deleteDraft, { loading: deletingDraft }] = useMutation(DeleteSpaceNewsletterDocument, {
    onError: () => {
      toast.error('Unable to delete draft');
    },
  });

  React.useEffect(() => {
    if (!newsletter || loadedDraftIdRef.current === newsletter._id) return;

    loadedDraftIdRef.current = newsletter._id;
    const nextSubject = newsletter.custom_subject_html || '';
    const nextBody = newsletter.custom_body_html || '';

    setSubject(nextSubject);
    setBody(nextBody);
    lastSavedRef.current = { subject: nextSubject, body: nextBody };
    setSaveStatus('idle');
  }, [newsletter]);

  React.useEffect(() => {
    if (!newsletter || readOnly || !hasChanges) return;

    const timer = setTimeout(async () => {
      setSaveStatus('saving');

      const result = await updateDraft({
        variables: {
          input: {
            _id: newsletter._id,
            custom_subject_html: subject,
            custom_body_html: body,
          },
        },
      });

      if (result.error) return;

      lastSavedRef.current = { subject, body };
      setSaveStatus('saved');

      if (saveStateTimerRef.current) clearTimeout(saveStateTimerRef.current);
      saveStateTimerRef.current = setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
    }, 1000);

    return () => clearTimeout(timer);
  }, [body, hasChanges, newsletter, readOnly, subject, updateDraft]);

  React.useEffect(() => {
    return () => {
      if (saveStateTimerRef.current) clearTimeout(saveStateTimerRef.current);
    };
  }, []);

  React.useEffect(() => {
    const textarea = subjectRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [subject]);

  const removeDraft = React.useCallback(async () => {
    if (!newsletter?._id) return false;

    const result = await deleteDraft({
      variables: {
        id: newsletter._id,
      },
    });

    return !result.error;
  }, [deleteDraft, newsletter?._id]);

  const handleBack = React.useCallback(async () => {
    if (newsletter?.draft && isEmptyDraft) {
      await removeDraft();
    }

    router.push(listHref);
  }, [isEmptyDraft, listHref, newsletter?.draft, removeDraft, router]);

  const handleDelete = React.useCallback(async () => {
    const deleted = await removeDraft();
    if (deleted) {
      router.push(listHref);
    }
  }, [listHref, removeDraft, router]);

  const handleSubjectChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSaveStatus('idle');
    setSubject(event.target.value);
  };

  if (loadingSpace || loadingNewsletter || !space) {
    return (
      <main className="min-h-dvh bg-page text-primary">
        <div className="flex min-h-dvh items-center justify-center">
          <div className="flex items-center gap-2 text-tertiary">
            <i aria-hidden="true" className="icon-loader size-5 animate-spin" />
            <p>Loading draft...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!newsletter) {
    return (
      <main className="min-h-dvh bg-page text-primary">
        <div className="flex min-h-dvh items-center justify-center px-4">
          <div className="w-full max-w-md rounded-md border border-card-border bg-card p-4">
            <p className="font-medium">Draft not found</p>
            <p className="mt-1 text-sm text-tertiary">
              This newsletter draft may have been deleted or is no longer available.
            </p>
            <Button className="mt-4 w-fit" size="sm" variant="secondary" onClick={() => router.push(listHref)}>
              Back to Newsletters
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-dvh flex-col bg-page text-primary">
      <Header
        leftIcon={
          <Button
            type="button"
            aria-label="Back to newsletters"
            icon="icon-chevron-left"
            size="sm"
            variant="tertiary"
            className="size-10 rounded-sm p-0"
            onClick={handleBack}
          />
        }
      />

      <div className="flex flex-1 flex-col px-4">
        <div className="mx-auto flex w-full max-w-[600px] flex-1 flex-col pt-7 pb-20">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-1 text-sm text-tertiary">
              <span className="truncate font-medium">{space.title}</span>
              <i aria-hidden="true" className="icon-chevron-right size-[18px] shrink-0" />
              <span className="font-medium">Newsletters</span>
              <i aria-hidden="true" className="icon-chevron-right size-[18px] shrink-0" />
            </div>

            <QuotaRing available={availableSends} total={sendingQuota?.total ?? 0} />
          </div>

          <div className="mt-2 flex flex-1 flex-col gap-4">
            <textarea
              ref={subjectRef}
              rows={1}
              readOnly={readOnly}
              value={subject}
              placeholder="Subject"
              className="min-h-12 w-full resize-none overflow-hidden border-0 border-b border-primary/8 bg-transparent px-0 py-2 text-4xl leading-[1.15] font-medium text-primary outline-none placeholder:text-quaternary"
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                }
              }}
              onChange={handleSubjectChange}
            />

            <TextEditor
              readOnly={readOnly}
              directory="email"
              content={body}
              placeholder="The beginning of a masterpiece..."
              containerClass="min-h-[320px] rounded-none border-0 bg-transparent px-0 py-0 text-base leading-7 text-primary hover:border-transparent focus:border-transparent"
              onChange={(value) => {
                setSaveStatus('idle');
                setBody(value);
              }}
            />
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 border-t border-primary/8 bg-page/80 p-4 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[600px] items-center justify-between gap-4">
          <Button
            aria-label="Delete draft"
            icon="icon-delete"
            size="base"
            variant="tertiary"
            className="size-10 shrink-0 rounded-sm p-0"
            loading={deletingDraft}
            onClick={handleDelete}
          />

          <div className="relative flex items-center gap-2">
            {saveStatus !== 'idle' && (
              <div className="absolute bottom-full right-0 mb-5 rounded-full border border-primary/8 bg-[rgba(32,32,34,0.8)] px-2.5 py-1 text-sm leading-5 text-tertiary backdrop-blur-[8px]">
                <span className="font-medium">{saveStatus === 'saved' ? 'Saved' : 'Saving'}</span>
              </div>
            )}

            <Button type="button" size="base" variant="tertiary">
              Preview
            </Button>
            <Button type="button" size="base" variant="secondary" disabled={!hasContent}>
              Continue
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
