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

export function capitalizeWords(str: string) {
  const words = str.split(' ');
  const capitalizedWords = words.map((word) => {
    if (word.length === 0) {
      return '';
    }
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
  return capitalizedWords.join(' ');
}

export function extractLinks(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;
  const matches = text.match(urlRegex);
  return matches
    ? Array.from(
        new Set(
          matches.map((link) => {
            if (link.startsWith('www.') && !link.startsWith('http')) {
              return `http://${link}`;
            }
            return link;
          }),
        ),
      )
    : [];
}
