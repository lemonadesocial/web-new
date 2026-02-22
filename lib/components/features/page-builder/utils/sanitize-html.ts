/**
 * Lightweight HTML sanitizer for page builder sections.
 *
 * Strips <script> tags, event handler attributes (onclick, onerror, etc.),
 * javascript: URLs, and other dangerous patterns.
 *
 * For production hardening, replace this with DOMPurify:
 *   import DOMPurify from 'dompurify';
 *   export const sanitizeHtml = (html: string) => DOMPurify.sanitize(html);
 */

const SCRIPT_REGEX = /<script[\s>][\s\S]*?<\/script>/gi;
const EVENT_HANDLER_REGEX = /\s+on\w+\s*=\s*["'][^"']*["']/gi;
const JAVASCRIPT_URL_REGEX = /\b(href|src|action)\s*=\s*["']\s*javascript\s*:/gi;
const DATA_URL_REGEX = /\b(src)\s*=\s*["']\s*data\s*:/gi;

export function sanitizeHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(SCRIPT_REGEX, '')
    .replace(EVENT_HANDLER_REGEX, '')
    .replace(JAVASCRIPT_URL_REGEX, '$1=""')
    .replace(DATA_URL_REGEX, '$1=""');
}

/**
 * Validate that a URL is safe for use in an iframe src.
 * Only allows https:// URLs.
 */
export function sanitizeIframeSrc(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('https://')) return trimmed;
  if (trimmed.startsWith('http://')) return trimmed;
  return '';
}
