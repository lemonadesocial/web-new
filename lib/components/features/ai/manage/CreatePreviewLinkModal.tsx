'use client';
import React from 'react';
import clsx from 'clsx';
import { CreatePreviewLinkDocument, PreviewLink, PreviewLinkType } from '$lib/graphql/generated/backend/graphql';
import { Button, InputField, Menu, MenuItem, modal, ModalContent, toast, Toggle } from '$lib/components/core';
import { useMutation } from '$lib/graphql/request';
import { copy } from '$lib/utils/helpers';

const expiredList = [
  { value: 1, label: '1 hour' },
  { value: 6, label: '6 hours' },
  { value: 24, label: '24 hours' },
  { value: 48, label: '48 hours' },
  { value: 168, label: '7 days' },
  { value: 0, label: 'Never' },
];

export function CreatePreviewLinkModal({
  onComplete,
  linkType,
  resourceId,
}: {
  onComplete: (link: PreviewLink) => void;
  linkType: PreviewLinkType;
  resourceId: string;
}) {
  const [requiredPassword, setRequiredPassword] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [expired, setExpired] = React.useState(() => expiredList.at(-1));

  const [createLink, { loading }] = useMutation(CreatePreviewLinkDocument, {
    onComplete(_, response) {
      if (response.createPreviewLink) {
        onComplete(response.createPreviewLink as PreviewLink);
        modal.close();
      }
    },
    onError: () => {
      toast.error('Failed to create preview link');
    },
  });

  return (
    <ModalContent icon="icon-link">
      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <p className="text-lg">Create Preview Link</p>
          <p className="text-sm text-secondary">Set access options for this preview link before sharing it.</p>
        </div>

        <div className="flex items-center justify-between">
          <p>Password Required</p>
          <Toggle id="preview-link-pw" checked={requiredPassword} onChange={(value) => setRequiredPassword(value)} />
        </div>

        {requiredPassword && (
          <InputField
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="[&_div.control]:pr-1.5! [&_div.control]:items-center [&_button]:bg-(--btn-tertiary) [&_button]:p-[7px] [&_button]:justify-center [&_button]:hover:bg-(--btn-tertiary-hover) [&_button]:rounded-xs [&_button]:flex [&_button]:items-center"
            right={
              password
                ? {
                    icon: 'icon-copy size-4',
                    onClick: () => copy(password, () => toast.success('Copied to clipboard! 📋')),
                  }
                : undefined
            }
          />
        )}

        <div className="flex justify-between items-center">
          <p className="text-sm text-secondary">Expires in</p>
          <Menu.Root strategy="fixed">
            <Menu.Trigger>
              {({ toggle, isOpen }) => (
                <div
                  onClick={toggle}
                  className="cursor-pointer bg-background/64 w-[150px] h-10 flex items-center px-3.5 border rounded-sm justify-between"
                >
                  <p>{expired?.label}</p>
                  <i className={clsx('icon-chevron-down size-5 text-quaternary', isOpen && 'rotate-180')} />
                </div>
              )}
            </Menu.Trigger>
            <Menu.Content className="max-w-[110px] p-1">
              {({ toggle }) => {
                return expiredList.map((item) => (
                  <MenuItem
                    key={item.value}
                    iconRight={item.value === expired?.value ? 'icon-done text-quaternary!' : undefined}
                    onClick={() => {
                      setExpired(item);
                      toggle();
                    }}
                    title={item.label}
                  ></MenuItem>
                ));
              }}
            </Menu.Content>
          </Menu.Root>
        </div>

        <Button
          variant="secondary"
          loading={loading}
          disabled={requiredPassword && !password.trim()}
          onClick={() => {
            createLink({
              variables: {
                input: {
                  link_type: linkType,
                  expires_in_hours: expired?.value || undefined,
                  password: requiredPassword && password ? password : undefined,
                  resource_id: resourceId,
                },
              },
            });
          }}
        >
          Create
        </Button>
      </div>
    </ModalContent>
  );
}
