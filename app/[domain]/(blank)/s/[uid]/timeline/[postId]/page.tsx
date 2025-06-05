import { notFound } from 'next/navigation';

import { FeedPostDetail } from '$lib/components/features/lens-feed/FeedPostDetail';
import { getSpace } from '$lib/utils/getSpace';
import { isObjectId } from '$lib/utils/helpers';

export default async function Page({ params }: { params: Promise<{ uid: string; postId: string }> }) {
  const uid = (await params).uid;
  const variables = isObjectId(uid) ? { id: uid, slug: uid } : { slug: uid };
  const space = await getSpace(variables);
  const postId = (await params).postId;

  if (!space?.lens_feed_id || !postId) return notFound();

  return <FeedPostDetail postId={postId} />;
}
