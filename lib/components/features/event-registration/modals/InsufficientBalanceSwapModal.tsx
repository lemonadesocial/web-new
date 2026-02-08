"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAtomValue as useJotaiAtomValue } from "jotai";
import {
  formatTokenBalance,
  parseUnits,
  type ExactOutSwapInput,
  type UserAsset,
} from "@avail-project/nexus-core";
import { type Hex } from "viem";

import { Button, Checkbox, ModalContent, Skeleton } from "$lib/components/core";
import { chainsMapAtom } from "$lib/jotai";
import { toast } from "$lib/components/core/toast";
import { useNexus } from "$lib/components/features/avail/nexus/NexusProvider";
import { TOKEN_IMAGES } from "$lib/components/features/avail/deposit/constants/assets";
import { usdFormatter } from "$lib/components/features/avail/common";
import { formatNumber } from "$lib/utils/number";
import { registrationModal } from "../store";
import { currencyAtom, selectedPaymentAccountAtom, tokenAddressAtom, useAtomValue } from "../store";
import { EthereumAccount } from "$lib/graphql/generated/backend/graphql";

interface InsufficientBalanceSwapModalProps {
  currentBalance: string;
  neededAmount: string;
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
  onSuccess,
}: InsufficientBalanceSwapModalProps) {
  const { nexusSDK, swapBalance, fetchSwapBalance, exchangeRate, requestSwapIntentAutoAllow } =
    useNexus();
  const chainsMap = useJotaiAtomValue(chainsMapAtom);
  const selectedPaymentAccount = useAtomValue(selectedPaymentAccountAtom);
  const tokenAddress = useAtomValue(tokenAddressAtom);
  const currency = useAtomValue(currencyAtom);

  const network = (selectedPaymentAccount?.account_info as EthereumAccount)?.network;
  const chain = network ? chainsMap[network] : null;
  const toChainId = Number(chain?.chain_id ?? 0);
  const toTokenAddress = (tokenAddress as Hex) ?? ("0x" as Hex);

  const [selectedChainIds, setSelectedChainIds] = useState<Set<string>>(new Set());
  const [swapLoading, setSwapLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    const token = chain?.tokens?.find(
      (t) => t.contract?.toLowerCase() === tokenAddress?.toLowerCase()
    );
    const decimals = token?.decimals ?? 6;
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
      neededAmountFormatted: (
        <>
          {neededAmountFormattedValue}
          <span className="text-secondary font-normal">
            {" "}
            · ~${formatNumber(neededUsdValue)}
          </span>
        </>
      ),
      neededUsd: neededUsdValue,
    };
  }, [currentBalance, neededAmount, chain, tokenAddress, currency, exchangeRate]);

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
    if (!nexusSDK || selectedChains.length === 0) return;
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
        registrationModal.close();
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
  const canShowSwapAssets = isNexusReady && availableChains.length > 0;

  return (
    <ModalContent
      title={`Not enough ${currency} to continue`}
      onClose={() => registrationModal.close()}
      className="min-w-[480px]"
    >
      <div className="space-y-4">
        <div className="space-y-3">
          <p className="text-secondary">
            You currently have {currentBalanceFormatted}. You&apos;re short{" "}
            <span className="font-medium text-danger-400">{neededAmountFormatted}</span>{" "}
            for this transaction.
          </p>
        </div>

        {!isNexusReady && (
          <div className="flex flex-col gap-2">
            <Skeleton animate className="h-4 w-24 rounded-md" />
            <Skeleton animate className="h-10 w-full rounded-md" />
          </div>
        )}

        {canShowSwapAssets && (
          <div>
            <p className="mb-2">Swap another asset into {currency} to proceed.</p>
            <div className="max-h-[240px] overflow-y-auto rounded-lg border">
              {availableChains.map((c) => (
                <div
                  key={c.id}
                  role="button"
                  tabIndex={0}
                  className="flex cursor-pointer items-center justify-between border-b p-4 last:border-b-0 hover:bg-muted/30"
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
                      className="size-8 rounded-full"
                    />
                    <div>
                      <p className="font-medium">{c.symbol}</p>
                      <p className="text-sm text-secondary">{c.chainName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm">{c.balance}</p>
                      <p className="text-xs text-secondary">
                        {usdFormatter.format(c.usdValue)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {canShowSwapAssets && selectedChains.length > 0 && (
          <p className="text-sm text-secondary">
            Selected: {usdFormatter.format(totalSelectedUsd)} · Remaining:{" "}
            {usdFormatter.format(Math.max(0, remainingUsd))}
          </p>
        )}

        {error && (
          <p className="text-sm text-danger-400">{error}</p>
        )}

        {canShowSwapAssets && (
          <p className="text-sm text-warning-300">
            You will receive exactly the amount needed. The swap uses your selected
            assets across chains to source the required amount.
          </p>
        )}

        <div className="flex gap-3">
          <Button
            variant="tertiary"
            className="flex-1"
            onClick={() => registrationModal.close()}
            disabled={swapLoading}
          >
            Cancel
          </Button>
          {canShowSwapAssets && (
            <Button
              className="flex-1"
              variant="secondary"
              onClick={handleSwap}
              loading={swapLoading}
              disabled={!hasEnoughBalance || swapLoading}
            >
              Swap & Continue
            </Button>
          )}
        </div>
      </div>
    </ModalContent>
  );
}
