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

/**
 * Validate that a URL is safe for use in an anchor href attribute.
 * Rejects javascript:, data:, vbscript: and other dangerous protocols.
 * Allows http(s), relative paths, anchor links, mailto, and tel.
 */
export function sanitizeHref(url: string | undefined | null): string {
  if (!url) return '#';
  const trimmed = url.trim();
  if (!trimmed) return '#';

  // Allow safe protocols
  if (trimmed.startsWith('https://') || trimmed.startsWith('http://')) return trimmed;
  // Allow relative paths
  if (trimmed.startsWith('/') || trimmed.startsWith('./') || trimmed.startsWith('../')) return trimmed;
  // Allow anchors
  if (trimmed.startsWith('#')) return trimmed;
  // Allow mailto and tel
  if (trimmed.startsWith('mailto:') || trimmed.startsWith('tel:')) return trimmed;

  // Block everything else (javascript:, data:, vbscript:, etc.)
  return '#';
}

/**
 * Sanitize CSS content for safe injection into a <style> tag.
 * Strips dangerous CSS constructs (expression(), javascript: urls, @import,
 * behavior, -moz-binding) while preserving valid CSS rules.
 * Unlike sanitizeHtml(), this does NOT use DOMPurify (which strips CSS rules).
 */
export function sanitizeCss(css: string): string {
  if (!css) return '';
  return css
    .replace(/expression\s*\(/gi, '/* blocked */(')
    .replace(/javascript\s*:/gi, '/* blocked */')
    .replace(/@import\b/gi, '/* @import blocked */')
    .replace(/behavior\s*:/gi, '/* blocked */:')
    .replace(/-moz-binding\s*:/gi, '/* blocked */:');
}
