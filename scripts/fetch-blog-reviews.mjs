/**
 * One-shot script to fetch the operator's Naver blog RSS feed and emit a
 * JSON list of the most recent posts (title, summary, link, pubDate). The
 * output is meant to be reviewed by a human and then transcribed into
 * src/data/testimonials.ts.
 *
 * Usage: node scripts/fetch-blog-reviews.mjs
 */

const BLOG_ID = 'ohnamsoo3822';
const RSS_URL = `https://rss.blog.naver.com/${BLOG_ID}.xml`;

const ITEM_RE = /<item>([\s\S]*?)<\/item>/g;
const CDATA_RE = /^<!\[CDATA\[([\s\S]*?)\]\]>$/;
const ENTITY_MAP = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

function pickTag(xml, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`);
  const m = xml.match(re);
  if (!m) return '';
  const raw = m[1].trim();
  const cdata = raw.match(CDATA_RE);
  return (cdata ? cdata[1] : raw).trim();
}

function decodeEntities(s) {
  return s.replace(/&(#?\w+);/g, (whole, code) => {
    if (code.startsWith('#')) {
      const n = code[1] === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : whole;
    }
    return ENTITY_MAP[code] ?? whole;
  });
}

function stripHtml(s) {
  return s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function summarize(description, max = 240) {
  const text = decodeEntities(stripHtml(description));
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + '…';
}

async function main() {
  const res = await fetch(RSS_URL, {
    headers: { 'user-agent': 'hallasan-bbq-fetch/1.0 (one-shot)' },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch RSS: HTTP ${res.status}`);
  }
  const xml = await res.text();
  const items = [...xml.matchAll(ITEM_RE)].map((m) => m[1]);
  const posts = items
    .map((raw) => {
      const title = decodeEntities(pickTag(raw, 'title'));
      const link = pickTag(raw, 'link');
      const pubDate = pickTag(raw, 'pubDate');
      const description = pickTag(raw, 'description');
      if (!link || !title) return null;
      return {
        title,
        summary: summarize(description),
        originalUrl: link,
        publishedAt: pubDate,
      };
    })
    .filter((p) => p !== null);

  const top = posts.slice(0, 10).map((p, i) => ({ index: i + 1, ...p }));
  console.log(JSON.stringify(top, null, 2));
  console.error(`Fetched ${posts.length} posts, showing top ${top.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
