import { useForm } from "react-hook-form";
import { pick, omit } from "lodash";

import { Button, drawer, Input, LabeledInput, ErrorText, Spacer, Textarea, TextEditor, Segment, toast, modal } from "$lib/components/core";
import { EventTicketType, NewPaymentProvider, Event } from "$lib/graphql/generated/backend/graphql";
import { useState } from "react";
import { UpdateFiatPriceModal } from "./UpdateFiatPriceModal";

type TicketFormState = {
  title: string;
  description: string;
  ticket_limit_per: number;
  ticket_limit?: number;
  active: boolean;
  private: boolean;
  limited: boolean;
  fiatPrice?: any;
  cryptoPrice?: any;
  category?: any;
};

type PaymentType = 'free' | 'direct';

const getInitialValues = (initialTicketType?: EventTicketType): TicketFormState => {
  if (!initialTicketType) {
    return {
      title: '',
      description: '',
      ticket_limit_per: 1,
      active: true,
      private: false,
      limited: false,
      fiatPrice: undefined,
      cryptoPrice: undefined,
      category: undefined
    };
  }

  const ticket = initialTicketType;
  const formTicket = pick(ticket, ['title', 'description', 'ticket_limit_per', 'ticket_limit', 'active', 'private', 'limited']) as TicketFormState;

  const fiatPrice = ticket.prices.find(price => price.payment_accounts_expanded?.[0]?.provider === NewPaymentProvider.Stripe);
  const cryptoPrice = ticket.prices.find(price => price.payment_accounts_expanded && price.payment_accounts_expanded[0].provider !== NewPaymentProvider.Stripe);

  formTicket.fiatPrice = fiatPrice && omit(fiatPrice, ['__typename']);
  formTicket.cryptoPrice = cryptoPrice && omit(cryptoPrice, ['__typename']);
  formTicket.category = ticket.category_expanded || undefined;
  formTicket.description = ticket.description || '';

  return formTicket;
};

export function TicketTypeDrawer({ ticketType: initialTicketType }: { ticketType?: EventTicketType }) {
  const defaultValues = getInitialValues(initialTicketType);
  const form = useForm<TicketFormState>({
    defaultValues
  });

  const { handleSubmit, formState: { errors } } = form;
  const paymnentTypes = [
    { value: 'free' as PaymentType, label: 'Free' },
    { value: 'direct' as PaymentType, label: 'Direct' },
  ];

  const [showDescription, setShowDescription] = useState(!!initialTicketType?.description);
  const [paymentType, setPaymentType] = useState<PaymentType>(defaultValues.fiatPrice ? 'direct' : 'free');

  const onSubmit = (values: TicketFormState) => {
    console.log(values);
  };

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
          {
            showDescription ? (
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
              <div
                className="flex items-center gap-1.5 cursor-pointer"
                onClick={() => setShowDescription(true)}
              >
                <i className="icon-plus size-5 text-tertiary" />
                <p className="text-tertiary text-sm">Add Description</p>
              </div>
            )
          }
        </div>
        <hr className="border-t border-t-divider" />
        <div className="px-4 py-6">
          <p>Pricing</p>
          <div className="h-4" />
          <Segment
            selected={paymentType}
            onSelect={(item) => setPaymentType(item.value)}
            items={paymnentTypes}
            className="w-full"
          />
          {
            paymentType === 'direct' && <>
              <p className="mt-2 text-tertiary text-sm">
                Guests pay upfront using crypto or card. For approval-based events, they&apos;ll only be charged once their registration is accepted.
              </p>
              <div className="rounded-sm bg-primary/8 mt-4">
                <div
                  className="flex py-2.5 px-3 items-center gap-2 cursor-pointer"
                  onClick={() => modal.open(UpdateFiatPriceModal)}
                >
                  <i className="icon-credit-card size-5 text-tertiary" />
                  <p className="flex-1">Price for Card</p>
                  <i className="icon-chevron-right size-5 text-tertiary" />
                </div>
                <hr className="border-t border-t-divider" />
                <div
                  className="flex py-2.5 px-3 items-center gap-2 cursor-pointer"
                  onClick={() => toast.success('Coming soon')}
                >
                  <i className="icon-wallet size-5 text-tertiary" />
                  <p className="flex-1">Price for Wallet</p>
                  <i className="icon-chevron-right size-5 text-tertiary" />
                </div>
              </div>
            </>
          }
        </div>
      </div>
      <div className="px-4 py-3 border-t border-t-divider flex-shrink-0">
        <Button type="submit" variant="secondary">
          {initialTicketType ? 'Update Ticket' : 'Create Ticket'}
        </Button>
      </div>
    </form>
  );
}
