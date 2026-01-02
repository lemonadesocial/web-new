import { usePassportContext } from '../provider';
import { LemonheadCard, FluffleCard } from './PhotoCards';

export function PassportPhoto() {
  const [state] = usePassportContext();

  return (
    <div className="flex-1 flex flex-col gap-8 md:py-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold leading-tight">{state.ui?.[state.currentStep!]?.title}</h1>
        <p className="text-tertiary">{state.ui?.[state.currentStep!]?.subtitle}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <LemonheadCard />
        <FluffleCard />
      </div>
    </div>
  );
}
