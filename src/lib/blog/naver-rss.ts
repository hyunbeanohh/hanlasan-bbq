import { extractThumbnail, summarize } from './parser';
import { SITE } from '@/lib/constants';
import type { GalleryPost } from './types';

const ITEM_RE = /<item>([\s\S]*?)<\/item>/g;
const TAG_RE = (tag: string) => new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`);
const CDATA_RE = /^<!\[CDATA\[([\s\S]*?)\]\]>$/;

function pickTag(xml: string, tag: string): string {
  const m = xml.match(TAG_RE(tag));
  if (!m) return '';
  const raw = m[1].trim();
  const cdata = raw.match(CDATA_RE);
  return (cdata ? cdata[1] : raw).trim();
}

export function parseNaverRss(xml: string, blogId: string): GalleryPost[] {
  const items = [...xml.matchAll(ITEM_RE)].map((m) => m[1]);
  return items
    .map((raw): GalleryPost | null => {
      const title = pickTag(raw, 'title');
      const link = pickTag(raw, 'link');
      const pubDate = pickTag(raw, 'pubDate');
      const description = pickTag(raw, 'description');
      if (!link || !title) return null;
      // Extract logNo: numeric segment of 8+ digits in the path, before query params
      const logNoMatch =
        link.match(/\/(\d{8,})(?:\?|$|\/)/) || link.match(/logNo=(\d+)/);
      const id = logNoMatch ? logNoMatch[1] : link;
      let publishedAt: string;
      try {
        const parsed = new Date(pubDate);
        if (isNaN(parsed.getTime())) throw new Error('invalid date');
        publishedAt = parsed.toISOString();
      } catch {
        publishedAt = new Date().toISOString();
      }
      return {
        id,
        title,
        summary: summarize(description),
        thumbnailUrl: extractThumbnail(description),
        originalUrl: link,
        publishedAt,
      };
    })
    .filter((p): p is GalleryPost => p !== null);
}

export async function fetchNaverBlogRss(blogId: string): Promise<GalleryPost[]> {
  const url = `https://rss.blog.naver.com/${blogId}.xml`;
  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: { 'user-agent': `hallasan-bbq-site/1.0 (+https://${SITE.canonicalHost})` },
    } as RequestInit);
    if (!res.ok) {
      console.error(`[naver-rss] fetch failed: ${res.status} ${url}`);
      return [];
    }
    const xml = await res.text();
    return parseNaverRss(xml, blogId);
  } catch (err) {
    console.error('[naver-rss] fetch threw:', err);
    return [];
  }
}
