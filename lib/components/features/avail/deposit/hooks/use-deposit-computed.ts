"use client";

import { useMemo } from "react";
import type { DestinationConfig, AssetSelectionState } from "../types";
import type {
  OnSwapIntentHookData,
  UserAsset,
} from "@avail-project/nexus-core";
import { CHAIN_METADATA } from "@avail-project/nexus-core";
import { usdFormatter } from "../../common";
import type { SwapSkippedData } from "./use-deposit-state";

interface UseDepositComputedProps {
  swapBalance: UserAsset[] | null;
  assetSelection: AssetSelectionState;
  activeIntent: OnSwapIntentHookData | null;
  destination: DestinationConfig;
  inputAmount: string | undefined;
  exchangeRate: Record<string, number> | null;
  getFiatValue: (amount: number, symbol: string) => number;
  actualGasFeeUsd: number | null;
  swapSkippedData: SwapSkippedData | null;
  skipSwap: boolean;
  nexusSDK: any;
}

/**
 * Available asset item from swap balance
 */
export interface AvailableAsset {
  chainId: number;
  tokenAddress: `0x${string}`;
  decimals: number;
  symbol: string;
  balance: string;
  balanceInFiat?: number;
  tokenLogo?: string;
  chainLogo?: string;
  chainName?: string;
}

/**
 * Hook for computing derived values from deposit widget state.
 * Separates computation logic from main hook for better maintainability.
 */
export function useDepositComputed(props: UseDepositComputedProps) {
  const {
    swapBalance,
    assetSelection,
    activeIntent,
    destination,
    inputAmount,
    exchangeRate,
    getFiatValue,
    actualGasFeeUsd,
    swapSkippedData,
    skipSwap,
    nexusSDK,
  } = props;

  /**
   * Flatten swap balance into a sorted list of available assets
   */
  const availableAssets = useMemo<AvailableAsset[]>(() => {
    if (!swapBalance) return [];
    const items: AvailableAsset[] = [];

    for (const asset of swapBalance) {
      if (!asset?.breakdown?.length) continue;
      for (const breakdown of asset.breakdown) {
        if (!breakdown?.chain?.id || !breakdown.balance) continue;
        const numericBalance = Number.parseFloat(breakdown.balance);
        if (!Number.isFinite(numericBalance) || numericBalance <= 0) continue;

        items.push({
          chainId: breakdown.chain.id,
          tokenAddress: breakdown.contractAddress as `0x${string}`,
          decimals: breakdown.decimals ?? asset.decimals,
          symbol: asset.symbol,
          balance: breakdown.balance,
          balanceInFiat: breakdown.balanceInFiat,
          tokenLogo: asset.icon,
          chainLogo: breakdown.chain.logo,
          chainName: breakdown.chain.name,
        });
      }
    }
    return items.toSorted(
      (a, b) => (b.balanceInFiat ?? 0) - (a.balanceInFiat ?? 0)
    );
  }, [swapBalance]);

  /**
   * Total USD value of selected assets
   */
  const totalSelectedBalance = useMemo(
    () =>
      availableAssets.reduce((sum, asset) => {
        const key = `${asset.tokenAddress}-${asset.chainId}`;
        if (assetSelection.selectedChainIds.has(key)) {
          return sum + (asset.balanceInFiat ?? 0);
        }
        return sum;
      }, 0),
    [availableAssets, assetSelection.selectedChainIds]
  );

  /**
   * Total balance across all assets
   */
  const totalBalance = useMemo(() => {
    const balance =
      swapBalance?.reduce(
        (acc, balance) => acc + parseFloat(balance.balance),
        0
      ) ?? 0;
    const usdBalance =
      swapBalance?.reduce((acc, balance) => acc + balance.balanceInFiat, 0) ??
      0;
    return { balance, usdBalance };
  }, [swapBalance]);

  /**
   * User's existing balance on destination chain
   */
  const destinationBalance = useMemo(() => {
    if (!nexusSDK || !swapBalance || !destination) return undefined;
    return swapBalance
      ?.find((token) => token.symbol === destination.tokenSymbol)
      ?.breakdown?.find((chain) => chain.chain?.id === destination.chainId);
  }, [swapBalance, nexusSDK, destination]);

  /**
   * Confirmation screen details computed from intent or skipped swap data
   */
  const confirmationDetails = useMemo(() => {
    // Handle swap skipped case - compute from swapSkippedData
    if (swapSkippedData && skipSwap) {
      const { destination: destData, gas } = swapSkippedData;

      // Format the token amount from raw units
      const rawAmount = Number.parseFloat(destData.amount);
      const tokenAmount = rawAmount / Math.pow(10, destData.token.decimals);
      const receiveAmountUsd = getFiatValue(tokenAmount, destData.token.symbol);

      // Format for display
      const receiveAmountAfterSwap = `${tokenAmount.toFixed(2)} ${destData.token.symbol}`;

      // Gas fee calculation from swapSkippedData
      const estimatedFeeWei = Number.parseFloat(gas.estimatedFee);
      const estimatedFeeEth = estimatedFeeWei / 1e18;
      const gasFeeUsd = getFiatValue(
        estimatedFeeEth,
        destination.gasTokenSymbol ?? "ETH"
      );

      return {
        sourceLabel: destination.label ?? "Deposit",
        sources: [],
        gasTokenSymbol: destination.gasTokenSymbol,
        estimatedTime: destination.estimatedTime ?? "~30s",
        amountSpent: receiveAmountUsd,
        totalFeeUsd: gasFeeUsd,
        receiveTokenSymbol: destData.token.symbol,
        receiveAmountAfterSwapUsd: receiveAmountUsd,
        receiveAmountAfterSwap,
        receiveTokenLogo: destination.tokenLogo,
        receiveTokenChain: destData.chain.id,
        destinationChainName: destData.chain.name,
      };
    }

    if (!activeIntent || !nexusSDK) return null;

    // Use user's requested amount (from input), not SDK's optimized bridge amount
    const receiveAmountUsd = inputAmount
      ? parseFloat(inputAmount.replace(/,/g, ""))
      : 0;

    // Convert USD amount to token amount for display
    const tokenExchangeRate = exchangeRate?.[destination.tokenSymbol] ?? 1;
    const receiveTokenAmount = receiveAmountUsd / tokenExchangeRate;

    const receiveAmountAfterSwap = nexusSDK.utils.formatTokenBalance(
      receiveTokenAmount.toString(),
      {
        symbol: destination.tokenSymbol,
        decimals: destination.tokenDecimals,
      }
    );

    // Build sources array from intent sources
    const sources: Array<{
      chainId: number;
      tokenAddress: `0x${string}`;
      decimals: number;
      symbol: string;
      balance: string;
      balanceInFiat?: number;
      tokenLogo?: string;
      chainLogo?: string;
      chainName?: string;
      isDestinationBalance?: boolean;
    }> = [];

    activeIntent.intent.sources.forEach((source) => {
      const matchingAsset = availableAssets.find(
        (asset) =>
          asset.chainId === source.chain.id &&
          asset.symbol === source.token.symbol
      );
      if (matchingAsset) {
        const sourceAmountUsd = getFiatValue(
          Number.parseFloat(source.amount),
          source.token.symbol
        );
        sources.push({
          ...matchingAsset,
          balance: source.amount,
          balanceInFiat: sourceAmountUsd,
          isDestinationBalance: false,
        });
      }
    });

    // Calculate total spent from cross-chain sources
    const totalAmountSpentUsd = activeIntent.intent.sources?.reduce(
      (acc, source) => {
        const amount = Number.parseFloat(source.amount);
        const usdAmount = getFiatValue(amount, source.token.symbol);
        return acc + usdAmount;
      },
      0
    );

    // Get the actual amount arriving on destination (AFTER fees)
    const destinationAmount = Number.parseFloat(
      activeIntent.intent.destination?.amount ?? "0"
    );
    const destinationAmountUsd = getFiatValue(
      destinationAmount,
      activeIntent.intent.destination?.token?.symbol ?? destination.tokenSymbol
    );

    // Calculate bridge/protocol fees
    const totalFeeUsd = Math.max(0, totalAmountSpentUsd - destinationAmountUsd);

    // Calculate destination balance used
    const usedFromDestinationUsd = Math.max(
      0,
      receiveAmountUsd - destinationAmountUsd
    );

    if (usedFromDestinationUsd > 0.01 && destinationBalance) {
      const usedTokenAmount = usedFromDestinationUsd / tokenExchangeRate;
      const chainMeta =
        CHAIN_METADATA[destination.chainId as keyof typeof CHAIN_METADATA];

      sources.push({
        chainId: destination.chainId,
        tokenAddress: destination.tokenAddress,
        decimals: destination.tokenDecimals,
        symbol: destination.tokenSymbol,
        balance: usedTokenAmount.toString(),
        balanceInFiat: usedFromDestinationUsd,
        tokenLogo: destination.tokenLogo,
        chainLogo: chainMeta?.logo,
        chainName: chainMeta?.name,
        isDestinationBalance: true,
      });
    }

    const actualAmountSpent = totalAmountSpentUsd + usedFromDestinationUsd;

    return {
      sourceLabel: destination.label ?? "Deposit",
      sources,
      gasTokenSymbol: destination.gasTokenSymbol,
      estimatedTime: destination.estimatedTime ?? "~30s",
      amountSpent: actualAmountSpent,
      totalFeeUsd,
      receiveTokenSymbol: destination.tokenSymbol,
      receiveAmountAfterSwapUsd: receiveAmountUsd,
      receiveAmountAfterSwap,
      receiveTokenLogo: destination.tokenLogo,
      receiveTokenChain: destination.chainId,
      destinationChainName: activeIntent.intent.destination?.chain?.name,
    };
  }, [
    activeIntent,
    nexusSDK,
    destination,
    availableAssets,
    inputAmount,
    exchangeRate,
    getFiatValue,
    destinationBalance,
    swapSkippedData,
    skipSwap,
  ]);

  /**
   * Gas fee breakdown for display
   */
  const feeBreakdown = useMemo(() => {
    // Use actual gas fee from receipt if available
    if (actualGasFeeUsd !== null) {
      const gasFormatted = usdFormatter.format(actualGasFeeUsd);
      return {
        totalGasFee: actualGasFeeUsd,
        gasUsd: actualGasFeeUsd,
        gasFormatted,
      };
    }

    // Use gas from swapSkippedData when swap is skipped
    if (swapSkippedData && skipSwap) {
      const { gas } = swapSkippedData;
      const estimatedFeeWei = Number.parseFloat(gas.estimatedFee);
      const estimatedFeeEth = estimatedFeeWei / 1e18;
      const gasUsd = getFiatValue(
        estimatedFeeEth,
        destination.gasTokenSymbol ?? "ETH"
      );
      const gasFormatted = usdFormatter.format(gasUsd);
      return { totalGasFee: gasUsd, gasUsd, gasFormatted };
    }

    // Otherwise use estimated gas from intent
    if (!activeIntent?.intent?.destination?.gas) {
      return { totalGasFee: 0, gasUsd: 0, gasFormatted: "0" };
    }

    const gas = (activeIntent.intent.destination as any).gas;
    const gasAmount = parseFloat(gas.amount);
    const gasSymbol = gas.token?.symbol ?? destination.gasTokenSymbol;
    const gasUsd = getFiatValue(gasAmount, gasSymbol);
    const gasFormatted = usdFormatter.format(gasUsd);

    return { totalGasFee: gasUsd, gasUsd, gasFormatted };
  }, [
    activeIntent,
    getFiatValue,
    actualGasFeeUsd,
    swapSkippedData,
    skipSwap,
    destination.gasTokenSymbol,
  ]);

  return {
    availableAssets,
    totalSelectedBalance,
    totalBalance,
    destinationBalance,
    confirmationDetails,
    feeBreakdown,
  };
}
