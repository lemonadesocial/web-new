import { ProfileCard } from '$lib/components/features/profile/ProfileCard';
import { Tabs } from './tabs';

export default async function Layout({ children }: React.PropsWithChildren) {
  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-14 divide-y divide-(--color-divider) md:divide-y-0">
      <div className="flex-1 flex flex-col w-full md:max-w-[336px] md:gap-4">
        <ProfileCard />
        <Tabs />
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
