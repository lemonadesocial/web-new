'use client';

import React from 'react';

import { Button } from '$lib/components/core/button/button';
import { modal } from '$lib/components/core/dialog/modal';
import { SendSpaceNewsletterTestEmailsDocument } from '$lib/graphql/generated/backend/graphql';
import { useMutation } from '$lib/graphql/request';
import { useMe } from '$lib/hooks/useMe';
import { isValidEmail } from '$lib/utils/string';
import { toast } from '$lib/components/core/toast/toast';

function EmailChipInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (emails: string[]) => void;
}) {
  const [draftValue, setDraftValue] = React.useState('');

  const addEmail = React.useCallback(() => {
    const nextValue = draftValue.trim().replace(/,$/, '');
    if (!nextValue || value.includes(nextValue)) {
      setDraftValue('');
      return;
    }

    onChange([...value, nextValue]);
    setDraftValue('');
  }, [draftValue, onChange, value]);

  const removeEmail = (email: string) => {
    onChange(value.filter((item) => item !== email));
  };

  return (
    <label className="flex min-h-10 w-full cursor-text flex-wrap items-center gap-1 rounded-sm border border-primary/8 bg-background/64 p-1">
      {value.map((email) => (
        <div key={email} className="flex h-8 shrink-0 items-center gap-1.5 rounded-xs bg-primary/8 px-2.5 py-1.5">
          <span className="text-sm font-medium">{email}</span>
          <button
            type="button"
            className="text-tertiary transition hover:text-primary"
            onClick={(event) => {
              event.stopPropagation();
              removeEmail(email);
            }}
          >
            <i aria-hidden="true" className="icon-x size-4" />
          </button>
        </div>
      ))}

      <input
        type="email"
        value={draftValue}
        placeholder={value.length === 0 ? 'name@email.com' : ''}
        className={
          value.length === 0
            ? 'h-8 min-w-[120px] flex-1 bg-transparent px-2 py-1 text-sm font-medium outline-none placeholder:text-quaternary'
            : 'h-8 min-w-12 flex-[1_1_48px] bg-transparent px-2 py-1 text-sm font-medium outline-none placeholder:text-quaternary'
        }
        onChange={(event) => setDraftValue(event.target.value)}
        onBlur={addEmail}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === 'Tab' || event.key === ',') {
            event.preventDefault();
            addEmail();
          }

          if (event.key === 'Backspace' && !draftValue && value.length > 0) {
            event.preventDefault();
            removeEmail(value[value.length - 1]);
          }
        }}
      />
    </label>
  );
}

export function SendNewsletterPreviewModal({
  draftId,
  spaceId,
  subject,
  body,
}: {
  draftId: string;
  spaceId: string;
  subject: string;
  body: string;
}) {
  const me = useMe();
  const [emails, setEmails] = React.useState<string[]>(() => (me?.email ? [me.email] : []));
  const [error, setError] = React.useState<string | null>(null);

  const [sendPreview, { loading }] = useMutation(SendSpaceNewsletterTestEmailsDocument, {
    onComplete: () => {
      toast.success('Preview sent successfully');
      modal.close();
    },
    onError: () => {
      toast.error('Unable to send preview');
    },
  });

  const handleSend = async () => {
    if (emails.length === 0 || emails.some((email) => !isValidEmail(email))) {
      setError('Enter at least one valid email address.');
      return;
    }

    setError(null);

    await sendPreview({
      variables: {
        input: {
          _id: draftId,
          space: spaceId,
          custom_subject_html: subject,
          custom_body_html: body,
          test_recipients: emails,
        },
      },
    });
  };

  return (
    <div className="w-[340px] max-w-full p-4">
      <div className="space-y-4">
        <div className="flex size-14 items-center justify-center rounded-full bg-primary/8 text-tertiary">
          <i aria-hidden="true" className="icon-email size-8" />
        </div>

        <div className="space-y-2">
          <p className="text-lg font-medium">Send Preview</p>
          <p className="text-sm text-secondary">Enter the email addresses you&apos;d like to send this preview to.</p>
        </div>

        <div className="space-y-2">
          <EmailChipInput value={emails} onChange={setEmails} />
          {error && <p className="text-sm text-danger-400">{error}</p>}
        </div>

        <Button type="button" size="base" variant="secondary" className="w-full" loading={loading} onClick={handleSend}>
          Send Preview
        </Button>
      </div>
    </div>
  );
}
