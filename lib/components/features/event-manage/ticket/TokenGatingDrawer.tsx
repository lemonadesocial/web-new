import { Button, drawer, modal } from "$lib/components/core";
import { ListEventTokenGatesDocument } from "$lib/graphql/generated/backend/graphql";
import { useQuery } from "$lib/graphql/request";
import { formatTokenGateRange } from "$lib/utils/event";

import { useEvent } from "../store";
import { TokenDetailsModal } from "./TokenDetailsModal";

export function TokenGatingDrawer({ ticketType }: { ticketType: string }) {
  const event = useEvent();

  const { data, refetch } = useQuery(ListEventTokenGatesDocument, {
    variables: { event: event?._id, ticketTypes: [ticketType] },
    skip: !event
  });

  const tokenGates = data?.listEventTokenGates;

  return (
    <div className="h-full flex flex-col">
      <div className="px-3 py-2 border-b border-b-divider gap-3 items-center flex">
        <Button icon="icon-chevron-double-right" variant="tertiary" size="sm" onClick={() => drawer.close()} aria-label="Close drawer" />
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar p-4">
        <h1 className="text-xl font-semibold">Crypto Token Gating</h1>
        <p className="text-secondary">Guests will connect their wallet upon registration to prove ownership of one of the tokens.</p>
        <div className="mt-4 space-y-2">
          {
            tokenGates?.map((tokenGate) => (
              <div
                key={tokenGate._id}
                className="flex items-center gap-3 rounded-md border-card-border bg-card py-3 px-4 cursor-pointer"
                onClick={() => {
                  modal.open(TokenDetailsModal, {
                    className: 'overflow-visible',
                    props: {
                      ticketType: ticketType,
                      tokenGate,
                      event: event?._id,
                      onUpdate: refetch
                    }
                  });
                }}
              >
                {
                  tokenGate.is_nft ? <i aria-hidden="true" className="icon-diamond size-5 text-tertiary" /> : <i aria-hidden="true" className="icon-token size-5 text-tertiary" />
                }
                <div className="flex-1">
                  <p>
                    {tokenGate.name}
                    {' '}
                    {formatTokenGateRange(tokenGate)}
                  </p>
                  <p className="text-sm text-tertiary">{tokenGate.is_nft ? 'ERC-721' : 'ERC-20'}</p>
                </div>
                <i aria-hidden="true" className="icon-chevron-right size-5 text-tertiary" />
              </div>
            ))
          }
        </div>
      </div>
      <div className="px-4 py-3 border-t border-t-divider flex-shrink-0">
        <Button
          type="submit"
          variant="secondary"
          onClick={() => modal.open(TokenDetailsModal, {
            className: 'overflow-visible',
            props: {
              event: event?._id,
              ticketType,
            }
          })}
        >
          Add Token
        </Button>
      </div>
    </div>
  );
}
