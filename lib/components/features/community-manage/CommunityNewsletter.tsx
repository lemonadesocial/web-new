'use client';

import { Button, Divider, toast } from '$lib/components/core';
import {
  CreateSpaceNewsletterDocument,
  GetSpaceVerificationSubmissionDocument,
  SpaceVerificationState,
} from '$lib/graphql/generated/backend/graphql';
import { useMutation, useQuery } from '$lib/graphql/request';
import { useRouter } from 'next/navigation';
import { useCommunityManageSpace } from './CommunityManageSpaceContext';

interface CommunityNewsletterProps {
  spaceIdOrSlug: string;
}

export function CommunityNewsletter({ spaceIdOrSlug }: CommunityNewsletterProps) {
  const router = useRouter();
  const ctx = useCommunityManageSpace();
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

  const { data: verificationData } = useQuery(GetSpaceVerificationSubmissionDocument, {
    variables: { space: ctx?.space._id || '' },
    skip: !ctx?.space._id,
    fetchPolicy: 'cache-and-network',
  });

  const isVerified =
    verificationData?.getSpaceVerificationSubmission?.state === SpaceVerificationState.Approved;

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
          
          {isVerified ? (
            <Button
              size="sm"
              variant="secondary"
              iconLeft="icon-plus"
              className="w-fit shrink-0"
              loading={creatingNewsletter}
              onClick={() =>
                ctx?.space._id &&
                createNewsletter({
                  variables: {
                    input: {
                      space: ctx.space._id,
                      draft: true,
                    },
                  },
                })
              }
            >
              New Draft
            </Button>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-md border border-card-border px-4 py-3 backdrop-blur-md bg-warning-300/16">
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
          )}
        </section>

        <Divider />

        <section className="flex flex-col gap-5">
          <h3 className="text-xl font-semibold">Published</h3>

          <div className="flex flex-col items-center justify-center gap-5 py-12 md:py-20 text-tertiary">
            <i aria-hidden="true" className="icon-email-open size-44 md:size-[184px] text-quaternary" />

            <div className="space-y-2 text-center max-w-xl">
              <h4 className="text-xl font-semibold font-title">No Newsletters</h4>
              <p>Tell your subscribers about your events and what is happening.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
