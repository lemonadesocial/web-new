'use client';

import { useRouter } from 'next/navigation';

import { Button, modal, ModalContent } from '$lib/components/core';
import { type Space, SubscriptionItemType } from '$lib/graphql/generated/backend/graphql';

import { getSpaceSubscriptionTier } from './feature-guard';
import { getUpgradeToProSectionHref, type UpgradeToProSectionKey } from './sections';
import { formatPlanTitle } from './utils';

type SpaceUpgradeRequiredModalProps = {
  space: Pick<Space, '_id' | 'slug' | 'title' | 'subscription_tier'>;
  featureName: string;
  requiredTier: SubscriptionItemType;
  description?: string;
  upgradeSection?: UpgradeToProSectionKey;
};

export function SpaceUpgradeRequiredModal({
  space,
  featureName,
  requiredTier,
  description,
  upgradeSection = 'plans',
}: SpaceUpgradeRequiredModalProps) {
  const router = useRouter();
  const currentTier = getSpaceSubscriptionTier(space);
  const requiredPlanTitle = formatPlanTitle(requiredTier);
  const currentPlanTitle = formatPlanTitle(currentTier);

  const handleUpgrade = () => {
    modal.close();
    router.push(getUpgradeToProSectionHref(space.slug || space._id, upgradeSection));
  };

  return (
    <ModalContent
      className="w-sm **:data-icon:bg-warning-300/16"
      icon="icon-flash text-warning-300!"
      onClose={() => modal.close()}
    >
      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <p className="text-lg">Upgrade required</p>
          <p className="text-sm text-secondary">
            {featureName} is available on {requiredPlanTitle} and above. {space.title} is currently on{' '}
            {currentPlanTitle}.
          </p>
          {description && <p className="text-sm text-secondary">{description}</p>}
        </div>

        <Button className="w-full" onClick={handleUpgrade}>
          Upgrade to {requiredPlanTitle}
        </Button>
      </div>
    </ModalContent>
  );
}
