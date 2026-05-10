const ENTITY_MAP: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
};

function decodeEntities(s: string): string {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/&([a-zA-Z]+);/g, (_, name) => ENTITY_MAP[name] ?? `&${name};`);
}

export function extractThumbnail(html: string): string | null {
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m ? decodeEntities(m[1]) : null;
}

export function summarize(html: string, max = 200): string {
  const stripped = html.replace(/<[^>]+>/g, '');
  const decoded = decodeEntities(stripped);
  const collapsed = decoded.replace(/\s+/g, ' ').trim();
  if (collapsed.length === 0) return '';
  if (collapsed.length <= max) return collapsed;
  return collapsed.slice(0, max - 1) + '…';
}
