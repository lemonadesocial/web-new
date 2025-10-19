'use client';
import { Button, Card, Divider, Menu, MenuItem, Toggle } from '$lib/components/core';
import { Space } from '$lib/graphql/generated/backend/graphql';
import { ASSET_PREFIX } from '$lib/utils/constants';

export function SettingsCommunityAvanced({ space }: { space: Space }) {
  return (
    <div className="page mx-auto py-7 px-4 md:px-0 flex flex-col gap-8">
      <div className="flex flex-col gap-5">
        <div>
          <h3 className="text-xl font-semibold flex-1">Event Defaults</h3>
          <p className="text-secondary">Default settings for new events created on this community.</p>
        </div>

        <Card.Root>
          <Card.Content className="p-0 divide-y divide-(--color-divider)">
            <div className="flex justify-between items-center py-3 px-4">
              <div>
                <p>Event Visibility</p>
                <p className="text-sm text-tertiary">Whether events are shown on the community page.</p>
              </div>
              <Menu.Root>
                <Menu.Trigger>
                  {({ toggle }) => (
                    <Button size="sm" variant="tertiary-alt" onClick={toggle} iconRight="icon-chevron-down">
                      Public
                    </Button>
                  )}
                </Menu.Trigger>
                <Menu.Content>
                  {({ toggle }) => (
                    <>
                      <MenuItem title="Public" />
                      <MenuItem title="Private" />
                    </>
                  )}
                </Menu.Content>
              </Menu.Root>
            </div>

            <div className="flex justify-between items-center py-3 px-4">
              <div>
                <p>Public Guest List</p>
                <p className="text-sm text-tertiary">Whether to show guest list on event pages.</p>
              </div>
              <Toggle id="public-guest" onChange={() => {}} />
            </div>

            <div className="flex justify-between items-center py-3 px-4">
              <div>
                <p>Collect Feedback</p>
                <p className="text-sm text-tertiary">Email guests after the event to collect feedback.</p>
              </div>
              <Toggle id="public-guest" onChange={() => {}} />
            </div>
          </Card.Content>
        </Card.Root>

        <p className="text-secondary text-sm">
          Changing these defaults does not affect existing events. You can always change these settings for each
          individual event.
        </p>
      </div>

      <Divider />

      <div className="flex flex-col gap-5">
        <div>
          <h3 className="text-xl font-semibold flex-1">Custom Domain</h3>
          <p className="text-secondary">
            Turn your community into a fully customizable website. Get a free Lemonade domain or connect your own.
          </p>
        </div>

        <Card.Root>
          <Card.Content className="p-0 divide-y divide-(--color-divider)">
            <div className="flex justify-between items-center py-3 px-4">
              <div className="flex gap-3 items-center">
                <div className="p-1.5 bg-card rounded-sm size-7 aspect-square flex items-center justify-center">
                  <i className="icon-lemonade-logo text-[#FDE047] size-4" />
                </div>
                <div>
                  <p>Favicon</p>
                  <p className="text-sm text-tertiary">32x32px ICO, PNG, GIF, or JPG file recommended.</p>
                </div>
              </div>
              <Button size="sm" variant="tertiary-alt">
                Change Favicon
              </Button>
            </div>
            <div className="flex justify-between items-center py-3 px-4">
              <div className="flex gap-3 items-center">
                <div className="p-1.5 bg-card rounded-sm size-7 aspect-square flex items-center justify-center">
                  <i className="icon-info text-tertiary size-4" />
                </div>
                <div>
                  <p>Title & Description</p>
                  <p className="text-sm text-tertiary">Culture Fest</p>
                </div>
              </div>
              <i className="icon-chevron-right size-5 text-quaternary" />
            </div>
          </Card.Content>
        </Card.Root>
      </div>

      <Divider />

      <div className="flex flex-col gap-5">
        <div>
          <h3 className="text-xl font-semibold flex-1">Community Status</h3>
          <p className="text-secondary">Mark the community as coming soon or archive it if it is no longer active.</p>
        </div>

        <Card.Root>
          <Card.Content className="p-0 divide-y divide-(--color-divider)">
            <div className="flex justify-between items-center py-3 px-4">
              <div className="flex gap-3 items-center">
                <div className="p-1.5 bg-card rounded-sm size7 aspect-square flex items-center justify-center bg-success-400/16">
                  <i className="icon-calendar text-success-400 size-4" />
                </div>
                <div>
                  <p className="text-success-400">Active</p>
                  <p className="text-sm text-tertiary">
                    The community is active and accepting subscriptions and event submissions.
                  </p>
                </div>
              </div>
              <Button size="sm" variant="tertiary-alt">
                Change Status
              </Button>
            </div>
          </Card.Content>
        </Card.Root>
      </div>

      <Divider />

      <div>
        <Button iconLeft="icon-delete" variant="flat" className="text-danger-400!" size="sm">
          Permanently Delete Community
        </Button>
      </div>
    </div>
  );
}
