import { useState } from 'react';

import { Button, Input, LabeledInput, modal, ModalContent, Toggle } from '$lib/components/core';
import { Event, UpdateEventSettingsDocument } from '$lib/graphql/generated/backend/graphql';
import { useMutation } from '$lib/graphql/request';
import { useUpdateEvent } from '../store';

export function LimitsAndRestrictions({ event }: { event: Event }) {
  return (
    <div className="flex md:grid grid-cols-4 gap-2 overflow-auto no-scrollbar">
      <div
        className="flex items-center py-2 px-3 gap-3 rounded-md border border-card-border bg-card cursor-pointer min-w-fit"
        onClick={() => {
          modal.open(RegistrationModal, {
            props: {
              event,
            },
          });
        }}
      >
        <div className="size-[38px] flex items-center justify-center rounded-sm bg-success-500/16">
          <i className="icon-ticket text-success-500" />
        </div>
        <div>
          <p>Registration</p>
          <p className="text-sm text-tertiary">{event.registration_disabled ? 'Closed' : 'Open'}</p>
        </div>
      </div>

      <div
        className="flex items-center py-2 px-3 gap-3 rounded-md border border-card-border bg-card cursor-pointer min-w-fit"
        onClick={() => {
          modal.open(ApprovalModal, {
            props: {
              event,
            },
          });
        }}
      >
        <div className="size-[38px] flex items-center justify-center rounded-sm bg-warning-300/16">
          <i className="icon-list-check text-warning-300" />
        </div>
        <div>
          <p>Require Approval</p>
          <p className="text-sm text-tertiary">{event.approval_required ? 'On' : 'Off'}</p>
        </div>
      </div>

      <div
        className="flex items-center py-2 px-3 gap-3 rounded-md border border-card-border bg-card cursor-pointer min-w-fit"
        onClick={() => {
          modal.open(CapacityModal, {
            props: {
              event,
            },
          });
        }}
      >
        <div className="size-[38px] flex items-center justify-center rounded-sm bg-[#FB923C]/16">
          <i className="icon-vertical-align-top text-[#FB923C]" />
        </div>
        <div>
          <p>Event Capacity</p>
          <p className="text-sm text-tertiary">{event.guest_limit || 'Unlimited'}</p>
        </div>
      </div>
    </div>
  );
}

function RegistrationModal({ event }: { event: Event }) {
  const [acceptRegistration, setAcceptRegistration] = useState(!event.registration_disabled);
  const updateEvent = useUpdateEvent();

  const [update, { loading }] = useMutation(UpdateEventSettingsDocument, {
    onComplete: () => {
      modal.close();
      updateEvent({
        registration_disabled: !acceptRegistration,
      });
    },
  });

  const handleConfirm = async () => {
    await update({
      variables: {
        id: event._id,
        input: {
          registration_disabled: !acceptRegistration,
        },
      },
    });
  };

  return (
    <ModalContent icon="icon-ticket" onClose={() => modal.close()}>
      <div className="space-y-4">
        <div className="space-y-2">
          <p>Registration</p>
          <p className="text-sm text-secondary">
            Close registration to stop accepting new guests, including anyone who may have been invited.
          </p>
          <p className="text-sm text-secondary">
            Please note that capacity and availability settings apply when registration is open.
          </p>
        </div>

        <div className="flex items-center justify-between">
          <p>Accept Registration</p>
          <Toggle
            id="accept-registration"
            checked={acceptRegistration}
            onChange={() => setAcceptRegistration(!acceptRegistration)}
          />
        </div>

        <Button variant="secondary" className="w-full" onClick={handleConfirm} loading={loading}>
          Confirm
        </Button>
      </div>
    </ModalContent>
  );
}

function ApprovalModal({ event }: { event: Event }) {
  const [requireApproval, setRequireApproval] = useState(!!event.approval_required);
  const updateEvent = useUpdateEvent();

  const [update, { loading }] = useMutation(UpdateEventSettingsDocument, {
    onComplete: () => {
      modal.close();
      updateEvent({
        approval_required: requireApproval,
      });
    },
  });

  const handleConfirm = async () => {
    await update({
      variables: {
        id: event._id,
        input: {
          approval_required: requireApproval,
        },
      },
    });
  };

  return (
    <ModalContent icon="icon-list-check" onClose={() => modal.close()}>
      <div className="space-y-4">
        <div className="space-y-2">
          <p>Require Approval</p>
          <p className="text-sm text-secondary">
            Manually review and approve each guest before they can join your event. Great for curating your audience.
          </p>
        </div>

        <div className="flex items-center justify-between">
          <p>Require Host Approval</p>
          <Toggle
            id="accept-registration"
            checked={requireApproval}
            onChange={() => setRequireApproval(!requireApproval)}
          />
        </div>

        <Button variant="secondary" className="w-full" onClick={handleConfirm} loading={loading}>
          Confirm
        </Button>
      </div>
    </ModalContent>
  );
}

function CapacityModal({ event }: { event: Event }) {
  const [limit, setLimit] = useState(event.guest_limit || undefined);
  const updateEvent = useUpdateEvent();

  const [update, { loading }] = useMutation(UpdateEventSettingsDocument, {
    onComplete: (_, res) => {
      modal.close();
      updateEvent({
        guest_limit: res.updateEvent?.guest_limit,
      });
    },
  });

  const handleConfirm = async () => {
    await update({
      variables: {
        id: event._id,
        input: {
          guest_limit: limit,
        },
      },
    });
  };

  return (
    <ModalContent icon="icon-vertical-align-top" onClose={() => modal.close()}>
      <div className="space-y-4">
        <div className="space-y-2">
          <p>Max Capacity</p>
          <p className="text-sm text-secondary">
            Auto-close registration when the capacity is reached. Only approved guests count toward the cap.
          </p>
        </div>

        <LabeledInput label="Capacity">
          <Input type="number" value={limit} onChange={(e) => setLimit(e.target.valueAsNumber)} variant="outlined" />
        </LabeledInput>

        <div className="flex gap-2">
          <Button
            variant="tertiary"
            className="w-full"
            onClick={() => {
              setLimit(undefined);
              update({
                variables: {
                  id: event._id,
                  input: {
                    guest_limit: null,
                  },
                },
              });
            }}
            loading={loading && !limit}
            disabled={loading}
          >
            Remove Limit
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            onClick={handleConfirm}
            loading={loading && !!limit}
            disabled={loading}
          >
            Set Limit
          </Button>
        </div>
      </div>
    </ModalContent>
  );
}
