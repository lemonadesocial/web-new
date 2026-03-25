'use client';

import Link from 'next/link';
import React from 'react';
import { format } from 'date-fns';

import {
  CreateSpaceVerificationSubmissionDocument,
  GetSpaceDocument,
  GetSpaceVerificationSubmissionDocument,
  Space,
  SpaceVerificationState,
  SpaceVerificationSubmission,
} from '$lib/graphql/generated/backend/graphql';
import { useMutation, useQuery } from '$lib/graphql/request';
import { generateUrl } from '$lib/utils/cnd';
import { isObjectId } from '$lib/utils/helpers';
import { Button } from '$lib/components/core/button/button';
import { Checkbox } from '$lib/components/core/input/checkbox';
import { InputField } from '$lib/components/core/input/input-field';
import { TextAreaField } from '$lib/components/core/input/textarea';
import { toast } from '$lib/components/core/toast/toast';
import Header from '$lib/components/layouts/header';

function getVerificationStatusInfo(submission: SpaceVerificationSubmission): {
  icon: string;
  iconBg: string;
  title: string;
  description: string;
  actionLabel?: string;
} {
  if (submission.state === SpaceVerificationState.Approved) {
    return {
      icon: 'icon-check text-success-500',
      iconBg: 'bg-success-500/16',
      title: 'Verification Request Approved',
      description: 'Your community has been verified and you can now enjoy higher invite and newsletter limits.',
    };
  }

  if (submission.state === SpaceVerificationState.Rejected) {
    return {
      icon: 'icon-x text-danger-400',
      iconBg: 'bg-danger-400/16',
      title: 'Verification Request Not approved',
      description: 'We were unable to verify your community. Please make sure you provide accurate information.',
      actionLabel: 'Submit Another Request',
    };
  }

  return {
    icon: 'icon-email text-tertiary',
    iconBg: 'bg-(--btn-tertiary)',
    title: 'Verification Request Received',
    description: `We received your application on ${format(
      new Date(submission.updated_at || submission.created_at),
      'd MMMM',
    )}. We process most submissions within 30 minutes and all submissions within 12 hours.`,
  };
}

export function VerifyCommunityPage({ uid }: { uid: string }) {
  const [forceVerify, setForceVerify] = React.useState(false);

  const spaceVariables = isObjectId(uid) ? { id: uid, slug: uid } : { slug: uid };
  const { data: dataGetSpace, loading: loadingSpace } = useQuery(GetSpaceDocument, {
    variables: spaceVariables,
    skip: !uid,
    fetchPolicy: 'cache-and-network',
  });

  const space = dataGetSpace?.getSpace as Space | undefined;

  const { data: verificationData, loading: loadingVerification, refetch } = useQuery(
    GetSpaceVerificationSubmissionDocument,
    {
      variables: { space: space?._id || '' },
      skip: !space?._id,
      fetchPolicy: 'cache-and-network',
    },
  );

  const verificationSubmission = verificationData?.getSpaceVerificationSubmission || null;
  const showHistory = !!verificationSubmission && !forceVerify;
  const statusInfo = verificationSubmission ? getVerificationStatusInfo(verificationSubmission) : null;

  return (
    <main className="h-dvh overflow-auto">
      <Header />
      <div className="page bg-transparent! mx-auto py-7 px-4 md:px-0">
        <div className="flex flex-col gap-8 pb-20">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold font-title">Verify Community</h1>
            <p className="text-tertiary">
              In order to increase your invite and newsletter limits, please share some information about your planned
              events and contacts.
            </p>
          </div>

          {(loadingSpace || loadingVerification) && (
            <div className="flex items-center gap-2 text-tertiary">
              <i aria-hidden="true" className="icon-loader size-5 animate-spin" />
              <p>Loading verification details...</p>
            </div>
          )}

          {!loadingSpace && !space && (
            <div className="max-w-128 rounded-md border border-card-border bg-card px-4 py-3 flex items-center gap-3">
              <i aria-hidden="true" className="icon-alert-outline size-9 text-warning-400" />
              <div className="space-y-0.5">
                <p>Community Not Found</p>
                <p className="text-sm text-tertiary">We couldn&apos;t find a community for this verification request.</p>
              </div>
            </div>
          )}

          {!!space && !loadingVerification && showHistory && !!statusInfo && (
            <div className="rounded-lg border border-card-border bg-card p-4 flex flex-col gap-4">
              <div className={`size-14 rounded-full flex items-center justify-center ${statusInfo.iconBg}`}>
                <i aria-hidden="true" className={`${statusInfo.icon} size-8`} />
              </div>
              <div className="space-y-2">
                <p className="text-lg leading-6">{statusInfo.title}</p>
                <p className="text-sm text-secondary">{statusInfo.description}</p>
                {verificationSubmission.state === SpaceVerificationState.Rejected && (
                  <button
                    type="button"
                    className="text-sm text-accent-400 hover:text-accent-300 transition-colors"
                    onClick={() => setForceVerify(true)}
                  >
                    {statusInfo.actionLabel}
                  </button>
                )}
              </div>
            </div>
          )}

          {!!space && !loadingVerification && !showHistory && (
            <VerifyCommunityForm
              space={space}
              onCompleted={async () => {
                setForceVerify(false);
                await refetch();
              }}
            />
          )}
        </div>
      </div>
    </main>
  );
}

type FormValues = {
  number_of_recipients: string;
  event_info: string;
  guests_info: string;
  confirmation_1: boolean;
  confirmation_2: boolean;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

function VerifyCommunityForm({ space, onCompleted }: { space: Space; onCompleted: () => Promise<void> | void }) {
  const [values, setValues] = React.useState<FormValues>({
    number_of_recipients: '',
    event_info: '',
    guests_info: '',
    confirmation_1: false,
    confirmation_2: false,
  });
  const [errors, setErrors] = React.useState<FormErrors>({});

  const [createVerificationSubmission, { loading }] = useMutation(CreateSpaceVerificationSubmissionDocument, {
    onComplete: async () => {
      toast.success('Verification request sent!');
      await onCompleted();
    },
    onError: () => {
      toast.error('Failed to send verification request');
    },
  });

  const completedInfo = !!space.image_avatar_expanded && !!space.description;
  const recipientsNumber = Number(values.number_of_recipients);
  const canSubmit =
    Number.isFinite(recipientsNumber) &&
    recipientsNumber > 0 &&
    !!values.event_info.trim() &&
    !!values.guests_info.trim() &&
    values.confirmation_1 &&
    values.confirmation_2;

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!values.number_of_recipients || Number.isNaN(recipientsNumber) || recipientsNumber <= 0) {
      nextErrors.number_of_recipients = 'Please enter a valid number.';
    }

    if (!values.event_info.trim()) {
      nextErrors.event_info = 'Please share information about your events.';
    }

    if (!values.guests_info.trim()) {
      nextErrors.guests_info = 'Please share information about your guests.';
    }

    if (!values.confirmation_1) {
      nextErrors.confirmation_1 = 'Please confirm this requirement.';
    }

    if (!values.confirmation_2) {
      nextErrors.confirmation_2 = 'Please confirm this requirement.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    await createVerificationSubmission({
      variables: {
        input: {
          space: space._id,
          number_of_recipients: recipientsNumber,
          event_info: values.event_info.trim(),
          guests_info: values.guests_info.trim(),
          confirmation_1: values.confirmation_1,
          confirmation_2: values.confirmation_2,
        },
      },
    });
  };

  return (
    <form onSubmit={onSubmit} className="max-w-128 w-full flex flex-col gap-6">
      <div className="rounded-md border border-card-border bg-card px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-sm border border-card-border overflow-hidden shrink-0 bg-(--btn-tertiary) flex items-center justify-center">
            {space.image_avatar_expanded ? (
              <img
                alt={space.title || 'Space avatar'}
                className="size-full object-cover"
                src={generateUrl(space.image_avatar_expanded, { resize: { width: 72, height: 72, fit: 'cover' } })}
              />
            ) : (
              <i aria-hidden="true" className="icon-user-group-outline size-5 text-tertiary" />
            )}
          </div>

          <div className="space-y-0.5 min-w-0">
            <p className="text-xs text-tertiary">For Community</p>
            <p className="truncate">{space.title}</p>
          </div>
        </div>

        {!completedInfo && (
          <div className="mt-3 pl-12 space-y-3">
            <div className="border-t border-card-border" />
            <div className="space-y-2">
              <p className="text-sm text-tertiary">
                To ensure timely verification, please complete your community information with a profile picture and
                description.
              </p>
              <Link
                href={`/s/manage/${space.slug || space._id}/settings`}
                className="inline-flex items-center gap-1 text-sm text-accent-400 hover:text-accent-300 transition-colors"
              >
                <span>Complete Community Info</span>
                <i aria-hidden="true" className="icon-arrow-outward size-4.5" />
              </Link>
            </div>
          </div>
        )}
      </div>

      <label className="flex flex-col gap-3">
        <div className="space-y-1">
          <p>How many people would you like to invite or send newsletters to?</p>
          <p className="text-sm text-tertiary">
            Please share an estimate of the number of messages you plan to send at once.
          </p>
        </div>
        <InputField
          type="number"
          min={1}
          className="max-w-40"
          placeholder="100"
          value={values.number_of_recipients}
          onChangeText={(value) => setValues((prev) => ({ ...prev, number_of_recipients: value }))}
          error={!!errors.number_of_recipients}
        />
        {errors.number_of_recipients && <p className="text-sm text-danger-400">{errors.number_of_recipients}</p>}
        {recipientsNumber > 500 && (
          <div className="border-l-2 border-warning-300 pl-3.5">
            <p className="text-sm text-warning-300">
              You can send up to 500 invites or newsletters per week once you verify your calendar. Need more? You can{' '}
              <Link href={`/upgrade-to-pro?space=${space._id}`} className="text-accent-400 hover:text-accent-300 transition-colors">
                upgrade your plan
              </Link>
              .
            </p>
          </div>
        )}
      </label>

      <label className="flex flex-col gap-3">
        <div className="space-y-1">
          <p>Please share some information about your events.</p>
          <p className="text-sm text-tertiary">What kinds of events are you hosting? How often? How do you market them?</p>
        </div>
        <TextAreaField
          className="min-h-24"
          rows={4}
          value={values.event_info}
          onChangeText={(value) => setValues((prev) => ({ ...prev, event_info: value }))}
        />
        {errors.event_info && <p className="text-sm text-danger-400">{errors.event_info}</p>}
      </label>

      <label className="flex flex-col gap-3">
        <div className="space-y-1">
          <p>Please share some information about your guests.</p>
          <p className="text-sm text-tertiary">
            How did you build your contact list? Did people opt in to receiving emails?
          </p>
        </div>
        <TextAreaField
          className="min-h-24"
          rows={4}
          value={values.guests_info}
          onChangeText={(value) => setValues((prev) => ({ ...prev, guests_info: value }))}
        />
        {errors.guests_info && <p className="text-sm text-danger-400">{errors.guests_info}</p>}
      </label>

      <div className="space-y-4">
        <div className="space-y-1">
          <Checkbox
            id="confirmation_1"
            value={values.confirmation_1}
            onChange={(event) => setValues((prev) => ({ ...prev, confirmation_1: event.target.checked }))}
          >
            <span>I confirm I will not import or contact people with inactive email addresses or who have unsubscribed.</span>
          </Checkbox>
          {errors.confirmation_1 && <p className="text-sm text-danger-400">{errors.confirmation_1}</p>}
        </div>

        <div className="space-y-1">
          <Checkbox
            id="confirmation_2"
            value={values.confirmation_2}
            onChange={(event) => setValues((prev) => ({ ...prev, confirmation_2: event.target.checked }))}
          >
            <span>I confirm that I will only message people who have opted in and consented to receiving emails.</span>
          </Checkbox>
          {errors.confirmation_2 && <p className="text-sm text-danger-400">{errors.confirmation_2}</p>}
        </div>
      </div>

      <Button
        type="submit"
        size="sm"
        variant="secondary"
        iconLeft="icon-done"
        className="w-fit"
        loading={loading}
        disabled={!canSubmit || loading}
      >
        Submit Request
      </Button>
    </form>
  );
}
