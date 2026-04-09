import { Button, Menu, MenuItem, modal, toast } from '$lib/components/core';
import { Event, GetSpacesDocument, Space, SpaceRole, UpdateEventSettingsDocument } from '$lib/graphql/generated/backend/graphql';
import { useMutation, useQuery } from '$lib/graphql/request';
import { communityAvatar } from '$lib/utils/community';
import { UpdateVisibilityModal } from '../modals/UpdateVisibilityModal';
import { useUpdateEvent } from '../store';

export function VisibilityDiscovery({ event }: { event: Event }) {
  const updateEvent = useUpdateEvent();
  const space = event.space_expanded;
  const { data: spacesData } = useQuery(GetSpacesDocument, {
    variables: {
      with_my_spaces: true,
      roles: [SpaceRole.Admin, SpaceRole.Creator, SpaceRole.Ambassador],
    },
    fetchPolicy: 'cache-and-network',
  });
  const [transferEvent, { loading: transferring }] = useMutation(UpdateEventSettingsDocument);
  const manageableSpaces = ((spacesData?.listSpaces || []) as Space[])
    .slice()
    .sort((a, _) => (a.personal ? -1 : 1));

  const handleTransferEvent = async (nextSpace: Space, closeMenu: () => void) => {
    if (nextSpace._id === event.space) {
      closeMenu();
      return;
    }

    const { error } = await transferEvent({
      variables: {
        id: event._id,
        input: {
          space: nextSpace._id,
        },
      },
    });

    if (error) {
      toast.error((error as Error)?.message || `Failed to transfer to ${nextSpace.title}`);
      return;
    }

    updateEvent({
      space: nextSpace._id,
      space_expanded: nextSpace,
    });
    toast.success(`Transferred to ${nextSpace.title}.`);
    closeMenu();
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold">Visibility & Discovery</h1>
        <p className="text-secondary">Control how people can find your event.</p>
      </div>

      <div className="flex py-3 px-3.5 gap-3 rounded-md border border-card-border bg-card">
        <img src={communityAvatar(space)} className="size-9 rounded-sm border border-card-border" />
        <div className="space-y-1.5">
          <div>
            <p className="text-xs text-tertiary">Managing Community</p>
            <p className="text-sm font-medium">{space?.title}</p>
          </div>
          <div className="text-tertiary text-sm">
            {event.private ? (
              <>
                <i aria-hidden="true" className="icon-sparkles text-warning-300 size-4" />{' '}
                <span className="text-warning-300 content-baseline text-sm align-middle">Private</span> {' — '}
                <span className="align-middle">
                  This event is not listed on the calendar page. Calendar admins have manage access to the event.
                </span>
              </>
            ) : (
              <>
                <i aria-hidden="true" className="icon-globe text-success-500 size-4" />{' '}
                <span className="text-success-500 content-baseline text-sm align-middle">Public</span> {' — '}
                <span className="align-middle">
                  This event is listed on the calendar page. Calendar admins have manage access to the event.
                </span>
              </>
            )}
          </div>
          <div className="pt-1 flex gap-2">
            <Button
              variant="tertiary"
              size="sm"
              iconLeft="icon-visibility"
              onClick={() => modal.open(UpdateVisibilityModal, { props: { event }, className: 'overflow-visible' })}
            >
              Change Visibility
            </Button>
            {!!manageableSpaces.length && (
              <Menu.Root placement="bottom-start">
                <Menu.Trigger>
                  <Button variant="tertiary" size="sm" iconLeft="icon-send-money" loading={transferring}>
                    Transfer Event
                  </Button>
                </Menu.Trigger>
                <Menu.Content className="w-70 p-1 max-h-60 overflow-auto">
                  {({ toggle }) =>
                    manageableSpaces.map((item) => (
                      <MenuItem
                        key={item._id}
                        onClick={() => handleTransferEvent(item, toggle)}
                        iconRight={item._id === event.space ? 'icon-check text-primary!' : undefined}
                        className="max-w-none"
                        iconLeft={
                          <img
                            src={communityAvatar(item)}
                            alt={item.title}
                            className="size-5 rounded-xs border border-card-border object-cover"
                            loading="lazy"
                          />
                        }
                      >
                        <p className="font-medium text-sm font-default-body text-secondary flex-1 truncate">{item.title}</p>
                      </MenuItem>
                    ))
                  }
                </Menu.Content>
              </Menu.Root>
            )}
          </div>
        </div>
      </div>

      {event.private && (
        <div className="flex gap-2 items-center">
          <i aria-hidden="true" className="icon-globe size-4 text-tertiary" />
          <p className="text-tertiary text-sm">
            To be eligible for being featured on Lemonade discovery pages and communities, please set the visibility of
            the event to public.
          </p>
        </div>
      )}
    </div>
  );
}
