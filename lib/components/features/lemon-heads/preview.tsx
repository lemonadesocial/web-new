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
  const [gender, size, body, skin_tone] = form.watch(['gender', 'size', 'body', 'skin_tone']);
  const data = bodyBase.find(
    (i) => i.gender === gender && i.body_type === size && i.skin_tone === skin_tone && i.name === body,
  );

  return (
    <Card.Root className="flex-1">
      <Card.Content className="p-0">
        <Image src={data?.attachment?.[0].signedUrl} lazy className="w-full h-full" />
      </Card.Content>
    </Card.Root>
  );
}
