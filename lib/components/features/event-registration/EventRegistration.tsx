import React, { useEffect, useMemo } from 'react';
import { useAtom as useJotaiAtom } from 'jotai';
import { format } from 'date-fns';

import { CalculateTicketsPricingDocument, EthereumStakeAccount, Event, GetEventInvitationDocument, GetEventTicketTypesDocument, ListEventTokenGatesDocument, NewPaymentAccount, PurchasableTicketType } from '$lib/graphql/generated/backend/graphql';
import { useQuery } from '$lib/graphql/request';
import { sessionAtom } from '$lib/jotai';
import { useMe } from '$lib/hooks/useMe';
import { Avatar, Button, Card, ModalContainer, SkeletonCard } from '$lib/components/core';
import { useSignIn } from '$lib/hooks/useSignIn';
import { useStakeRefundRate } from '$lib/utils/stake';
import { userAvatar } from '$lib/utils/user';

import {
  approvalRequiredAtom,
  currencyAtom,
  discountCodeAtom,
  eventAtom,
  eventDataAtom,
  eventTokenGatesAtom,
  hasSingleFreeTicketAtom,
  nonLoggedInStatusAtom,
  pricingInfoAtom,
  purchaseItemsAtom,
  registrationModal,
  requiredProfileFieldsAtom, selectedPaymentAccountAtom,
  ticketLimitAtom,
  ticketTypesAtom,
  useAtom,
  useAtomValue,
  useSetAtom
} from './store';

import { EventRegistrationStoreProvider } from './context';
import { TicketSelect } from './TicketSelect';
import { RegisterButton } from './RegisterButton';
import { AccessCard } from '../event-access/AccessCard';
import { EventCountdown } from '../event-access/EventCountdown';

const EventRegistrationContent: React.FC = () => {
  const signIn = useSignIn();
  const me = useMe();
  const approvalRequired = useAtomValue(approvalRequiredAtom);
  const hasSingleFreeTicket = useAtomValue(hasSingleFreeTicketAtom);
  const nonLoggedInStatus = useAtomValue(nonLoggedInStatusAtom);
  const purchaseItems = useAtomValue(purchaseItemsAtom);
  const ticketTypes = useAtomValue(ticketTypesAtom);
  const paymentAccount = ticketTypes[0].prices[0].payment_accounts_expanded?.[0];

  const event = useAtomValue(eventDataAtom);

  const { refundRate } = useStakeRefundRate(paymentAccount?.type === 'ethereum_stake' ? (paymentAccount?.account_info as EthereumStakeAccount) : undefined);

  const ticketTypeText = useMemo(() => {
    return purchaseItems
      .map(ticket => {
        const ticketType = ticketTypes.find(t => t?._id === ticket.id);
        return `${ticket.count}x ${ticketType?.title || ''}`;
      })
      .join(', ');
  }, [purchaseItems, ticketTypes]);

  if (nonLoggedInStatus) {
    return (
      <AccessCard event={event}>
        <div>
          <h3 className="text-xl font-semibold">
            {nonLoggedInStatus === 'success' ? `You're In` : 'Pending Approval'}
          </h3>
          <p className="text-lg text-tertiary">{ticketTypeText}</p>
        </div>
        <EventCountdown event={event} />
        <hr className="border-primary/8" />
        <div className="p-4 space-y-3 bg-primary/8 rounded-sm">
          <div className='size-8 flex items-center justify-center bg-white rounded-full'>
            <i className='icon-login size-5 text-black' />
          </div>
          <p>Please sign in to manage your registration and see more event details.</p>
          <Button size='sm' variant='tertiary' iconRight='icon-chevron-right' onClick={() => signIn()}>Sign In</Button>
        </div>
      </AccessCard>
    );
  }

  const showCheckInEarn = ticketTypes.length === 1 && paymentAccount?.type === 'ethereum_stake';

  return (
    <Card.Root>
      <Card.Header>{hasSingleFreeTicket ? 'Registration' : 'Get Tickets'}</Card.Header>
      {!!(approvalRequired || showCheckInEarn || event.guest_limit) && (
        <div className='p-3 flex flex-col gap-3 border-b border-card-border'>
          {
            showCheckInEarn && (
              <div className='flex gap-3 items-center'>
                <div className='rounded-sm bg-card h-[28] w-[28] flex items-center justify-center'>
                  <i className='icon-send-money size-4 text-tertiary' />
                </div>
                <div>
                  <p className='font-medium'>Check In to Earn</p>
                  <p className='text-sm text-secondary'>Get {refundRate}% back if you check in by {format(new Date((paymentAccount.account_info as EthereumStakeAccount).requirement_checkin_before), 'EEEE, MMM d, h:mm a')}.</p>
                </div>
              </div>
            )
          }
          {
            !!event.guest_limit && (
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

const BaseEventRegistration: React.FC<{ event: Event; }> = ({ event: initialEvent }) => {
  const [event, setEvent] = useAtom(eventAtom);
  const [currency, setCurrency] = useAtom(currencyAtom);
  const [purchaseItems, setPurchaseItems] = useAtom(purchaseItemsAtom);
  const [ticketLimit, setTicketLimit] = useAtom(ticketLimitAtom);

  const setApprovalRequired = useSetAtom(approvalRequiredAtom);
  const setTicketTypes = useSetAtom(ticketTypesAtom);
  const setRequiredProfileFields = useSetAtom(requiredProfileFieldsAtom);
  const setPricingInfo = useSetAtom(pricingInfoAtom);
  const setSelectedPaymentAccount = useSetAtom(selectedPaymentAccountAtom);
  const discountCode = useAtomValue(discountCodeAtom);
  const setEventTokenGates = useSetAtom(eventTokenGatesAtom);

  const [session] = useJotaiAtom(sessionAtom);
  const me = useMe();

  useEffect(() => {
    setEvent(initialEvent);
  }, [initialEvent, setEvent]);

  const { data: inviteData, loading: loadingInvitation } = useQuery(GetEventInvitationDocument, {
    variables: { event: initialEvent._id },
    skip: !session || !initialEvent.approval_required,
  });

  const { loading: loadingTicketTypes, data: ticketTypesData } = useQuery(GetEventTicketTypesDocument, {
    variables: { input: { event: initialEvent._id } },
    onComplete(data) {
      const ticketTypes = data.getEventTicketTypes.ticket_types as PurchasableTicketType[];

      setTicketTypes(ticketTypes);
      setTicketLimit(ticketTypes.reduce((acc, ticketType) => acc + ticketType.limit, 0));
    },
  });

  useQuery(CalculateTicketsPricingDocument, {
    variables: {
      input: {
        event: initialEvent._id,
        currency,
        items: purchaseItems,
        discount: discountCode,
      },
    },
    skip: !purchaseItems.length || !currency,
    onComplete(data) {
      setPricingInfo(data.calculateTicketsPricing);
    },
  });


  const { data: tokenGatesData } = useQuery(ListEventTokenGatesDocument, {
    variables: { event: initialEvent._id },
    onComplete(data) {
      setEventTokenGates(data.listEventTokenGates);
    },
  });

  React.useEffect(() => {
    const ticketTypes = ticketTypesData?.getEventTicketTypes.ticket_types as PurchasableTicketType[];
    if (ticketTypes?.length === 1 && tokenGatesData?.listEventTokenGates.length === 0) {
      const ticket = ticketTypes[0];
      const price = ticket.prices[0];

      setPurchaseItems([{ id: ticket._id, count: 1 }]);
      setCurrency(price.currency);
      setSelectedPaymentAccount(price.payment_accounts_expanded?.[0] as NewPaymentAccount);
    }
  }, [ticketTypesData, tokenGatesData]);

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
      requireFields.unshift({ field: 'email', required: true });
    }

    if (!me.display_name && !requireFields.some(field => field.field === 'display_name')) {
      requireFields.unshift({ field: 'display_name', required: true });
    }

    setRequiredProfileFields(requireFields);
  }, [initialEvent, me]);

  if (!event) return null;

  if (loadingInvitation || loadingTicketTypes) return <SkeletonCard />;

  if (ticketLimit === 0) return (
    <Card.Root>
      <Card.Header>Registration</Card.Header>
      <Card.Content>
        <div className="flex gap-2 items-center">
          <i className="icon-ticket size-5" />
          <p className="text-lg">Sold Out</p>
        </div>
        <p className="text-sm text-secondary">This event is sold out and no longer taking registrations.</p>
      </Card.Content>
    </Card.Root>
  );

  return <>
    <EventRegistrationContent />
    <ModalContainer modal={registrationModal} />
  </>;
};

export const EventRegistration: React.FC<{ event: Event; }> = ({ event }) => (
  <EventRegistrationStoreProvider>
    <BaseEventRegistration event={event} />
  </EventRegistrationStoreProvider>
);
