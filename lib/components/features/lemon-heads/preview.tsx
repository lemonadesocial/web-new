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
    mouthgear,
    headgear,
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
    'mouthgear',
    'headgear',
  ]);
  const data = bodyBase.find(
    (i) => i.gender === gender && i.body_type === size && i.skin_tone === skin_tone.value && i.name === body,
  );

  return (
    <Card.Root className="flex-1">
      <Card.Content className="p-0">
        <Image src={data?.attachment?.[0].signedUrl} lazy className="w-full h-full" />
        {eyes && <img src={eyes?.attachment?.[0].signedUrl} className="absolute top-0" />}
        {mouth && <img src={mouth?.attachment?.[0].signedUrl} className="absolute top-0" />}
        {hair && <img src={hair?.attachment?.[0].signedUrl} className="absolute top-0" />}
        {facial_hair && <img src={facial_hair?.attachment?.[0].signedUrl} className="absolute top-0" />}
        {top && <img src={top?.attachment?.[0].signedUrl} className="absolute top-0" />}
        {bottom && <img src={bottom?.attachment?.[0].signedUrl} className="absolute top-0" />}
        {outfit && <img src={outfit?.attachment?.[0].signedUrl} className="absolute top-0" />}
        {eyewear && <img src={eyewear?.attachment?.[0].signedUrl} className="absolute top-0" />}
        {mouthgear && <img src={mouthgear?.attachment?.[0].signedUrl} className="absolute top-0" />}
        {headgear && <img src={headgear?.attachment?.[0].signedUrl} className="absolute top-0" />}
      </Card.Content>
    </Card.Root>
  );
}
