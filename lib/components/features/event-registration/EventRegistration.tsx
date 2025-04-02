import React, { useEffect } from 'react';
import { useAtom as useJotaiAtom } from 'jotai';

import { CalculateTicketsPricingDocument, Event, GetEventInvitationDocument, GetEventTicketTypesDocument, NewPaymentAccount, PurchasableTicketType } from '$lib/generated/backend/graphql';
import { useQuery } from '$lib/request';
import { sessionAtom } from '$lib/jotai';
import { useMe } from '$lib/hooks/useMe';
import { userAvatar } from '$lib/utils/user';
import { Avatar, Card, ModalContainer, SkeletonBox } from '$lib/components/core';

import { approvalRequiredAtom, buyerInfoAtom, currencyAtom, eventAtom, hasSingleFreeTicketAtom, nonLoggedInStatusAtom, pricingInfoAtom, purchaseItemsAtom, registrationModal, requiredProfileFieldsAtom, selectedPaymentAccountAtom, ticketLimitAtom, ticketTypesAtom, useAtom, useAtomValue, useSetAtom } from './store';

import { EventRegistrationStoreProvider } from './context';
import { TicketSelect } from './TicketSelect';
import { RegisterButton } from './RegisterButton';

const EventRegistrationContent: React.FC = () => {
  const me = useMe();
  const approvalRequired = useAtomValue(approvalRequiredAtom);
  const ticketLimit = useAtomValue(ticketLimitAtom);
  const hasSingleFreeTicket = useAtomValue(hasSingleFreeTicketAtom);
  const nonLoggedInStatus = useAtomValue(nonLoggedInStatusAtom);
  const buyerInfo = useAtomValue(buyerInfoAtom);

  if (nonLoggedInStatus) {
    return (
      <Card.Root className="p-4">
        <h3 className="text-xl font-semibold">
          {nonLoggedInStatus === 'success' ? `You're In` : 'Pending Approval'}
        </h3>
        <p className="text-secondary">
          {
            nonLoggedInStatus === 'success'
              ? <>A confirmation email has been sent to <span style={{ fontWeight: 'bold' }}>{buyerInfo?.email}</span></>
              : 'We will let you know when the host approves your registration.'}
        </p>
      </Card.Root>
    );
  }

  return (
    <Card.Root>
      <Card.Header>{hasSingleFreeTicket ? 'Registration' : 'Get Tickets'}</Card.Header>
      {!!(approvalRequired || ticketLimit) && (
        <div className='p-3 flex flex-col gap-3 border border-card-border'>
          {
            !!ticketLimit && (
              <div className='flex gap-3 items-center'>
                <div className='rounded-sm bg-card h-[28] w-[28] flex items-center justify-center'>
                  <i className='icon-alarm size-4 text-tertiary' />
                </div>
                <div>
                  <p className='font-medium'>Limited Spots Remaining</p>
                  <p className='text-sm text-secondary'>Hurry up and register before the event fills up!</p>
                </div>
              </div>
            )
          }
          {
            approvalRequired && (
              <div className='flex gap-3 items-center'>
                <div className='rounded-sm bg-card h-[28] w-[28] flex items-center justify-center'>
                  <i className='icon-list-check size-4 text-tertiary' />
                </div>
                <div>
                  <p className='font-medium'>Approval required</p>
                  <p className='text-sm text-secondary'>Your registration is subject to approval by the host.</p>
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
              <p className='font-medium text-secondary'>{me.email}</p>
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
  const [currency, setCurrency] = useAtom(currencyAtom);
  const [purchaseItems, setPurchaseItems] = useAtom(purchaseItemsAtom);

  const setApprovalRequired = useSetAtom(approvalRequiredAtom);
  const setTicketTypes = useSetAtom(ticketTypesAtom);
  const setTicketLimit = useSetAtom(ticketLimitAtom);
  const setRequiredProfileFields = useSetAtom(requiredProfileFieldsAtom);
  const setPricingInfo = useSetAtom(pricingInfoAtom);
  const setSelectedPaymentAccount = useSetAtom(selectedPaymentAccountAtom);

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
      const ticketTypes = data.getEventTicketTypes.ticket_types as PurchasableTicketType[];

      setTicketTypes(ticketTypes);
      setTicketLimit(ticketTypes.reduce((acc, ticketType) => acc + ticketType.limit, 0));

      if (ticketTypes.length == 1) {
        const ticket = ticketTypes[0];
        const price = ticket.prices[0];

        setPurchaseItems([{ id: ticket._id, count: 1 }]);
        setCurrency(price.currency);
        setSelectedPaymentAccount(price.payment_accounts_expanded?.[0] as NewPaymentAccount);
      }
    },
  });

  useQuery(CalculateTicketsPricingDocument, {
    variables: {
      input: {
        event: initialEvent._id,
        currency,
        items: purchaseItems,
      },
    },
    skip: !purchaseItems.length,
    onComplete(data) {
      setPricingInfo(data.calculateTicketsPricing);
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

  return <>
    <EventRegistrationContent />
    <ModalContainer modal={registrationModal} />
  </>;
};

export const EventRegistration: React.FC<{ event: Event }> = ({ event }) => (
  <EventRegistrationStoreProvider>
    <BaseEventRegistration event={event} />
  </EventRegistrationStoreProvider>
);
