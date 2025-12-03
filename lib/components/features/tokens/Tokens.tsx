'use client';

import { Button, Card } from '$lib/components/core';
import { RadialProgress } from '$lib/components/core/progess/radial';
import { useScrollable } from '$lib/hooks/useScrollable';

export function Tokens() {
  return (
    <div className="flex flex-col gap-3 max-sm:pb-28 py-4 md:max-h-[calc(100dvh-56px)]">
      <Toolbar />

      <div className="flex flex-col md:grid grid-cols-3 gap-4 flex-1 overflow-hidden">
        <List data={[1, 2, 3, 4, 5, 6, 7, 8, 9]} title="New Tokens" onLoadMore={() => console.log('loading')} />
        <List data={[1, 2, 3]} title="Graduating Tokens" />
        <List data={[1, 2, 3]} title="Recently Graduated" />
      </div>
    </div>
  );
}

function Toolbar() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-2">
        <div className="text-sm flex gap-1 px-2.5 py-1.5 bg-(--btn-tertiary) w-fit rounded-sm">
          <p className="text-tertiary">Quick Buy Size:</p>
          <p className="text-secondary">0.0001 ETH</p>
        </div>
        <Button icon="icon-arrow-down rotate-180" size="sm" variant="tertiary-alt" />
        <Button icon="icon-arrow-down" size="sm" variant="tertiary-alt" />
      </div>

      <Button iconLeft="icon-plus" size="sm" variant="secondary" className="hidden md:block">
        Create Coin
      </Button>

      <Button icon="icon-plus" size="sm" variant="secondary" className="md:hidden">
        Create Coin
      </Button>
    </div>
  );
}

function List({ title, data = [], onLoadMore }: { title: string; data: any; onLoadMore?: () => void }) {
  const { ref } = useScrollable(onLoadMore);

  return (
    <Card.Root className="flex flex-col flex-1 max-sm:max-h-[700px] h-full">
      <Card.Header>
        <p>{title}</p>
      </Card.Header>

      <div ref={ref} className="flex-1 overflow-auto no-scrollbar">
        <Card.Content>
          <div className="flex flex-col gap-2">
            {data.map((_item: any, idx: number) => (
              <Card.Root key={idx}>
                <Card.Content className="py-3">
                  <div className="flex gap-4">
                    <div className="size-[114px] aspect-square rounded-sm bg-gray-300" />
                    <div className="text-tertiary text-sm w-full">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex justify-between">
                          <div>
                            <div className="flex gap-1 items-end">
                              <p className="text-base text-primary">$ETH</p>
                              <p className="text-sm">2h 10m ago</p>
                            </div>
                            <div className="flex gap-1.5 items-center text-sm">
                              <p className="text-tertiary">0x3a4b...q6r5</p>
                              <i className="icon-copy size-3.5 aspect-square text-quaternary" />
                            </div>
                          </div>

                          <RadialProgress value={50} label="1" size="size-10" color="text-blue-400" />
                        </div>

                        <div className="flex justify-between items-end">
                          <div className="flex flex-col gap-1">
                            <p>MC: $450.2K</p>
                            <p>VOL: $12.3K</p>
                            <div className="flex gap-2 items-center">
                              <i className="icon-user-group-outline size-4" />
                              <p className="text-secondary">350</p>
                            </div>
                          </div>
                          <Button variant="tertiary-alt" size="sm">
                            Quick Buy
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card.Content>
              </Card.Root>
            ))}
          </div>
        </Card.Content>
      </div>
    </Card.Root>
  );
}
