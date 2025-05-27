import { notFound } from 'next/navigation';

import { LensAccountCard } from '$lib/components/features/lens-account/LensAccountCard';
import { LensFeed } from '$lib/components/features/lens-feed/LensFeed';
import { isObjectId } from '$lib/utils/helpers';
import { getSpace } from '$lib/utils/getSpace';

export default async function Page({ params }: { params: Promise<{ uid: string }> }) {
  const uid = (await params).uid;
  const variables = isObjectId(uid) ? { id: uid, slug: uid } : { slug: uid };
  const space = await getSpace(variables);

  if (!space?.lens_feed_id) return notFound();

  return (
    <div className="grid grid-cols-[1fr_336px] gap-8 items-start pb-10">
      <LensFeed feedAddress={space.lens_feed_id} />
      <LensAccountCard />
    </div>
  );
}
