import { useState } from 'react';
import { ModalContent, Input, Toggle, Button, modal, toast } from '$lib/components/core';
import { CreateEventTicketDiscountsDocument } from '$lib/graphql/generated/backend/graphql';
import type { Event } from '$lib/graphql/generated/backend/graphql';
import { useMutation } from '$lib/graphql/request';
import { TicketTypeSelector } from '../common/TicketTypeSelector';
import { useUpdateEvent } from '../store';

interface CreateCouponModalProps {
  event: Event;
}

export function CreateCouponModal({ event }: CreateCouponModalProps) {
  const [couponCode, setCouponCode] = useState('');
  const [selectedTicketTypes, setSelectedTicketTypes] = useState<string[]>([]);
  const [limitedUses, setLimitedUses] = useState(false);
  const [totalUses, setTotalUses] = useState<number | undefined>(undefined);
  const [usesPerGuest, setUsesPerGuest] = useState<number | undefined>(undefined);
  const [percentOff, setPercentOff] = useState(50);

  const ticketTypes = event.event_ticket_types || [];
  const updateEvent = useUpdateEvent();

  const [createDiscount, { loading }] = useMutation(CreateEventTicketDiscountsDocument, {
    onComplete: (_, data) => {
      if (data?.createEventTicketDiscounts?.payment_ticket_discounts) {
        const newDiscounts = data.createEventTicketDiscounts.payment_ticket_discounts;

        updateEvent({
          payment_ticket_discounts: newDiscounts as any
        });

        toast.success('Coupon created successfully');
        modal.close();
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create coupon');
    }
  });

  const handleCreate = () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    const ratio = percentOff / 100;
    const discountInput = {
      code: couponCode.trim(),
      ratio,
      ticket_types: selectedTicketTypes.length > 0 ? selectedTicketTypes : undefined,
      use_limit: limitedUses && totalUses ? totalUses : undefined,
      use_limit_per: limitedUses && usesPerGuest ? usesPerGuest : undefined
    };

    createDiscount({
      variables: {
        event: event._id,
        inputs: [discountInput]
      }
    });
  };

  return (
    <ModalContent
      icon="icon-discount"
      onClose={() => modal.close()}
    >
      <div className="flex flex-col gap-3">
        <p className="text-lg">Create Coupon</p>

        <Input
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          variant="outlined"
          placeholder="MYCODE123"
          className="w-full"
        />

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
          <p>Limited Uses</p>
          <Toggle
            id="limited-uses"
            checked={limitedUses}
            onChange={checked => {
              setLimitedUses(checked);
              setTotalUses(checked ? 2 : undefined);
            }}
          />
        </div>

        {
          limitedUses && <>
            <div className="flex items-center justify-between">
              <p className="text-secondary text-sm">Total Uses</p>
              <Input
                value={totalUses}
                onChange={(e) => setTotalUses(e.target.valueAsNumber)}
                variant="outlined"
                type="number"
                min={0}
                className="w-[152px]"
                placeholder="Unlimited"
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
          </>
        }

        <div className="flex items-center justify-between">
          <p className="text-secondary text-sm">Percent Off</p>
          <div className="flex">
            <Input
              value={percentOff}
              onChange={(e) => setPercentOff(e.target.valueAsNumber)}
              variant="outlined"
              type="number"
              min={0}
              max={100}
              className="w-28 rounded-r-none"
            />
            <div className="flex items-center justify-center bg-card rounded-r-md w-10 border">
              <p className="text-sm text-tertiary">%</p>
            </div>
          </div>
        </div>

        <Button
          onClick={handleCreate}
          className="w-full"
          variant="secondary"
          loading={loading}
          disabled={loading}
        >
          Create
        </Button>
      </div>
    </ModalContent>
  );
}
