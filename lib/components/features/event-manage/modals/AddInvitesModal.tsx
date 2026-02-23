import { useState } from 'react';

import { modal, Button, toast } from '$lib/components/core';
import { Event } from '$lib/graphql/generated/backend/graphql';
import { InviteEventDocument } from '$lib/graphql/generated/backend/graphql';
import { useMutation } from '$lib/graphql/request';

import { AddGuestsModal } from './AddGuestsModal';
import { useMe } from '$lib/hooks/useMe';

export function AddInvitesModal({
  emails,
  event,
  onBack,
  show = 'invites',
  title = 'Invite Guests',
}: {
  emails: string[];
  event: Event;
  onBack: () => void;
  show?: 'invites' | 'guests';
  title?: string;
}) {
  const me = useMe();
  const [inviteEvent, { loading }] = useMutation(InviteEventDocument);
  const [tab, setTab] = useState<'invites' | 'guests'>(show);
  const [message, setMessage] = useState('');

  const handleSendInvites = async () => {
    try {
      await inviteEvent({
        variables: {
          event: event._id,
          emails,
          custom_body_html: message,
        },
      });
      toast.success('Invites sent successfully!');
      modal.close();
    } catch (error: any) {
      toast.error(error.message || 'Failed to send invites');
    }
  };

  if (tab === 'guests')
    return (
      <AddGuestsModal
        title={title}
        emails={emails}
        event={event}
        onBack={onBack}
        onSelectInvite={() => setTab('invites')}
      />
    );

  return (
    <div className="w-full max-w-[448px]">
      <div className="flex justify-between py-3 px-4 border-b">
        <p className="text-lg">{title}</p>
        <Button icon="icon-x" size="xs" variant="tertiary" className="rounded-full" onClick={() => modal.close()} aria-label="Close" />
      </div>
      <div className="p-4 space-y-4">
        <div className="py-2.5 px-3.5 rounded-sm border bg-card">
          <p className="text-sm text-tertiary">
            Inviting {emails.length} {emails.length === 1 ? 'guest' : 'guests'}
          </p>
          <p className="truncate">{emails.join(', ')}</p>
        </div>

        <div className="rounded-sm border bg-card">
          <div className="py-2.5 px-3.5 border-b">
            <p>
              Hi, {me?.name} invites you to join {event.title}.
            </p>
          </div>
          <textarea
            value={message}
            className="w-full min-h-[80px] border-none outline-none font-medium placeholder:text-tertiary resize-none px-3.5 py-2.5 bg-white/8 block"
            placeholder="Add a custom message here..."
            onChange={(e) => setMessage(e.target.value)}
          />
          <p className="py-2.5 px-3.5">RSVP: lemonade.social/e/{event.shortid}</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-[34px] min-w-[34px] rounded-sm bg-primary/8">
              <i className="icon-ticket size-4.5 text-tertiary" />
            </div>
            <div>
              <p className="text-sm">We will send guests an invite link to register for the event.</p>
              <p className="text-sm text-tertiary">
                Guests will be automatically approved when they complete their registration.
              </p>
            </div>
          </div>
        </div>
        <hr className="border-t" />
        <p className="text-sm text-tertiary">
          You can bypass registration and payment by adding guests directly to the guest list.{' '}
          <button type="button" className="text-accent-500 cursor-pointer inline" onClick={() => setTab('guests')}>
            Add Guests Directly
          </button>
        </p>
      </div>
      <div className="flex justify-between py-3 px-4 border-t items-center">
        <Button iconLeft="icon-chevron-left" variant="tertiary" onClick={onBack} disabled={loading}>
          Back
        </Button>
        <Button iconLeft="icon-email" variant="secondary" onClick={handleSendInvites} loading={loading}>
          Send Invites
        </Button>
      </div>
    </div>
  );
}
