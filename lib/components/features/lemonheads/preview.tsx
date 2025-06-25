import { UseFormReturn } from 'react-hook-form';
import { LemonHeadValues } from './types';
import { Card } from '$lib/components/core';
import { LemonHeadAttachment, LemonHeadBodyType } from '$lib/lemonheads/types';

export function LemonHeadPreview({
  form,
  bodyBase,
}: {
  form: UseFormReturn<LemonHeadValues>;
  bodyBase: LemonHeadBodyType[];
}) {
  const formValues = form.watch();
  // const [
  //   gender,
  //   size,
  //   body,
  //   skin_tone,
  //   eyes,
  //   mouth,
  //   hair,
  //   facial_hair,
  //   top,
  //   bottom,
  //   outfit,
  //   eyewear,
  //   footwear,
  //   mouthgear,
  //   headgear,
  //   background,
  // ] = form.watch([
  //   'gender',
  //   'size',
  //   'body',
  //   'skin_tone',
  //   'eyes',
  //   'mouth',
  //   'hair',
  //   'facial_hair',
  //   'top',
  //   'bottom',
  //   'outfit',
  //   'eyewear',
  //   'footwear',
  //   'mouthgear',
  //   'headgear',
  //   'background',
  // ]);
  const data = bodyBase.find(
    (i) =>
      i.gender === formValues.gender &&
      i.body_type === formValues.size &&
      i.skin_tone === formValues.skin_tone.value &&
      i.name === formValues.body,
  );

  const getSource = (value: LemonHeadAttachment[] = []) => {
    return value[0]?.thumbnails.card_cover.signedUrl;
  };

  return (
    <Card.Root className="flex-1">
      <Card.Content className="p-0 size-[692px] relative">
        <img src={data?.attachment?.[0].thumbnails.card_cover.signedUrl} className="w-full h-full absolute top-0" />
        {formValues.headgear && <PreviewImageItem src={getSource(formValues.headgear.attachment)} />}
        {formValues.hair && <PreviewImageItem src={getSource(formValues.hair.attachment)} />}

        {formValues.eyes && <PreviewImageItem src={getSource(formValues.eyes.attachment)} />}
        {formValues.eyewear && <PreviewImageItem src={getSource(formValues.eyewear.attachment)} />}

        {formValues.mouth && <PreviewImageItem src={getSource(formValues.mouth.attachment)} />}
        {formValues.mouthgear && <PreviewImageItem src={getSource(formValues.mouthgear.attachment)} />}

        {formValues.facial_hair && <PreviewImageItem src={getSource(formValues.facial_hair.attachment)} />}
        {formValues.top && <PreviewImageItem src={getSource(formValues.top.attachment)} />}
        {formValues.bottom && <PreviewImageItem src={getSource(formValues.bottom.attachment)} />}
        {formValues.outfit && <PreviewImageItem src={getSource(formValues.outfit.attachment)} />}
        {formValues.footwear && <PreviewImageItem src={getSource(formValues.footwear.attachment)} />}

        {formValues.background && <PreviewImageItem src={getSource(formValues.background.attachment)} />}
      </Card.Content>
    </Card.Root>
  );
}

function PreviewImageItem({ src }: { src: string }) {
  return <img src={src} className="w-full h-full absolute top-0" />;
}
