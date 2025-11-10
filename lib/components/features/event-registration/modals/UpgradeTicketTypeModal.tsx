'use client';
import { useAtom, useAtomValue } from 'jotai';

import { Card, modal, ModalContent } from '$lib/components/core';
import { PurchasableTicketType } from '$lib/graphql/generated/backend/graphql';
import { purchaseItemsAtom, ticketTypesAtom } from '../store';
import { generateUrl } from '$lib/utils/cnd';

interface Props {
  ticketType: PurchasableTicketType;
  recommended: string[];
}

export function UpgradeTicketTypeModal({}: Props) {
  const [purchaseItems, setPurchaseItems] = useAtom(purchaseItemsAtom);
  console.log(purchaseItems);

  // const ticketTypes = useAtomValue(ticketTypesAtom);
  // const recommendedTicketTypes = ticketTypes.filter((t) => recommended.includes(t._id));

  return (
    <ModalContent
      className="w-sm **:data-icon:bg-accent-400/16"
      icon="icon-arrow-shape-up-stack-outline text-accent-400!"
      onClose={() => modal.close()}
    >
      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <p className="text-lg">Upgrade Ticket</p>
          <p className="text-secondary text-sm">Get more from your event with this upgrade.</p>
        </div>

        <div>
          <Card.Root>
            <Card.Content>
              {/* {ticketType.photos_expanded?.[0] && ( */}
              {/*   <img */}
              {/*     src={generateUrl(ticketType.photos_expanded?.[0] as any)} */}
              {/*     className="size-10 aspect-square rounded-xs my-1" */}
              {/*   /> */}
              {/* )} */}

              <div>
                <p></p>
              </div>
            </Card.Content>
          </Card.Root>
        </div>
      </div>
    </ModalContent>
  );
}
