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
  const skin_tone = form.watch('skin_tone');

  return (
    <div className="flex w-full flex-1 gap-2">
      <Card.Root>
        <Card.Content className="flex flex-col gap-1 p-2 w-[96px] max-h-[692px] overflow-auto no-scrollbar">
          {Object.entries(menuOpts).map(([key, item]) => {
            return (
              <div
                key={key}
                className={clsx(
                  'flex flex-col items-center justify-center gap-2 pt-3 px-2 pb-2 hover:bg-card-hover rounded-md cursor-pointer',
                  key === selected && 'bg-card-hover',
                )}
                onClick={() => setSelected(key)}
              >
                {key === 'skin' && <div className="size-8 rounded-full" style={{ background: skin_tone.color }} />}
                {key !== 'skin' && <i className={twMerge('size-8', item.icon)} />}
                <p className="text-xs">{item.label}</p>
              </div>
            );
          })}
        </Card.Content>
      </Card.Root>

      <Card.Root className="flex-1">
        <Card.Content className="p-0 max-h-[692px] overflow-auto no-scrollbar scroll-smooth">
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

// const clamp = (value: number) => Math.max(0, value);
//
// const isBetween = (value: number, floor: number, ceil: number) => value >= floor && value <= ceil;
//
// const useScrollspy = (ids: string[], offset: number = 0) => {
//   const [activeId, setActiveId] = React.useState('');
//
//   React.useLayoutEffect(() => {
//     const listener = () => {
//       const scroll = window.pageYOffset;
//
//       const position = ids
//         .map((id) => {
//           const element = document.getElementById(id);
//
//           if (!element) return { id, top: -1, bottom: -1 };
//
//           const rect = element.getBoundingClientRect();
//           const top = clamp(rect.top + scroll - offset);
//           const bottom = clamp(rect.bottom + scroll - offset);
//
//           return { id, top, bottom };
//         })
//         .find(({ top, bottom }) => isBetween(scroll, top, bottom));
//
//       setActiveId(position?.id || '');
//     };
//
//     listener();
//
//     window.addEventListener('resize', listener);
//     window.addEventListener('scroll', listener);
//
//     return () => {
//       window.removeEventListener('resize', listener);
//       window.removeEventListener('scroll', listener);
//     };
//   }, [ids, offset]);
//
//   return activeId;
// };

const skinToneOpts = [
  { value: 'light', label: 'Soft', color: '#FDCCA8' },
  { value: 'tan', label: 'Medium', color: '#E0955F' },
  { value: 'brown', label: 'Rich', color: '#984F1B' },
  { value: 'dark', label: 'Bold', color: '#6C350D' },
];
function SkinToneItems({ form }: { form: UseFormReturn<LemonHeadValues> }) {
  const skin_tone = form.watch('skin_tone');
  return (
    <div className="grid grid-cols-2 text-center gap-3 p-4">
      {skinToneOpts.map((item) => (
        <div
          key={item.value}
          className="flex flex-col gap-1"
          onClick={() => form.setValue('skin_tone', { value: item.value, color: item.color })}
        >
          <SquareButton active={skin_tone.value === item.value} style={{ background: item.color }}></SquareButton>
          <p>{item.label}</p>
        </div>
      ))}
    </div>
  );
}

const faceOpts = [
  { value: 'eyes', label: 'Eyes' },
  { value: 'mouth', label: 'Mouth' },
  { value: 'hair', label: 'Hair' },
  { value: 'facial_hair', label: 'Facial Hair' },
];
function FaceItems({ form }: { form: UseFormReturn<LemonHeadValues> }) {
  const [loading, setLoading] = React.useState(false);
  const [selected, setSelected] = React.useState('eyes');
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

  // const activeId = useScrollspy(faceItems.map((i) => i.value));

  if (loading) return <Loading />;

  const [eyes, mouth, hair, facial_hair] = form.watch(['eyes', 'mouth', 'hair', 'facial_hair']);

  return (
    <div className="divide-y divide-[var(--color-divider)] flex flex-col gap">
      <ul className="flex px-4 py-3">
        {faceOpts.map((item) => (
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

      <div className="p-4 divide-y divide-[var(--color-divider)] space-y-4">
        <ListView
          id="eyes"
          data={list.filter((i) => i.type === 'eyes')}
          title="Eyes"
          selected={eyes?.Id}
          onClick={(item) => form.setValue('eyes', { Id: item.Id, attachment: item.attachment })}
        />
        <ListView
          id="mouth"
          data={list.filter((i) => i.type === 'mouth')}
          title="Mounth"
          selected={mouth?.Id}
          onClick={(item) => form.setValue('mouth', { Id: item.Id, attachment: item.attachment })}
        />
        <ListView
          id="hair"
          data={list.filter((i) => i.type === 'hair')}
          title="Hair"
          selected={hair?.Id}
          onClick={(item) => form.setValue('hair', { Id: item.Id, attachment: item.attachment })}
        />
        <ListView
          id="facial_hair"
          data={list.filter((i) => i.type === 'facial_hair')}
          title="Facial Hair"
          selected={facial_hair?.Id}
          onClick={(item) => form.setValue('facial_hair', { Id: item.Id, attachment: item.attachment })}
        />
      </div>
    </div>
  );
}

function TopItems({ form }: { form: UseFormReturn<LemonHeadValues> }) {
  const top = form.watch('top');
  return (
    <ViewWithoutTab
      field={top}
      filter="top"
      onClick={(item) => form.setValue('top', { Id: item.Id, attachment: item.attachment })}
    />
  );
}

function BottomItems({ form }: { form: UseFormReturn<LemonHeadValues> }) {
  const bottom = form.watch('bottom');

  return (
    <ViewWithoutTab
      field={bottom}
      filter="bottom"
      onClick={(item) => form.setValue('bottom', { Id: item.Id, attachment: item.attachment })}
    />
  );
}

function OutfitItems({ form }: { form: UseFormReturn<LemonHeadValues> }) {
  const outfit = form.watch('outfit');

  return (
    <ViewWithoutTab
      field={outfit}
      filter="outfit"
      onClick={(item) => form.setValue('outfit', { Id: item.Id, attachment: item.attachment })}
    />
  );
}

const accessoryOpts = [
  { value: 'eyewear', label: 'Eyewear' },
  { value: 'mouthgear', label: 'Mouthgear' },
  { value: 'headgear', label: 'Headgear' },
];
function AccessoryItems({ form }: { form: UseFormReturn<LemonHeadValues> }) {
  const [loading, setLoading] = React.useState(false);
  const [selected, setSelected] = React.useState('eyewear');
  const [list, setList] = React.useState<LemonHeadAccessory[]>([]);

  const fetchData = async (data: LemonHeadAccessory[] = []) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        where: '(type,anyof,eyewear,mouthgear,headgear)',
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

  // const activeId = useScrollspy(faceItems.map((i) => i.value));

  if (loading) return <Loading />;

  const [eyewear, mouthgear, headgear] = form.watch(['eyewear', 'mouthgear', 'headgear']);

  return (
    <div className="divide-y divide-[var(--color-divider)] flex flex-col gap">
      <ul className="flex px-4 py-3">
        {accessoryOpts.map((item) => (
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

      <div className="p-4 divide-y divide-[var(--color-divider)] space-y-4">
        <ListView
          id="eyewear"
          data={list.filter((i) => i.type === 'eyewear')}
          title="Eyes"
          selected={eyewear?.Id}
          onClick={(item) => form.setValue('eyewear', { Id: item.Id, attachment: item.attachment })}
        />
        <ListView
          id="mouthgear"
          data={list.filter((i) => i.type === 'mouthgear')}
          title="Mounth"
          selected={mouthgear?.Id}
          onClick={(item) => form.setValue('mouthgear', { Id: item.Id, attachment: item.attachment })}
        />
        <ListView
          id="headgear"
          data={list.filter((i) => i.type === 'headgear')}
          title="Hair"
          selected={headgear?.Id}
          onClick={(item) => form.setValue('headgear', { Id: item.Id, attachment: item.attachment })}
        />
      </div>
    </div>
  );
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

function ViewWithoutTab({
  field,
  filter,
  onClick,
}: {
  field?: { Id: number };
  filter: string;
  onClick: (item: LemonHeadAccessory) => void;
}) {
  const [loading, setLoading] = React.useState(false);
  const [list, setList] = React.useState<LemonHeadAccessory[]>([]);

  const fetchData = async (data: LemonHeadAccessory[] = []) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        where: `(type,anyof,${filter})`,
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

  if (loading) return <Loading />;

  return (
    <div className="p-4">
      <ListView data={list} selected={field?.Id} onClick={onClick} />
    </div>
  );
}

function ListView({
  data = [],
  title,
  onClick,
  selected,
  id,
}: {
  id?: string;
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

function Loading() {
  return <div className="flex justify-center items-center h-[692px]">Loading...</div>;
}
