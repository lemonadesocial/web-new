/**
 * HTML sanitizer for page builder sections.
 *
 * Uses DOMPurify for production-grade XSS prevention.
 */

import DOMPurify from 'dompurify';

export function sanitizeHtml(html: string): string {
  if (!html) return '';
  return DOMPurify.sanitize(html);
}

/**
 * Validate that a URL is safe for use in an iframe src.
 * Only allows http(s):// URLs.
 */
export function sanitizeIframeSrc(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('https://')) return trimmed;
  if (trimmed.startsWith('http://')) return trimmed;
  return '';
}
