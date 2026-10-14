import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  create: vi.fn().mockResolvedValue(42),
  notify: vi.fn().mockResolvedValue(undefined),
  env: vi.fn().mockReturnValue({ PII_KEY: 'test', TURNSTILE_SECRET: 'test' }),
}));
vi.mock('next/headers', () => ({ headers: async () => new Headers() }));
vi.mock('@/lib/inquiries/cf', () => ({ getEnv: mocks.env, getDB: () => ({}) }));
vi.mock('@/lib/inquiries/crypto', () => ({ encryptPII: async () => 'encrypted' }));
vi.mock('@/lib/inquiries/turnstile', () => ({ verifyTurnstile: async () => ({ success: true }) }));
vi.mock('@/lib/inquiries/rate-limit', () => ({ RateLimiter: class { async check() { return true; } } }));
vi.mock('@/lib/inquiries/repository', () => ({ InquiryRepository: class { createQuickQuote = mocks.create; } }));
vi.mock('@/lib/inquiries/notify', () => ({ sendNewInquiryNotification: mocks.notify }));

import { createQuickQuoteAction } from '@/components/home/reservation/quick-quote-action';

function request() {
  const data = new FormData();
  Object.entries({ headcount: '50', eventDate: '2030-06-01', location: '서울 강남구', phone: '010-1234-5678', privacyConsent: 'on', turnstileToken: 'test', meal: '식사 미포함' }).forEach(([key, value]) => data.set(key, value));
  data.append('menus', '통돼지바베큐');
  data.append('menus', '해물바베큐');
  return data;
}

describe('quick quote submission', () => {
  beforeEach(() => vi.clearAllMocks());

  it('keeps all selected menus and meal choice in storage and notification', async () => {
    expect(await createQuickQuoteAction({ ok: false }, request())).toEqual({ ok: true });
    const saved = mocks.create.mock.calls[0][0];
    expect(saved.content).toContain('선택 메뉴: 통돼지바베큐 + 해물바베큐');
    expect(saved.content).toContain('식사 여부: 식사 미포함');
    expect(mocks.notify.mock.calls[0][1].content).toBe(saved.content);
  });

  it.each(['menus', 'meal'])('rejects missing %s before storage or notification', async (field) => {
    const data = request();
    data.delete(field);
    const response = await createQuickQuoteAction({ ok: false }, data);
    expect(response.ok).toBe(false);
    expect(response.fieldErrors?.[field]).toBeDefined();
    expect(mocks.create).not.toHaveBeenCalled();
    expect(mocks.notify).not.toHaveBeenCalled();
  });
});
