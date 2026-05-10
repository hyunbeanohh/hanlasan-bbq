import { describe, it, expect } from 'vitest';
import { extractThumbnail, summarize } from './parser';

describe('extractThumbnail', () => {
  it('returns first <img src> from html', () => {
    const html = '<p>hi</p><img src="https://x.test/a.jpg"><img src="https://x.test/b.jpg">';
    expect(extractThumbnail(html)).toBe('https://x.test/a.jpg');
  });
  it('handles single quotes', () => {
    expect(extractThumbnail("<img src='https://x.test/q.jpg' alt='x'>")).toBe('https://x.test/q.jpg');
  });
  it('returns null when no <img>', () => {
    expect(extractThumbnail('<p>no image here</p>')).toBeNull();
  });
  it('handles encoded HTML entities in attribute values', () => {
    const html = '<img src="https://x.test/a.jpg?w=1&amp;q=80">';
    expect(extractThumbnail(html)).toBe('https://x.test/a.jpg?w=1&q=80');
  });
});

describe('summarize', () => {
  it('strips html tags', () => {
    expect(summarize('<p>안녕하세요</p>')).toBe('안녕하세요');
  });
  it('collapses whitespace', () => {
    expect(summarize('  hello\n\nworld  ')).toBe('hello world');
  });
  it('trims to 200 chars by default with ellipsis', () => {
    const s = summarize('가'.repeat(300));
    expect(s.length).toBeLessThanOrEqual(200);
    expect(s.endsWith('…')).toBe(true);
  });
  it('respects custom max', () => {
    expect(summarize('hello world', 5)).toBe('hell…');
  });
  it('returns empty string for empty input', () => {
    expect(summarize('')).toBe('');
    expect(summarize('   ')).toBe('');
  });
  it('decodes basic HTML entities', () => {
    expect(summarize('&lt;b&gt;hi&lt;/b&gt; &amp; bye')).toBe('<b>hi</b> & bye');
  });
});
