'use client';

import clsx from 'clsx';
import { motion } from 'framer-motion';
import { ActiveTabType, storeManageLayout as store, useStoreManageLayout } from './store';
import { Button, Menu } from '$lib/components/core';
import { tabMappings } from './helpers';

const devices = {
  desktop: {
    icon: 'icon-settings',
  },
  mobile: {
    icon: 'icon-settings',
  },
};

function ManageLayoutToolbar() {
  const state = useStoreManageLayout();

  return (
    <div className="h-14 flex items-center px-4 gap-4">
      <motion.div
        initial={false}
        animate={{ width: state.showSidebarLeft ? 424 : 'auto' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="flex items-center justify-between gap-3 overflow-hidden"
      >
        <Menu.Root>
          <Menu.Trigger>
            {({ toggle }) => (
              <div className="flex gap-3 cursor-pointer" onClick={toggle}>
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
        </div>

        <div className="flex gap-2">
          <Button size="sm" variant="secondary" iconLeft="icon-arrow-shape-up-stack-outline">
            Upgrade
          </Button>
          <Button size="sm">Public</Button>
        </div>
      </div>
    </div>
  );
}

export default ManageLayoutToolbar;
