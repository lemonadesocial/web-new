'use client';

import clsx from 'clsx';
import { motion } from 'framer-motion';
import { match } from 'ts-pattern';

import { Button, Menu, toast } from '$lib/components/core';
import { useMutation } from '$lib/graphql/request';
import { Event, PublishEventDocument } from '$lib/graphql/generated/backend/graphql';

import { useUpdateEvent } from '../../event-manage/store';
import { tabMappings } from './helpers';
import { ActiveTabType, storeManageLayout as store, useStoreManageLayout } from './store';

const devices = {
  desktop: {
    icon: 'icon-computer',
  },
  mobile: {
    icon: 'icon-smartphone',
  },
};

function ManageLayoutToolbar() {
  const state = useStoreManageLayout();

  // NOTE: its bc using different store
  const updateEvent = useUpdateEvent();

  const [publishEvent, { loading: publishingEvent }] = useMutation(PublishEventDocument, {
    onComplete: (_, data) => {
      if (data?.updateEvent?.published) {
        toast.success('Event published successfully!');
        updateEvent({ published: true });
        store.setData({ ...state.data, published: true } as Event);
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to publish event');
    },
  });

  const handlePublish = () => {
    match(state.layoutType)
      .with('event', () => {
        if (state.data?._id) {
          publishEvent({
            variables: {
              event: state.data._id,
            },
          });
        }
      })
      .otherwise(() => {});
  };

  return (
    <div className="h-14 flex items-center px-4 gap-4">
      <motion.div
        initial={false}
        animate={{ width: state.showSidebarLeft ? 424 : 'auto' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="flex items-center gap-3 overflow-hidden"
      >
        <i className="icon-lemonade-logo size-5" />
        <Menu.Root className="flex-1">
          <Menu.Trigger>
            {({ toggle }) => (
              <div className="flex items-center gap-3 cursor-pointer" onClick={toggle}>
                <div className="w-8 h-8 rounded-sm aspect-square bg-accent-200 shrink-0" />
                <div className="whitespace-nowrap">
                  <p className="text-sm font-medium">Culture Fest</p>
                  <p className="text-tertiary text-xs">Arts & Culture</p>
                </div>
              </div>
            )}
          </Menu.Trigger>
        </Menu.Root>

        <Button
          icon="icon-left-panel-close-outline"
          size="sm"
          variant="tertiary-alt"
          onClick={() => store.toggleSidebarLeft()}
          className="shrink-0"
        />
      </motion.div>

      <div className="flex flex-1 justify-between items-center gap-2">
        <div className="flex gap-2">
          <div className="bg-(--btn-tertiary) backdrop-blur-md rounded-sm">
            {Object.entries(tabMappings).map(([key, item]) => (
              <Button
                key={key}
                iconLeft={item.icon}
                variant="tertiary"
                size="sm"
                onClick={() => store.setActiveTab(key as ActiveTabType)}
                className={clsx(state.activeTab !== key ? 'bg-transparent!' : 'text-primary!')}
              >
                {state.activeTab === key && item.label}
              </Button>
            ))}
          </div>

          <div className="bg-(--btn-tertiary) backdrop-blur-md rounded-sm">
            {Object.entries(devices).map(([key, item]) => (
              <Button
                key={key}
                icon={item.icon}
                variant="tertiary"
                size="sm"
                onClick={() => store.setPreviewMode(key as any)}
                className={clsx(state.device !== key ? 'bg-transparent!' : 'text-primary!')}
              ></Button>
            ))}
          </div>

          <Button
            variant="tertiary-alt"
            icon="icon-arrow-outward"
            size="sm"
            onClick={() => {
              match(state.layoutType).with('event', () => window.open(`/e/${(state.data as Event)?.shortid}`));
            }}
          />
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            iconLeft="icon-arrow-shape-up-stack-outline"
            onClick={() => {
              toast.success('Coming Soon.');
              // router.push('/upgrade-to-pro');
            }}
          >
            Upgrade
          </Button>
          <Button size="sm" onClick={handlePublish} loading={publishingEvent}>
            {(state.data as Event)?.published ? 'Published' : 'Publish'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ManageLayoutToolbar;
