import UpgradeToProPage from './UpgradeToProPage';

import { DEFAULT_UPGRADE_TO_PRO_SECTION } from '$lib/components/features/upgrade-to-pro/sections';

export default function Page() {
  return <UpgradeToProPage activeSection={DEFAULT_UPGRADE_TO_PRO_SECTION} />;
}
