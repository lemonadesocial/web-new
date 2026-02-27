import { formatEther } from 'viem';
import { formatNumber } from './number';

export function calculateMarketCapData(
  latestMarketCapETH: string | null | undefined,
  previousMarketCapETH: string | null | undefined,
): {
  formattedAmount: string;
  percentageChange: number | null;
} {
  const latest = latestMarketCapETH ? BigInt(latestMarketCapETH) : BigInt(0);
  const previous = previousMarketCapETH ? BigInt(previousMarketCapETH) : null;

  const formattedMarketCap = formatEther(latest);
  const marketCapNumber = Number(formattedMarketCap);
  const formattedAmount = marketCapNumber > 0 ? `${formatNumber(marketCapNumber)} ETH` : '0 ETH';

  let percentageChange: number | null = null;
  if (previous !== null && previous > 0) {
    const latestNum = Number(latest);
    const previousNum = Number(previous);
    if (previousNum !== 0) {
      percentageChange = ((latestNum - previousNum) / previousNum) * 100;
    }
  }

  return {
    formattedAmount,
    percentageChange,
  };
}

