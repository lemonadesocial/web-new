'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '$lib/components/core/button/button';
import { modal } from '$lib/components/core/dialog/modal';
import TextEditor from '$lib/components/core/text-editor/text-editor';
import { toast } from '$lib/components/core/toast/toast';
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
import { useConfirmation } from '$lib/hooks/useConfirmation';
import { SendNewsletterPreviewModal } from './modals/SendNewsletterPreviewModal';
import { SendNewsletterModal } from './modals/SendNewsletterModal';

type SaveStatus = 'idle' | 'saving' | 'saved';
const PREVIEW_MODAL_CLASS_NAME = 'w-85 max-w-[calc(100vw-32px)] shadow-[0_4px_8px_rgba(0,0,0,0.32)]';
const SEND_MODAL_CLASS_NAME = 'w-85 max-w-[calc(100vw-32px)] shadow-[0_4px_8px_rgba(0,0,0,0.32)]';

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
  const confirm = useConfirmation();

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
  const [isHydrated, setIsHydrated] = React.useState(false);
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
    loadedDraftIdRef.current = null;
    lastSavedRef.current = { subject: '', body: '' };
    setSubject('');
    setBody('');
    setIsHydrated(false);
    setSaveStatus('idle');
  }, [draftId]);

  React.useEffect(() => {
    if (!newsletter) return;

    const nextSubject = newsletter.custom_subject_html || '';
    const nextBody = newsletter.custom_body_html || '';
    const isNewDraft = loadedDraftIdRef.current !== newsletter._id;
    const hasLocalEdits = subject !== lastSavedRef.current.subject || body !== lastSavedRef.current.body;
    const hasFreshServerContent =
      nextSubject !== lastSavedRef.current.subject || nextBody !== lastSavedRef.current.body;

    if (!isNewDraft && (hasLocalEdits || !hasFreshServerContent)) return;

    loadedDraftIdRef.current = newsletter._id;
    setSubject(nextSubject);
    setBody(nextBody);
    lastSavedRef.current = { subject: nextSubject, body: nextBody };
    setIsHydrated(true);
    setSaveStatus('idle');
  }, [body, newsletter, subject]);

  React.useEffect(() => {
    if (!newsletter || !isHydrated || loadingNewsletter || readOnly || !hasChanges || loadedDraftIdRef.current !== newsletter._id) return;

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
  }, [body, hasChanges, isHydrated, loadingNewsletter, newsletter, readOnly, subject, updateDraft]);

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

  if (loadingSpace || loadingNewsletter || !space || (newsletter && !isHydrated)) {
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
        <div className="mx-auto flex w-full max-w-150 flex-1 flex-col pt-7 pb-20">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-1 text-sm text-tertiary">
              <span className="truncate font-medium">{space.title}</span>
              <i aria-hidden="true" className="icon-chevron-right size-4.5 shrink-0" />
              <span className="font-medium">Newsletters</span>
              <i aria-hidden="true" className="icon-chevron-right size-4.5 shrink-0" />
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
              className="min-h-12 w-full resize-none overflow-hidden border-0 border-b border-primary/8 bg-transparent px-0 py-2 text-4xl leading-tight font-medium text-primary outline-none placeholder:text-quaternary"
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
              containerClass="min-h-80 rounded-none border-0 bg-transparent px-0 py-0 text-base leading-7 text-primary hover:border-transparent focus:border-transparent"
              onChange={(value) => {
                setSaveStatus('idle');
                setBody(value);
              }}
            />
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 border-t border-primary/8 bg-page/80 p-4 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-150 items-center justify-between gap-4">
          <Button
            aria-label="Delete draft"
            icon="icon-delete"
            size="base"
            variant="tertiary"
            className="size-10 shrink-0 rounded-sm p-0"
            loading={deletingDraft}
            onClick={() =>
              confirm({
                title: 'Delete Draft',
                subtitle: 'Are you sure you want to delete this draft? You will not be able to recover it.',
                icon: 'icon-delete',
                buttonText: 'Delete',
                onConfirm: handleDelete,
              })
            }
          />

          <div className="relative flex items-center gap-2">
            {saveStatus !== 'idle' && (
              <div className="absolute bottom-full right-0 mb-5 rounded-full border border-primary/8 bg-[rgba(32,32,34,0.8)] px-2.5 py-1 text-sm leading-5 text-tertiary backdrop-blur">
                <span className="font-medium">{saveStatus === 'saved' ? 'Saved' : 'Saving'}</span>
              </div>
            )}

            <Button
              type="button"
              size="base"
              variant="tertiary"
              onClick={() =>
                modal.open(SendNewsletterPreviewModal, {
                  props: {
                    draftId: newsletter._id,
                    spaceId: space._id,
                    subject,
                    body,
                  },
                  className: PREVIEW_MODAL_CLASS_NAME,
                })
              }
            >
              Preview
            </Button>
            <Button
              type="button"
              size="base"
              variant="secondary"
              disabled={!hasContent || readOnly}
              onClick={() =>
                modal.open(SendNewsletterModal, {
                  dismissible: false,
                  props: {
                    uid,
                    spaceId: space._id,
                    draftId: newsletter._id,
                    subject,
                    body,
                    adminsCount: space.admins?.length ?? 0,
                    availableSends,
                    totalSends: sendingQuota?.total ?? 0,
                  },
                  className: SEND_MODAL_CLASS_NAME,
                })
              }
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
