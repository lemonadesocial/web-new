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

export function truncateMiddle(str: string, prefix: number, suffix: number, ellipsis = '...') {
  if (str.length <= prefix + suffix + ellipsis.length) {
    return str;
  }

  const pre = str.substring(0, prefix);
  const suf = str.substring(str.length - suffix);

  return pre + ellipsis + suf;
}
