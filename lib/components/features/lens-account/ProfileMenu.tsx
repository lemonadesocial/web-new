import { Menu, MenuItem, modal } from "$lib/components/core";
import { useLogOut } from "$lib/hooks/useLens";

import { SelectProfileModal } from "./SelectProfileModal";

export function ProfileMenu({ children }: { children: React.ReactNode }) {
  const { logOut } = useLogOut();

  return (
    <Menu.Root>
      <Menu.Trigger>
        {children}
      </Menu.Trigger>
      <Menu.Content className="p-1">
        {({ toggle }) => <>
          <MenuItem
            onClick={async () => {
              modal.open(SelectProfileModal, { dismissible: true });
              toggle();
            }}
          >
            <div className="flex items-center gap-2.5">
              <i className="icon-renew size-4 text-secondary" />
              <p className="text-sm text-secondary">Switch Account</p>
            </div>
          </MenuItem>
          <MenuItem
            onClick={async () => {
              logOut();
              toggle();
            }}
          >
            <div className="flex items-center gap-2.5">
              <i className="icon-exit size-4 text-error" />
              <p className="text-sm text-error">Disconnect</p>
            </div>
          </MenuItem>
        </>}
      </Menu.Content>
    </Menu.Root>
  )
}
