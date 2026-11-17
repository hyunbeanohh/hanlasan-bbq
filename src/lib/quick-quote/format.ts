import type { QuickQuoteInput } from './schema';

export interface QuickQuoteTitleInput {
  headcount: number;
  /** 빈 문자열이면 날짜 미정 */
  eventDate: string;
  /** 날짜 미정일 때 대략 시기 */
  eventPeriod?: string;
  /** 빈 문자열이면 지역 미정 */
  location: string;
}

export interface QuickQuoteContentInput extends QuickQuoteTitleInput {
  menus: QuickQuoteInput['menus'];
  meal: QuickQuoteInput['meal'];
  phone: string;
  email?: string;
}

const TITLE_MAX = 200;

function shortDate(eventDate: string, eventPeriod?: string): string {
  if (!eventDate) return eventPeriod?.trim() ? `${eventPeriod.trim()}(미정)` : '날짜 미정';
  const [, month, day] = eventDate.split('-');
  return `${Number(month)}/${Number(day)}`;
}

export function buildQuickQuoteTitle(input: QuickQuoteTitleInput): string {
  const prefix = `[빠른 견적] ${input.headcount}명 · ${shortDate(input.eventDate, input.eventPeriod)} · `;
  const room = TITLE_MAX - prefix.length;
  const loc = (input.location.trim() || '지역 미정').slice(0, Math.max(0, room));
  return prefix + loc;
}

export function buildQuickQuoteContent(input: QuickQuoteContentInput): string {
  const lines = [
    `선택 메뉴: ${input.menus.join(' + ')}`,
    `식사 여부: ${input.meal}`,
    `인원: ${input.headcount}명`,
    `희망 날짜: ${input.eventDate || `미정 (대략 ${input.eventPeriod?.trim() || '시기 미정'})`}`,
    `출장 장소: ${input.location.trim() || '미정 (상담 필요)'}`,
    `연락처: ${input.phone}`,
  ];
  if (input.email) lines.push(`이메일: ${input.email}`);
  return lines.join('\n');
}
