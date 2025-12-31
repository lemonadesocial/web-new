import { notFound } from 'next/navigation';
import { isObjectId } from '$lib/utils/helpers';
import { getSpace } from '$lib/utils/getSpace';
import { CoinPageClient } from './CoinPageClient';

export default async function Page({ params }: { params: Promise<{ uid: string }> }) {
  const uid = (await params).uid;
  const variables = isObjectId(uid) ? { id: uid, slug: uid } : { slug: uid };

  const space = await getSpace(variables);

  if (!space) return notFound();

  return <CoinPageClient spaceId={space._id} />;
}

