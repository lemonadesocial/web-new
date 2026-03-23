'use client';

import { useState, useEffect } from 'react';

import { isAtlasEnabled, ATLAS_REWARD_SUMMARY_QUERY, ATLAS_REWARD_HISTORY_QUERY, mapRewardSummary, atlasGraphqlQuery } from '$lib/services/atlas-client';
import type { AtlasRewardBalance, AtlasRewardTransaction } from '$lib/types/atlas';
import { RewardHistory } from './RewardHistory';
import { RewardVerificationBanner } from './RewardVerificationBanner';

interface RewardDashboardProps {
  spaceId: string;
}

const VOLUME_TIERS = [
  { name: 'Bronze', minVolume: 0, cashback: '1%' },
  { name: 'Silver', minVolume: 500, cashback: '2%' },
  { name: 'Gold', minVolume: 2000, cashback: '3%' },
  { name: 'Platinum', minVolume: 10000, cashback: '5%' },
];

export function RewardDashboard({ spaceId }: RewardDashboardProps) {
  const enabled = isAtlasEnabled();
  const [balance, setBalance] = useState<AtlasRewardBalance | null>(null);
  const [transactions, setTransactions] = useState<AtlasRewardTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        const [summaryData, historyData] = await Promise.all([
          atlasGraphqlQuery(ATLAS_REWARD_SUMMARY_QUERY, { space: spaceId }),
          atlasGraphqlQuery(ATLAS_REWARD_HISTORY_QUERY, { space: spaceId, limit: 20, offset: 0 }),
        ]);
        if (!cancelled) {
          setBalance(mapRewardSummary(summaryData.atlasRewardSummary));
          setTransactions(historyData.atlasRewardHistory as AtlasRewardTransaction[]);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load rewards');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [enabled, spaceId]);

  if (!enabled) {
    return (
      <div className="page mx-auto py-7 px-4 md:px-0">
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <i aria-hidden="true" className="icon-gift size-12 text-quaternary mb-4" />
          <p className="text-secondary text-lg font-medium">Rewards coming soon</p>
          <p className="text-quaternary text-sm mt-1">
            Atlas Protocol rewards will be available once the integration is enabled.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page mx-auto py-7 px-4 md:px-0 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 rounded-md border border-card-border animate-pulse bg-overlay-secondary" />
          ))}
        </div>
        <div className="h-16 rounded-md border border-card-border animate-pulse bg-overlay-secondary" />
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 rounded-md border border-card-border animate-pulse bg-overlay-secondary" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page mx-auto py-7 px-4 md:px-0">
        <div className="px-3 py-2 rounded-md bg-danger-500/10 border border-danger-500/20">
          <p className="text-danger-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const currentTier = VOLUME_TIERS.find((t) => t.name.toLowerCase() === balance?.volume_tier) || VOLUME_TIERS[0];
  const currentTierIndex = VOLUME_TIERS.indexOf(currentTier);
  const nextTier = currentTierIndex < VOLUME_TIERS.length - 1 ? VOLUME_TIERS[currentTierIndex + 1] : null;

  return (
    <div className="page mx-auto py-7 px-4 md:px-0 space-y-6">
      <h2 className="text-xl font-semibold">Rewards</h2>

      <RewardVerificationBanner isVerified={balance?.is_verified ?? false} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-md border border-card-border bg-overlay-secondary space-y-1">
          <p className="text-tertiary text-xs">Available balance</p>
          <p className="text-primary text-2xl font-semibold">
            {balance?.available.toFixed(2) ?? '0.00'} <span className="text-sm text-secondary">{balance?.currency ?? 'USDC'}</span>
          </p>
        </div>

        <div className="p-4 rounded-md border border-card-border bg-overlay-secondary space-y-1">
          <p className="text-tertiary text-xs">Total earned</p>
          <p className="text-success-500 text-2xl font-semibold">
            {balance?.total_earned.toFixed(2) ?? '0.00'} <span className="text-sm">{balance?.currency ?? 'USDC'}</span>
          </p>
        </div>

        <div className="p-4 rounded-md border border-card-border bg-overlay-secondary space-y-1">
          <p className="text-tertiary text-xs">Total redeemed</p>
          <p className="text-primary text-2xl font-semibold">
            {balance?.total_redeemed.toFixed(2) ?? '0.00'} <span className="text-sm text-secondary">{balance?.currency ?? 'USDC'}</span>
          </p>
        </div>
      </div>

      <div className="p-4 rounded-md border border-card-border bg-overlay-secondary space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary text-sm font-medium capitalize">{currentTier.name} tier</p>
            <p className="text-tertiary text-xs">{currentTier.cashback} cashback on purchases</p>
          </div>
          {nextTier && (
            <div className="text-right">
              <p className="text-quaternary text-xs">Next: {nextTier.name}</p>
              <p className="text-tertiary text-xs">{nextTier.cashback} cashback</p>
            </div>
          )}
        </div>

        {nextTier && balance?.next_tier_threshold != null && (
          <div className="space-y-1">
            <div className="h-1.5 rounded-full bg-overlay-secondary border border-card-border overflow-hidden">
              <div
                className="h-full rounded-full bg-accent-400 transition-all"
                style={{
                  width: `${Math.min(100, ((balance.total_earned / balance.next_tier_threshold) * 100))}%`,
                }}
              />
            </div>
            <p className="text-quaternary text-[10px]">
              {balance.total_earned.toFixed(0)} / {balance.next_tier_threshold.toFixed(0)} to {nextTier.name}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="text-primary text-sm font-medium">Transaction history</h3>
        <RewardHistory transactions={transactions} loading={false} />
      </div>
    </div>
  );
}
