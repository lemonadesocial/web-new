'use client';
import React from 'react';
import { intersection } from 'lodash';

import { Button, Card, ModalContent } from '$lib/components/core';
import {
  currenciesAtom,
  currencyAtom,
  eventTokenGatesAtom,
  purchaseItemsAtom,
  registrationModal,
  selectedPaymentAccountAtom,
  ticketTypesAtom,
  useAtom,
  useAtomValue,
  useSetAtom,
} from '../store';
import { generateUrl } from '$lib/utils/cnd';
import { NewPaymentAccount, PurchasableTicketType } from '$lib/graphql/generated/backend/graphql';

import { TicketPrices } from '../TicketSelectItem';
import { TokenGateEligibilityModal } from './TokenGateEligibilityModal';

interface Props {
  onClose: () => void;
}

export function UpgradeTicketTypeModal({ onClose }: Props) {
  const eventTokenGates = useAtomValue(eventTokenGatesAtom);
  const setCurrency = useSetAtom(currencyAtom);
  const setSelectedPaymentAccount = useSetAtom(selectedPaymentAccountAtom);
  const setCurrencies = useSetAtom(currenciesAtom);

  const [purchaseItems, setPurchaseItems] = useAtom(purchaseItemsAtom);
  const ticketTypes = useAtomValue(ticketTypesAtom);
  const tierMap = Object.fromEntries(
    new Map(
      ticketTypes.map((tier) => {
        return [tier._id, tier];
      }),
    ),
  );

  const [list] = React.useState(() =>
    purchaseItems.filter(({ id }) => !!tierMap[id].recommended_upgrade_ticket_types?.length),
  );

  const getRecommendedTicketType = (ticketType: PurchasableTicketType) => {
    return ticketTypes
      .filter((i) => ticketType.recommended_upgrade_ticket_types?.includes(i._id))
      .reduce((max, current) => {
        const currentPrice = current.prices[0];
        const maxPrice = max.prices[0];
        if (currentPrice && maxPrice && currentPrice.cost > maxPrice.cost) {
          return current;
        } else {
          return max;
        }
      });
  };

  const processTicketChange = (newPurchaseTickets, ticketRecommended) => {
    const price = ticketRecommended.prices[0];

    const selectedTicketTypes = ticketTypes.filter((ticket) =>
      newPurchaseTickets.some((item) => item.id === ticket._id),
    );
    const paymentCurrencies = selectedTicketTypes.map((ticket) => ticket.prices.map((price) => price.currency));
    const newCurrencies = intersection(...paymentCurrencies);
    setCurrencies(newCurrencies);
    setCurrency(price.currency);
    setSelectedPaymentAccount(price.payment_accounts_expanded?.[0] as NewPaymentAccount);
  };

  const handleUpgrade = () => {
    let tokenGate = null;
    let ticketRecommended: PurchasableTicketType | null = null;
    const arr = purchaseItems.reduce((acc: any = [], obj) => {
      const ticketType = tierMap[obj.id] as PurchasableTicketType;
      if (ticketType?.recommended_upgrade_ticket_types) {
        ticketRecommended = getRecommendedTicketType(ticketType);
        tokenGate = eventTokenGates.find((gate) => gate.gated_ticket_types?.includes(ticketRecommended?._id));

        const existing = purchaseItems.find((i) => i.id === ticketRecommended?._id);
        acc.push({ id: ticketRecommended._id, count: obj.count + (existing?.count || 0) });
      }
      return acc;
    }, []);

    if (tokenGate && ticketRecommended) {
      registrationModal.open(TokenGateEligibilityModal, {
        props: {
          ticketTitle: ticketRecommended.title,
          tokenGate: tokenGate,
          onConfirm: () => {
            setPurchaseItems(arr);
            if (ticketRecommended) {
              processTicketChange(arr, ticketRecommended);
            }
            onClose();
          },
        },
      });
      return;
    }

    setPurchaseItems(arr);
    if (ticketRecommended) {
      processTicketChange(arr, ticketRecommended);
    }

    onClose();
  };

  return (
    <ModalContent
      className="w-sm **:data-icon:bg-accent-400/16"
      icon="icon-arrow-shape-up-stack-outline text-accent-400!"
      onClose={() => registrationModal.close()}
    >
      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <p className="text-lg">Upgrade Ticket</p>
          <p className="text-secondary text-sm">Get more from your event with this upgrade.</p>
        </div>

        <div>
          {list.map((item) => {
            const ticketType = tierMap[item.id];
            if (!ticketType) return null;

            const t = getRecommendedTicketType(ticketType);

            return (
              <div key={ticketType._id} className="relative">
                <Card.Root className="bg-(--input-bg) border-(--color-divider)">
                  <Card.Content>
                    <div className="flex gap-3">
                      {ticketType?.photos_expanded?.[0] && (
                        <img
                          src={generateUrl(ticketType.photos_expanded?.[0] as any)}
                          className="size-10 aspect-square rounded-xs my-1"
                        />
                      )}

                      <div>
                        <p>
                          {item.count} x {ticketType?.title}
                        </p>
                        <TicketPrices prices={ticketType.prices} groupRegistration={ticketType.limit > 1} active />
                      </div>
                    </div>
                  </Card.Content>
                </Card.Root>

                <div className="relative h-2 flex items-center justify-center">
                  <div className="bg-(--btn-secondary) text-primary-invert flex items-center justify-center rounded-full p-[5px] w-fit absolute z-10 -top-2">
                    <i aria-hidden="true" className="size-3.5 icon-arrow-back-sharp -rotate-90" />
                  </div>
                </div>

                <Card.Root className="bg-(--btn-tertiary-hover) border-secondary">
                  <Card.Content className="py-2 px-3">
                    <div className="absolute right-0 top-0 rounded-bl-sm rounded-tr-sm bg-secondary px-2 py-[3px] text-primary-invert text-xs">
                      <p>Upgrade</p>
                    </div>
                    <div className="flex gap-3">
                      {t?.photos_expanded?.[0] && (
                        <img
                          src={generateUrl(t.photos_expanded?.[0] as any)}
                          className="size-10 aspect-square rounded-xs my-1"
                        />
                      )}

                      <div>
                        <p>
                          {item.count} x {t?.title}
                        </p>
                        <TicketPrices prices={t.prices} groupRegistration={t.limit > 1} active />
                      </div>
                    </div>
                    <p>{t.description}</p>
                  </Card.Content>
                </Card.Root>
              </div>
            );
          })}
        </div>
        <Button className="w-full" onClick={handleUpgrade}>
          Upgrade
        </Button>
        <Button variant="flat" className="w-full" onClick={() => onClose()}>
          Keep Current Selection
        </Button>
      </div>
    </ModalContent>
  );
}
