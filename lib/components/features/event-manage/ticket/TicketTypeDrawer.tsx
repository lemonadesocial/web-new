import { useForm } from 'react-hook-form';
import { pick, omit } from 'lodash';
import { useState } from 'react';

import {
  Button,
  drawer,
  Input,
  LabeledInput,
  ErrorText,
  Spacer,
  Textarea,
  Segment,
  toast,
  modal,
  Toggle,
} from '$lib/components/core';
import {
  EventTicketType,
  NewPaymentProvider,
  EventTicketPrice,
  CreateEventTicketTypeDocument,
  ListEventTicketTypesDocument,
  EventTicketTypeInput,
  UpdateEventTicketTypeDocument,
  ListEventTokenGatesDocument,
  ListEventGuestsDocument,
  ExportEventTicketsDocument,
} from '$lib/graphql/generated/backend/graphql';
import { useMutation, useQuery } from '$lib/graphql/request';
import { UpdateFiatPriceModal } from './UpdateFiatPriceModal';
import { formatCryptoPrice, formatFiatPrice, getEventDirectPaymentAccounts } from '$lib/utils/event';

import { TicketCapacityModal } from './TicketCapacityModal';
import { AdditionalTicketsModal } from './AdditionalTicketsModal';
import { TokenGatingDrawer } from './TokenGatingDrawer';
import { TokenDetailsModal } from './TokenDetailsModal';
import { useEvent } from '../store';
import { EmailListDrawer } from './EmailListDrawer';
import { AcceptWalletPaymentsModal } from './AcceptWalletPaymentsModal';
import { UpdateCryptoPriceModal } from './UpdateCryptoPriceModal';

type TicketFormState = {
  title: string;
  description: string;
  ticket_limit_per: number | undefined;
  ticket_limit?: number;
  active: boolean;
  private: boolean;
  limited: boolean;
  fiatPrice?: EventTicketPrice;
  cryptoPrice?: EventTicketPrice;
  category?: any;
};

type PaymentType = 'free' | 'direct';

const getInitialValues = (initialTicketType?: EventTicketType): TicketFormState => {
  if (!initialTicketType) {
    return {
      title: '',
      description: '',
      ticket_limit: undefined,
      ticket_limit_per: 1,
      active: true,
      private: false,
      limited: false,
      fiatPrice: undefined,
      cryptoPrice: undefined,
      category: undefined,
    };
  }

  const ticket = initialTicketType;
  const formTicket = pick(ticket, [
    'title',
    'description',
    'ticket_limit_per',
    'ticket_limit',
    'active',
    'private',
    'limited',
  ]) as TicketFormState;

  const fiatPrice = ticket.prices.find(
    (price) => price.payment_accounts_expanded?.[0]?.provider === NewPaymentProvider.Stripe,
  );
  const cryptoPrice = ticket.prices.find(
    (price) =>
      price.payment_accounts_expanded && price.payment_accounts_expanded[0].provider !== NewPaymentProvider.Stripe,
  );

  formTicket.fiatPrice = fiatPrice && omit(fiatPrice, ['__typename']);
  formTicket.cryptoPrice = cryptoPrice && omit(cryptoPrice, ['__typename']);
  formTicket.category = ticket.category_expanded || undefined;
  formTicket.description = ticket.description || '';

  return formTicket;
};

export function TicketTypeDrawer({ ticketType: initialTicketType }: { ticketType?: EventTicketType }) {
  const event = useEvent();
  const defaultValues = getInitialValues(initialTicketType);
  const form = useForm<TicketFormState>({
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { errors },
    setValue,
  } = form;
  const paymnentTypes = [
    { value: 'free' as PaymentType, label: 'Free' },
    { value: 'direct' as PaymentType, label: 'Direct' },
  ];

  const [showDescription, setShowDescription] = useState(!!initialTicketType?.description);
  const [paymentType, setPaymentType] = useState<PaymentType>(defaultValues.fiatPrice || defaultValues.cryptoPrice ? 'direct' : 'free');

  const { data: dataExportEventTickets } = useQuery(ExportEventTicketsDocument, {
    variables: {
      id: event?._id,
      ticketTypeIds: [initialTicketType?._id],
      pagination: {
        skip: 0,
        limit: 1,
      },
    },
    skip: !initialTicketType?._id,
  });

  const { data, loading: loadingTokenGates } = useQuery(ListEventTokenGatesDocument, {
    variables: { event: event?._id, ticketTypes: [initialTicketType?._id] },
    skip: !event || !initialTicketType?._id,
  });

  const tokenGates = data?.listEventTokenGates;

  const [createTicket, { loading: createLoading }] = useMutation(CreateEventTicketTypeDocument, {
    onComplete: (client) => {
      client.refetchQuery({
        query: ListEventTicketTypesDocument,
        variables: {
          event: event!._id,
        },
      });

      drawer.close();
      toast.success('Ticket created');
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const [updateTicket, { loading: updateLoading }] = useMutation(UpdateEventTicketTypeDocument, {
    onComplete: (client) => {
      client.refetchQuery({
        query: ListEventTicketTypesDocument,
        variables: {
          event: event!._id,
        },
      });

      drawer.close();
      toast.success('Ticket updated');
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const onSubmit = (values: TicketFormState) => {
    const { category, fiatPrice, cryptoPrice, ...ticket } = values;

    const prices = [fiatPrice, cryptoPrice].filter(Boolean);

    if (!prices.length && paymentType !== 'free') {
      toast.error('Ticket must have a price');
      return;
    }

    const newTicket = {
      event: event!._id,
      category: category?._id,
      prices: prices.length
        ? prices.map((price) => pick(price, ['cost', 'currency', 'payment_accounts']))
        : [{ cost: '0', currency: 'USD' }],
      ...pick(ticket, [
        'title',
        'description',
        'ticket_limit_per',
        'ticket_limit',
        'photos',
        'active',
        'private',
        'limited',
      ]),
    } as EventTicketTypeInput;

    if (!initialTicketType) {
      createTicket({
        variables: {
          input: newTicket,
        },
      });

      return;
    }

    updateTicket({
      variables: {
        id: initialTicketType._id,
        input: newTicket,
      },
    });
  };

  const handleOpenTokenGating = () => {
    if (!initialTicketType?._id) return;

    if (tokenGates?.length) {
      drawer.open(TokenGatingDrawer, {
        props: {
          ticketType: initialTicketType._id,
        },
      });

      return;
    }

    modal.open(TokenDetailsModal, {
      className: 'overflow-visible',
      props: {
        ticketType: initialTicketType._id,
        event: event?._id,
        onCreate() {
          drawer.open(TokenGatingDrawer, {
            props: {
              ticketType: initialTicketType._id,
            },
          });
        },
      },
    });
  };

  const handleOpenWalletPrice = () => {
    if (cryptoPrice) {
      modal.open(UpdateCryptoPriceModal, {
        className: 'overflow-visible',
        props: {
          onChange: (price) => form.setValue('cryptoPrice', price),
          price: cryptoPrice,
        },
      });

      return;
    }

    const directPaymentAccounts = getEventDirectPaymentAccounts(event!);

    if (directPaymentAccounts.length) {
      modal.open(UpdateCryptoPriceModal, {
        className: 'overflow-visible',
        props: {
          onChange: (price) => form.setValue('cryptoPrice', price),
        },
      });

      return;
    }

    modal.open(AcceptWalletPaymentsModal, {
      props: {
        event: event!,
      },
    });
  };

  const { fiatPrice, cryptoPrice, ticket_limit, ticket_limit_per } = form.watch();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col">
      <div className="px-3 py-2 border-b border-b-divider gap-3 items-center flex">
        <Button icon="icon-chevron-double-right" variant="tertiary" size="sm" onClick={() => drawer.close()} />
        <p className="flex-1 text-center">{initialTicketType ? 'Edit Ticket Type' : 'New Ticket Type'}</p>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="p-4">
          <LabeledInput label="Ticket Name">
            <Input
              {...form.register('title', { required: 'Please enter a ticket name' })}
              placeholder="Friends & Family"
              variant="outlined"
              error={!!errors.title}
            />
            {errors.title?.message && <ErrorText message={errors.title.message} />}
          </LabeledInput>
          <Spacer className="h-4" />
          {showDescription ? (
            <LabeledInput label="Description">
              <Textarea
                {...form.register('description')}
                placeholder="Access all IRL zones, and a free craft beer box!"
                variant="outlined"
                rows={1}
              />
              {errors.description?.message && <ErrorText message={errors.description.message} />}
            </LabeledInput>
          ) : (
            <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setShowDescription(true)}>
              <i className="icon-plus size-5 text-tertiary" />
              <p className="text-tertiary text-sm">Add Description</p>
            </div>
          )}
        </div>

        <hr className="border-t border-t-divider" />
        <div className="px-4 py-6">
          <p>Pricing</p>
          <div className="h-4" />
          <Segment
            selected={paymentType}
            onSelect={(item) => {
              setPaymentType(item.value);
              setValue('fiatPrice', undefined);
              setValue('cryptoPrice', undefined);
            }}
            items={paymnentTypes}
            className="w-full"
          />
          {paymentType === 'direct' && (
            <>
              <p className="mt-2 text-tertiary text-sm">
                Guests pay upfront using crypto or card. For approval-based events, they&apos;ll only be charged once
                their registration is accepted.
              </p>
              <div className="rounded-sm bg-primary/8 mt-4">
                <div
                  className="flex py-2.5 px-3 items-center gap-2 cursor-pointer"
                  onClick={() =>
                    modal.open(UpdateFiatPriceModal, {
                      props: {
                        price: fiatPrice,
                        onChange: (price) => form.setValue('fiatPrice', price),
                      },
                      className: 'overflow-visible',
                    })
                  }
                >
                  <i className="icon-credit-card size-5 text-tertiary" />
                  <p className="flex-1">Price for Card</p>
                  {fiatPrice ? (
                    <div className="flex items-center gap-2">
                      <p className="text-tertiary">{formatFiatPrice(fiatPrice)}</p>
                      <i className="icon-edit-sharp size-5 text-tertiary" />
                    </div>
                  ) : (
                    <i className="icon-chevron-right size-5 text-tertiary" />
                  )}
                </div>
                <hr className="border-t border-t-divider" />
                <div
                  classNametext-tertiary
                  className="flex py-2.5 px-3 items-center gap-2 cursor-pointer"
                  onClick={handleOpenWalletPrice}
                >
                  <i className="icon-wallet size-5 text-tertiary" />
                  <p className="flex-1">Price for Wallet</p>
                  {
                    cryptoPrice ? (
                      <div className="flex items-center gap-2">
                        <p className="text-tertiary">{formatCryptoPrice(cryptoPrice)}</p>
                        <i className="icon-edit-sharp size-5 text-tertiary" />
                      </div>
                    ) : (
                      <i className="icon-chevron-right size-5 text-tertiary" />
                    )
                  }
                </div>
              </div>
            </>
          )}
        </div>

        <hr className="border-t border-t-divider" />
        <div className="px-4 py-6 space-y-4">
          <p>Limits & Restrictions</p>
          <div className="rounded-sm bg-primary/8 mt-4">
            <div
              className="flex py-2.5 px-3 items-center cursor-pointer"
              onClick={() =>
                modal.open(TicketCapacityModal, {
                  props: {
                    ticketLimit: ticket_limit,
                    onChange: (limit) => form.setValue('ticket_limit', limit),
                  },
                })
              }
            >
              <div className="flex items-center gap-2 flex-1">
                <i className="icon-vertical-align-top size-5 text-tertiary" />
                <p>Ticket Capacity</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-tertiary">{ticket_limit || 'Unlimited'}</p>
                <i className="icon-edit-sharp size-5 text-tertiary" />
              </div>
            </div>
            <hr className="border-t border-t-divider" />
            <div
              className="flex py-2.5 px-3 items-center cursor-pointer"
              onClick={() =>
                modal.open(AdditionalTicketsModal, {
                  props: {
                    ticketLimitPer: ticket_limit_per,
                    onChange: (limit) => form.setValue('ticket_limit_per', limit),
                  },
                })
              }
            >
              <div className="flex items-center gap-2 flex-1">
                <i className="icon-ticket-plus size-5 text-tertiary" />
                <p>Additional Tickets</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-tertiary">
                  {ticket_limit_per === undefined
                    ? 'Unlimited'
                    : ticket_limit_per === 1
                      ? 'Off'
                      : `${ticket_limit_per} per guest`}
                </p>
                <i className="icon-edit-sharp size-5 text-tertiary" />
              </div>
            </div>
          </div>

          {initialTicketType && (
            <div className="space-y-1.5">
              <p className="text-sm text-secondary">Restrict Access</p>
              <div className="rounded-sm bg-primary/8 divide-y divide-(--color-divider)">
                <div
                  className="flex py-2.5 px-3 items-center cursor-pointer"
                  // onClick={() => drawer.open(EmailListDrawer, { props: { ticketType: initialTicketType } })}
                  onClick={() => toast.success('Coming soon')}
                >
                  <div className="flex items-center gap-2 flex-1">
                    <i className="icon-email size-5 text-tertiary" />
                    <p>Email List</p>
                  </div>

                  <div className="text-tertiary flex gap-2 items-center">
                    {!!dataExportEventTickets?.exportEventTickets.count && (
                      <p>{dataExportEventTickets?.exportEventTickets.count} emails</p>
                    )}
                    <i className="icon-chevron-right size-5 text-tertiary" />
                  </div>
                </div>
                {!loadingTokenGates && (
                  <div className="flex py-2.5 px-3 items-center cursor-pointer" onClick={handleOpenTokenGating}>
                    <div className="flex items-center gap-2 flex-1">
                      <i className="icon-token size-5 text-tertiary" />
                      <p>Token Gating</p>
                    </div>
                    <div className="flex gap-2 items-center">
                      {!!tokenGates?.length && <p className="text-tertiary">{tokenGates.length}</p>}
                      <i className="icon-chevron-right size-5 text-tertiary" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div>
            <p className="text-sm text-secondary mb-1.5">Visibility</p>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p>Activate Ticket</p>
                <p className="text-tertiary text-sm">
                  If disabled, guests won&apos;t be able to buy or receive this ticket.
                </p>
              </div>
              <Toggle
                id="active"
                checked={!!form.watch('active')}
                onChange={(value) => form.setValue('active', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p>Hide on Event Page</p>
                <p className="text-tertiary text-sm">Hidden tickets stay private and must be assigned by hosts.</p>
              </div>
              <Toggle
                id="private"
                checked={form.watch('private')}
                onChange={(value) => form.setValue('private', value)}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 py-3 border-t border-t-divider flex-shrink-0">
        <Button type="submit" variant="secondary" loading={createLoading || updateLoading}>
          {initialTicketType ? 'Update Ticket' : 'Create Ticket'}
        </Button>
      </div>
    </form>
  );
}
