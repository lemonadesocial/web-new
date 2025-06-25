import { UseFormReturn } from 'react-hook-form';
import { LemonHeadValues } from './types';
import { Card } from '$lib/components/core';
import { Image } from '$lib/components/core/image';
import { LemonHeadBodyType } from '$lib/lemon-heads/types';

export function LemonHeadPreview({
  form,
  bodyBase,
}: {
  form: UseFormReturn<LemonHeadValues>;
  bodyBase: LemonHeadBodyType[];
}) {
  const [
    gender,
    size,
    body,
    skin_tone,
    eyes,
    mouth,
    hair,
    facial_hair,
    top,
    bottom,
    outfit,
    eyewear,
    footwear,
    mouthgear,
    headgear,
    background,
  ] = form.watch([
    'gender',
    'size',
    'body',
    'skin_tone',
    'eyes',
    'mouth',
    'hair',
    'facial_hair',
    'top',
    'bottom',
    'outfit',
    'eyewear',
    'footwear',
    'mouthgear',
    'headgear',
    'background',
  ]);
  const data = bodyBase.find(
    (i) => i.gender === gender && i.body_type === size && i.skin_tone === skin_tone.value && i.name === body,
  );

  return (
    <Card.Root className="flex-1">
      <Card.Content className="p-0 size-[692px] relative">
        <img src={data?.attachment?.[0].signedUrl} className="w-full h-full absolute top-0" />
        {eyes && <img src={eyes?.attachment?.[0].signedUrl} className="absolute top-0" />}
        {mouth && <img src={mouth?.attachment?.[0].signedUrl} className="absolute top-0" />}
        {hair && <img src={hair?.attachment?.[0].signedUrl} className="absolute top-0" />}
        {facial_hair && <img src={facial_hair?.attachment?.[0].signedUrl} className="absolute top-0" />}
        {bottom && <img src={bottom?.attachment?.[0].signedUrl} className="absolute top-0 w-full h-full" />}
        {top && <img src={top?.attachment?.[0].signedUrl} className="absolute top-0  w-full h-full" />}
        {outfit && <img src={outfit?.attachment?.[0].signedUrl} className="absolute top-0" />}
        {eyewear && <img src={eyewear?.attachment?.[0].signedUrl} className="absolute top-0" />}
        {footwear && <img src={footwear?.attachment?.[0].signedUrl} className="absolute bottom-0" />}
        {mouthgear && <img src={mouthgear?.attachment?.[0].signedUrl} className="absolute top-0" />}
        {headgear && <img src={headgear?.attachment?.[0].signedUrl} className="absolute top-0" />}
        {background && (
          <img
            src={background?.attachment?.[0].signedUrl}
            className="absolute inset-0 w-full h-full aspect-square"
            style={{ zIndex: -1 }}
          />
        )}
      </Card.Content>
    </Card.Root>
  );
}
