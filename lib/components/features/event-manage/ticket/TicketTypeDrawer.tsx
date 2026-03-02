'use client';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
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
  FileInput,
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
  ExportEventTicketsDocument,
  File,
  DeleteEventTicketTypeDocument,
} from '$lib/graphql/generated/backend/graphql';
import { useMutation, useQuery } from '$lib/graphql/request';
import { UpdateFiatPriceModal } from './UpdateFiatPriceModal';
import { formatCryptoPrice, formatFiatPrice } from '$lib/utils/event';
import { useEventDirectPaymentAccounts } from '$lib/hooks/useEventDirectPaymentAccounts';

import { TicketCapacityModal } from './TicketCapacityModal';
import { AdditionalTicketsModal } from './AdditionalTicketsModal';
import { TokenGatingDrawer } from './TokenGatingDrawer';
import { TokenDetailsModal } from './TokenDetailsModal';
import { useEvent } from '../store';
import { generateUrl } from '$lib/utils/cnd';
import { uploadFiles } from '$lib/utils/file';
import { Pane } from '$lib/components/core/pane/pane';
import { AcceptWalletPaymentsModal } from './AcceptWalletPaymentsModal';
import { UpdateCryptoPriceModal } from './UpdateCryptoPriceModal';

type TicketFormState = {
  title: string;
  description: string;
  ticket_limit_per: number | null;
  ticket_limit?: number | null;
  active: boolean;
  private: boolean;
  limited: boolean;
  fiatPrice?: EventTicketPrice;
  cryptoPrice?: EventTicketPrice;
  category?: any;
  photos_expanded?: File[];
  photos?: string[];
};

type PaymentType = 'free' | 'direct';

const getInitialValues = (initialTicketType?: EventTicketType): TicketFormState => {
  if (!initialTicketType) {
    return {
      title: '',
      description: '',
      ticket_limit: null,
      ticket_limit_per: 1,
      active: true,
      private: false,
      limited: false,
      fiatPrice: undefined,
      cryptoPrice: undefined,
      category: undefined,
      photos: [],
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
    'photos',
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
  const { directPaymentAccounts } = useEventDirectPaymentAccounts(event);
  const defaultValues = getInitialValues(initialTicketType);

  const [ticketTypePhotos, setTicketTypePhotos] = React.useState([]);

  const [deleteTicketType, { loading: isDeleting }] = useMutation(DeleteEventTicketTypeDocument, {
    onComplete: (client) => {
      client.refetchQuery({
        query: ListEventTicketTypesDocument,
        variables: {
          event: event!._id,
        },
      });

      drawer.close();
      toast.success('Ticket deleted');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const form = useForm<TicketFormState>({
    defaultValues,
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
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

  const [createTicket] = useMutation(CreateEventTicketTypeDocument, {
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

  const [updateTicket] = useMutation(UpdateEventTicketTypeDocument, {
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

  const onSubmit = async (values: TicketFormState) => {
    let images = [];
    if (ticketTypePhotos.length > 0) {
      images = await uploadFiles(ticketTypePhotos, 'ticket_type');
    }

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
      photos: [...images.map((i) => i._id), ...(ticket.photos, [])],
      ticket_limit: ticket.ticket_limit || null,
      ...pick(ticket, ['title', 'description', 'ticket_limit_per', 'active', 'private', 'limited']),
    } as EventTicketTypeInput;

    if (!newTicket?.photos?.length) {
      delete newTicket['photos'];
    }

    if (!initialTicketType) {
      await createTicket({
        variables: {
          input: newTicket,
        },
      });

      return;
    }

    await updateTicket({
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
        onAccept: () => {
          modal.open(UpdateCryptoPriceModal, {
            className: 'overflow-visible',
            props: {
              onChange: (price) => form.setValue('cryptoPrice', price),
            },
          });
        },
      },
    });
  };

  const { fiatPrice, cryptoPrice, ticket_limit, ticket_limit_per } = form.watch();

  return (
    <Pane.Root>
      <Pane.Header.Root>
        <Pane.Header.Left />
        <Pane.Header.Center className="flex-1 flex items-center justify-center">
          <p>{initialTicketType ? 'Edit Ticket Type' : 'New Ticket Type'}</p>
        </Pane.Header.Center>
        {initialTicketType && event && (
          <Pane.Header.Right>
            <Button
              variant="flat"
              loading={isDeleting}
              onClick={() => deleteTicketType({ variables: { event: event._id, id: initialTicketType._id } })}
              className="hover:bg-danger-500/10!"
              icon="icon-delete text-danger-400"
              size="sm"
            />
          </Pane.Header.Right>
        )}
      </Pane.Header.Root>
      <Pane.Content>
        <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto no-scrollbar">
            <div className="p-4">
              <div className="flex gap-3">
                <Controller
                  name="photos"
                  control={control}
                  render={() => {
                    return (
                      <FileInput accept="image/*" onChange={(files) => setTicketTypePhotos(files)}>
                        {(open) => (
                          <div
                            className="size-[60px] aspect-square rounded-sm relative flex items-center justify-center bg-(--btn-tertiary) cursor-pointer overflow-hidden"
                            onClick={() => {
                              if (!isSubmitting) open();
                            }}
                          >
                            {!!ticketTypePhotos.length || initialTicketType?.photos_expanded?.[0] ? (
                              <img
                                className="w-full h-full object-contain"
                                src={
                                  !!ticketTypePhotos.length
                                    ? URL.createObjectURL(ticketTypePhotos[0])
                                    : generateUrl(initialTicketType?.photos_expanded?.[0])
                                }
                              />
                            ) : (
                              <i aria-hidden="true" className="icon-image size-6 text-tertiary" />
                            )}

                            <Button
                              className="rounded-full absolute -bottom-0.5 -right-0.5 border-overlay-primary! border-2!"
                              variant="secondary"
                              icon="icon-upload-sharp"
                              disabled={isSubmitting}
                              size="xs"
                            />
                          </div>
                        )}
                      </FileInput>
                    );
                  }}
                />

                <LabeledInput label="Ticket Name" className="flex-1">
                  <Input
                    {...form.register('title', { required: 'Please enter a ticket name' })}
                    placeholder="Friends & Family"
                    variant="outlined"
                    error={!!errors.title}
                  />
                  {errors.title?.message && <ErrorText message={errors.title.message} />}
                </LabeledInput>
              </div>
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
                <button type="button" className="flex items-center gap-1.5 cursor-pointer" onClick={() => setShowDescription(true)}>
                  <i className="icon-plus size-5 text-tertiary" />
                  <p className="text-tertiary text-sm">Add Description</p>
                </button>
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
                      <i aria-hidden="true" className="icon-credit-card size-5 text-tertiary" />
                      <p className="flex-1">Price for Card</p>
                      {fiatPrice ? (
                        <div className="flex items-center gap-2">
                          <p className="text-tertiary">{formatFiatPrice(fiatPrice)}</p>
                          <i aria-hidden="true" className="icon-edit-sharp size-5 text-tertiary" />
                        </div>
                      ) : (
                        <i aria-hidden="true" className="icon-chevron-right size-5 text-tertiary" />
                      )}
                    </div>
                    <hr className="border-t border-t-divider" />
                    <div
                      classNametext-tertiary
                      className="flex py-2.5 px-3 items-center gap-2 cursor-pointer"
                      onClick={handleOpenWalletPrice}
                    >
                      <i aria-hidden="true" className="icon-wallet size-5 text-tertiary" />
                      <p className="flex-1">Price for Wallet</p>
                      {
                        cryptoPrice ? (
                          <div className="flex items-center gap-2">
                            <p className="text-tertiary">{formatCryptoPrice(cryptoPrice)}</p>
                            <i className="icon-edit-sharp size-5 text-tertiary" />
                          </div>
                        ) : (
                          <i aria-hidden="true" className="icon-chevron-right size-5 text-tertiary" />
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
                    <i aria-hidden="true" className="icon-vertical-align-top size-5 text-tertiary" />
                    <p>Ticket Capacity</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-tertiary">{ticket_limit || 'Unlimited'}</p>
                    <i aria-hidden="true" className="icon-edit-sharp size-5 text-tertiary" />
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
                    <i aria-hidden="true" className="icon-ticket-plus size-5 text-tertiary" />
                    <p>Additional Tickets</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-tertiary">
                      {ticket_limit_per === null
                        ? 'Unlimited'
                        : ticket_limit_per === 1
                          ? 'Off'
                          : `${ticket_limit_per} per guest`}
                    </p>
                    <i aria-hidden="true" className="icon-edit-sharp size-5 text-tertiary" />
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
                        <i aria-hidden="true" className="icon-email size-5 text-tertiary" />
                        <p>Email List</p>
                      </div>

                      <div className="text-tertiary flex gap-2 items-center">
                        {!!dataExportEventTickets?.exportEventTickets.count && (
                          <p>{dataExportEventTickets?.exportEventTickets.count} emails</p>
                        )}
                        <i aria-hidden="true" className="icon-chevron-right size-5 text-tertiary" />
                      </div>
                    </div>
                    {!loadingTokenGates && (
                      <button type="button" className="flex py-2.5 px-3 items-center cursor-pointer w-full" onClick={handleOpenTokenGating}>
                        <div className="flex items-center gap-2 flex-1">
                          <i aria-hidden="true" className="icon-token size-5 text-tertiary" />
                          <p>Token Gating</p>
                        </div>
                        <div className="flex gap-2 items-center">
                          {!!tokenGates?.length && <p className="text-tertiary">{tokenGates.length}</p>}
                          <i aria-hidden="true" className="icon-chevron-right size-5 text-tertiary" />
                        </div>
                      </button>
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
            <Button type="submit" variant="secondary" loading={isSubmitting}>
              {initialTicketType ? 'Update Ticket' : 'Create Ticket'}
            </Button>
          </div>
        </form>
      </Pane.Content>
    </Pane.Root>
  );
}
