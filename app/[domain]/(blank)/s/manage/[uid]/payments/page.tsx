import { notFound } from 'next/navigation';
import { CommunityPayments } from '$lib/components/features/community-manage/CommunityPayments';
import { getSpace } from '$lib/utils/getSpace';
import { isObjectId } from '$lib/utils/helpers';

export default async function Page({ params }: { params: Promise<{ uid: string }> }) {
  const uid = (await params).uid;
  const variables = isObjectId(uid) ? { id: uid, slug: uid } : { slug: uid };

  const space = await getSpace(variables);

  if (!space) return notFound();

  return <CommunityPayments space={space} />;
}
