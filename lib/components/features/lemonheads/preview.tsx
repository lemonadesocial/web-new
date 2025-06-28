import { UseFormReturn } from 'react-hook-form';
import { Card } from '$lib/components/core';
import { LemonHeadAttachment, LemonHeadBodyType } from '$lib/trpc/lemonheads/types';
import { LemonHeadValues } from './types';

export function LemonHeadPreview({
  form,
  bodyBase,
}: {
  form: UseFormReturn<LemonHeadValues>;
  bodyBase: LemonHeadBodyType[];
}) {
  const formValues = form.watch();

  const data = bodyBase.find(
    (i) =>
      i.gender === formValues.gender &&
      i.body_type === formValues.size &&
      i.skin_tone === formValues.skin_tone.value &&
      i.name === formValues.body,
  );

  const getSource = (value: LemonHeadAttachment[] = []) => {
    return value[0]?.signedUrl;
  };

  return (
    <Card.Root>
      <Card.Content className="p-0 max-w-[692px] aspect-square relative">
        {formValues.background && <PreviewImageItem src={getSource(formValues.background.attachment)} />}

        <img src={data?.attachment?.[0].thumbnails.card_cover.signedUrl} className="w-full h-full absolute top-0" />
        {formValues.hair && <PreviewImageItem src={getSource(formValues.hair.attachment)} />}
        {formValues.headgear && <PreviewImageItem src={getSource(formValues.headgear.attachment)} />}

        {formValues.eyes && <PreviewImageItem src={getSource(formValues.eyes.attachment)} />}
        {formValues.eyewear && <PreviewImageItem src={getSource(formValues.eyewear.attachment)} />}

        {formValues.mouth && <PreviewImageItem src={getSource(formValues.mouth.attachment)} />}
        {formValues.mouthgear && <PreviewImageItem src={getSource(formValues.mouthgear.attachment)} />}

        {formValues.facial_hair && <PreviewImageItem src={getSource(formValues.facial_hair.attachment)} />}
        {formValues.bottom && <PreviewImageItem src={getSource(formValues.bottom.attachment)} />}
        {formValues.top && <PreviewImageItem src={getSource(formValues.top.attachment)} />}
        {formValues.outfit && <PreviewImageItem src={getSource(formValues.outfit.attachment)} />}
        {formValues.footwear && <PreviewImageItem src={getSource(formValues.footwear.attachment)} />}
      </Card.Content>
    </Card.Root>
  );
}

function PreviewImageItem({ src, style }: { src: string; style?: React.CSSProperties }) {
  return <img src={src} className="w-full h-full absolute top-0" style={style} />;
}
