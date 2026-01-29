import { RedEnvelopesBanners } from '$lib/components/features/red-envelopes/RedEnvelopesBanners';
import { RedEnvelopesPacks } from '$lib/components/features/red-envelopes/RedEnvelopesPacks';

export default function Page() {
  return (
    <div className="max-w-[1200px] mx-auto space-y-12">
      <RedEnvelopesBanners />
      <RedEnvelopesPacks />
    </div>
  );
}
