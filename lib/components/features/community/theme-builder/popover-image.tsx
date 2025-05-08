import { Menu } from '$lib/components/core';
import { SystemFileBase } from '$lib/graphql/generated/backend/graphql';
import clsx from 'clsx';

type Props = {
  images?: SystemFileBase[];
  selected?: SystemFileBase;
  onSelect: (image: any) => void;
};

export function PopoverImage({ images = [], selected, onSelect }: Props) {
  return (
    <Menu.Root placement="top" strategy="fixed" className="flex-1">
      <Menu.Trigger>
        <div className="w-full bg-primary/8 text-tertiary px-2.5 py-2 rounded-sm flex items-center gap-2">
          <img src={selected?.url} className="size-[24px] aspect-square rounded" />
          <span className="text-left flex-1  font-general-sans">Background</span>
          <p className="flex items-center gap-1">
            <span className="capitalize">{selected?.name}</span>
            <i className="icon-chevrons-up-down text-quaternary" />
          </p>
        </div>
      </Menu.Trigger>
      <Menu.Content className="grid grid-cols-4 gap-3">
        {images.map((item) => (
          <div
            key={item._id}
            className={clsx('flex flex-col items-center gap-1 cursor-pointer')}
            onClick={() => onSelect(item)}
          >
            <div className={clsx('rounded-sm outline-offset-2', item._id === selected?._id && 'outline-2')}>
              <img src={item.url} className="aspect-[4/3] h-[48px] rounded-sm self-stretch" loading="lazy" />
            </div>
            <p className="text-xs font-normal text-tertiary">{item.name}</p>
          </div>
        ))}
      </Menu.Content>
    </Menu.Root>
  );
}
