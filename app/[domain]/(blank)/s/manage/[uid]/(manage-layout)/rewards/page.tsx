import { RewardDashboard } from '$lib/components/features/space-manage/RewardDashboard';

export default function RewardsPage({ params }: { params: { uid: string } }) {
  return <RewardDashboard spaceId={params.uid} />;
}
