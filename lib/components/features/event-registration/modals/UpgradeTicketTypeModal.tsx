'use client';
import React from 'react';

import { Button, Card, ModalContent } from '$lib/components/core';
import { purchaseItemsAtom, registrationModal, ticketTypesAtom, useAtom, useAtomValue } from '../store';
import { generateUrl } from '$lib/utils/cnd';
import { TicketPrices } from '../TicketSelectItem';

interface Props {
  onClose: () => void;
}

export function UpgradeTicketTypeModal({ onClose }: Props) {
  const [purchaseItems, setPurchaseItems] = useAtom(purchaseItemsAtom);
  const ticketTypes = useAtomValue(ticketTypesAtom);
  const [list] = React.useState(purchaseItems);

  const getTicket = (id: string) => {
    return ticketTypes.find((t) => t._id === id);
  };

  // const getRecommendedTicketTypes = (ticketType: PurchasableTicketType) => {
  //   const arr = ticketTypes.filter((i) => ticketType.recommended_upgrade_ticket_types?.includes(i._id));
  // };

  const handleUpgrade = () => {
    const arr = purchaseItems.reduce((acc: any = [], obj) => {
      const ticketType = getTicket(obj.id);
      // TODO: need to update check highest prices
      // 1. ticket type has 2 recommended
      // 2. pick highest price instead of first
      acc.push({ id: ticketType?.recommended_upgrade_ticket_types?.[0], count: obj.count });
      return acc;
    }, []);
    setPurchaseItems(arr);
    registrationModal.close();
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
            const ticketType = getTicket(item.id);
            if (!ticketType) return null;

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
                    <i className="size-3.5 icon-arrow-back-sharp -rotate-90" />
                  </div>
                </div>

                {ticketType.recommended_upgrade_ticket_types?.map((recommended) => {
                  const t = getTicket(recommended);
                  if (!t) return null;

                  return (
                    <Card.Root key={recommended} className="bg-(--btn-tertiary-hover) border-secondary">
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
                  );
                })}
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
