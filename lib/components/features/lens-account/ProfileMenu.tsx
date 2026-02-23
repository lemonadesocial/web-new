import { useRouter } from 'next/navigation';

import { Menu, MenuItem, modal } from '$lib/components/core';
import { useAccount, useLogOut } from '$lib/hooks/useLens';

import { SelectProfileModal } from './SelectProfileModal';
import { EditProfileModal } from './EditProfileModal';

export function ProfileMenu({
  children,
  options = { canView: true, canEdit: true },
}: {
  children: React.ReactNode;
  options?: { canView?: boolean; canEdit?: boolean };
}) {
  const { logOut } = useLogOut();
  const router = useRouter();
  const { account } = useAccount();

  return (
    <Menu.Root>
      <Menu.Trigger>{children}</Menu.Trigger>
      <Menu.Content className="p-1">
        {({ toggle }) => (
          <>
            {account && options.canEdit && (
              <MenuItem onClick={async () => modal.open(EditProfileModal)}>
                <div className="flex items-center gap-2.5">
                  <i aria-hidden="true" className="icon-person-edit size-4 text-secondary" />
                  <p className="text-sm text-secondary">Edit Profile</p>
                </div>
              </MenuItem>
            )}

            {account?.username && options.canView && (
              <MenuItem onClick={async () => router.push(`/l/${account!.username!.localName}`)}>
                <div className="flex items-center gap-2.5">
                  <i aria-hidden="true" className="icon-account size-4 text-secondary" />
                  <p className="text-sm text-secondary">View Profile</p>
                </div>
              </MenuItem>
            )}

            <MenuItem
              onClick={async () => {
                modal.open(SelectProfileModal);
                toggle();
              }}
            >
              <div className="flex items-center gap-2.5">
                <i aria-hidden="true" className="icon-renew size-4 text-secondary" />
                <p className="text-sm text-secondary">Switch Profile</p>
              </div>
            </MenuItem>
            <MenuItem
              onClick={async () => {
                logOut();
                toggle();
              }}
            >
              <div className="flex items-center gap-2.5">
                <i aria-hidden="true" className="icon-exit size-4 text-error" />
                <p className="text-sm text-error">Disconnect</p>
              </div>
            </MenuItem>
          </>
        )}
      </Menu.Content>
    </Menu.Root>
  );
}
