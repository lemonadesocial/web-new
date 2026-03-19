import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

import type { AtlasRewardBalance, AtlasRewardTransaction } from '$lib/types/atlas';

// Default mock: Atlas disabled
vi.mock('$lib/services/atlas-client', () => ({
  isAtlasEnabled: vi.fn(() => false),
  atlasGetRewardBalance: vi.fn(),
  atlasGetRewardHistory: vi.fn(),
}));

import { RewardDashboard } from '../RewardDashboard';
import { isAtlasEnabled, atlasGetRewardBalance, atlasGetRewardHistory } from '$lib/services/atlas-client';

const mockedIsAtlasEnabled = vi.mocked(isAtlasEnabled);
const mockedGetBalance = vi.mocked(atlasGetRewardBalance);
const mockedGetHistory = vi.mocked(atlasGetRewardHistory);

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
    mockedGetBalance.mockResolvedValue(mockBalance);
    mockedGetHistory.mockResolvedValue(mockTransactions);

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
    mockedGetBalance.mockRejectedValue(new Error('Server error'));
    mockedGetHistory.mockRejectedValue(new Error('Server error'));

    render(<RewardDashboard spaceId="space-1" />);

    await waitFor(() => {
      expect(screen.getByText('Server error')).toBeDefined();
    });
  });
});
