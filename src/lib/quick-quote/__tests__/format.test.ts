import { describe, it, expect } from 'vitest';
import { buildQuickQuoteTitle, buildQuickQuoteContent } from '../format';

describe('buildQuickQuoteTitle', () => {
  it('formats title with headcount, MM/DD, and location', () => {
    expect(
      buildQuickQuoteTitle({ headcount: 10, eventDate: '2030-06-01', location: '애월읍 곽지리' }),
    ).toBe('[빠른 견적] 10명 · 6/1 · 애월읍 곽지리');
  });

  it('trims location and clamps long locations', () => {
    const longLoc = 'a'.repeat(120);
    const title = buildQuickQuoteTitle({ headcount: 3, eventDate: '2030-12-25', location: longLoc });
    expect(title.startsWith('[빠른 견적] 3명 · 12/25 · ')).toBe(true);
    expect(title.length).toBeLessThanOrEqual(200);
  });
});

describe('buildQuickQuoteContent', () => {
  it('produces a readable multi-line summary', () => {
    const out = buildQuickQuoteContent({
      headcount: 10,
      eventDate: '2030-06-01',
      location: '애월읍 곽지리',
      phone: '010-1234-5678',
    });
    expect(out).toBe(
      '인원: 10명\n희망 날짜: 2030-06-01\n출장 장소: 애월읍 곽지리\n연락처: 010-1234-5678',
    );
  });
});
