import { expect, it, describe } from 'vitest';
import {
  sanitizeHtml,
  sanitizeIframeSrc,
  sanitizeHref,
  sanitizeMediaSrc,
  sanitizeCss,
} from '$lib/components/features/page-builder/utils/sanitize-html';

// ===========================================================================
// sanitizeHtml (DOMPurify)
// ===========================================================================

describe('sanitizeHtml', () => {
  it('strips <script> tags', () => {
    const dirty = '<p>Hello</p><script>alert("xss")</script><p>World</p>';
    const clean = sanitizeHtml(dirty);

    expect(clean).not.toContain('<script');
    expect(clean).not.toContain('</script>');
    expect(clean).not.toContain('alert');
    expect(clean).toContain('<p>Hello</p>');
    expect(clean).toContain('<p>World</p>');
  });

  it('strips <script> tags with attributes', () => {
    const dirty = '<script type="text/javascript" src="evil.js"></script>';
    const clean = sanitizeHtml(dirty);

    expect(clean).not.toContain('<script');
    expect(clean).toBe('');
  });

  it('strips event handlers (onclick, onerror)', () => {
    const dirty = '<img src="photo.jpg" onerror="alert(1)" />';
    const clean = sanitizeHtml(dirty);

    expect(clean).not.toContain('onerror');
    expect(clean).not.toContain('alert');
    expect(clean).toContain('src="photo.jpg"');
  });

  it('strips onclick handler', () => {
    const dirty = '<button onclick="stealCookies()">Click me</button>';
    const clean = sanitizeHtml(dirty);

    expect(clean).not.toContain('onclick');
    expect(clean).not.toContain('stealCookies');
    expect(clean).toContain('Click me');
  });

  it('strips javascript: URLs', () => {
    const dirty = '<a href="javascript:alert(1)">Click</a>';
    const clean = sanitizeHtml(dirty);

    expect(clean).not.toContain('javascript:');
    expect(clean).toContain('Click');
  });

  it('preserves safe HTML (headings, paragraphs, links, bold, italic)', () => {
    const safe =
      '<h1>Title</h1><p>Paragraph with <strong>bold</strong> and <em>italic</em> text.</p><a href="https://example.com">Link</a>';
    const clean = sanitizeHtml(safe);

    expect(clean).toBe(safe);
  });

  it('handles empty input', () => {
    expect(sanitizeHtml('')).toBe('');
  });

  it('handles undefined-like falsy input', () => {
    // The function checks `if (!html)` which handles empty string
    expect(sanitizeHtml('')).toBe('');
  });
});

// ===========================================================================
// sanitizeIframeSrc
// ===========================================================================

describe('sanitizeIframeSrc', () => {
  it('allows https URLs', () => {
    const url = 'https://www.youtube.com/embed/abc123';
    expect(sanitizeIframeSrc(url)).toBe(url);
  });

  it('allows http URLs', () => {
    const url = 'http://example.com/embed';
    expect(sanitizeIframeSrc(url)).toBe(url);
  });

  it('rejects javascript: URLs', () => {
    const url = 'javascript:alert(1)';
    expect(sanitizeIframeSrc(url)).toBe('');
  });

  it('rejects data: URLs', () => {
    const url = 'data:text/html,<h1>XSS</h1>';
    expect(sanitizeIframeSrc(url)).toBe('');
  });

  it('rejects empty strings', () => {
    expect(sanitizeIframeSrc('')).toBe('');
  });

  it('trims whitespace from valid URLs', () => {
    const url = '  https://example.com/embed  ';
    expect(sanitizeIframeSrc(url)).toBe('https://example.com/embed');
  });

  it('rejects URLs with no protocol', () => {
    expect(sanitizeIframeSrc('example.com')).toBe('');
  });

  it('rejects ftp: URLs', () => {
    expect(sanitizeIframeSrc('ftp://files.example.com')).toBe('');
  });

  // --- Case-insensitive bypass vectors ---

  it('rejects JAVASCRIPT: (uppercase)', () => {
    expect(sanitizeIframeSrc('JAVASCRIPT:alert(1)')).toBe('');
  });

  it('rejects JaVaScRiPt: (mixed case)', () => {
    expect(sanitizeIframeSrc('JaVaScRiPt:alert(1)')).toBe('');
  });

  it('rejects vbscript: URLs', () => {
    expect(sanitizeIframeSrc('vbscript:MsgBox("XSS")')).toBe('');
  });

  // --- Control character bypass vectors ---

  it('rejects tab-prefixed javascript: URLs', () => {
    expect(sanitizeIframeSrc('\tjavascript:alert(1)')).toBe('');
  });

  it('rejects null-byte-prefixed javascript: URLs', () => {
    expect(sanitizeIframeSrc('\x00javascript:alert(1)')).toBe('');
  });

  it('rejects newline-embedded javascript: URLs', () => {
    expect(sanitizeIframeSrc('\njavascript:alert(1)')).toBe('');
  });

  // --- Preserves case in safe URLs ---

  it('preserves original case in valid HTTPS URLs', () => {
    const url = 'HTTPS://Example.com/Embed';
    expect(sanitizeIframeSrc(url)).toBe(url);
  });
});

// ===========================================================================
// sanitizeHref
// ===========================================================================

describe('sanitizeHref', () => {
  // --- Safe protocols ---

  it('allows https URLs', () => {
    expect(sanitizeHref('https://example.com')).toBe('https://example.com');
  });

  it('allows http URLs', () => {
    expect(sanitizeHref('http://example.com')).toBe('http://example.com');
  });

  it('allows relative paths (/ ./ ../)', () => {
    expect(sanitizeHref('/about')).toBe('/about');
    expect(sanitizeHref('./page')).toBe('./page');
    expect(sanitizeHref('../home')).toBe('../home');
  });

  it('allows anchor links', () => {
    expect(sanitizeHref('#section')).toBe('#section');
  });

  it('allows mailto: links', () => {
    expect(sanitizeHref('mailto:test@example.com')).toBe('mailto:test@example.com');
  });

  it('allows tel: links', () => {
    expect(sanitizeHref('tel:+1234567890')).toBe('tel:+1234567890');
  });

  // --- Dangerous protocols blocked ---

  it('rejects javascript: URLs', () => {
    expect(sanitizeHref('javascript:alert(1)')).toBe('#');
  });

  it('rejects data: URLs', () => {
    expect(sanitizeHref('data:text/html,<h1>XSS</h1>')).toBe('#');
  });

  it('rejects vbscript: URLs', () => {
    expect(sanitizeHref('vbscript:MsgBox("XSS")')).toBe('#');
  });

  // --- Case-insensitive bypass vectors ---

  it('rejects JAVASCRIPT: (uppercase)', () => {
    expect(sanitizeHref('JAVASCRIPT:alert(1)')).toBe('#');
  });

  it('rejects JaVaScRiPt: (mixed case)', () => {
    expect(sanitizeHref('JaVaScRiPt:alert(1)')).toBe('#');
  });

  it('rejects DATA: (uppercase)', () => {
    expect(sanitizeHref('DATA:text/html,<h1>XSS</h1>')).toBe('#');
  });

  // --- Control character bypass vectors ---

  it('rejects tab-prefixed javascript: URLs', () => {
    expect(sanitizeHref('\tjavascript:alert(1)')).toBe('#');
  });

  it('rejects null-byte-prefixed javascript: URLs', () => {
    expect(sanitizeHref('\x00javascript:alert(1)')).toBe('#');
  });

  it('rejects newline-embedded javascript: URLs', () => {
    expect(sanitizeHref('\njavascript:alert(1)')).toBe('#');
  });

  it('rejects carriage-return-prefixed javascript: URLs', () => {
    expect(sanitizeHref('\rjavascript:alert(1)')).toBe('#');
  });

  // --- Fallback on falsy ---

  it('returns # for null', () => {
    expect(sanitizeHref(null)).toBe('#');
  });

  it('returns # for undefined', () => {
    expect(sanitizeHref(undefined)).toBe('#');
  });

  it('returns # for empty string', () => {
    expect(sanitizeHref('')).toBe('#');
  });

  it('returns # for whitespace-only string', () => {
    expect(sanitizeHref('   ')).toBe('#');
  });

  // --- Preserves case ---

  it('preserves original case in valid HTTPS URLs', () => {
    expect(sanitizeHref('HTTPS://Example.com')).toBe('HTTPS://Example.com');
  });

  it('allows MAILTO: (case-insensitive)', () => {
    expect(sanitizeHref('MAILTO:test@example.com')).toBe('MAILTO:test@example.com');
  });
});

// ===========================================================================
// sanitizeMediaSrc
// ===========================================================================

describe('sanitizeMediaSrc', () => {
  // --- Safe protocols ---

  it('allows https URLs', () => {
    expect(sanitizeMediaSrc('https://cdn.example.com/image.jpg')).toBe('https://cdn.example.com/image.jpg');
  });

  it('allows http URLs', () => {
    expect(sanitizeMediaSrc('http://example.com/photo.png')).toBe('http://example.com/photo.png');
  });

  it('allows protocol-relative URLs', () => {
    expect(sanitizeMediaSrc('//cdn.example.com/image.jpg')).toBe('//cdn.example.com/image.jpg');
  });

  it('allows data:image/ URLs (base64 thumbnails)', () => {
    const dataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANS';
    expect(sanitizeMediaSrc(dataUrl)).toBe(dataUrl);
  });

  it('allows relative paths', () => {
    expect(sanitizeMediaSrc('/images/logo.png')).toBe('/images/logo.png');
    expect(sanitizeMediaSrc('./photo.jpg')).toBe('./photo.jpg');
    expect(sanitizeMediaSrc('../assets/img.svg')).toBe('../assets/img.svg');
  });

  // --- Dangerous protocols blocked ---

  it('rejects javascript: URLs', () => {
    expect(sanitizeMediaSrc('javascript:alert(1)')).toBe('');
  });

  it('rejects data:text/html URLs', () => {
    expect(sanitizeMediaSrc('data:text/html,<script>alert(1)</script>')).toBe('');
  });

  it('rejects vbscript: URLs', () => {
    expect(sanitizeMediaSrc('vbscript:MsgBox("XSS")')).toBe('');
  });

  it('rejects blob: URLs', () => {
    expect(sanitizeMediaSrc('blob:http://evil.com/abc123')).toBe('');
  });

  // --- Case-insensitive bypass vectors ---

  it('rejects JAVASCRIPT: (uppercase)', () => {
    expect(sanitizeMediaSrc('JAVASCRIPT:alert(1)')).toBe('');
  });

  it('rejects JaVaScRiPt: (mixed case)', () => {
    expect(sanitizeMediaSrc('JaVaScRiPt:alert(1)')).toBe('');
  });

  it('allows DATA:IMAGE/ (case-insensitive safe data)', () => {
    expect(sanitizeMediaSrc('DATA:IMAGE/PNG;base64,abc')).toBe('DATA:IMAGE/PNG;base64,abc');
  });

  // --- Control character bypass vectors ---

  it('rejects tab-prefixed javascript: URLs', () => {
    expect(sanitizeMediaSrc('\tjavascript:alert(1)')).toBe('');
  });

  it('rejects null-byte-prefixed javascript: URLs', () => {
    expect(sanitizeMediaSrc('\x00javascript:alert(1)')).toBe('');
  });

  // --- Falsy input ---

  it('returns empty string for null', () => {
    expect(sanitizeMediaSrc(null)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(sanitizeMediaSrc(undefined)).toBe('');
  });

  it('returns empty string for empty string', () => {
    expect(sanitizeMediaSrc('')).toBe('');
  });

  it('returns empty string for whitespace-only', () => {
    expect(sanitizeMediaSrc('   ')).toBe('');
  });
});

// ===========================================================================
// sanitizeCss
// ===========================================================================

describe('sanitizeCss', () => {
  // --- Preserves valid CSS ---

  it('preserves valid CSS rules', () => {
    const css = '.heading { color: red; font-size: 16px; }';
    expect(sanitizeCss(css)).toBe(css);
  });

  it('preserves safe url() values', () => {
    const css = "background: url('https://cdn.example.com/bg.jpg');";
    expect(sanitizeCss(css)).toBe(css);
  });

  it('preserves data:image/ urls in CSS', () => {
    const css = "background: url('data:image/svg+xml,...');";
    expect(sanitizeCss(css)).toBe(css);
  });

  // --- Blocks dangerous constructs ---

  it('blocks expression()', () => {
    const css = 'width: expression(document.body.clientWidth / 2 + "px");';
    expect(sanitizeCss(css)).not.toContain('expression(');
  });

  it('blocks javascript: in CSS', () => {
    const css = 'background: url(javascript:alert(1));';
    expect(sanitizeCss(css)).not.toContain('javascript:');
  });

  it('blocks @import', () => {
    const css = '@import url("https://evil.com/steal.css");';
    expect(sanitizeCss(css)).toContain('@import blocked');
  });

  it('blocks behavior:', () => {
    const css = 'behavior: url(xss.htc);';
    expect(sanitizeCss(css)).not.toMatch(/behavior\s*:/i);
  });

  it('blocks -moz-binding:', () => {
    const css = '-moz-binding: url(xbl.xml#xss);';
    expect(sanitizeCss(css)).not.toMatch(/-moz-binding\s*:/i);
  });

  // --- url() injection vectors ---

  it('blocks url(javascript:...) in CSS', () => {
    const css = "background: url('javascript:alert(1)');";
    expect(sanitizeCss(css)).toContain('blocked-url');
    expect(sanitizeCss(css)).not.toContain('javascript:');
  });

  it('blocks url(data:text/html,...) in CSS', () => {
    const css = "background: url('data:text/html,<script>alert(1)</script>');";
    expect(sanitizeCss(css)).toContain('blocked-url');
  });

  it('blocks url(vbscript:...) in CSS', () => {
    const css = "background: url('vbscript:execute');";
    expect(sanitizeCss(css)).toContain('blocked-url');
  });

  it('blocks url(javascript:) without quotes', () => {
    const css = 'background: url(javascript:alert(1));';
    expect(sanitizeCss(css)).toContain('blocked-url');
  });

  it('blocks url(data:text/html) without quotes', () => {
    const css = 'background: url(data:text/html,<h1>XSS</h1>);';
    expect(sanitizeCss(css)).toContain('blocked-url');
  });

  // --- Null-byte obfuscation ---

  it('strips \\00 null-byte escape sequences', () => {
    const css = 'back\\00ground: url(javascript:alert(1));';
    const result = sanitizeCss(css);
    expect(result).not.toContain('javascript:');
  });

  it('strips \\000000 extended null-byte escapes', () => {
    const css = 'exp\\000000ression(alert(1))';
    const result = sanitizeCss(css);
    expect(result).not.toContain('expression(');
  });

  // --- vbscript: in CSS ---

  it('blocks vbscript: in CSS rules', () => {
    const css = 'background: vbscript:execute;';
    expect(sanitizeCss(css)).not.toContain('vbscript:');
  });

  // --- Empty / falsy ---

  it('returns empty string for empty input', () => {
    expect(sanitizeCss('')).toBe('');
  });

  // --- Case insensitive ---

  it('blocks EXPRESSION() (uppercase)', () => {
    const css = 'width: EXPRESSION(alert(1));';
    expect(sanitizeCss(css)).not.toMatch(/expression\s*\(/i);
  });

  it('blocks JAVASCRIPT: (uppercase) in CSS', () => {
    const css = 'background: JAVASCRIPT:alert(1);';
    expect(sanitizeCss(css)).not.toContain('JAVASCRIPT:');
  });

  it('blocks URL(JAVASCRIPT:...) (uppercase) in CSS', () => {
    const css = "background: URL('JAVASCRIPT:alert(1)');";
    expect(sanitizeCss(css)).toContain('blocked-url');
  });
});
