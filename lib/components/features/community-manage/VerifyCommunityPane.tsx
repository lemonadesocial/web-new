'use client';

import Link from 'next/link';
import React from 'react';

import { CreateSpaceVerificationSubmissionDocument, Space } from '$lib/graphql/generated/backend/graphql';
import { useMutation } from '$lib/graphql/request';
import { generateUrl } from '$lib/utils/cnd';
import { Button } from '$lib/components/core/button/button';
import { drawer } from '$lib/components/core/dialog';
import { Checkbox } from '$lib/components/core/input/checkbox';
import { InputField } from '$lib/components/core/input/input-field';
import { TextAreaField } from '$lib/components/core/input/textarea';
import { Pane } from '$lib/components/core/pane/pane';
import { toast } from '$lib/components/core/toast/toast';

type VerifyCommunityPaneProps = {
  space: Space;
  onCompleted?: () => Promise<void> | void;
};

type FormValues = {
  number_of_recipients: string;
  event_info: string;
  guests_info: string;
  confirmation_1: boolean;
  confirmation_2: boolean;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

export function VerifyCommunityPane({ space, onCompleted }: VerifyCommunityPaneProps) {
  const [values, setValues] = React.useState<FormValues>({
    number_of_recipients: '',
    event_info: '',
    guests_info: '',
    confirmation_1: false,
    confirmation_2: false,
  });
  const [errors, setErrors] = React.useState<FormErrors>({});
  const formId = React.useId();

  const clearError = React.useCallback((field: keyof FormValues) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      return { ...prev, [field]: undefined };
    });
  }, []);

  const updateValue = React.useCallback(
    (field: 'number_of_recipients' | 'event_info' | 'guests_info', value: string) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      clearError(field);
    },
    [clearError],
  );

  const updateConfirmation = React.useCallback(
    (field: 'confirmation_1' | 'confirmation_2', checked: boolean) => {
      setValues((prev) => ({ ...prev, [field]: checked }));
      clearError(field);
    },
    [clearError],
  );

  const [createVerificationSubmission, { loading }] = useMutation(CreateSpaceVerificationSubmissionDocument, {
    onComplete: async () => {
      toast.success('Verification request sent!');
      drawer.close();
      await onCompleted?.();
    },
    onError: () => {
      toast.error('Failed to send verification request');
    },
  });

  const recipientsNumber = Number(values.number_of_recipients);

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!values.number_of_recipients || Number.isNaN(recipientsNumber) || recipientsNumber <= 0) {
      nextErrors.number_of_recipients = 'Enter a valid number.';
    }

    if (!values.event_info.trim()) {
      nextErrors.event_info = 'Please add a bit more detail.';
    }

    if (!values.guests_info.trim()) {
      nextErrors.guests_info = 'Please add a bit more detail.';
    }

    if (!values.confirmation_1) {
      nextErrors.confirmation_1 = 'Please confirm to continue.';
    }

    if (!values.confirmation_2) {
      nextErrors.confirmation_2 = 'Please confirm to continue.';
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

  const completedInfo = !!space.image_avatar_expanded && !!space.description;

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

          <form id={formId} onSubmit={onSubmit} className="max-w-128 w-full flex flex-col gap-6">
            <div className="rounded-md border border-card-border bg-card px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-sm border border-card-border overflow-hidden shrink-0 bg-(--btn-tertiary) flex items-center justify-center">
                  {space.image_avatar_expanded ? (
                    <img
                      alt={space.title || 'Space avatar'}
                      className="size-full object-cover"
                      src={generateUrl(space.image_avatar_expanded, {
                        resize: { width: 72, height: 72, fit: 'cover' },
                      })}
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

              {!completedInfo ? (
                <div className="mt-3 pl-12 space-y-3">
                  <div className="border-t border-card-border" />
                  <div className="space-y-2">
                    <p className="text-sm text-tertiary">
                      To ensure timely verification, please complete your community information with a profile picture
                      and description.
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
              ) : null}
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
                onChangeText={(value) => updateValue('number_of_recipients', value)}
                error={!!errors.number_of_recipients}
              />
              {errors.number_of_recipients ? <p className="text-sm text-danger-400">{errors.number_of_recipients}</p> : null}
              {recipientsNumber > 500 ? (
                <div className="border-l-2 border-warning-300 pl-3.5">
                  <p className="text-sm text-warning-300">
                    You can send up to 500 invites or newsletters per week once you verify your calendar. Need more? You
                    can{' '}
                    <Link href={`/upgrade/${space._id}`} className="text-accent-400 hover:text-accent-300 transition-colors">
                      upgrade your plan
                    </Link>
                    .
                  </p>
                </div>
              ) : null}
            </label>

            <label className="flex flex-col gap-3">
              <div className="space-y-1">
                <p>Please share some information about your events.</p>
                <p className="text-sm text-tertiary">
                  What kinds of events are you hosting? How often? How do you market them?
                </p>
              </div>
              <TextAreaField
                className="min-h-24"
                rows={4}
                value={values.event_info}
                onChangeText={(value) => updateValue('event_info', value)}
              />
              {errors.event_info ? <p className="text-sm text-danger-400">{errors.event_info}</p> : null}
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
                onChangeText={(value) => updateValue('guests_info', value)}
              />
              {errors.guests_info ? <p className="text-sm text-danger-400">{errors.guests_info}</p> : null}
            </label>

            <div className="space-y-4">
              <div className="space-y-1">
                <Checkbox
                  id="confirmation_1"
                  value={values.confirmation_1}
                  onChange={(event) => updateConfirmation('confirmation_1', event.target.checked)}
                >
                  <span>
                    I confirm I will not import or contact people with inactive email addresses or who have
                    unsubscribed.
                  </span>
                </Checkbox>
                {errors.confirmation_1 ? <p className="text-sm text-danger-400">{errors.confirmation_1}</p> : null}
              </div>

              <div className="space-y-1">
                <Checkbox
                  id="confirmation_2"
                  value={values.confirmation_2}
                  onChange={(event) => updateConfirmation('confirmation_2', event.target.checked)}
                >
                  <span>I confirm that I will only message people who have opted in and consented to receiving emails.</span>
                </Checkbox>
                {errors.confirmation_2 ? <p className="text-sm text-danger-400">{errors.confirmation_2}</p> : null}
              </div>
            </div>
          </form>
        </div>
      </Pane.Content>

      <Pane.Footer>
        <div className="border-t border-card-border p-4">
          <Button
            form={formId}
            type="submit"
            variant="secondary"
            iconLeft="icon-done"
            className="w-full justify-center"
            loading={loading}
          >
            Submit Request
          </Button>
        </div>
      </Pane.Footer>
    </Pane.Root>
  );
}
