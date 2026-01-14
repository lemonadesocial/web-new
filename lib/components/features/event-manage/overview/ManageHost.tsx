import { Avatar, Button, Chip, modal } from '$lib/components/core';
import { UserWithEmail, User, EventRole } from '$lib/graphql/generated/backend/graphql';
import { userAvatar } from '$lib/utils/user';
import { Event } from '$lib/graphql/generated/backend/graphql';
import { AddHostModal } from '../modals/AddHostModal';
import { ConfigureHostModal } from '../modals/ConfigureHostModal';

export function ManageHost({ event }: { event: Event }) {
  if (!event.host_expanded_new) return;

  const isVisible = (user: UserWithEmail) => {
    return event.visible_cohosts_expanded_new?.some((c) => c?.email === user?.email);
  };

  return (
    <div className="space-y-5">
      <div>
        <div className="flex justify-between gap-2.5">
          <h1 className="text-xl font-semibold">Hosts</h1>
          <Button
            variant="tertiary"
            size="sm"
            iconLeft="icon-plus"
            onClick={() =>
              modal.open(AddHostModal, {
                dismissible: true,
                props: {
                  event,
                },
              })
            }
          >
            Add Host
          </Button>
        </div>
        <p className="text-secondary">Add hosts, special guests, and event managers.</p>
      </div>
      <div className="rounded-md border-card-border bg-card divide-y divide-(--color-divider)">
        <div className="flex justify-between items-center px-4 py-3">
          <div className="flex gap-2">
            <HostInfo host={event.host_expanded_new as User} />
            <Chip variant="success" size="xxs" className="rounded-full">
              Creator
            </Chip>
          </div>
          <i
            className="icon-edit-sharp text-tertiary size-5 cursor-pointer"
            onClick={() =>
              modal.open(ConfigureHostModal, {
                dismissible: true,
                props: {
                  event,
                  user: event.host_expanded_new as User,
                  isVisible: isVisible(event.host_expanded_new as UserWithEmail),
                },
              })
            }
          />
        </div>
        {event.cohosts_expanded_new?.map((host, index) => (
          <div className="flex justify-between items-center px-4 py-3" key={index}>
            <div className="flex gap-2">
              <HostInfo host={host as User} />
              {
                host?.event_role === EventRole.Gatekeeper && (
                  <Chip variant="alert" size="xxs" className="rounded-full">
                    Promoter
                  </Chip>
                )
              }
              {
                !host?.event_role && (
                  <Chip variant="primary" size="xxs" className="rounded-full">
                    Cohost
                  </Chip>
                )
              }
            </div>
            <i
              className="icon-edit-sharp text-tertiary size-5 cursor-pointer"
              onClick={() =>
                modal.open(ConfigureHostModal, {
                  dismissible: true,
                  props: {
                    event,
                    user: host as User,
                    isVisible: isVisible(host as UserWithEmail),
                  },
                })
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function HostInfo({ host }: { host: User }) {
  return (
    <div className="flex gap-3 items-center">
      <Avatar src={userAvatar(host)} className="size-5" />
      <div className="flex gap-2 items-center">
        <p>{host.display_name || host.name || 'Anonymous'}</p>
        <p className="text-tertiary hidden md:block">{host.email}</p>
      </div>
    </div>
  );
}
