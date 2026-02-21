import { useState } from 'react';

import { ModalContent, Input, Toggle, Button, modal, toast } from '$lib/components/core';
import type { Event, EventPaymentTicketDiscount, UpdateEventTicketDiscountInput } from '$lib/graphql/generated/backend/graphql';
import { UpdateEventTicketDiscountDocument, DeleteEventTicketDiscountsDocument } from '$lib/graphql/generated/backend/graphql';
import { useMutation } from '$lib/graphql/request';
import { TicketTypeSelector } from '../common/TicketTypeSelector';
import { useUpdateEvent } from '../store';

interface EditCouponModalProps {
  event: Event;
  coupon: EventPaymentTicketDiscount;
}

export function EditCouponModal({ event, coupon }: EditCouponModalProps) {
  const [selectedTicketTypes, setSelectedTicketTypes] = useState<string[]>(
    coupon.ticket_types || []
  );
  const [limitedUses, setLimitedUses] = useState(!!coupon.use_limit);
  const [remainingUses, setRemainingUses] = useState<number | undefined>(
    coupon.use_limit ? coupon.use_limit - (coupon.use_count || 0) : undefined
  );
  const [usesPerGuest, setUsesPerGuest] = useState<number | undefined>(
    coupon.use_limit_per || undefined
  );

  const ticketTypes = event.event_ticket_types || [];
  const updateEvent = useUpdateEvent();

  const percentOff = Math.round(coupon.ratio * 100);

  const [updateDiscount, { loading }] = useMutation(UpdateEventTicketDiscountDocument, {
    onComplete: (_, data) => {
      if (data?.updateEventTicketDiscount?.payment_ticket_discounts) {
        const updatedDiscounts = data.updateEventTicketDiscount.payment_ticket_discounts;

        updateEvent({
          payment_ticket_discounts: updatedDiscounts as any
        });

        toast.success('Coupon updated successfully');
        modal.close();
      }
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const [deleteDiscount, { loading: deleteLoading }] = useMutation(DeleteEventTicketDiscountsDocument, {
    onComplete: (_, data) => {
      if (data?.deleteEventTicketDiscounts?.payment_ticket_discounts) {
        const updatedDiscounts = data.deleteEventTicketDiscounts.payment_ticket_discounts;

        updateEvent({
          payment_ticket_discounts: updatedDiscounts as any
        });

        toast.success('Coupon deleted successfully');
        modal.close();
      }
    },
    onError(error) {
      toast.error(error.message);
    },
  });

  const handleDelete = () => {
    deleteDiscount({
      variables: {
        event: event._id,
        discounts: [coupon.code],
      },
    });
  };

  const handleUpdate = () => {
    const input: UpdateEventTicketDiscountInput = {
      code: coupon.code,
      ticket_types: selectedTicketTypes,
      use_limit: limitedUses ? (remainingUses || 0) + (coupon.use_count || 0) : null,
      use_limit_per: limitedUses ? usesPerGuest : null,
    };

    updateDiscount({
      variables: {
        event: event._id,
        input,
      },
    });
  };


  return (
    <ModalContent
      icon="icon-discount"
      onClose={() => modal.close()}
    >
      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <div>
            <p className="text-lg">Edit Coupon</p>
            <div className="flex items-center gap-1.5">
              <span className="text-lg text-tertiary">{coupon.code}</span>
              <i aria-hidden="true" className="icon-dot size-3 text-tertiary" />
              <span className="text-lg text-tertiary">{percentOff}% off</span>
            </div>
          </div>
          <p className="text-sm text-secondary">
            You may not change the terms of an existing coupon, but you can always create new ones.
          </p>
        </div>

        <div className="space-y-1.5">
          <p className="text-sm text-secondary">Redeemable For</p>
          <TicketTypeSelector
            value={selectedTicketTypes}
            onChange={setSelectedTicketTypes}
            ticketTypes={ticketTypes}
            className="w-full"
          />
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm">Limited Uses</p>
          <Toggle
            id="limited-uses"
            checked={limitedUses}
            onChange={setLimitedUses}
          />
        </div>

        {limitedUses && <>
          <div className="flex justify-between items-center">
            <p className="text-sm text-secondary">Remaining Uses</p>
            <Input
              value={remainingUses || ''}
              onChange={(e) => setRemainingUses(e.target.valueAsNumber)}
              variant="outlined"
              type="number"
              min={0}
              className="w-[152px]"
            />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-secondary text-sm">Uses Per Guest</p>
            <Input
              value={usesPerGuest}
              onChange={(e) => setUsesPerGuest(e.target.valueAsNumber)}
              variant="outlined"
              type="number"
              min={0}
              className="w-[152px]"
              placeholder="Unlimited"
            />
          </div>
        </>}

        <div className="flex gap-3 pt-2">
          <Button
            onClick={handleDelete}
            variant="danger"
            outlined
            className="flex-1"
            loading={deleteLoading}
          >
            Delete
          </Button>
          <Button
            onClick={handleUpdate}
            variant="secondary"
            className="flex-1"
            loading={loading}
          >
            Update
          </Button>
        </div>
      </div>
    </ModalContent>
  );
}
