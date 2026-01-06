import { notFound } from 'next/navigation';

import { LensAccountCard } from '$lib/components/features/lens-account/LensAccountCard';
import { isObjectId } from '$lib/utils/helpers';
import { getSpace } from '$lib/utils/getSpace';
import { TimelineContent } from './content';

export default async function Page({ params }: { params: Promise<{ uid: string }> }) {
  const uid = (await params).uid;
  const variables = isObjectId(uid) ? { id: uid, slug: uid } : { slug: uid };
  const space = await getSpace(variables);

  if (!space?.lens_feed_id) return notFound();

  return (
    <div className="page mx-auto px-4 xl:px-0 pt-6">
      <div className="flex flex-col-reverse md:grid md:grid-cols-[1fr_336px] gap-5 md:gap-8 items-start pb-10">
        <TimelineContent feedAddress={space.lens_feed_id} />
        <LensAccountCard />
      </div>
    </div>
  );
}
