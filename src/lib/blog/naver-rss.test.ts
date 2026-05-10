import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { parseNaverRss } from './naver-rss';

const here = path.dirname(fileURLToPath(import.meta.url));
const fixture = readFileSync(
  path.join(here, '__fixtures__/naver-rss-synthetic.xml'),
  'utf-8',
);

describe('parseNaverRss', () => {
  const posts = parseNaverRss(fixture, 'ohnamsoo3822');

  it('parses all items', () => {
    expect(posts).toHaveLength(3);
  });

  it('extracts logNo as id when present in URL', () => {
    expect(posts[0].id).toBe('223100000001');
  });

  it('preserves title text', () => {
    expect(posts[0].title).toBe('제주 가족모임 출장바베큐 후기');
  });

  it('produces ISO 8601 publishedAt', () => {
    expect(posts[0].publishedAt).toMatch(/^2026-05-05T/);
  });

  it('extracts first image as thumbnail', () => {
    expect(posts[0].thumbnailUrl).toBe('https://postfiles.pstatic.net/MjAyNi8w/sample1.jpg');
  });

  it('returns null thumbnail when no image in description', () => {
    expect(posts[2].thumbnailUrl).toBeNull();
  });

  it('summary is plain text under 200 chars', () => {
    expect(posts[0].summary.length).toBeLessThanOrEqual(200);
    expect(posts[0].summary).not.toMatch(/[<>]/);
  });

  it('originalUrl points to blog.naver.com path', () => {
    expect(posts[0].originalUrl).toContain('blog.naver.com/ohnamsoo3822');
  });

  it('returns empty array on malformed input', () => {
    expect(parseNaverRss('<rss></rss>', 'ohnamsoo3822')).toEqual([]);
  });
});
