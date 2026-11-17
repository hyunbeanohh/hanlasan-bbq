import { describe, it, expect } from 'vitest';
import { quickQuoteSchema } from '../schema';

describe('quickQuoteSchema', () => {
  const valid = {
    menus: ['통돼지바베큐', '해물바베큐'],
    meal: '식사 포함',
    headcount: '10',
    eventDate: '2030-06-01',
    location: '애월읍 곽지리',
    phone: '010-1234-5678',
    privacyConsent: 'on',
    turnstileToken: 'token-xyz',
  };

  it('requires at least one supported menu and an explicit meal choice', () => {
    for (const menus of [[], ['없는 메뉴'], undefined]) {
      expect(quickQuoteSchema.safeParse({ ...valid, menus }).success).toBe(false);
    }
    for (const meal of ['', undefined, 'maybe']) {
      expect(quickQuoteSchema.safeParse({ ...valid, meal }).success).toBe(false);
    }
  });

  it('preserves multiple menus and accepts no meal', () => {
    const result = quickQuoteSchema.parse({ ...valid, meal: '식사 미포함' });
    expect(result.menus).toEqual(valid.menus);
    expect(result.meal).toBe('식사 미포함');
  });

  it('accepts valid input and coerces headcount to number', () => {
    const r = quickQuoteSchema.safeParse(valid);
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.headcount).toBe(10);
  });

  it('rejects headcount below 1', () => {
    expect(quickQuoteSchema.safeParse({ ...valid, headcount: '0' }).success).toBe(false);
  });

  it('accepts headcount at upper boundary 1000', () => {
    expect(quickQuoteSchema.safeParse({ ...valid, headcount: '1000' }).success).toBe(true);
  });

  it('rejects headcount above 1000', () => {
    expect(quickQuoteSchema.safeParse({ ...valid, headcount: '1001' }).success).toBe(false);
  });

  it('rejects malformed date', () => {
    expect(quickQuoteSchema.safeParse({ ...valid, eventDate: '2030/06/01' }).success).toBe(false);
  });

  it('rejects past dates', () => {
    expect(quickQuoteSchema.safeParse({ ...valid, eventDate: '2000-01-01' }).success).toBe(false);
  });

  it('requires a region of at least 2 characters', () => {
    for (const location of ['', ' ', 'a', undefined]) {
      expect(quickQuoteSchema.safeParse({ ...valid, location }).success).toBe(false);
    }
    expect(quickQuoteSchema.safeParse({ ...valid, location: '부산' }).success).toBe(true);
  });

  it('requires a date unless marked undecided with a rough period', () => {
    const noDate = quickQuoteSchema.safeParse({ ...valid, eventDate: '' });
    expect(noDate.success).toBe(false);
    if (!noDate.success) expect(noDate.error.issues[0].path[0]).toBe('eventDate');

    const noPeriod = quickQuoteSchema.safeParse({ ...valid, eventDate: '', dateUndecided: 'on' });
    expect(noPeriod.success).toBe(false);
    if (!noPeriod.success) expect(noPeriod.error.issues[0].path[0]).toBe('eventPeriod');

    const ok = quickQuoteSchema.safeParse({
      ...valid,
      eventDate: '',
      dateUndecided: 'on',
      eventPeriod: '12월 중순',
    });
    expect(ok.success).toBe(true);
  });

  it('normalizes phone numbers typed without hyphens', () => {
    for (const [input, out] of [
      ['01012345678', '010-1234-5678'],
      ['010 1234 5678', '010-1234-5678'],
      ['0111234567', '011-123-4567'],
    ]) {
      const r = quickQuoteSchema.safeParse({ ...valid, phone: input });
      expect(r.success).toBe(true);
      if (r.success) expect(r.data.phone).toBe(out);
    }
  });

  it('rejects invalid phone numbers', () => {
    for (const phone of ['0212345678', '010-12-34', 'abc', '']) {
      expect(quickQuoteSchema.safeParse({ ...valid, phone }).success).toBe(false);
    }
  });

  it('requires privacyConsent', () => {
    expect(quickQuoteSchema.safeParse({ ...valid, privacyConsent: undefined }).success).toBe(false);
  });

  it('requires turnstileToken', () => {
    expect(quickQuoteSchema.safeParse({ ...valid, turnstileToken: '' }).success).toBe(false);
  });

  it('accepts a valid email', () => {
    const r = quickQuoteSchema.safeParse({ ...valid, email: 'guest@naver.com' });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.email).toBe('guest@naver.com');
  });

  it('accepts empty email (optional field)', () => {
    const r = quickQuoteSchema.safeParse({ ...valid, email: '' });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.email).toBe('');
  });

  it('defaults email to empty string when key is missing', () => {
    const r = quickQuoteSchema.safeParse(valid);
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.email).toBe('');
  });

  it('rejects malformed email', () => {
    expect(quickQuoteSchema.safeParse({ ...valid, email: 'not-an-email' }).success).toBe(false);
  });

  it('rejects email over 120 chars', () => {
    const long = 'a'.repeat(115) + '@b.com';
    expect(quickQuoteSchema.safeParse({ ...valid, email: long }).success).toBe(false);
  });
});
