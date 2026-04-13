import { type Space, SubscriptionItemType } from '$lib/graphql/generated/backend/graphql';

type SpaceWithSubscriptionTier = Pick<Space, 'subscription_tier'> | null | undefined;

const SUBSCRIPTION_TIER_RANK = new Map<SubscriptionItemType, number>([
  [SubscriptionItemType.Free, 0],
  [SubscriptionItemType.Pro, 1],
  [SubscriptionItemType.Plus, 2],
  [SubscriptionItemType.Max, 3],
  [SubscriptionItemType.Enterprise, 4],
]);

export function getSpaceSubscriptionTier(space: SpaceWithSubscriptionTier): SubscriptionItemType {
  return space?.subscription_tier as SubscriptionItemType ?? SubscriptionItemType.Free;
}

export function isSpaceSubscriptionTierAtLeast(
  space: SpaceWithSubscriptionTier,
  requiredTier: SubscriptionItemType,
): boolean {
  const currentTier = getSpaceSubscriptionTier(space);
  const currentTierRank = SUBSCRIPTION_TIER_RANK.get(currentTier) ?? 0;
  const requiredTierRank = SUBSCRIPTION_TIER_RANK.get(requiredTier) ?? 0;

  return currentTierRank >= requiredTierRank;
}

export function isSpaceUpgradeRequired(
  space: SpaceWithSubscriptionTier,
  requiredTier: SubscriptionItemType,
): boolean {
  return !isSpaceSubscriptionTierAtLeast(space, requiredTier);
}
