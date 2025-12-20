import type { Metadata, ResolvingMetadata } from 'next';
import { PASSPORT_METADATA, PASSPORT_PROVIDER } from '$lib/components/features/passports/config';
import { MainPassport } from '$lib/components/features/passports/main';

type Props = {
  params: Promise<{ provider: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { provider } = await params;
  return PASSPORT_METADATA[provider as string];
}

async function Page({ params }: { params: Promise<{ provider: string }> }) {
  const provider = (await params).provider as PASSPORT_PROVIDER;

  return <MainPassport provider={provider} />;
}

export default Page;
