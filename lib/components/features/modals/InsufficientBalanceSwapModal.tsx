"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  formatTokenBalance,
  parseUnits,
  type ExactOutSwapInput,
  type UserAsset,
} from "@avail-project/nexus-core";
import { type Hex } from "viem";

import { Button, Checkbox, modal } from "$lib/components/core";
import { toast } from "$lib/components/core/toast";
import { useNexus } from "$lib/components/features/avail/NexusProvider";
import { TOKEN_IMAGES } from "$lib/components/features/avail/assets";
import { usdFormatter } from "$lib/components/features/avail/constant";
import { formatNumber } from "$lib/utils/number";

interface InsufficientBalanceSwapModalProps {
  currentBalance: string;
  neededAmount: string;
  currency: string;
  toChainId: number;
  toTokenAddress: Hex;
  tokenDecimals?: number;
  onSuccess: () => void;
}

function transformSwapBalanceToChains(
  swapBalance: UserAsset[] | null
): Array<{
  id: string;
  chainId: number;
  tokenAddress: `0x${string}`;
  chainName: string;
  symbol: string;
  decimals: number;
  balance: string;
  balanceRaw: bigint;
  usdValue: number;
  logo: string;
}> {
  if (!swapBalance) return [];
  const chains: Array<{
    id: string;
    chainId: number;
    tokenAddress: `0x${string}`;
    chainName: string;
    symbol: string;
    decimals: number;
    balance: string;
    balanceRaw: bigint;
    usdValue: number;
    logo: string;
  }> = [];
  swapBalance.forEach((asset) => {
    asset.breakdown?.forEach((b) => {
      if (b.chain && b.balance) {
        const balanceNum = parseFloat(b.balance);
        const decimals = asset.decimals;
        const balanceRaw = parseUnits(b.balance, decimals);
        chains.push({
          id: `${b.contractAddress}-${b.chain.id}`,
          chainId: b.chain.id,
          tokenAddress: b.contractAddress as `0x${string}`,
          chainName: b.chain.name,
          symbol: asset.symbol,
          decimals,
          balance: formatTokenBalance(balanceNum, { decimals, symbol: asset.symbol }),
          balanceRaw,
          usdValue: b.balanceInFiat ?? 0,
          logo: asset.icon || TOKEN_IMAGES[asset.symbol] || "",
        });
      }
    });
  });
  return chains.sort((a, b) => b.usdValue - a.usdValue);
}

export function InsufficientBalanceSwapModal({
  currentBalance,
  neededAmount,
  currency,
  toChainId,
  toTokenAddress,
  tokenDecimals = 18,
  onSuccess,
}: InsufficientBalanceSwapModalProps) {
  const { nexusSDK, swapBalance, fetchSwapBalance, exchangeRate, requestSwapIntentAutoAllow } =
    useNexus();

  const [selectedChainIds, setSelectedChainIds] = useState<Set<string>>(new Set());
  const [swapLoading, setSwapLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const swapSupportedChains = useMemo(() => {
    if (!nexusSDK) return [];
    return nexusSDK.getSwapSupportedChains();
  }, [nexusSDK]);

  const isToChainSupported = useMemo(() => {
    if (!toChainId || swapSupportedChains.length === 0) return false;
    return swapSupportedChains.some((c) => c.id === toChainId);
  }, [toChainId, swapSupportedChains]);

  const availableChains = useMemo(
    () => transformSwapBalanceToChains(swapBalance),
    [swapBalance]
  );

  const selectedChains = useMemo(
    () => availableChains.filter((c) => selectedChainIds.has(c.id)),
    [availableChains, selectedChainIds]
  );

  const totalSelectedUsd = useMemo(
    () => selectedChains.reduce((sum, c) => sum + c.usdValue, 0),
    [selectedChains]
  );

  const { currentBalanceFormatted, neededAmountFormatted, neededUsd } = useMemo(() => {
    const decimals = tokenDecimals;
    const symbol = currency;
    const rate = exchangeRate?.[symbol.toUpperCase()] ?? 1;

    const currentNum = Number(currentBalance) / 10 ** decimals;
    const neededNum = Number(neededAmount) / 10 ** decimals;
    const neededUsdValue = neededNum * rate;

    const currentBalanceFormattedValue = formatTokenBalance(currentNum, {
      decimals,
      symbol,
    });
    const neededAmountFormattedValue = formatTokenBalance(neededNum, {
      decimals,
      symbol,
    });

    return {
      currentBalanceFormatted: currentBalanceFormattedValue,
      neededAmountFormatted: neededAmountFormattedValue,
      neededUsd: neededUsdValue,
    };
  }, [currentBalance, neededAmount, tokenDecimals, currency, exchangeRate]);

  const remainingUsd = neededUsd - totalSelectedUsd;

  useEffect(() => {
    void fetchSwapBalance();
  }, [fetchSwapBalance]);

  const toggleChain = useCallback((id: string) => {
    setSelectedChainIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleSwap = async () => {
    if (!nexusSDK || selectedChains.length === 0 || !isToChainSupported) return;
    setError(null);
    setSwapLoading(true);

    const fromSources = selectedChains.map((c) => ({
      chainId: c.chainId,
      tokenAddress: c.tokenAddress,
    }));

    const input: ExactOutSwapInput = {
      fromSources,
      toChainId,
      toTokenAddress,
      toAmount: BigInt(neededAmount),
    };

    try {
      requestSwapIntentAutoAllow();

      const result = await nexusSDK.swapWithExactOut(input);

      if (result.success && result.result) {
        toast.success("Swap completed successfully");
        modal.close();
        onSuccess();
        return;
      }

      setError(result.success ? "Swap failed" : (result as { error: string }).error);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Swap failed");
    } finally {
      setSwapLoading(false);
      void fetchSwapBalance();
    }
  };

  const hasEnoughBalance = totalSelectedUsd > 0;
  const isNexusReady = Boolean(nexusSDK);
  const canShowSwapAssets = isNexusReady && availableChains.length > 0 && isToChainSupported;

  return (
    <div className="p-4 space-y-4 w-full max-w-[340px]">
      <div className="flex justify-between items-start">
        <div className="size-[56px] flex justify-center items-center rounded-full bg-danger-400/16 shrink-0">
          <i className="icon-error text-danger-400" />
        </div>
        <Button icon="icon-x" size="xs" variant="tertiary" className="rounded-full shrink-0" onClick={() => modal.close()} />
      </div>
      <div className="space-y-2">
        <p className="text-lg">Insufficient Funds</p>
        <p className="text-sm text-secondary">
          You have {currentBalanceFormatted} available. This transaction needs{" "}
          <span className="font-medium text-danger-400">{neededAmountFormatted}</span>{" "}
          (about ${formatNumber(neededUsd)}) more.
        </p>


        {canShowSwapAssets ? (
          <div className="space-y-4">
            <p className="text-sm text-secondary">Swap one or more assets into {currency} to continue.</p>
            <div className="max-h-[204px] overflow-y-auto no-scrollbar rounded-md border-card-border bg-card">
              {availableChains.map((c) => (
                <div
                  key={c.id}
                  role="button"
                  tabIndex={0}
                  className="flex cursor-pointer items-center justify-between border-b px-3 py-1.5 last:border-b-0"
                  onClick={() => toggleChain(c.id)}
                >
                  <div className="flex items-center gap-3">
                    <div onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        id={`swap-chain-${c.id}`}
                        value={selectedChainIds.has(c.id)}
                        onChange={() => toggleChain(c.id)}
                      />
                    </div>
                    <img
                      src={c.logo}
                      alt={c.symbol}
                      className="size-5 rounded-full"
                    />
                    <div>
                      <p className="font-medium">{c.symbol}</p>
                      <p className="text-sm text-tertiary">{c.chainName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{c.balance}</p>
                    <p className="text-sm text-tertiary">
                      {usdFormatter.format(c.usdValue)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-secondary">Please note: only the exact amount needed will be swapped.</p>
          </div>
        ) : (
          <p className="text-sm text-secondary">
            {!isNexusReady
              ? "Nexus swap service is loading and will be ready shortly."
              : !isToChainSupported
                ? `Please note: swapping to ${currency} isn't supported on this network. Please add ${currency} to continue.`
                : "No swapable assets found."}
          </p>
        )}

        {canShowSwapAssets && selectedChains.length > 0 && (
          <p className="text-sm text-secondary">
            Selected: <span className="text-success-400">{usdFormatter.format(totalSelectedUsd)}</span> · Remaining:{" "}
            <span className="text-warning-400">{usdFormatter.format(Math.max(0, remainingUsd))}</span>
          </p>
        )}

        {error && (
          <p className="text-sm text-danger-400">{error}</p>
        )}
      </div>

      {
        canShowSwapAssets ? (
          <div className="flex gap-2">
            <Button
              variant="tertiary"
              className="w-full"
              onClick={() => modal.close()}
              disabled={swapLoading}
            >
              Cancel
            </Button>
            {canShowSwapAssets && (
              <Button
                variant="secondary"
                className="w-full"
                onClick={handleSwap}
                loading={swapLoading}
                disabled={!hasEnoughBalance || swapLoading}
              >
                Swap & Continue
              </Button>
            )}
          </div>
        ) : (
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => modal.close()}
          >
            Done
          </Button>
        )
      }
    </div>
  );
}
