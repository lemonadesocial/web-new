import { Card } from '$lib/components/core';
import { LemonHeadsAttachment, LemonHeadsLayer } from '$lib/trpc/lemonheads/types';
import { LemonHeadValues } from './types';

export function LemonHeadPreview({
  form: formValues,
  className,
  bodySet,
}: {
  form: LemonHeadValues;
  bodySet: LemonHeadsLayer[];
  className?: string;
}) {
  const getSource = (value: LemonHeadsAttachment[] = []) => {
    return value[0]?.signedUrl;
  };

  const dataBody = formValues.body;
  const body = bodySet.find(
    (i) =>
      i.gender === dataBody.filters.gender &&
      i.size === dataBody.filters.size &&
      i.name === dataBody.value &&
      i.skin_tone === dataBody.filters.skin_tone,
  );

  return (
    <Card.Root className={className}>
      <Card.Content className="p-0 max-w-[692px] aspect-square relative">
        {formValues.background && <PreviewImageItem src={getSource(formValues.background.attachment)} />}

        <img src={getSource(body?.attachment)} className="w-full h-full absolute top-0" />
        {formValues.hair && <PreviewImageItem src={getSource(formValues.hair.attachment)} />}
        {formValues.headgear && <PreviewImageItem src={getSource(formValues.headgear.attachment)} />}

        {formValues.eyes && <PreviewImageItem src={getSource(formValues.eyes.attachment)} />}
        {formValues.eyewear && <PreviewImageItem src={getSource(formValues.eyewear.attachment)} />}

        {formValues.mouth && <PreviewImageItem src={getSource(formValues.mouth.attachment)} />}
        {formValues.mouthgear && <PreviewImageItem src={getSource(formValues.mouthgear.attachment)} />}

        {formValues.facial_hair && <PreviewImageItem src={getSource(formValues.facial_hair.attachment)} />}
        {formValues.footwear && <PreviewImageItem src={getSource(formValues.footwear.attachment)} />}
        {formValues.bottom && <PreviewImageItem src={getSource(formValues.bottom.attachment)} />}
        {formValues.top && <PreviewImageItem src={getSource(formValues.top.attachment)} />}
        {formValues.outfit && <PreviewImageItem src={getSource(formValues.outfit.attachment)} />}
        {formValues.pet && <PreviewImageItem src={getSource(formValues.pet.attachment)} />}
      </Card.Content>
    </Card.Root>
  );
}

function PreviewImageItem({ src, style }: { src: string; style?: React.CSSProperties }) {
  return <img src={src} className="w-full h-full absolute top-0" style={style} />;
}
