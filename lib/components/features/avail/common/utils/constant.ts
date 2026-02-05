import { formatUnits, parseUnits } from "viem";

export const SHORT_CHAIN_NAME: Record<number, string> = {
  1: "Ethereum",
  8453: "Base",
  42161: "Arbitrum",
  10: "Optimism",
  137: "Polygon",
  43114: "Avalanche",
  534352: "Scroll",
  50104: "Sophon",
  8217: "Kaia",
  56: "BNB",
  143: "Monad",
  999: "HyperEVM",
  728126428: "Tron",
  11155111: "Sepolia",
  84532: "Base Sepolia",
  421614: "Arbitrum Sepolia",
  11155420: "Optimism Sepolia",
  80002: "Polygon Amoy",
  10143: "Monad Testnet",
  2494104990: "Tron Shasta",
  567: "Validium Testnet",
} as const;

const DEFAULT_SAFETY_MARGIN = 0.01; // 1%

/**
 * Compute an amount string for fraction buttons (25%, 50%, 75%, 100%).
 *
 * @param balanceStr - user's balance as a human decimal string (e.g. "12.345") OR as base-unit integer string if `balanceIsBaseUnits` true
 * @param fraction - fraction e.g. 0.25, 0.5, 0.75, 1
 * @param decimals - token decimals (6 for USDC/USDT, 18 for ETH)
 * @param safetyMargin - 0.01 for 1% default
 * @param balanceIsBaseUnits - if true, balanceStr is already base units integer string (wei / smallest unit)
 * @returns decimal string clipped to token decimals (rounded down)
 */
export function computeAmountFromFraction(
  balanceStr: string,
  fraction: number,
  decimals: number,
  safetyMargin = DEFAULT_SAFETY_MARGIN,
  balanceIsBaseUnits = false,
): string {
  if (!balanceStr) return "0";

  // parse balance into base units (BigInt)
  const balanceUnits: bigint = balanceIsBaseUnits
    ? BigInt(balanceStr)
    : parseUnits(balanceStr, decimals);

  if (balanceUnits === BigInt(0)) return "0";

  // Use an integer precision multiplier to avoid FP issues
  const PREC = 1_000_000; // 1e6 precision for fraction & safety margin
  const safetyMul = BigInt(Math.max(0, Math.floor((1 - safetyMargin) * PREC))); // (1 - safetyMargin) * PREC
  const fractionMul = BigInt(Math.max(0, Math.floor(fraction * PREC))); // fraction * PREC

  // Apply safety margin: floor(balance * (1 - safetyMargin))
  const maxAfterSafety = (balanceUnits * safetyMul) / BigInt(PREC);

  // Apply fraction and floor: floor(maxAfterSafety * fraction)
  let desiredUnits = (maxAfterSafety * fractionMul) / BigInt(PREC);

  // Extra clamp just in case
  if (desiredUnits > balanceUnits) desiredUnits = balanceUnits;
  if (desiredUnits < BigInt(0)) desiredUnits = BigInt(0);

  // format back to human readable decimal string with token decimals (formatUnits truncates/keeps decimals)
  // formatUnits will produce exactly decimals digits if fractional part exists; we'll strip trailing zeros.
  const raw = formatUnits(desiredUnits, decimals);
  // strip trailing zeros and possible trailing dot
  return raw
    .replace(/(\.\d*?[1-9])0+$/u, "$1")
    .replace(/\.0+$/u, "")
    .replace(/^\.$/u, "0");
}

export const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
