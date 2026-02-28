/**
 * HTML / URL / CSS sanitizers for page builder sections.
 *
 * All URL validators normalise the input to lowercase before checking the
 * protocol so that mixed-case bypass attacks (e.g. `JaVaScRiPt:`) are blocked.
 * Control characters (\x00-\x1f) are stripped before evaluation to prevent
 * null-byte and tab/newline obfuscation.
 *
 * Uses DOMPurify for production-grade HTML XSS prevention.
 */

import DOMPurify from 'dompurify';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Strip ASCII control characters (0x00–0x1F) that can be used to obfuscate
 * protocol prefixes in URLs (e.g. `\x00javascript:`, `\tjavascript:`).
 */
function stripControlChars(value: string): string {
  // eslint-disable-next-line no-control-regex
  return value.replace(/[\x00-\x1f]/g, '');
}

// ---------------------------------------------------------------------------
// HTML
// ---------------------------------------------------------------------------

export function sanitizeHtml(html: string): string {
  if (!html) return '';
  return DOMPurify.sanitize(html);
}

// ---------------------------------------------------------------------------
// URL — iframe src
// ---------------------------------------------------------------------------

/**
 * Validate that a URL is safe for use in an iframe src.
 * Only allows http(s):// URLs.
 */
export function sanitizeIframeSrc(url: string): string {
  if (!url) return '';
  const cleaned = stripControlChars(url).trim();
  const lower = cleaned.toLowerCase();
  if (lower.startsWith('https://') || lower.startsWith('http://')) return cleaned;
  return '';
}

// ---------------------------------------------------------------------------
// URL — anchor href
// ---------------------------------------------------------------------------

/**
 * Validate that a URL is safe for use in an anchor href attribute.
 * Rejects javascript:, data:, vbscript: and other dangerous protocols.
 * Allows http(s), relative paths, anchor links, mailto, and tel.
 */
export function sanitizeHref(url: string | undefined | null): string {
  if (!url) return '#';
  const cleaned = stripControlChars(url).trim();
  if (!cleaned) return '#';

  const lower = cleaned.toLowerCase();

  // Allow safe protocols
  if (lower.startsWith('https://') || lower.startsWith('http://')) return cleaned;
  // Allow relative paths
  if (cleaned.startsWith('/') || cleaned.startsWith('./') || cleaned.startsWith('../')) return cleaned;
  // Allow anchors
  if (cleaned.startsWith('#')) return cleaned;
  // Allow mailto and tel
  if (lower.startsWith('mailto:') || lower.startsWith('tel:')) return cleaned;

  // Block everything else (javascript:, data:, vbscript:, etc.)
  return '#';
}

// ---------------------------------------------------------------------------
// URL — media src (images, video posters, cover art)
// ---------------------------------------------------------------------------

/**
 * Validate that a URL is safe for use in <img src>, <video poster>, etc.
 * Allows http(s), protocol-relative (`//`), data:image/* (base64 thumbnails),
 * and relative paths. Blocks javascript:, data:text/html, vbscript:, and all
 * other dangerous protocols.
 */
export function sanitizeMediaSrc(url: string | undefined | null): string {
  if (!url) return '';
  const cleaned = stripControlChars(url).trim();
  if (!cleaned) return '';

  const lower = cleaned.toLowerCase();

  // Allow http(s)
  if (lower.startsWith('https://') || lower.startsWith('http://')) return cleaned;
  // Allow protocol-relative URLs
  if (cleaned.startsWith('//')) return cleaned;
  // Allow safe data: image types only (used for base64 thumbnails)
  if (lower.startsWith('data:image/')) return cleaned;
  // Allow relative paths
  if (cleaned.startsWith('/') || cleaned.startsWith('./') || cleaned.startsWith('../')) return cleaned;

  // Block everything else (javascript:, data:text/html, vbscript:, blob: etc.)
  return '';
}

// ---------------------------------------------------------------------------
// CSS
// ---------------------------------------------------------------------------

/**
 * Sanitize CSS content for safe injection into a <style> tag.
 *
 * Strips dangerous CSS constructs:
 * - expression() (IE CSS expressions)
 * - javascript: URLs (in any context, including url())
 * - @import (prevents loading external stylesheets)
 * - behavior / -moz-binding (IE/Firefox extensions for executable content)
 * - url() with dangerous protocols (javascript:, data:text/html, vbscript:)
 * - Null-byte obfuscation (\00, \000000)
 *
 * Unlike sanitizeHtml(), this does NOT use DOMPurify (which strips CSS rules).
 */
export function sanitizeCss(css: string): string {
  if (!css) return '';

  // 1. Strip null-byte escape sequences used for obfuscation (\00, \000000)
  let safe = css.replace(/\\0+/g, '');

  // 2. Sanitise url() contents FIRST — before standalone pattern replacement
  //    so that dangerous protocols inside url() are caught intact.
  safe = safe.replace(
    /url\s*\(\s*(['"]?)([\s\S]*?)\1\s*\)/gi,
    (_match, quote: string, inner: string) => {
      const normalised = stripControlChars(inner).trim().toLowerCase();
      if (
        normalised.startsWith('javascript:') ||
        normalised.startsWith('vbscript:') ||
        (normalised.startsWith('data:') && !normalised.startsWith('data:image/'))
      ) {
        return '/* blocked-url */';
      }
      return `url(${quote}${inner}${quote})`;
    },
  );

  // 3. Block dangerous functions / directives (standalone, outside url())
  safe = safe
    .replace(/expression\s*\(/gi, '/* blocked */(')
    .replace(/javascript\s*:/gi, '/* blocked */')
    .replace(/vbscript\s*:/gi, '/* blocked */')
    .replace(/@import\b/gi, '/* @import blocked */')
    .replace(/behavior\s*:/gi, '/* blocked */:')
    .replace(/-moz-binding\s*:/gi, '/* blocked */:');

  return safe;
}
