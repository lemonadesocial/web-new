'use client';
import { Space } from '$lib/graphql/generated/backend/graphql';
import { CustomDomainSection } from '../community-manage/settings/SettingsCommunityAvanced';

export function CustomDomain({ space }: { space: Space }) {
  return (
    <div className="p-12 flex flex-col gap-6">
      <div className="space-y-1">
        <h3 className="text-2xl font-bold">Custom Domain</h3>
        <p className="text-tertiary">
          Turn your community into a fully customizable website and host it on your own domain!
        </p>
      </div>

      <CustomDomainSection space={space} />
    </div>
  );
}
