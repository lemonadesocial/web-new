import { Button } from "$lib/components/core";
import { Event } from "$lib/graphql/generated/backend/graphql";
import { CreateCouponModal } from "../modals/CreateCouponModal";
import { modal } from "$lib/components/core";

export function CouponList({ event }: { event: Event }) {
  const discounts = event.payment_ticket_discounts || [];

  const handleCreateCoupon = () => {
    modal.open(CreateCouponModal, { props: { event } });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Coupons</h1>
        <Button
          variant="tertiary"
          size="sm"
          iconLeft="icon-plus"
          onClick={handleCreateCoupon}
        >
          Create
        </Button>
      </div>
      
      {discounts.length === 0 ? (
        <div className="flex items-center gap-3 py-3 px-4 rounded-md border border-card-border bg-card">
          <i className="icon-discount size-9 text-tertiary" />
          <div>
            <p className="text-tertiary">No Discount Codes Yet</p>
            <p className="text-tertiary text-sm">Create discount codes to offer special pricing for your event.</p>
          </div>
        </div>
      ) : (
        <div className="rounded-md border border-card-border bg-card divide-y divide-(--color-divider)">
          {discounts.map((discount, index) => (
              <div key={index} className="flex items-center justify-between px-4 py-3 gap-3">
                <div className="flex gap-2 items-center flex-1">
                  {
                    discount.active
                      ? <p className="uppercase text-accent-500">{discount.code}</p>
                      : <p className="uppercase text-tertiary line-through">{discount.code}</p>
                  }
                  <p className="text-tertiary">{discount.ratio * 100}% off</p>
                  {
                    discount.use_count && <>
                      <i className="icon-dot size-3 text-tertiary" />
                      <p className="text-tertiary">{discount.use_limit ? `${discount.use_count || 0}/${discount.use_limit}` : discount.use_count || 0} used</p>
                    </>
                  }
                </div>
                {/* <div className="flex gap-3 items-center">
                  <i className="icon-edit-sharp size-5 text-tertiary cursor-pointer" />
                </div> */}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
