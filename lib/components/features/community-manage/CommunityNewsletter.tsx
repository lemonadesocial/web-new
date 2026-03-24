'use client';

import { FloatingPortal } from '@floating-ui/react';
import { Button } from '$lib/components/core/button/button';
import { Divider } from '$lib/components/core/divider/divider';
import { drawer } from '$lib/components/core/dialog/drawer';
import { Menu } from '$lib/components/core/menu/menu';
import { Skeleton } from '$lib/components/core/skeleton/skeleton';
import { toast } from '$lib/components/core/toast/toast';
import {
  CreateSpaceNewsletterDocument,
  DeleteSpaceNewsletterDocument,
  EmailRecipientType,
  GetSpaceTagsDocument,
  GetSpaceVerificationSubmissionDocument,
  ListSpaceNewslettersDocument,
  SpaceTagFragmentFragmentDoc,
  SpaceVerificationState,
  type ListSpaceNewslettersQuery,
} from '$lib/graphql/generated/backend/graphql';
import { useFragment } from '$lib/graphql/generated/backend/fragment-masking';
import { useMutation, useQuery } from '$lib/graphql/request';
import { useConfirmation } from '$lib/hooks/useConfirmation';
import { RECIPIENT_TYPE_MAP } from '$lib/utils/email';
import { htmlToInlineText } from '$lib/utils/string';
import { format, isToday } from 'date-fns';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useCommunityManageSpace } from './CommunityManageSpaceContext';
import { NewsletterStatsPane } from './panes/NewsletterStatsPane';

interface CommunityNewsletterProps {
  spaceIdOrSlug: string;
}

type NewsletterListItem = ListSpaceNewslettersQuery['listSpaceNewsletters'][number];
type CategorizedNewsletters = {
  drafts: NewsletterListItem[];
  scheduled: NewsletterListItem[];
  published: NewsletterListItem[];
};

export function CommunityNewsletter({ spaceIdOrSlug }: CommunityNewsletterProps) {
  const router = useRouter();
  const ctx = useCommunityManageSpace();
  const confirm = useConfirmation();

  const [createNewsletter, { loading: creatingNewsletter }] = useMutation(CreateSpaceNewsletterDocument, {
    onComplete: (_, data) => {
      const draftId = data?.createSpaceNewsletter?._id;
      if (!draftId) {
        toast.error('Failed to create draft');
        return;
      }

      router.push(`/s/manage/${spaceIdOrSlug}/newsletters/${draftId}`);
    },
    onError: () => {
      toast.error('Failed to create draft');
    },
  });

  const { data: verificationData, loading: loadingVerification } = useQuery(GetSpaceVerificationSubmissionDocument, {
    variables: { space: ctx?.space._id || '' },
    skip: !ctx?.space._id,
    fetchPolicy: 'cache-and-network',
  });

  const isLoadingVerification = loadingVerification && !verificationData;
  const isVerified = verificationData?.getSpaceVerificationSubmission?.state === SpaceVerificationState.Approved;

  const {
    data: newslettersData,
    loading: loadingNewsletters,
    refetch: refetchNewsletters,
  } = useQuery(ListSpaceNewslettersDocument, {
    variables: {
      space: ctx?.space._id || '',
      draft: true,
      sent: true,
      scheduled: true,
    },
    skip: !ctx?.space._id || !isVerified,
    fetchPolicy: 'cache-and-network',
  });

  const { data: tagsData } = useQuery(GetSpaceTagsDocument, {
    variables: { space: ctx?.space._id || '' },
    skip: !ctx?.space._id || !isVerified,
    fetchPolicy: 'cache-and-network',
  });

  const [duplicateNewsletter, { loading: duplicatingNewsletter }] = useMutation(CreateSpaceNewsletterDocument, {
    onComplete: (_, data) => {
      const draftId = data?.createSpaceNewsletter?._id;
      if (!draftId) {
        toast.error('Failed to duplicate draft');
        return;
      }

      router.push(`/s/manage/${spaceIdOrSlug}/newsletters/${draftId}`);
    },
    onError: () => {
      toast.error('Failed to duplicate draft');
    },
  });

  const [deleteNewsletter, { loading: deletingNewsletter }] = useMutation(DeleteSpaceNewsletterDocument, {
    onError: () => {
      toast.error('Failed to delete newsletter');
    },
  });

  const newsletters = newslettersData?.listSpaceNewsletters || [];

  const { drafts: draftNewsletters, scheduled: scheduledNewsletters, published: publishedNewsletters } =
    React.useMemo<CategorizedNewsletters>(() => {
      const categorized: CategorizedNewsletters = {
        drafts: [],
        scheduled: [],
        published: [],
      };

      newsletters.forEach((newsletter) => {
        if (newsletter.draft) {
          categorized.drafts.push(newsletter);
          return;
        }

        if (newsletter.sent_at) {
          categorized.published.push(newsletter);
          return;
        }

        if (newsletter.scheduled_at) {
          categorized.scheduled.push(newsletter);
        }
      });

      categorized.drafts.sort(
        (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime(),
      );
      categorized.scheduled.sort(
        (a, b) => new Date(a.scheduled_at || 0).getTime() - new Date(b.scheduled_at || 0).getTime(),
      );
      categorized.published.sort(
        (a, b) => new Date(b.sent_at || 0).getTime() - new Date(a.sent_at || 0).getTime(),
      );

      return categorized;
    }, [newsletters]);

  const tagMap = React.useMemo(() => {
    const tags = useFragment(SpaceTagFragmentFragmentDoc, tagsData?.listSpaceTags || []);

    return new Map(tags.filter(Boolean).map((tag) => [tag._id.toString(), tag.tag]));
  }, [tagsData?.listSpaceTags]);

  const handleCreateDraft = React.useCallback(async () => {
    if (!ctx?.space._id) return;

    await createNewsletter({
      variables: {
        input: {
          space: ctx.space._id,
          draft: true,
        },
      },
    });
  }, [createNewsletter, ctx?.space._id]);

  const handleDuplicateNewsletter = React.useCallback(
    async (newsletter: NewsletterListItem) => {
      if (!ctx?.space._id) return;

      await duplicateNewsletter({
        variables: {
          input: {
            space: ctx.space._id,
            draft: true,
            custom_subject_html: newsletter.custom_subject_html,
            custom_body_html: newsletter.custom_body_html,
          },
        },
      });
    },
    [ctx?.space._id, duplicateNewsletter],
  );

  const handleDeleteNewsletter = React.useCallback(
    async (newsletterId: string, successMessage: string) => {
      const result = await deleteNewsletter({
        variables: {
          id: newsletterId,
        },
      });

      if (!result.error) {
        toast.success(successMessage);
        await refetchNewsletters();
      }
    },
    [deleteNewsletter, refetchNewsletters],
  );

  const actionMenuDisabled = duplicatingNewsletter || deletingNewsletter;

  return (
    <div className="page bg-transparent! mx-auto py-7 px-4 md:px-0">
      <div className="flex flex-col gap-8 pb-20">
        <section className="flex flex-col gap-5">
          <div className="space-y-1">
            <h3 className="text-xl font-semibold">Drafts</h3>
            <p className="text-secondary">
              As you write, your drafts will be automatically saved and appear here.
            </p>
          </div>

          {isLoadingVerification ? (
            <>
              <DraftListSkeleton />
              <Skeleton animate className="h-9 w-[104px] rounded-sm" />
            </>
          ) : !isVerified ? (
            <div className="flex flex-col gap-3 rounded-md border border-card-border bg-warning-300/16 px-4 py-3 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-0.5">
                <p className="text-warning-300">Please verify your community</p>
                <p className="text-secondary">Share information about your community to send newsletters.</p>
              </div>

              <Button
                size="sm"
                variant="warning"
                outlined
                iconRight="icon-chevron-right"
                className="w-fit"
                onClick={() => router.push(`/s/manage/${spaceIdOrSlug}/verify`)}
              >
                Verify
              </Button>
            </div>
          ) : (
            <>
              {loadingNewsletters && draftNewsletters.length === 0 ? <DraftListSkeleton /> : null}

              {draftNewsletters.length > 0 ? (
                <div className="overflow-hidden rounded-md border border-card-border bg-card">
                  {draftNewsletters.map((newsletter, index) => (
                    <div
                      key={newsletter._id}
                      className={`flex w-full items-center gap-3 px-4 py-3 ${index > 0 ? 'border-t border-primary/8' : ''}`}
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <div className="flex min-w-0 flex-1 items-center gap-2 text-base leading-6 font-medium">
                          <span className="max-w-[40%] shrink-0 truncate text-primary">
                            {getNewsletterSubject(newsletter.custom_subject_html)}
                          </span>
                          <span className="min-w-0 flex-1 truncate text-tertiary">
                            {getNewsletterPreview(newsletter.custom_body_html)}
                          </span>
                        </div>

                        <span className="shrink-0 text-base leading-6 font-medium text-tertiary">
                          {getDraftDateLabel(newsletter.created_at)}
                        </span>
                      </div>

                      <div className="shrink-0">
                        <NewsletterActionsMenu
                          disabled={actionMenuDisabled}
                          onEdit={() => router.push(`/s/manage/${spaceIdOrSlug}/newsletters/${newsletter._id}`)}
                          onDuplicate={() => handleDuplicateNewsletter(newsletter)}
                          onDelete={() =>
                            confirm({
                              title: 'Delete Draft',
                              subtitle: 'Are you sure you want to delete this draft? You will not be able to recover it.',
                              icon: 'icon-delete',
                              buttonText: 'Delete',
                              onConfirm: async () => {
                                await handleDeleteNewsletter(newsletter._id.toString(), 'Draft deleted');
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              <Button
                size="sm"
                variant="secondary"
                iconLeft="icon-plus"
                className="w-fit shrink-0"
                loading={creatingNewsletter}
                onClick={handleCreateDraft}
              >
                New Draft
              </Button>
            </>
          )}
        </section>

        {isVerified ? (
          <>
            {(loadingNewsletters || scheduledNewsletters.length > 0) && (
              <>
                <Divider />

                <section className="flex flex-col gap-5">
                  <h3 className="text-xl font-semibold">Scheduled</h3>

                  {loadingNewsletters && scheduledNewsletters.length === 0 ? (
                    <NewsletterListSkeleton rows={3} />
                  ) : (
                    <div className="overflow-hidden rounded-md border border-card-border bg-card">
                      {scheduledNewsletters.map((newsletter, index) => (
                        <div
                          key={newsletter._id}
                          className={`flex items-start gap-3 px-4 py-3 ${index > 0 ? 'border-t border-primary/8' : ''}`}
                        >
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-base leading-6 font-medium text-primary">
                              {getNewsletterSubject(newsletter.custom_subject_html)}
                            </p>
                            <p className="mt-1 text-sm leading-5 text-tertiary">
                              {getScheduledDateLabel(newsletter.scheduled_at)}
                              <span className="px-1 text-primary/20">·</span>
                              To {getAudienceSummary(newsletter, tagMap)}
                            </p>
                          </div>

                          <div className="shrink-0">
                            <NewsletterActionsMenu
                              disabled={actionMenuDisabled}
                              onEdit={() => router.push(`/s/manage/${spaceIdOrSlug}/newsletters/${newsletter._id}`)}
                              onDuplicate={() => handleDuplicateNewsletter(newsletter)}
                              onDelete={() =>
                                confirm({
                                  title: 'Delete Newsletter',
                                  subtitle: 'Are you sure you want to delete this newsletter? You will not be able to recover it.',
                                  icon: 'icon-delete',
                                  buttonText: 'Delete',
                                  onConfirm: async () => {
                                    await handleDeleteNewsletter(newsletter._id.toString(), 'Newsletter deleted');
                                  },
                                })
                              }
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </>
            )}

            <Divider />

            <section className="flex flex-col gap-5">
              <h3 className="text-xl font-semibold">Published</h3>

              {loadingNewsletters && publishedNewsletters.length === 0 ? (
                <PublishedListSkeleton />
              ) : publishedNewsletters.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {publishedNewsletters.map((newsletter) => {
                    const sentCount = newsletter.recipients?.length || 0;
                    const opensCount = newsletter.opened?.length || 0;

                    return (
                      <div key={newsletter._id} className="overflow-hidden rounded-md border border-card-border bg-card">
                        <div className="flex items-start gap-3 px-4 py-3">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-base leading-6 font-medium text-primary">
                              {getNewsletterSubject(newsletter.custom_subject_html)}
                            </p>
                            <p className="mt-1 text-sm leading-5 text-tertiary">
                              {getPublishedDateLabel(newsletter.sent_at)}
                              <span className="px-1 text-primary/20">·</span>
                              {getAudienceSummary(newsletter, tagMap)}
                            </p>
                          </div>

                          <div className="shrink-0">
                            <NewsletterActionsMenu
                              disabled={actionMenuDisabled}
                              onDuplicate={() => handleDuplicateNewsletter(newsletter)}
                              onDelete={() =>
                                confirm({
                                  title: 'Delete Newsletter',
                                  subtitle: 'Are you sure you want to delete this newsletter? You will not be able to recover it.',
                                  icon: 'icon-delete',
                                  buttonText: 'Delete',
                                  onConfirm: async () => {
                                    await handleDeleteNewsletter(newsletter._id.toString(), 'Newsletter deleted');
                                  },
                                })
                              }
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-3 border-t border-primary/8 bg-primary/4 px-4 py-3">
                          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                            <PublishedMetric label="Sent" value={formatInteger(sentCount)} />
                            <PublishedMetric
                              label="Opens"
                              value={formatInteger(opensCount)}
                              meta={getPercentageLabel(opensCount, sentCount)}
                            />
                          </div>

                          <Button
                            type="button"
                            size="sm"
                            variant="tertiary"
                            iconLeft="icon-bar-chart"
                            className="shrink-0"
                            onClick={() =>
                              drawer.open(NewsletterStatsPane, {
                                props: {
                                  newsletter,
                                },
                                contentClass: 'md:max-w-[544px]',
                              })
                            }
                          >
                            View Stats
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-5 py-12 text-tertiary md:py-20">
                  <i aria-hidden="true" className="icon-email-open size-44 text-quaternary md:size-[184px]" />

                  <div className="max-w-xl space-y-2 text-center">
                    <h4 className="font-title text-xl font-semibold">No Newsletters</h4>
                    <p>Tell your subscribers about your events and what is happening.</p>
                  </div>
                </div>
              )}
            </section>
          </>
        ) : null}
      </div>
    </div>
  );
}

function DraftListSkeleton() {
  return (
    <div className="overflow-hidden rounded-md border border-card-border bg-card">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className={`flex items-center gap-3 px-4 py-3 ${index > 0 ? 'border-t border-primary/8' : ''}`}
        >
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <Skeleton animate className="h-6 w-[180px] shrink-0 rounded-xs" />
              <Skeleton animate className="h-6 min-w-0 flex-1 rounded-xs" />
            </div>

            <Skeleton animate className="h-6 w-14 shrink-0 rounded-xs" />
          </div>

          <Skeleton animate className="size-5 shrink-0 rounded-full" />
        </div>
      ))}
    </div>
  );
}

function NewsletterListSkeleton({ rows }: { rows: number }) {
  return (
    <div className="overflow-hidden rounded-md border border-card-border bg-card">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className={`flex items-start gap-3 px-4 py-3 ${index > 0 ? 'border-t border-primary/8' : ''}`}
        >
          <div className="min-w-0 flex-1">
            <Skeleton animate className="h-6 w-[240px] rounded-xs" />
            <Skeleton animate className="mt-2 h-5 w-[320px] max-w-full rounded-xs" />
          </div>

          <Skeleton animate className="mt-0.5 size-5 shrink-0 rounded-full" />
        </div>
      ))}
    </div>
  );
}

function PublishedListSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-md border border-card-border bg-card">
          <div className="flex items-start gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <Skeleton animate className="h-6 w-[240px] rounded-xs" />
              <Skeleton animate className="mt-2 h-5 w-[280px] max-w-full rounded-xs" />
            </div>

            <Skeleton animate className="mt-0.5 size-5 shrink-0 rounded-full" />
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-primary/8 bg-primary/4 px-4 py-3">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <Skeleton animate className="h-10 w-[82px] rounded-xs" />
              <Skeleton animate className="h-10 w-[96px] rounded-xs" />
            </div>

            <Skeleton animate className="h-9 w-[104px] rounded-sm" />
          </div>
        </div>
      ))}
    </div>
  );
}

function getNewsletterSubject(value?: string | null) {
  const subject = htmlToInlineText(value);
  return subject || 'Untitled';
}

function getNewsletterPreview(value?: string | null) {
  return htmlToInlineText(value);
}

function getDraftDateLabel(value?: string | null) {
  if (!value) return '';

  const date = new Date(value);
  if (isToday(date)) return 'Today';

  return format(date, 'MMM d');
}

function getScheduledDateLabel(value?: string | null) {
  if (!value) return 'Schedule pending';

  return format(new Date(value), 'MMM d, yyyy, h:mm a');
}

function getPublishedDateLabel(value?: string | null) {
  if (!value) return 'Sent recently';

  return format(new Date(value), "MMM d, yyyy 'at' h:mm a");
}

function getAudienceSummary(newsletter: NewsletterListItem, tagMap: Map<string, string>) {
  const labels = newsletter.recipient_types?.flatMap((type) => {
    if (type === EmailRecipientType.SpaceTaggedPeople) {
      const tagLabels = newsletter.recipient_filters?.space_members?.space_tags
        ?.map((tagId) => tagMap.get(tagId.toString()))
        .filter(Boolean) as string[] | undefined;

      if (newsletter.recipient_filters?.space_members?.include_untagged) {
        return [...(tagLabels || []), 'Others'];
      }

      return tagLabels || ['Selected People'];
    }

    if (type === EmailRecipientType.SpaceSubscribers) return ['All People'];
    if (type === EmailRecipientType.SpaceEventAttendees) return ['Event Guests'];

    return [RECIPIENT_TYPE_MAP.get(type) || 'Selected People'];
  }) || [];

  const uniqueLabels = Array.from(new Set(labels.filter(Boolean)));
  const label = uniqueLabels.length > 0 ? uniqueLabels.join(', ') : 'Selected People';
  const count = newsletter.sent_at
    ? newsletter.recipients?.length || 0
    : newsletter.pending_recipients?.length || newsletter.recipients?.length || 0;

  return count > 0 ? `${label} (${formatInteger(count)})` : label;
}

function getPercentageLabel(value: number, total: number) {
  if (!value || !total) return undefined;

  return `${Math.round((value / total) * 100)}%`;
}

function formatInteger(value: number) {
  return new Intl.NumberFormat('en-US').format(value);
}

function PublishedMetric({
  label,
  value,
  meta,
}: {
  label: string;
  value: string;
  meta?: string;
}) {
  return (
    <div className="flex min-w-[58px] flex-col">
      <span className="text-xs leading-4 text-quaternary">{label}</span>
      <div className="flex items-baseline gap-1">
        <span className="text-sm leading-5 font-medium text-primary">{value}</span>
        {meta ? <span className="text-sm leading-4 text-tertiary">{meta}</span> : null}
      </div>
    </div>
  );
}

function NewsletterActionsMenu({
  disabled,
  onReschedule,
  onEdit,
  onDuplicate,
  onDelete,
}: {
  disabled?: boolean;
  onReschedule?: () => void;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
}) {
  const hasActions = Boolean(onReschedule || onEdit || onDuplicate || onDelete);

  return (
    <Menu.Root disabled={disabled || !hasActions} placement="bottom-end" withFlip>
      <Menu.Trigger className="flex size-5 items-center justify-center text-quaternary transition hover:text-primary">
        <i aria-hidden="true" className="icon-more-horiz size-5" />
      </Menu.Trigger>

      <FloatingPortal>
        <Menu.Content className="z-[100001] min-w-[132px] rounded-sm p-1 shadow-[0_4px_8px_rgba(0,0,0,0.32)] backdrop-blur-xl">
          {onReschedule ? <MenuActionItem icon="icon-clock" label="Reschedule" onClick={onReschedule} /> : null}
          {onEdit ? <MenuActionItem icon="icon-edit-square" label="Edit" onClick={onEdit} /> : null}
          {onDuplicate ? <MenuActionItem icon="icon-copy" label="Duplicate" onClick={onDuplicate} /> : null}
          {onDelete ? <MenuActionItem icon="icon-delete" label="Delete" danger onClick={onDelete} /> : null}
        </Menu.Content>
      </FloatingPortal>
    </Menu.Root>
  );
}

function MenuActionItem({
  icon,
  label,
  danger = false,
  onClick,
}: {
  icon: string;
  label: string;
  danger?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-2.5 rounded-xs px-2 py-1.5 text-left transition hover:bg-primary/8"
      onClick={onClick}
    >
      <i
        aria-hidden="true"
        className={`size-4 shrink-0 ${danger ? 'text-danger-400' : 'text-tertiary'} ${icon}`}
      />
      <span className={`text-sm font-medium ${danger ? 'text-danger-400' : 'text-secondary'}`}>{label}</span>
    </button>
  );
}
