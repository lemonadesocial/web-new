import { Button, modal } from '$lib/components/core';
import { Event } from '$lib/graphql/generated/backend/graphql';
import { communityAvatar } from '$lib/utils/community';
import { UpdateVisibilityModal } from '../modals/UpdateVisibilityModal';

export function VisibilityDiscovery({ event }: { event: Event }) {
  const space = event.space_expanded;

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
                <i className="icon-sparkles text-warning-300 size-4" />{' '}
                <span className="text-warning-300 content-baseline text-sm align-middle">Private</span> {' — '}
                <span className="align-middle">
                  This event is not listed on the calendar page. Calendar admins have manage access to the event.
                </span>
              </>
            ) : (
              <>
                <i className="icon-globe text-success-500 size-4" />{' '}
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
          </div>
        </div>
      </div>

      {event.private && (
        <div className="flex gap-2 items-center">
          <i className="icon-globe size-4 text-tertiary" />
          <p className="text-tertiary text-sm">
            To be eligible for being featured on Lemonade discovery pages and communities, please set the visibility of
            the event to public.
          </p>
        </div>
      )}
    </div>
  );
}
