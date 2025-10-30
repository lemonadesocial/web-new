import { LemonheadCard, FluffleCard } from './PhotoCards';

export function PassportPhoto() {
  return (
    <div className="flex-1 flex flex-col gap-8 md:py-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold leading-tight">Show the world who you are.</h1>
        <p className="text-tertiary">
          Select your LemonHead or upload a custom photo to make your passport uniquely yours.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <LemonheadCard />
        <FluffleCard />
      </div>
    </div>
  );
}
