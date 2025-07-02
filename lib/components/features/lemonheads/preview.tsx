import { Card } from '$lib/components/core';
import { LemonHeadsAttachment, LemonHeadsLayer } from '$lib/trpc/lemonheads/types';
import { LemonHeadValues } from './types';

import { TraitOrders, TraitType } from '../../../services/lemonhead/core';

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

  const layers: { [k in TraitType]?: LemonHeadsLayer } = { ...formValues, body };

  return (
    <Card.Root className={className}>
      <Card.Content className="p-0 max-w-[692px] aspect-square relative">
        {TraitOrders.map((traitType) => {
          const source = getSource(layers[traitType]?.attachment);

          if (!source) return null;

          return <PreviewImageItem key={traitType} src={source} style={{ zIndex: TraitOrders.indexOf(traitType) }} />;
        })}
      </Card.Content>
    </Card.Root>
  );
}

function PreviewImageItem({ src, style }: { src: string; style?: React.CSSProperties }) {
  return <img src={src} className="w-full h-full absolute top-0" style={style} />;
}
