import { LemonheadCard, FluffleCard } from './PhotoCards';

export function PassportPhoto() {
  return (
    <div className="flex-1 flex flex-col gap-8 md:py-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold leading-tight">Choose your passport photo.</h1>
        <p className="text-tertiary">Select the avatar you’d like on your passport.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <LemonheadCard />
        <FluffleCard />
      </div>
    </div>
  );
}
