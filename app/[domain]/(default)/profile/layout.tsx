import { ProfileCard } from "$lib/components/features/profile/ProfileCard";
import { Tabs } from "./tabs";
  
export default async function Layout({ children }: React.PropsWithChildren) {
  return (
    <div className="md:grid md:grid-cols-[336px_1fr] gap-5 md:gap-14 items-start pb-10">
      <div className="space-y-4">
        <ProfileCard />
        <Tabs />
      </div>
      {children}
    </div>
  );
}
