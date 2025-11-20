import { PASSPORT_PROVIDER } from '$lib/components/features/passports/config';
import { MainPassport } from '$lib/components/features/passports/main';

async function Page({ params }: { params: Promise<{ provider: string }> }) {
  const provider = (await params).provider as PASSPORT_PROVIDER;

  return <MainPassport provider={provider} />;
}

export default Page;
