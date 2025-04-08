import { useState } from "react";

import { generateUrl } from "$lib/utils/cnd";
import { getDisplayPrice, getEventCardStart } from "$lib/utils/event";

import { currencyAtom, eventDataAtom, pricingInfoAtom, purchaseItemsAtom, selectedPaymentAccountAtom, ticketLimitAtom, ticketTypesAtom, useAtomValue } from "./store";
import { TicketSelectItem } from "./TicketSelectItem";

export function OrderSummary() {
  const event = useAtomValue(eventDataAtom);
  const ticketLimit = useAtomValue(ticketLimitAtom);
  const pricingInfo = useAtomValue(pricingInfoAtom);
  const selectedPaymentAccount = useAtomValue(selectedPaymentAccountAtom);
  const currency = useAtomValue(currencyAtom)!;

  const pricingPaymentAccount = pricingInfo?.payment_accounts?.find(account => account._id === selectedPaymentAccount?._id) || pricingInfo?.payment_accounts?.[0];
  const fee = pricingPaymentAccount?.fee;
  const grandTotal = (BigInt(pricingInfo?.total || '0') + BigInt(fee || '0')).toString();

  return (
    <div className="border border-divider rounded-lg w-[340] h-min">
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
