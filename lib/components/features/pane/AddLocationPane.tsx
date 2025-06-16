'use client';
import { Accordion, Button, Checkbox, Divider, drawer, Map, Radiobox } from '$lib/components/core';
import { PlaceAutoComplete } from '$lib/components/core/map/place-autocomplete';
import { Address, UpdateUserDocument } from '$lib/graphql/generated/backend/graphql';
import { useMutation } from '$lib/graphql/request';
import { useMe } from '$lib/hooks/useMe';
import clsx from 'clsx';
import React from 'react';

export function AddLocationPane({
  address,
  onConfirm,
}: {
  address?: Address;
  onConfirm?: (params: { address?: Address; retrict: boolean }) => void;
}) {
  const me = useMe();
  const [selectedAddress, setSelectedAddress] = React.useState<{ address: Address; retrict: boolean; save: boolean }>();
  const [selected, setSelected] = React.useState({ address, retrict: false, save: false });

  const [updateUserAddresses, { loading }] = useMutation(UpdateUserDocument);

  return (
    <div className="flex flex-col h-full">
      <PaneHeader />

      <div className="flex-1 overflow-auto no-scrollbar">
        <div className="flex flex-col gap-4 px-4 pt-4 pb-6!">
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-semibold">Add Location</h3>
            <p className="text-secondary">Add your event location so guests know where to show up.</p>
          </div>
          <PlaceAutoComplete
            autoFocus
            label="Event Location"
            placeholder={`What's the address?`}
            onSelect={(value) => {
              setSelectedAddress({ address: value, retrict: false, save: false });
              setSelected((prev) => ({ ...prev, address: value, retrict: false }));
            }}
          />

          {selectedAddress?.address?.latitude && selectedAddress?.address?.longitude && (
            <>
              <div className="aspect-video h-[240px] rounded-sm overflow-hidden">
                <Map
                  gestureHandling="greedy"
                  defaultZoom={11}
                  center={{ lat: selectedAddress?.address?.latitude, lng: selectedAddress?.address?.longitude }}
                  markers={[{ lat: selectedAddress?.address?.latitude, lng: selectedAddress?.address?.longitude }]}
                />
              </div>

              <Checkbox
                id="checkbox_retrict"
                value={selectedAddress.retrict}
                onChange={() => setSelectedAddress({ ...selectedAddress, retrict: !selectedAddress?.retrict })}
                containerClass="items-center"
              >
                <p className="text-primary">Restrict Location to Guests</p>
                <p className="text-sm text-tertiary">Only approved and invited guests can see the precise location.</p>
              </Checkbox>

              <Checkbox
                id="checkbox_save"
                value={selectedAddress.save}
                onChange={() => setSelectedAddress({ ...selectedAddress, save: !selectedAddress?.save })}
                containerClass="items-center"
              >
                <p className="text-primary">Add to Saved Locations</p>
                <p className="text-sm text-tertiary">
                  Add this spot to your saved locations for faster access next time.
                </p>
              </Checkbox>
            </>
          )}
        </div>

        <div className="px-4">
          <Divider />
        </div>

        {me?.addresses?.length && (
          <div className="flex flex-col gap-4 px-4 py-6">
            <p className="text-lg">Saved Locations</p>

            <div className="flex flex-col gap-2">
              {me.addresses.map((item) => {
                return (
                  <Accordion.Root
                    key={item._id}
                    open={item._id === selected.address?._id}
                    className={clsx(
                      'bg-card!',
                      item._id === selected?.address?._id && 'border-[var(--color-primary)]! bg-transparent!',
                    )}
                  >
                    <Accordion.Header chevron={false} className="px-0! py-0!" disabled>
                      {({ toggle }) => (
                        <div className="flex w-full items-center z-10 px-3! py-2.5!">
                          <div className="flex-1">
                            <Radiobox
                              containerClass="items-center"
                              id={item._id}
                              name="select-location"
                              value={item._id === selected?.address?._id}
                              onChange={(e) => {
                                e.stopPropagation();
                                toggle();
                                setSelected({ ...selected, address: item, retrict: false });
                                setSelectedAddress(undefined);
                              }}
                            >
                              <span className="flex flex-col flex-1 w-full">
                                <span className="font-medium text-primary">{item.title}</span>
                                <span className="text-secondary text-sm">{item.street_1}</span>
                              </span>
                            </Radiobox>
                          </div>
                          <Button icon="icon-more-vert" variant="flat"></Button>
                        </div>
                      )}
                    </Accordion.Header>
                    <Accordion.Content className="px-3! py-0! ">
                      <Divider />
                      <div className="py-2.5">
                        <Checkbox
                          id={`checkbox_${item._id}`}
                          value={selected.address?._id === item._id ? selected.retrict : false}
                          onChange={() => setSelected((prev) => ({ ...prev, retrict: !prev.retrict }))}
                          containerClass="items-center"
                        >
                          <p className="text-primary">Restrict Location to Guests</p>
                          <p className="text-sm text-tertiary">
                            Only approved and invited guests can see the precise location.
                          </p>
                        </Checkbox>
                      </div>
                    </Accordion.Content>
                  </Accordion.Root>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="py-3 px-4 border-t">
        <Button
          variant="secondary"
          disabled={!selected.address}
          loading={loading}
          onClick={async () => {
            if (selectedAddress?.save) {
              const arr = me?.addresses?.map(({ __typename, ...rest }) => rest) || [];
              await updateUserAddresses({
                variables: { input: { addresses: [selectedAddress.address, ...arr] } },
              });
            }
            onConfirm?.(selected);
            drawer.close();
          }}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
}

function PaneHeader() {
  return (
    <div className="px-3 py-2 flex gap-3 border-b sticky top-0 z-50 backdrop-blur-xl">
      <Button icon="icon-chevron-double-right" variant="tertiary-alt" size="sm" onClick={() => drawer.close()} />
    </div>
  );
}
