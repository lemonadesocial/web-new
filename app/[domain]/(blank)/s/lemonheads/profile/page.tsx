import { Space } from '$lib/graphql/generated/backend/graphql';
import { getSpace } from '$lib/utils/getSpace';
import { notFound } from 'next/navigation';
import { HeroSectionProfile, ProfileInfoSection } from '../shared';
import { LemonHeadsNFTCard } from '$lib/components/features/lemonheads/cards/LemonHeadsNFTCard';
import { UpcommingEventsCard } from '$lib/components/features/event/UpcommingEventsCard';

async function Page() {
  const variables = { slug: 'lemonheads' };
  const space = (await getSpace(variables)) as Space;

  if (!space) return notFound();

  return (
    <div className="flex gap-12">
      <div className="flex flex-col gap-5">
        <HeroSectionProfile space={space} />
        <ProfileInfoSection />
      </div>

      <div className="hidden md:block w-full max-w-[296px] space-y-4">
        <LemonHeadsNFTCard />
        <UpcommingEventsCard />
      </div>
    </div>
  );
}

export default Page;
