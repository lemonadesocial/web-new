import { notFound } from 'next/navigation';

import { FeedPostDetail } from '$lib/components/features/lens-feed/FeedPostDetail';
import { getSpace } from '$lib/utils/getSpace';
import { isObjectId } from '$lib/utils/helpers';

export default async function Page({ params }: { params: Promise<{ uid: string; slug: string }> }) {
  const uid = (await params).uid;
  const variables = isObjectId(uid) ? { id: uid, slug: uid } : { slug: uid };
  const space = await getSpace(variables);
  const postSlug = (await params).slug;

  if (!space?.lens_feed_id || !postSlug) return notFound();

  return <FeedPostDetail postSlug={postSlug} />;
}
