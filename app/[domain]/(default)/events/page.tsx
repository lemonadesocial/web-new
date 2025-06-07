import { LensAccountCard } from '$lib/components/features/lens-account/LensAccountCard';
import { EventsContent } from './content';

export default function Page() {
  return (
    <div className="flex flex-col-reverse md:grid md:grid-cols-[1fr_336px] gap-5 md:gap-[72px] items-start pb-10">
      <EventsContent />
      <LensAccountCard />
    </div>
  );
}
