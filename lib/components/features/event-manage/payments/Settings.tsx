'use client';
import { Button, InputField, Menu, MenuItem } from '$lib/components/core';

export function Settings() {
  return (
    <div className="page mx-auto py-6 px-4 md:px-0">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <h3 className="text-xl font-semibold flex-1">Vaults (5)</h3>
            <Button iconLeft="icon-plus" size="sm" variant="tertiary-alt">
              Add Vault
            </Button>
          </div>
          <InputField
            iconLeft="icon-search"
            placeholder="Search"
            // value={search}
            // onChangeText={(text) => {
            //   setSearch(text);
            //   debouncedPerformSearch(text);
            // }}
          />

          <div className="flex justify-between">
            <Menu.Root placement="bottom-start">
              <Menu.Trigger>
                {({ toggle }) => (
                  <>
                    <Button
                      iconLeft="icon-filter-line"
                      onClick={toggle}
                      size="sm"
                      variant="tertiary-alt"
                      className="hidden md:block"
                      iconRight="icon-chevron-down"
                    >
                      All Networks
                    </Button>
                    <Button
                      icon="icon-filter-line"
                      onClick={toggle}
                      size="sm"
                      variant="tertiary-alt"
                      className="md:hidden"
                    />
                  </>
                )}
              </Menu.Trigger>
              <Menu.Content className="p-2 w-52">{({ toggle }) => <>Content</>}</Menu.Content>
            </Menu.Root>

            <Menu.Root placement="bottom-end">
              <Menu.Trigger>
                {({ toggle }) => (
                  <>
                    <Button
                      iconLeft="icon-filter-line"
                      onClick={toggle}
                      size="sm"
                      variant="tertiary-alt"
                      className="hidden md:block"
                      iconRight="icon-chevron-down"
                    >
                      All Vaults
                    </Button>
                    <Button
                      icon="icon-filter-line"
                      onClick={toggle}
                      size="sm"
                      variant="tertiary-alt"
                      className="md:hidden"
                    />
                  </>
                )}
              </Menu.Trigger>
              <Menu.Content className="p-2 w-52">{({ toggle }) => <>Content</>}</Menu.Content>
            </Menu.Root>
          </div>
        </div>
      </div>
    </div>
  );
}
