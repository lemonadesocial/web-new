import { useState } from "react";

import { generateUrl } from "$lib/utils/cnd";
import { getDisplayPrice, getEventCardStart } from "$lib/utils/event";
import { useClient } from "$lib/graphql/request/provider";
import { Button, Input, toast } from "$lib/components/core";
import { CalculateTicketsPricingDocument, EthereumStakeAccount } from "$lib/graphql/generated/backend/graphql";

import { currencyAtom, discountCodeAtom, eventDataAtom, pricingInfoAtom, purchaseItemsAtom, selectedPaymentAccountAtom, ticketLimitAtom, ticketTypesAtom, useAtomValue, useSetAtom } from "./store";
import { TicketSelectItem } from "./TicketSelectItem";
import { format } from "date-fns";
import { useStakeRefundRate } from "$lib/utils/stake";

export function OrderSummary() {
  const event = useAtomValue(eventDataAtom);
  const ticketLimit = useAtomValue(ticketLimitAtom);
  const pricingInfo = useAtomValue(pricingInfoAtom);
  const purchaseItems = useAtomValue(purchaseItemsAtom);
  const selectedPaymentAccount = useAtomValue(selectedPaymentAccountAtom);
  const currency = useAtomValue(currencyAtom)!;
  const setPricingInfo = useSetAtom(pricingInfoAtom);

  const setDiscountCode = useSetAtom(discountCodeAtom);
  const [showDiscountInput, setShowDiscountInput] = useState(false);
  const [discountCodeInput, setDiscountCodeInput] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  const { client } = useClient();

  const pricingPaymentAccount = pricingInfo?.payment_accounts?.find(account => account._id === selectedPaymentAccount?._id) || pricingInfo?.payment_accounts?.[0];
  const fee = pricingPaymentAccount?.fee;
  const grandTotal = (BigInt(pricingInfo?.total || '0') + BigInt(fee || '0')).toString();

  const { refundRate } = useStakeRefundRate(pricingPaymentAccount?.type === 'ethereum_stake' ? (pricingPaymentAccount?.account_info as EthereumStakeAccount) : undefined);

  const handleApplyDiscount = async () => {
    if (!discountCodeInput.trim().length) return;

    setIsApplying(true);

    try {
      const { data, error } = await client.query({
        query: CalculateTicketsPricingDocument,
        variables: {
          input: {
            event: event._id,
            currency,
            items: purchaseItems,
            discount: discountCodeInput.trim().toUpperCase(),
          },
        },
        fetchPolicy: 'network-only',
      });

      if (error) {
        throw error;
      }

      if (data?.calculateTicketsPricing) {
        setPricingInfo(data.calculateTicketsPricing);
        setDiscountCode(discountCodeInput.trim().toUpperCase());
        setShowDiscountInput(false);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to apply discount code');
    } finally {
      setIsApplying(false);
    }
  };

  const handleClearDiscount = async () => {
    setDiscountCodeInput('');
    setDiscountCode(null);

    const { data } = await client.query({
      query: CalculateTicketsPricingDocument,
      variables: {
        input: {
          event: event._id,
          currency,
          items: purchaseItems,
          discount: null,
        },
      },
      fetchPolicy: 'network-only',
    });

    if (data?.calculateTicketsPricing) {
      setPricingInfo(data.calculateTicketsPricing);
    }
  };

  return (
    <div className="border-b md:border border-divider md:rounded-lg md:w-[340] h-min bg-primary/8 md:bg-transparent">
      <h3 className="text-xl font-semibold px-4 pt-4 pb-0 leading-8 md:hidden">
        Registration
      </h3>
      <div className="p-4 flex gap-3 pb-2">
        {
          event.new_new_photos_expanded?.[0] && (
            <img
              className="aspect-square object-contain rounded-sm border border-divider size-[54px]"
              src={generateUrl(event.new_new_photos_expanded[0], {
                resize: { height: 120, width: 120, fit: 'cover' },
              })}
            />
          )
        }
        <div>
          <p className="pb-1">{event.title}</p>
          <p className="text-tertiary text-sm">{getEventCardStart(event)}</p>
        </div>
      </div>
      {
        !!ticketLimit && (
          <div className="px-4 pt-2 pb-3 border-b border-divider">
            <TicketSelect />
          </div>
        )
      }
      <div className="px-4 pt-2 pb-3 space-y-1  ">
        {
          pricingInfo?.subtotal && (
            <div className="flex justify-between items-center">
              <p className="text-tertiary">Subtotal</p>
              <p className="text-tertiary">{getDisplayPrice(pricingInfo.subtotal.toString(), currency, pricingPaymentAccount)}</p>
            </div>
          )
        }
        {
          (!showDiscountInput && Number(pricingInfo?.discount || '0') > 0 && discountCodeInput) ? (
            <div className="flex justify-between items-center gap-2">
              <p className="text-tertiary flex-1">Coupon</p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <p className="text-success-500 uppercase">{discountCodeInput}</p>
                  <i className="icon-dot text-success-500 size-2" />
                  <p className="text-success-500">{getDisplayPrice(pricingInfo!.discount.toString(), currency, pricingPaymentAccount)}</p>
                </div>
                <i className="icon-cancel size-4 text-tertiary cursor-pointer" onClick={handleClearDiscount} />
              </div>
            </div>
          ) : <p className="text-accent-400 cursor-pointer" onClick={() => setShowDiscountInput(true)}>Add Coupon</p>
        }
        {
          showDiscountInput && (
            <div className="flex gap-2">
              <Input onChange={(e) => setDiscountCodeInput(e.target.value)} value={discountCodeInput} />
              <Button variant="secondary" onClick={handleApplyDiscount} loading={isApplying} disabled={!discountCodeInput.trim().length}>
                Apply
              </Button>
            </div>
          )
        }
        {
          pricingPaymentAccount?.type === 'ethereum_stake' && (
            <div className="py-2 px-3 rounded-sm bg-primary/8 my-2">
              <p className="text-sm text-secondary">Get {refundRate}% back if you check in by {format(new Date((pricingPaymentAccount.account_info as EthereumStakeAccount).requirement_checkin_before), 'EEEE, MMM d, h:mm a')}.</p>
            </div>
          )
        }
        {
          !!fee && (
            <div className="flex justify-between items-center">
              <p className="text-tertiary">Platform fees</p>
              <p className="text-tertiary">{getDisplayPrice(fee.toString(), currency, pricingPaymentAccount)}</p>
            </div>
          )
        }
        <div className="flex justify-between items-center">
          <p className="text-tertiary">Total</p>
          <h4 className="text-xl font-semibold">{getDisplayPrice(grandTotal, currency, pricingPaymentAccount)}</h4>
        </div>
      </div>
    </div>
  );
}

function TicketSelect() {
  const ticketTypes = useAtomValue(ticketTypesAtom);
  const purchaseItems = useAtomValue(purchaseItemsAtom);
  const currency = useAtomValue(currencyAtom)!;
  const selectedPaymentAccount = useAtomValue(selectedPaymentAccountAtom);

  const [showEdit, setShowEdit] = useState(!purchaseItems.length);

  const tierMap = Object.fromEntries(new Map(
    ticketTypes.map(tier => {
      return [tier._id, tier];
    }),
  ));

  if (ticketTypes.length === 1) return <TicketSelectItem ticketType={ticketTypes[0]} compact />;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <p>Tickets</p>
        <p onClick={purchaseItems.length ? () => setShowEdit(showEdit => !showEdit) : undefined} className="cursor-pointer text-accent-400">
          {!!(showEdit && purchaseItems.length) ? 'Done' : 'Edit'}
        </p>
      </div>
      {
        showEdit ? (
          <div className="space-y-2">
            {ticketTypes.map(tier => (
              <TicketSelectItem key={tier._id} ticketType={tier} />
            ))}
          </div>) : (
          <div className="space-y-1">
            {
              purchaseItems.map(({ count, id }) => {
                const price = tierMap[id]?.prices.find((p) => p.currency === currency);

                return (
                  <div className="flex justify-between items-center" key={id}>
                    <p className="text-tertiary">{count} x {tierMap[id].title}</p>
                    <p className="text-tertiary">
                      {getDisplayPrice((BigInt(price.cost) * BigInt(count)).toString(), currency, selectedPaymentAccount)}
                    </p>
                  </div>
                );
              })
            }
          </div>
        )
      }
    </div>
  );
}
