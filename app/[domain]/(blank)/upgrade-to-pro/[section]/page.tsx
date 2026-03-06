import { notFound } from 'next/navigation';

import UpgradeToProPage from '../UpgradeToProPage';

import { getUpgradeToProSectionKey } from '$lib/components/features/upgrade-to-pro/sections';

export default async function Page({ params }: { params: Promise<{ section: string }> }) {
  const section = (await params).section;
  const activeSection = getUpgradeToProSectionKey(section);

  if (!activeSection) return notFound();

  return <UpgradeToProPage activeSection={activeSection} />;
}
