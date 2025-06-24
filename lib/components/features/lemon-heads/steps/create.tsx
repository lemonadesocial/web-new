'use client';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import { UseFormReturn } from 'react-hook-form';
import { LemonHeadAccessory, LemonHeadBodyType, LemonHeadPageInfo } from '$lib/lemon-heads/types';
import { Card } from '$lib/components/core';
import { LemonHeadValues } from '../types';
import { SquareButton } from '../shared';

const menuOpts: Record<string, any> = {
  skin: { label: 'Skin Tone', icon: '', component: SkinToneItems },
  face: { label: 'Face', icon: 'icon-lh-mood', component: FaceItems },
  tops: { label: 'Tops', icon: 'icon-lh-tshirt-crew', component: TopItems },
  bottom: { label: 'Bottoms', icon: 'icon-lh-pants', component: BottomItems },
  outfits: { label: 'Outfits', icon: 'icon-lh-dress', component: OutfitItems },
  accessories: { label: 'Accessories', icon: 'icon-lh-glasses-fill', component: AccessoryItems },
  footwear: { label: 'Footwear', icon: 'icon-lh-footprint', component: FootwearItems },
  background: { label: 'Background', icon: '', component: BackgroundItems },
  pets: { label: 'Pets', icon: 'icon-lh-pets', component: PetItems },
};

export function CreateStep({
  bodyBase = [],
  form,
}: {
  form: UseFormReturn<LemonHeadValues>;
  bodyBase?: LemonHeadBodyType[];
}) {
  const [selected, setSelected] = React.useState('skin');

  return (
    <div className="flex w-full flex-1 gap-2">
      <Card.Root>
        <Card.Content className="flex flex-col gap-1 p-2 w-[96px] max-h-[692px] overflow-auto no-scrollbar">
          {Object.entries(menuOpts).map(([key, item]) => (
            <div
              key={key}
              className={clsx(
                'flex flex-col items-center justify-center gap-2 pt-3 px-2 pb-2 hover:bg-card-hover rounded-md cursor-pointer',
                key === selected && 'bg-card-hover',
              )}
              onClick={() => setSelected(key)}
            >
              <i className={twMerge('size-8', item.icon)} />
              <p className="text-xs">{item.label}</p>
            </div>
          ))}
        </Card.Content>
      </Card.Root>

      <Card.Root className="flex-1">
        <Card.Content className="p-0">
          {Object.entries(menuOpts).map(([key, item]) => {
            const Comp = item.component;
            return (
              <div key={key} className={clsx(selected !== key && 'hidden')}>
                <Comp bodyBase={bodyBase} form={form} />
              </div>
            );
          })}
        </Card.Content>
      </Card.Root>
    </div>
  );
}

const clamp = (value: number) => Math.max(0, value);

const isBetween = (value: number, floor: number, ceil: number) => value >= floor && value <= ceil;

const useScrollspy = (ids: string[], offset: number = 0) => {
  const [activeId, setActiveId] = React.useState('');

  React.useLayoutEffect(() => {
    const listener = () => {
      const scroll = window.pageYOffset;

      const position = ids
        .map((id) => {
          const element = document.getElementById(id);

          if (!element) return { id, top: -1, bottom: -1 };

          const rect = element.getBoundingClientRect();
          const top = clamp(rect.top + scroll - offset);
          const bottom = clamp(rect.bottom + scroll - offset);

          return { id, top, bottom };
        })
        .find(({ top, bottom }) => isBetween(scroll, top, bottom));

      setActiveId(position?.id || '');
    };

    listener();

    window.addEventListener('resize', listener);
    window.addEventListener('scroll', listener);

    return () => {
      window.removeEventListener('resize', listener);
      window.removeEventListener('scroll', listener);
    };
  }, [ids, offset]);

  return activeId;
};

function SkinToneItems() {
  return <>Skin Tone</>;
}

const faceItems = [
  { value: 'eyes', label: 'Eyes' },
  { value: 'mouth', label: 'Mouth' },
  { value: 'hair', label: 'Hair' },
  { value: 'facial_hair', label: 'Facial Hair' },
];
function FaceItems({ form }: { form: UseFormReturn<LemonHeadValues> }) {
  const [loading, setLoading] = React.useState(false);
  const [selected, setSelected] = React.useState('eyewear');
  const [list, setList] = React.useState<LemonHeadAccessory[]>([]);

  const fetchData = async (data: LemonHeadAccessory[] = []) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        where: '(type,anyof,eyes,mouth,hair,facial_hair)',
        offset: data.length.toString(),
        limit: '100',
      }).toString();
      const res = await fetch('/api/lemonhead/accessories?' + decodeURI(params), { method: 'GET' });
      const json = (await res.json()) as { list: LemonHeadAccessory[]; pageInfo: LemonHeadPageInfo };
      const result = [...data, ...json.list] as LemonHeadAccessory[];
      if (!json.pageInfo?.isLastPage) {
        fetchData(result);
      }

      setList(result);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const activeId = useScrollspy(faceItems.map((i) => i.value));

  if (loading) return null;

  const [eyes, mouth, hair, facial_hair] = form.watch(['eyes', 'mouth', 'hair', 'facial_hair']);

  return (
    <div className="max-h-[692px] divide-y divide-[var(--color-divider)] flex flex-col gap">
      <ul className="flex px-4 py-3">
        {faceItems.map((item) => (
          <li key={item.value}>
            <a href={`#${item.value}`} onClick={() => setSelected(item.value)}>
              <div
                className={clsx(
                  'px-2.5 py-1.5 text-tertiary hover:bg-[var(--btn-tertiary)] rounded-sm font-medium text-sm',
                  selected === item.value && 'text-primary bg-[var(--btn-tertiary)]!',
                )}
              >
                {item.label}
              </div>
            </a>
          </li>
        ))}
      </ul>

      <div className="scroll-smooth overflow-auto p-4 divide-y divide-[var(--color-divider)] space-y-4 no-scrollbar">
        <ListView
          id="eyes"
          data={list.filter((i) => i.type === 'eyes')}
          title="Eyes"
          selected={eyes?.Id}
          onClick={(item) => form.setValue('eyes', item)}
        />
        <ListView
          id="mouth"
          data={list.filter((i) => i.type === 'mouth')}
          title="Mounth"
          selected={mouth?.Id}
          onClick={(item) => form.setValue('mouth', item)}
        />
        <ListView
          id="hair"
          data={list.filter((i) => i.type === 'hair')}
          title="Hair"
          selected={hair?.Id}
          onClick={(item) => form.setValue('hair', item)}
        />
        <ListView
          id="facial_hair"
          data={list.filter((i) => i.type === 'facial_hair')}
          title="Facial Hair"
          selected={facial_hair?.Id}
          onClick={(item) => form.setValue('facial_hair', item)}
        />
      </div>
    </div>
  );
}

function TopItems() {
  return <>Tops</>;
}

function BottomItems() {
  return <>Bottoms</>;
}

function OutfitItems() {
  return <>Outfits</>;
}

function AccessoryItems() {
  return <>Accessories</>;
}

function FootwearItems() {
  return <>Footwear</>;
}

function BackgroundItems() {
  return <>Background</>;
}

function PetItems() {
  return <>Pets</>;
}

function ListView({
  data = [],
  title,
  onClick,
  selected,
  id,
}: {
  id: string;
  data?: LemonHeadAccessory[];
  title?: string;
  selected?: number;
  onClick: (item: LemonHeadAccessory) => void;
}) {
  return (
    <div id={id} className="flex flex-col gap-4 pb-4">
      {title && <p>{title}</p>}
      <div className="grid grid-cols-3 gap-3">
        {data.map((i) => (
          <div key={i.Id} className="text-center space-y-1">
            <SquareButton active={i.Id === selected} className="flex-col items-stretch" onClick={() => onClick(i)}>
              <img src={i.attachment?.[0]?.thumbnails.card_cover.signedUrl} />
            </SquareButton>
            <p className={clsx('text-sm', i.Id === selected ? 'text-primary' : 'text-tertiary')}>{i.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
