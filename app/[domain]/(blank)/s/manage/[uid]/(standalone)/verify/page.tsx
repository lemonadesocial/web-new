import { VerifyCommunityPage } from '$lib/components/features/community-manage/VerifyCommunityPage';

export default function Page({ params }: { params: { uid: string } }) {
  return <VerifyCommunityPage uid={params.uid} />;
}
