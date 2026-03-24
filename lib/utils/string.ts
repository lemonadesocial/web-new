import { htmlToText } from 'html-to-text';
import { EMAIL_REGEX } from './regex';

export function formatCurrency(amount = 0, currency?: string, attemptedDecimals = 2, showFree = true): string {
  if (attemptedDecimals > 0) amount /= 10 ** attemptedDecimals;

  // const decimals = amount % 1 === 0 ? attemptedDecimals : 2;
  const decimals = amount % 1 === 0 ? 0 : attemptedDecimals;
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

export function isValidEmail(input: string) {
  return EMAIL_REGEX.test(input.trim());
}

export function htmlToInlineText(input?: string | null) {
  if (!input) return '';

  return htmlToText(input, { wordwrap: false })
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * @description this format str to number
 * Ex:
 *    formatNumber("1") -> 1
 *    formatNumber("1.2") -> 1.2
 **/
export function parseNumericString(str: string) {
  const num = parseFloat(str);
  return num.toString();
}
