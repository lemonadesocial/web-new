import { RedEnvelopesBanners } from '$lib/components/features/cny/RedEnvelopesBanners';
import { RedEnvelopesPacks } from '$lib/components/features/cny/RedEnvelopesPacks';
import { RedEnvelopesStats } from '$lib/components/features/cny/RedEnvelopesStats';

export default function Page() {
  return (
    <div className="max-w-[1200px] mx-auto space-y-12 pb-12">
      <RedEnvelopesBanners />
      <RedEnvelopesPacks />
      <RedEnvelopesStats />
    </div>
  );
}
