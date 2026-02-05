"use client";

import { useState, useCallback, useEffect } from "react";
import type { AssetSelectionState } from "../types";
import type { UserAsset } from "@avail-project/nexus-core";

/**
 * Creates fresh initial asset selection state
 */
export const createInitialAssetSelection = (): AssetSelectionState => ({
  selectedChainIds: new Set<string>(),
  filter: "all",
  expandedTokens: new Set(),
});

/**
 * Hook for managing asset selection state in the deposit widget.
 * Handles selection of tokens/chains for cross-chain swaps.
 */
export function useAssetSelection(swapBalance: UserAsset[] | null) {
  const [assetSelection, setAssetSelectionState] =
    useState<AssetSelectionState>(createInitialAssetSelection);

  // Extract primitive value for effect dependency (rerender-dependencies)
  const selectedChainIdsCount = assetSelection.selectedChainIds.size;

  // Auto-select all assets when swapBalance first loads
  useEffect(() => {
    if (swapBalance && selectedChainIdsCount === 0) {
      const allChainIds = new Set<string>();
      swapBalance.forEach((asset) => {
        if (asset.breakdown) {
          asset.breakdown.forEach((b) => {
            if (b.chain && b.balance) {
              allChainIds.add(`${b.contractAddress}-${b.chain.id}`);
            }
          });
        }
      });
      if (allChainIds.size > 0) {
        setAssetSelectionState({
          selectedChainIds: allChainIds,
          filter: "all",
          expandedTokens: new Set(),
        });
      }
    }
  }, [swapBalance, selectedChainIdsCount]);

  const setAssetSelection = useCallback(
    (update: Partial<AssetSelectionState>) => {
      setAssetSelectionState((prev) => ({ ...prev, ...update }));
    },
    []
  );

  const resetAssetSelection = useCallback(() => {
    setAssetSelectionState(createInitialAssetSelection());
  }, []);

  return {
    assetSelection,
    setAssetSelection,
    resetAssetSelection,
  };
}
