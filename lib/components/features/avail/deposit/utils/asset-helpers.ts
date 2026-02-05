import type { Token, AssetFilterType } from "../types";
import { STABLECOIN_SYMBOLS } from "../constants/widget";
import { CHAIN_METADATA } from "@avail-project/nexus-core";

export function isStablecoin(symbol: string): boolean {
  return STABLECOIN_SYMBOLS.includes(
    symbol as (typeof STABLECOIN_SYMBOLS)[number],
  );
}

export function isNative(symbol: string): boolean {
  return Object.values(CHAIN_METADATA).some(
    (chain) => chain.nativeCurrency.symbol === symbol,
  );
}

/**
 * Get checkbox state for a token based on selected chains
 */
export function getTokenCheckState(
  token: Token,
  selectedChainIds: Set<string>,
): boolean | "indeterminate" {
  const selectedChainCount = token.chains.filter((c) =>
    selectedChainIds.has(c.id),
  ).length;

  if (selectedChainCount === 0) return false;
  if (selectedChainCount === token.chains.length) return true;
  return "indeterminate";
}

/**
 * Check if current selection matches a preset filter
 * Returns the matching filter type or "custom"
 */
export function checkIfMatchesPreset(
  tokens: Token[],
  selectedChainIds: Set<string>,
): AssetFilterType {
  if (selectedChainIds.size === 0) return "custom";

  const allIds = new Set<string>();
  const stableIds = new Set<string>();
  const nativeIds = new Set<string>();

  tokens.forEach((token) => {
    token.chains.forEach((chain) => {
      allIds.add(chain.id);
      if (isStablecoin(token.symbol)) {
        stableIds.add(chain.id);
      }
      if (isNative(token.symbol)) {
        nativeIds.add(chain.id);
      }
    });
  });

  const setsEqual = (a: Set<string>, b: Set<string>) =>
    a.size === b.size && [...a].every((id) => b.has(id));

  if (setsEqual(selectedChainIds, allIds)) return "all";
  if (setsEqual(selectedChainIds, stableIds)) return "stablecoins";
  if (setsEqual(selectedChainIds, nativeIds)) return "native";
  return "custom";
}

/**
 * Get chain IDs for a preset filter
 */
export function getChainIdsForFilter(
  tokens: Token[],
  filter: "all" | "stablecoins" | "native",
): Set<string> {
  const ids = new Set<string>();
  tokens.forEach((token) => {
    const shouldInclude =
      filter === "all" ||
      (filter === "stablecoins" && isStablecoin(token.symbol)) ||
      (filter === "native" && isNative(token.symbol));

    if (shouldInclude) {
      token.chains.forEach((chain) => ids.add(chain.id));
    }
  });
  return ids;
}

/**
 * Calculate total USD value for selected chain IDs
 */
export function calculateSelectedAmount(
  tokens: Token[],
  selectedChainIds: Set<string>,
): number {
  let total = 0;
  tokens.forEach((token) => {
    token.chains.forEach((chain) => {
      if (selectedChainIds.has(chain.id)) {
        total += chain.usdValue;
      }
    });
  });
  return total;
}
