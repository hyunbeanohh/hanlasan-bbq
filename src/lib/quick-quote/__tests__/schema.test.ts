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

  it('rejects headcount above 200', () => {
    expect(quickQuoteSchema.safeParse({ ...valid, headcount: '201' }).success).toBe(false);
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
});
