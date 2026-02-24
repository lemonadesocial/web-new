'use client';

import { Button, Menu } from '$lib/components/core';
import Header from '$lib/components/layouts/header';
import clsx from 'clsx';
import React from 'react';

const buttons = {
  settings: {
    icon: 'icon-settings',
    label: 'Settings',
  },
  design: {
    icon: 'icon-settings',
    label: 'Design',
  },
  preview: {
    icon: 'icon-settings',
    label: 'Preview',
  },
};

const previewButtons = {
  desktop: {
    icon: 'icon-settings',
  },
  mobile: {
    icon: 'icon-settings',
  },
};

function ManageLayout() {
  const [mode, setMode] = React.useState('settings');
  const [previewMode, setPreviewMode] = React.useState('desktop');
  const [toggleChat, setToggleChat] = React.useState(false);

  return (
    <>
      <Header showUI={false} />
      <div className="h-dvh flex flex-col">
        <div className="h-14 flex items-center px-4 gap-4">
          <div
            className={clsx(
              'flex transition-all ease-in-out duration-300 items-center justify-between gap-3 max-w-[424px]',
              !toggleChat ? 'w-fit' : 'w-full',
            )}
          >
            <Menu.Root>
              <Menu.Trigger>
                {({ toggle }) => (
                  <div className="flex gap-3" onClick={toggle}>
                    <div className="w-8 h-8 rounded-sm aspect-square bg-accent-200" />
                    <div>
                      <p className="text-sm">Culture Fest</p>
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
              onClick={() => setToggleChat(!toggleChat)}
            />
          </div>

          <div className="flex gap-2">
            <div className="bg-(--btn-tertiary) backdrop-blur-md rounded-sm">
              {Object.entries(buttons).map(([key, item]) => (
                <Button
                  key={key}
                  iconLeft={item.icon}
                  variant="tertiary"
                  size="sm"
                  onClick={() => setMode(key)}
                  className={clsx(mode !== key ? 'bg-transparent!' : 'text-primary!')}
                >
                  {mode === key && item.label}
                </Button>
              ))}
            </div>

            <div className="bg-(--btn-tertiary) backdrop-blur-md rounded-sm">
              {Object.entries(previewButtons).map(([key, item]) => (
                <Button
                  key={key}
                  icon={item.icon}
                  variant="tertiary"
                  size="sm"
                  onClick={() => setPreviewMode(key)}
                  className={clsx(previewMode !== key ? 'bg-transparent!' : 'text-primary!')}
                ></Button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-4 px-1 flex-1 overflow-hidden">
          {toggleChat && <div className="w-full max-w-[424px]">Chat here</div>}
          <div
            className={clsx('bg-(--btn-tertiary) w-full h-full rounded-md pb-1', previewMode === 'mobile' && 'py-4')}
          >
            <div
              className={clsx(
                'bg-accent-300 w-full h-full rounded-md overflow-auto',
                previewMode === 'mobile' && 'max-w-sm mx-auto',
              )}
            >
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>

              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>

              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>

              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>

              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>

              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
              <p>Content</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ManageLayout;
