import { ClaimLemonHeadCard } from '$lib/components/features/lemonheads/ClaimLemonHeadCard';
import { LensAccountCard } from '$lib/components/features/lens-account/LensAccountCard';
import { EventsContent } from './content';

export default function Page() {
  return (
    <div className="flex flex-col-reverse md:grid md:grid-cols-[1fr_336px] gap-5 md:gap-[72px] items-start pb-10 mt-6 md:mt-11">
      <EventsContent />

      <div className="flex flex-col gap-4">
        <LensAccountCard />
        <ClaimLemonHeadCard />
      </div>
    </div>
  );
}
