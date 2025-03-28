import React, { useEffect } from 'react';
import { useAtom as useJotaiAtom } from 'jotai';

import { Avatar, Card, SkeletonBox } from '$lib/components/core';

import { Event, GetEventInvitationDocument, GetEventTicketTypesDocument, PurchasableTicketType } from '$lib/generated/backend/graphql';
import { useQuery } from '$lib/request';
import { approvalRequiredAtom, eventAtom, hasSingleFreeTicketAtom, requiredProfileFieldsAtom, ticketLimitAtom, ticketTypesAtom, useAtom, useAtomValue, useSetAtom } from './store';
import { sessionAtom } from '$lib/jotai';
import { useMe } from '$lib/hooks/useMe';
import { userAvatar } from '$lib/utils/user';

import { EventRegistrationStoreProvider } from './context';
import { TicketSelect } from './TicketSelect';
import { RegisterButton } from './RegisterButton';

const EventRegistrationContent: React.FC = () => {
  const me = useMe();
  const approvalRequired = useAtomValue(approvalRequiredAtom);
  const ticketLimit = useAtomValue(ticketLimitAtom);
  const hasSingleFreeTicket = useAtomValue(hasSingleFreeTicketAtom);

  return (
    <Card.Root>
      <Card.Header>{hasSingleFreeTicket ? 'Registration' : 'Get Tickets'}</Card.Header>
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
        <TicketSelect />
        <p className='font-medium'>
          {hasSingleFreeTicket ? 'Welcome! To join the event, please register below.' : 'Welcome! To join the event, please get your ticket below.'}
        </p>
        {
          me && (
            <div className='flex gap-2 items-center'>
              <Avatar src={userAvatar(me)} className='size-5' />
              <p className='font-medium'>{me.name}</p>
              <p className='font-medium text-tertiary/80'>{me.email}</p>
            </div>
          )
        }
        <RegisterButton />
      </div>
    </Card.Root>
  );
};

const BaseEventRegistration: React.FC<{ event: Event }> = ({ event: initialEvent }) => {
  const [event, setEvent] = useAtom(eventAtom);
  const setApprovalRequired = useSetAtom(approvalRequiredAtom);
  const setTicketTypes = useSetAtom(ticketTypesAtom);
  const setTicketLimit = useSetAtom(ticketLimitAtom);
  const setRequiredProfileFields = useSetAtom(requiredProfileFieldsAtom);

  const [session] = useJotaiAtom(sessionAtom);
  const me = useMe();

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

  React.useEffect(() => {
    const requireFields = initialEvent.application_profile_fields || [];

    if (!me?._id) {
      setRequiredProfileFields(requireFields);
      return;
    }

    if (!me.email && !requireFields.some(field => field.field === 'email')) {
      requireFields.push({ field: 'email', required: true });
    }

    if (!me.display_name && !requireFields.some(field => field.field === 'display_name')) {
      requireFields.push({ field: 'display_name', required: true });
    }

    setRequiredProfileFields(requireFields);
  }, [initialEvent, me]);

  if (!event) return null;

  if (loadingInvitation || loadingTicketTypes) return <SkeletonBox rows={4} />;

  return <EventRegistrationContent />;
};

export const EventRegistration: React.FC<{ event: Event }> = ({ event }) => (
  <EventRegistrationStoreProvider>
    <BaseEventRegistration event={event} />
  </EventRegistrationStoreProvider>
);
