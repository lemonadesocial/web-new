import { expect, it, describe } from 'vitest';
import {
  sanitizeHtml,
  sanitizeIframeSrc,
} from '$lib/components/features/page-builder/utils/sanitize-html';

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
});
