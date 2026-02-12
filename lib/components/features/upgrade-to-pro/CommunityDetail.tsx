import { Space } from '$lib/graphql/generated/backend/graphql';
import { CommunityDetailForm } from '../community-manage/settings/SettingsCommunityDisplay';
import { ThemeProvider } from '../theme-builder/provider';

export function CommunityDetail({ space }: { space: Space }) {
  return (
    <ThemeProvider themeData={space.theme_data}>
      <div className="**:data-submit-content:top-0! **:data-submit-content:px-4! **:data-form-content:px-4">
        <CommunityDetailForm space={space} />
      </div>
    </ThemeProvider>
  );
}
