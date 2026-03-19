import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

import type { AtlasRewardBalance, AtlasRewardTransaction } from '$lib/types/atlas';

// Default mock: Atlas disabled
// The component uses atlasGraphqlQuery + mapRewardSummary (not atlasGetRewardBalance/History).
vi.mock('$lib/services/atlas-client', () => ({
  isAtlasEnabled: vi.fn(() => false),
  atlasGraphqlQuery: vi.fn(),
  mapRewardSummary: vi.fn((data: unknown) => data),
  ATLAS_REWARD_SUMMARY_QUERY: 'mock-summary-query',
  ATLAS_REWARD_HISTORY_QUERY: 'mock-history-query',
}));

import { RewardDashboard } from '../RewardDashboard';
import { isAtlasEnabled, atlasGraphqlQuery } from '$lib/services/atlas-client';

const mockedIsAtlasEnabled = vi.mocked(isAtlasEnabled);
const mockedAtlasGraphqlQuery = vi.mocked(atlasGraphqlQuery);

const mockBalance: AtlasRewardBalance = {
  total_earned: 150.5,
  total_redeemed: 30.0,
  available: 120.5,
  currency: 'USDC',
  volume_tier: 'silver',
  next_tier_threshold: 2000,
  is_verified: true,
};

const mockTransactions: AtlasRewardTransaction[] = [
  {
    id: 'tx1',
    type: 'cashback',
    amount: 5.0,
    currency: 'USDC',
    status: 'completed',
    description: 'Cashback for ticket purchase',
    event_title: 'Web3 Summit',
    created_at: '2026-03-15T12:00:00Z',
  },
];

describe('RewardDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedIsAtlasEnabled.mockReturnValue(false);
  });

  it('shows coming soon fallback when Atlas is disabled', () => {
    render(<RewardDashboard spaceId="space-1" />);

    expect(screen.getByText('Rewards coming soon')).toBeDefined();
    expect(screen.getByText(/Atlas Protocol rewards will be available/)).toBeDefined();
  });

  it('renders balance cards with data when Atlas is enabled', async () => {
    mockedIsAtlasEnabled.mockReturnValue(true);
    // atlasGraphqlQuery is called twice: once for summary, once for history.
    // First call returns summary data, second returns history data.
    mockedAtlasGraphqlQuery
      .mockResolvedValueOnce({ atlasRewardSummary: mockBalance })
      .mockResolvedValueOnce({ atlasRewardHistory: mockTransactions });

    render(<RewardDashboard spaceId="space-1" />);

    await waitFor(() => {
      expect(screen.getByText('Available balance')).toBeDefined();
    });

    // Balance values are rendered inside <p> tags with <span> siblings for currency,
    // so we use a text content matcher to find partial matches.
    const balanceTexts = screen.getAllByText((_content, element) => {
      return element?.tagName === 'P' && !!element.textContent?.includes('120.50');
    });
    expect(balanceTexts.length).toBeGreaterThan(0);

    const earnedTexts = screen.getAllByText((_content, element) => {
      return element?.tagName === 'P' && !!element.textContent?.includes('150.50');
    });
    expect(earnedTexts.length).toBeGreaterThan(0);

    const redeemedTexts = screen.getAllByText((_content, element) => {
      return element?.tagName === 'P' && !!element.textContent?.includes('30.00');
    });
    expect(redeemedTexts.length).toBeGreaterThan(0);
  });

  it('renders error state when API fails', async () => {
    mockedIsAtlasEnabled.mockReturnValue(true);
    mockedAtlasGraphqlQuery.mockRejectedValue(new Error('Server error'));

    render(<RewardDashboard spaceId="space-1" />);

    await waitFor(() => {
      expect(screen.getByText('Server error')).toBeDefined();
    });
  });
});
