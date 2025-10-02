import { notFound } from 'next/navigation';
import { CommunityEvents } from '$lib/components/features/community-manage/CommunityEvents';
import { getSpace } from '$lib/utils/getSpace';
import { isObjectId } from '$lib/utils/helpers';
import { CommunityOverview } from '$lib/components/features/community-manage/CommunityOverview';

export default async function Page({ params }: { params: Promise<{ uid: string }> }) {
  const uid = (await params).uid;
  const variables = isObjectId(uid) ? { id: uid, slug: uid } : { slug: uid };

  const space = await getSpace(variables);

  if (!space) return notFound();

  return <CommunityOverview space={space} />;
}
