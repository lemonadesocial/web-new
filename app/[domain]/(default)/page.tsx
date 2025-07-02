import { notFound } from 'next/navigation';

import { getSiteData } from '$utils/fetchers';

import { HomePageContent } from './content';
import { ClaimLemonHeadCard } from '$lib/components/features/lemonheads/ClaimLemonHeadCard';
import { WhoToFollow } from '$lib/components/features/lens-account/WhoToFollow';

export default async function SiteHomePage({ params }: { params: Promise<{ domain: string }> }) {
  const res = await params;
  const domain = decodeURIComponent(res.domain);
  const [data] = await Promise.all([getSiteData(domain)]);

  if (!data) {
    notFound();
  }

  return (
    <div className="flex flex-col-reverse md:grid md:grid-cols-[1fr_336px] gap-5 md:gap-[72px] items-start pb-10 mt-0 md:mt-11">
      <HomePageContent />
      <div className="flex flex-col gap-4">
        <ClaimLemonHeadCard />
        <WhoToFollow /> 
      </div>
    </div>
  );
}
