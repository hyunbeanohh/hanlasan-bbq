export interface QuickQuoteTitleInput {
  headcount: number;
  eventDate: string;
  location: string;
}

export interface QuickQuoteContentInput extends QuickQuoteTitleInput {
  phone: string;
}

const TITLE_MAX = 200;

export function buildQuickQuoteTitle(input: QuickQuoteTitleInput): string {
  const [, month, day] = input.eventDate.split('-');
  const md = `${Number(month)}/${Number(day)}`;
  const prefix = `[빠른 견적] ${input.headcount}명 · ${md} · `;
  const room = TITLE_MAX - prefix.length;
  const loc = input.location.trim().slice(0, Math.max(0, room));
  return prefix + loc;
}

export function buildQuickQuoteContent(input: QuickQuoteContentInput): string {
  return [
    `인원: ${input.headcount}명`,
    `희망 날짜: ${input.eventDate}`,
    `출장 장소: ${input.location.trim()}`,
    `연락처: ${input.phone}`,
  ].join('\n');
}
