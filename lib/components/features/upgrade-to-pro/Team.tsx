import { Space } from '$lib/graphql/generated/backend/graphql';
import {
  AdminSection,
  AmbassadorSection,
} from '$lib/components/features/community-manage/settings/SettingsCommunityTeam';

function Team({ space }: { space: Space }) {
  return (
    <div className="p-12 flex flex-col gap-6">
      <div className="space-y-1">
        <h3 className="text-2xl font-bold">Team</h3>
      </div>
      <div className="flex flex-col gap-12">
        <AdminSection space={space} />
        <AmbassadorSection space={space} />
      </div>
    </div>
  );
}

export default Team;
