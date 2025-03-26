import React, { useEffect } from 'react';
import { useAtom as useJotaiAtom } from 'jotai';

import { Event, GetEventInvitationDocument, GetEventTicketTypesDocument, PurchasableTicketType } from '$lib/generated/backend/graphql';
import { useQuery } from '$lib/request';
import { Card, SkeletonBox } from '$lib/components/core';

import { approvalRequiredAtom, eventAtom, hasSingleFreeTicketAtom, ticketLimitAtom, ticketTypesAtom, useAtom, useAtomValue, useSetAtom } from './store';
import { sessionAtom } from '$lib/jotai';
import { EventRegistrationStoreProvider } from './context';

const EventRegistrationContent: React.FC = () => {

  const approvalRequired = useAtomValue(approvalRequiredAtom);
  const ticketLimit = useAtomValue(ticketLimitAtom);
  const hasSingleFreeTicket = useAtomValue(hasSingleFreeTicketAtom);

  return (
    <Card.Root>
      <Card.Header title={hasSingleFreeTicket ? 'Registration' : 'Get Tickets'} className="text-sm" />
      {!!(approvalRequired || ticketLimit) && (
        <div className='p-3 flex flex-col gap-3 border border-tertiary/[0.04]'>
          {
            !!ticketLimit && (
              <div className='flex gap-3 items-center'>
                <div className='rounded-sm bg-tertiary/[.04] h-[28] w-[28] flex items-center justify-center'>
                  <i className='icon-alarm size-4 text-tertiary/[.56]' />
                </div>
                <div>
                  <p className='font-medium'>Limited Spots Remaining</p>
                  <p className='text-sm text-tertiary/[.8]'>Hurry up and register before the event fills up!</p>
                </div>
              </div>
            )
          }
          {
            approvalRequired && (
              <div className='flex gap-3 items-center'>
                <div className='rounded-sm bg-tertiary/[.04] h-[28] w-[28] flex items-center justify-center'>
                  <i className='icon-list-check size-4 text-tertiary/[.56]' />
                </div>
                <div>
                  <p className='font-medium'>Approval required</p>
                  <p className='text-sm text-tertiary/[.8]'>Your registration is subject to approval by the host.</p>
                </div>
              </div>
            )
          }
        </div>
      )}
      <div className='flex flex-col gap-4 p-4'>
        <p className='font-medium'>
          {hasSingleFreeTicketAtom ? 'Welcome! To join the event, please register below.' : 'Welcome! To join the event, please get your ticket below.'}
        </p>
      </div>
    </Card.Root>
  );
};

const BaseEventRegistration: React.FC<{ event: Event }> = ({ event: initialEvent }) => {
  const [event, setEvent] = useAtom(eventAtom);
  const setApprovalRequired = useSetAtom(approvalRequiredAtom);
  const [session] = useJotaiAtom(sessionAtom);
  const setTicketTypes = useSetAtom(ticketTypesAtom);
  const setTicketLimit = useSetAtom(ticketLimitAtom);

  useEffect(() => {
    setEvent(initialEvent);
  }, [initialEvent, setEvent]);

  const { data: inviteData, loading: loadingInvitation } = useQuery(GetEventInvitationDocument, {
    variables: { event: initialEvent._id },
    skip: !session || !initialEvent.approval_required,
  });

  const { loading: loadingTicketTypes } = useQuery(GetEventTicketTypesDocument, {
    variables: { event: initialEvent._id },
    onComplete(data) {
      setTicketTypes(data.getEventTicketTypes.ticket_types as PurchasableTicketType[]);
      setTicketLimit(data.getEventTicketTypes.ticket_types.reduce((acc, ticketType) => acc + ticketType.limit, 0));
    },
  });

  React.useEffect(() => {
    if (!initialEvent.approval_required) return;

    if (!inviteData?.getEventInvitation?._id) {
      setApprovalRequired(true);
      return;
    }

    const hosts = [initialEvent.host, ...(initialEvent.cohosts || [])];
    const invited = inviteData.getEventInvitation.inviters.some((inviter) => hosts.includes(inviter));
    setApprovalRequired(!invited);
  }, [inviteData, initialEvent, setApprovalRequired]);

  if (!event) return null;

  if (loadingInvitation || loadingTicketTypes) return <SkeletonBox rows={4} />;

  return <EventRegistrationContent />;
};

export const EventRegistration: React.FC<{ event: Event }> = ({ event }) => (
  <EventRegistrationStoreProvider>
    <BaseEventRegistration event={event} />
  </EventRegistrationStoreProvider>
);
