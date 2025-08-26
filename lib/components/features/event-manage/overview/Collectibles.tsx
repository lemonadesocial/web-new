import { Event, PoapDrop, UpdatePoapDropDocument } from "$lib/graphql/generated/backend/graphql";
import { Button, modal, Chip, Menu, MenuItem, toast } from "$lib/components/core";
import { useQuery, useMutation } from "$lib/graphql/request";
import { ListPoapDropsDocument } from "$lib/graphql/generated/backend/graphql";
import { Skeleton } from "$lib/components/core/skeleton";
import { generateUrl } from "$lib/utils/cnd";

import { EditCollectibleModal } from "../modals/EditCollectibleModal";
import { CreateNewCollectibleModal } from "../modals/CreateNewCollectibleModal";
import { ImportCollectibleModal } from "../modals/ImportCollectibleModal";
import { chainsMapAtom } from "$lib/jotai";
import { useAtomValue } from "jotai";

export function Collectibles({ event }: { event: Event; }) {
  const { data: poapDropsData, loading } = useQuery(ListPoapDropsDocument, {
    variables: { event: event._id }
  });

  const poapDrops = poapDropsData?.listPoapDrops || [];

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Collectibles</h1>
          <Menu.Root>
            <Menu.Trigger>
              {({ toggle }) => (
                <Button
                  variant="tertiary"
                  size="sm"
                  iconLeft="icon-plus"
                  onClick={toggle}
                >
                  New Collectible
                </Button>
              )}
            </Menu.Trigger>
            <Menu.Content className="p-1">
              {({ toggle }) => (
                <>
                  <MenuItem
                    iconLeft="icon-diamond"
                    title="Create New Collectible"
                    onClick={() => {
                      modal.open(CreateNewCollectibleModal, { props: { event }, className: 'overflow-visible' });
                      toggle();
                    }}
                  />
                  <MenuItem
                    iconLeft="icon-download"
                    title="Import Collectible"
                    onClick={() => {
                      modal.open(ImportCollectibleModal, { props: { event }, className: 'overflow-visible' });
                      toggle();
                    }}
                  />
                </>
              )}
            </Menu.Content>
          </Menu.Root>
        </div>
        <p className="text-secondary">Add digital mementos that guests can claim for attending your event.</p>
      </div>

      {loading ? (
        <CollectiblesSkeleton />
      ) : poapDrops.length === 0 ? (
        <div className="flex items-center gap-3 py-3 px-4 rounded-md border border-card-border bg-card">
          <i className="icon-diamond size-9 text-tertiary" />
          <div>
            <p className="text-tertiary">No Collectibles Added</p>
            <p className="text-tertiary text-sm">You can add digital mementos for your guests to claim and remember the event by.</p>
          </div>
        </div>
      ) : (
        <div className="rounded-md border border-card-border bg-card divide-y divide-(--color-divider)">
          {poapDrops.map((poapDrop) => (
            <CollectibleItem key={poapDrop._id} poapDrop={poapDrop as PoapDrop} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}

function CollectibleItem({ poapDrop, event }: { poapDrop: PoapDrop; event: Event }) {
  const chains = useAtomValue(chainsMapAtom);
  const network = chains[poapDrop.minting_network];

  const [updatePoapDrop] = useMutation(UpdatePoapDropDocument, {
    onError(error) {
      toast.error(error.message);
    },
    onComplete(client) {
      const existingData = client.readQuery(ListPoapDropsDocument, { event: event._id });
      if (existingData?.listPoapDrops) {
        client.writeQuery({
          query: ListPoapDropsDocument,
          variables: { event: event._id },
          data: {
            ...existingData,
            listPoapDrops: existingData.listPoapDrops.filter(
              drop => drop._id !== poapDrop._id
            )
          }
        });
      }

      toast.success('Collectible removed from event successfully');
    }
  });

  const handleRemoveFromEvent = () => {
    updatePoapDrop({
      variables: {
        drop: poapDrop._id,
        input: {
          event: null
        }
      }
    });
  };

  return (
    <div className="py-3 px-4 flex gap-3 items-center">
      <img
        src={poapDrop.image_url || generateUrl(poapDrop.image_expanded, 'PROFILE')}
        alt={poapDrop.name}
        className="size-4 rounded-xs object-cover border-card-border"
      />

      <div className="flex items-center gap-2 flex-1">
        <p>{poapDrop.name}</p>
        <p className="text-tertiary">{poapDrop.claim_count || 0}/{poapDrop.amount} claimed</p>
        {
          poapDrop.claim_mode === 'registration' ? <Chip size="xxs" variant="secondary" className="rounded-full">Registration</Chip> : <Chip size="xxs" className="rounded-full">Check In</Chip>
        }
      </div>

      <Chip size="xxs" variant="secondary" leftIcon="icon-ticket" className="rounded-full">
        {
          poapDrop.ticket_types_expanded?.length ? poapDrop.ticket_types_expanded.map((ticketType) => ticketType.title).join(', ') : 'All Tickets'
        }
      </Chip>

      {
        poapDrop.status === 'pending' && <Chip size="xxs" variant="warning" className="rounded-full">Validating...</Chip>
      }
      {
        poapDrop.status === 'failed' && <Chip size="xxs" variant="error" className="rounded-full">Failed</Chip>
      }
      {
        network?.logo_url && <img src={network.logo_url} alt={network.name} className="size-4 rounded-full object-cover" />
      }
      <Menu.Root>
        <Menu.Trigger>
          <i className="icon-more-horiz size-5 text-tertiary" />
        </Menu.Trigger>
        <Menu.Content className="p-1">
          {({ toggle }) => (
            <>
              <MenuItem iconLeft="icon-settings" title="Claim Settings" onClick={() => {
                modal.open(EditCollectibleModal, { props: { poapDrop, event }, className: 'overflow-visible' });
                toggle();
              }} />
              <MenuItem
                iconLeft="icon-delete text-error"
                onClick={() => {
                  handleRemoveFromEvent();
                  toggle();
                }}
              >
                <p className="text-error text-sm">
                  Remove from Event
                </p>
              </MenuItem>
            </>
          )}
        </Menu.Content>
      </Menu.Root>
    </div>
  );
}

function CollectiblesSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 rounded-md border border-card-border bg-card">
      <Skeleton className="size-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-6" />
      </div>
    </div>
  );
}
