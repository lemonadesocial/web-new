'use client';

import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

import { Avatar, Button, Chip, toast } from '$lib/components/core';
import {
  Event,
  GetTicketDocument,
  Ticket,
  UpdateEventCheckinsMutationDocument,
} from '$lib/graphql/generated/backend/graphql';
import { useMutation, useQuery } from '$lib/graphql/request';
import { randomUserImage } from '$lib/utils/user';
import { ModalContent } from '$lib/components/core/dialog/modal';
import { format } from 'date-fns';

interface TicketCheckInModalProps {
  event: Event;
  shortId: string;
  onClose: () => void;
}

export function TicketCheckInModal({ event, shortId, onClose }: TicketCheckInModalProps) {
  const [checkingInShortids, setCheckingInShortids] = useState<Set<string>>(new Set());

  const { data, refetch } = useQuery(GetTicketDocument, {
    variables: { shortid: shortId },
    onComplete(data) {
      const ticket = data?.getTicket as Ticket | undefined;
      if (!ticket || ticket.event !== event._id) {
        toast.error('This QR code is not valid for this event.');
        onClose();
      }
    },
  });

  const [updateCheckins] = useMutation(UpdateEventCheckinsMutationDocument, {
    onComplete() {
      setCheckingInShortids(new Set());
      refetch();
    },
    onError(error) {
      setCheckingInShortids(new Set());
      toast.error(error.message);
    },
  });

  const ticket = data?.getTicket as Ticket | undefined;

  if (ticket?.event !== event._id) {
    return null;
  }

  const assignee = ticket?.assigned_to_expanded || ticket?.assignee_expanded || ticket?.acquired_expanded;
  const assigneeEmail = assignee?.email || ticket?.assigned_email || ticket?.acquired_by_email;
  const assigneeName = assignee?.name || ticket?.metadata?.buyer_name || '';

  const ticketGroup = ticket ? [ticket, ...(ticket.acquired_tickets || [])] : [];
  const isAllCheckedIn = ticketGroup.every((t) => t.checkin?.active || false);
  const uncheckedTicketsCount = ticketGroup.filter((t) => !t.checkin?.active).length;
  const showCheckInAllButton = !isAllCheckedIn && uncheckedTicketsCount > 1;

  const handleCheckIn = (shortid: string) => {
    setCheckingInShortids(new Set([shortid]));
    updateCheckins({
      variables: {
        input: {
          shortids: [shortid],
          active: true,
        },
      },
    });
  };

  const handleCheckInAll = () => {
    const uncheckedShortids = ticketGroup.filter((t) => !t.checkin?.active).map((t) => t.shortid);
    setCheckingInShortids(new Set(uncheckedShortids));
    updateCheckins({
      variables: {
        input: {
          shortids: uncheckedShortids,
          active: true,
        },
      },
    });
  };

  if (!ticket) {
    return null;
  }

  return (
    <ModalContent className="w-[480px] p-0">
      <div className="flex items-center gap-3 py-3 px-4 border-b">
        <Avatar
          src={assignee?.image_avatar || randomUserImage(assigneeEmail || '')}
          className="size-12"
        />
        <div className="flex-1">
          <p>{assigneeName}</p>
          <p className="text-tertiary text-sm">{assigneeEmail}</p>
        </div>
        <Chip variant="success" size="s" className="rounded-sm">
          Going
        </Chip>
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between">
          <p className="font-medium">Tickets</p>
          {showCheckInAllButton && (
            <Button
              variant="secondary"
              className="rounded-full"
              size="sm"
              onClick={handleCheckInAll}
              disabled={checkingInShortids.size > 0}
            >
              Check In All
            </Button>
          )}
        </div>

        <div className="rounded-sm border divide-y divide-(--color-divider)">
          {ticketGroup.map((t, index) => {
            const isCheckedIn = t.checkin?.active || false;
            const checkInUser = t.checkin?.updated_by_expanded;

            return (
              <div
                key={t._id || index}
                className="flex items-center justify-between p-3"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-6 flex-shrink-0">
                    <p className="text-tertiary">#{index + 1}</p>
                  </div>
                  <div className="flex-1">
                    <p>
                      {t.type_expanded?.title || 'Unknown'}
                    </p>
                    {isCheckedIn && t.checkin?.created_at && (
                      <p className="text-tertiary text-sm">
                        Checked in {formatDistanceToNow(new Date(t.checkin.created_at), { addSuffix: true })}
                        {checkInUser?.name && ` by ${checkInUser.name}`}
                      </p>
                    )}
                  </div>
                </div>
                {!isCheckedIn && (
                  <Button
                    variant="tertiary"
                    className="rounded-full"
                    size="sm"
                    onClick={() => handleCheckIn(t.shortid)}
                    loading={checkingInShortids.has(t.shortid)}
                  >
                    Check In
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {ticket.created_at && (
        <div className="border-t px-4 py-3">
          <p className="text-xs text-tertiary">Registered</p>
          <p className="text-sm text-tertiary">{format(new Date(ticket.created_at), 'MMM d, h:mm a')}</p>
        </div>
      )}
    </ModalContent>
  );
}
