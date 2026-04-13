'use client';

import Link from 'next/link';
import React from 'react';

import {
  CreateSpaceVerificationSubmissionDocument,
  GetSpaceDocument,
  GetSpaceVerificationSubmissionDocument,
  Space,
  SpaceVerificationState,
} from '$lib/graphql/generated/backend/graphql';
import { useMutation, useQuery } from '$lib/graphql/request';
import { generateUrl } from '$lib/utils/cnd';
import { isObjectId } from '$lib/utils/helpers';
import { Button } from '$lib/components/core/button/button';
import { drawer } from '$lib/components/core/dialog';
import { Checkbox } from '$lib/components/core/input/checkbox';
import { InputField } from '$lib/components/core/input/input-field';
import { TextAreaField } from '$lib/components/core/input/textarea';
import { Pane } from '$lib/components/core/pane/pane';
import { toast } from '$lib/components/core/toast/toast';
import { VerificationSubmissionStatusCard } from './VerificationSubmissionStatusCard';

export function VerifyCommunityPane({ uid }: { uid: string }) {
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
  const form = useVerifyCommunityForm({
    space,
    enabled: !!space && !loadingVerification && !showHistory,
    onCompleted: async () => {
      setForceVerify(false);
      const result = await refetch();
      const nextSubmission = result.data?.getSpaceVerificationSubmission;

      if (
        nextSubmission &&
        nextSubmission.state !== SpaceVerificationState.Approved &&
        nextSubmission.state !== SpaceVerificationState.Rejected
      ) {
        drawer.close();
      }
    },
  });

  return (
    <Pane.Root>
      <Pane.Header.Root>
        <Pane.Header.Left className="flex items-center gap-3">
          <p className="truncate pt-1 text-base font-medium">Verify Community</p>
        </Pane.Header.Left>
      </Pane.Header.Root>

      <Pane.Content className="overflow-auto p-4">
        <div className="flex flex-col gap-6 pb-6">
          <div className="space-y-1">
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

          {!!space && !loadingVerification && showHistory && !!verificationSubmission && (
            <VerificationSubmissionStatusCard
              submission={verificationSubmission}
              onRejectedAction={() => setForceVerify(true)}
            />
          )}

          {!!space && !loadingVerification && !showHistory && (
            <VerifyCommunityFormFields
              formId={form.formId}
              space={space}
              values={form.values}
              errors={form.errors}
              recipientsNumber={form.recipientsNumber}
              onChangeValue={form.onChangeValue}
              onToggleValue={form.onToggleValue}
              onSubmit={form.onSubmit}
            />
          )}
        </div>
      </Pane.Content>

      {!!space && !loadingVerification && !showHistory && (
        <Pane.Footer>
          <div className="border-t border-card-border p-4">
            <Button
              form={form.formId}
              type="submit"
              variant="secondary"
              iconLeft="icon-done"
              className="w-full justify-center"
              loading={form.loading}
              disabled={!form.canSubmit || form.loading}
            >
              Submit Request
            </Button>
          </div>
        </Pane.Footer>
      )}
    </Pane.Root>
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

function useVerifyCommunityForm({
  space,
  enabled,
  onCompleted,
}: {
  space?: Space;
  enabled: boolean;
  onCompleted: () => Promise<void> | void;
}) {
  const [values, setValues] = React.useState<FormValues>({
    number_of_recipients: '',
    event_info: '',
    guests_info: '',
    confirmation_1: false,
    confirmation_2: false,
  });
  const [errors, setErrors] = React.useState<FormErrors>({});
  const formId = React.useId();

  const [createVerificationSubmission, { loading }] = useMutation(CreateSpaceVerificationSubmissionDocument, {
    onComplete: async () => {
      toast.success('Verification request sent!');
      await onCompleted();
    },
    onError: () => {
      toast.error('Failed to send verification request');
    },
  });

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

    if (!enabled || !space || !validate()) {
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

  const onChangeValue = React.useCallback((field: keyof FormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  const onToggleValue = React.useCallback((field: 'confirmation_1' | 'confirmation_2', checked: boolean) => {
    setValues((prev) => ({ ...prev, [field]: checked }));
  }, []);

  return {
    canSubmit,
    errors,
    formId,
    loading,
    onChangeValue,
    onSubmit,
    onToggleValue,
    recipientsNumber,
    values,
  };
}

function VerifyCommunityFormFields({
  formId,
  space,
  values,
  errors,
  recipientsNumber,
  onChangeValue,
  onToggleValue,
  onSubmit,
}: {
  formId: string;
  space: Space;
  values: FormValues;
  errors: FormErrors;
  recipientsNumber: number;
  onChangeValue: (field: 'number_of_recipients' | 'event_info' | 'guests_info', value: string) => void;
  onToggleValue: (field: 'confirmation_1' | 'confirmation_2', checked: boolean) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
}) {
  const completedInfo = !!space.image_avatar_expanded && !!space.description;

  return (
    <form id={formId} onSubmit={onSubmit} className="max-w-128 w-full flex flex-col gap-6">
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
          onChangeText={(value) => onChangeValue('number_of_recipients', value)}
          error={!!errors.number_of_recipients}
        />
        {errors.number_of_recipients && <p className="text-sm text-danger-400">{errors.number_of_recipients}</p>}
        {recipientsNumber > 500 && (
          <div className="border-l-2 border-warning-300 pl-3.5">
            <p className="text-sm text-warning-300">
              You can send up to 500 invites or newsletters per week once you verify your calendar. Need more? You can{' '}
              <Link href={`/upgrade/${space._id}`} className="text-accent-400 hover:text-accent-300 transition-colors">
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
          onChangeText={(value) => onChangeValue('event_info', value)}
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
          onChangeText={(value) => onChangeValue('guests_info', value)}
        />
        {errors.guests_info && <p className="text-sm text-danger-400">{errors.guests_info}</p>}
      </label>

      <div className="space-y-4">
        <div className="space-y-1">
          <Checkbox
            id="confirmation_1"
            value={values.confirmation_1}
            onChange={(event) => onToggleValue('confirmation_1', event.target.checked)}
          >
            <span>I confirm I will not import or contact people with inactive email addresses or who have unsubscribed.</span>
          </Checkbox>
          {errors.confirmation_1 && <p className="text-sm text-danger-400">{errors.confirmation_1}</p>}
        </div>

        <div className="space-y-1">
          <Checkbox
            id="confirmation_2"
            value={values.confirmation_2}
            onChange={(event) => onToggleValue('confirmation_2', event.target.checked)}
          >
            <span>I confirm that I will only message people who have opted in and consented to receiving emails.</span>
          </Checkbox>
          {errors.confirmation_2 && <p className="text-sm text-danger-400">{errors.confirmation_2}</p>}
        </div>
      </div>
    </form>
  );
}
