export function formatCurrency(amount = 0, currency?: string, attemptedDecimals = 2, showFree = true): string {
  amount /= 100;

  const decimals = amount % 1 === 0 ? attemptedDecimals : 2;
  return !!amount || !showFree
    ? amount.toLocaleString(undefined, {
        style: 'currency',
        currency: currency ?? 'USD',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
    : 'Free';
}

export function truncateStr(params: { str?: string; prefix: number; subfix?: number }) {
  if (!params.str || params.str?.length <= params.prefix) return params.str;

  const ellipsis = '...';
  const frontChars = params.prefix;
  const backChars = params.subfix || params.str.length;

  return params.str.substring(0, frontChars) + ellipsis + params.str.substring(params.str.length - backChars);
}
