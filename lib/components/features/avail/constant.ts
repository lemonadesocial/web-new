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

const DEFAULT_SAFETY_MARGIN = 0.01;

export function computeAmountFromFraction(
  balanceStr: string,
  fraction: number,
  decimals: number,
  safetyMargin = DEFAULT_SAFETY_MARGIN,
  balanceIsBaseUnits = false,
): string {
  if (!balanceStr) return "0";

  const balanceUnits: bigint = balanceIsBaseUnits
    ? BigInt(balanceStr)
    : parseUnits(balanceStr, decimals);

  if (balanceUnits === BigInt(0)) return "0";

  const PREC = 1_000_000;
  const safetyMul = BigInt(Math.max(0, Math.floor((1 - safetyMargin) * PREC)));
  const fractionMul = BigInt(Math.max(0, Math.floor(fraction * PREC)));

  const maxAfterSafety = (balanceUnits * safetyMul) / BigInt(PREC);

  let desiredUnits = (maxAfterSafety * fractionMul) / BigInt(PREC);

  if (desiredUnits > balanceUnits) desiredUnits = balanceUnits;
  if (desiredUnits < BigInt(0)) desiredUnits = BigInt(0);

  const raw = formatUnits(desiredUnits, decimals);
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
