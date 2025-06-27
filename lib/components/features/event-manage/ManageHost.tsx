import { Avatar, Button, Chip, modal } from "$lib/components/core";
import { User } from "$lib/graphql/generated/backend/graphql";
import { userAvatar } from "$lib/utils/user";
import { Event } from "$lib/graphql/generated/backend/graphql";
import { AddHostModal } from "./modals/AddHostModal";

export function ManageHost({ event }: { event: Event }) {
  if (!event.host_expanded) return;

  return (
    <div className="space-y-5">
      <div>
        <div className="flex justify-between gap-2.5">
          <h1 className="text-xl font-semibold">Hosts</h1>
          <Button
            variant="tertiary"
            size="sm"
            iconLeft="icon-plus"
            onClick={() => modal.open(AddHostModal, {
              dismissible: true,
              props: {
                event
              }
            })}
          >
            Add Host
          </Button>
        </div>
        <p className="text-secondary">Add hosts, special guests, and event managers.</p>
      </div>
      <div className="rounded-md border-card-border bg-card divide-border">
        <div className="flex justify-between items-center px-4 py-3">
          <div className="flex gap-2">
            <HostInfo host={event.host_expanded} />
            <Chip variant="success" size="xxs" className="rounded-full">Creator</Chip>
          </div>
          {/* edit */}
        </div>
      </div>
    </div>
  );
}

function HostInfo({ host }: { host: User }) {
  return (
    <div className="flex gap-3 items-center">
      <Avatar src={userAvatar(host)} className="size-5" />
      <div className="flex gap-2 items-center">
        <p>{host.display_name}</p>
        {/* <p>{host.email}</p> */}
      </div>
    </div>
  )
}
