import { describe, it, expect } from 'vitest';
import { quickQuoteSchema } from '../schema';

describe('quickQuoteSchema', () => {
  const valid = {
    headcount: '10',
    eventDate: '2030-06-01',
    location: '애월읍 곽지리',
    phone: '010-1234-5678',
    privacyConsent: 'on',
    turnstileToken: 'token-xyz',
  };

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

  it('rejects short location', () => {
    expect(quickQuoteSchema.safeParse({ ...valid, location: 'a' }).success).toBe(false);
  });

  it('rejects invalid phone format', () => {
    expect(quickQuoteSchema.safeParse({ ...valid, phone: '01012345678' }).success).toBe(false);
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
