'use server';

import { headers } from 'next/headers';
import { quickQuoteSchema } from '@/lib/quick-quote/schema';
import { buildQuickQuoteTitle, buildQuickQuoteContent } from '@/lib/quick-quote/format';
import { encryptPII } from '@/lib/inquiries/crypto';
import { verifyTurnstile } from '@/lib/inquiries/turnstile';
import { RateLimiter } from '@/lib/inquiries/rate-limit';
import { InquiryRepository } from '@/lib/inquiries/repository';
import { sendNewInquiryNotification } from '@/lib/inquiries/notify';
import { getDB, getEnv } from '@/lib/inquiries/cf';

export interface QuickQuoteFormState {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
}

const QUICK_QUOTE_DAILY_LIMIT = 15;

export async function createQuickQuoteAction(
  _prev: QuickQuoteFormState,
  formData: FormData,
): Promise<QuickQuoteFormState> {
  const env = getEnv();
  const raw = Object.fromEntries(formData);
  const parsed = quickQuoteSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const path = issue.path.join('.');
      (fieldErrors[path] ??= []).push(issue.message);
    }
    return { ok: false, message: '입력값을 확인해주세요', fieldErrors };
  }
  const input = parsed.data;

  const ip = (await headers()).get('cf-connecting-ip') ?? 'unknown';

  const limiter = new RateLimiter(getDB());
  const allowed = await limiter.check(ip, 'quick-quote', QUICK_QUOTE_DAILY_LIMIT, 86_400);
  if (!allowed) {
    return { ok: false, message: '오늘 견적 요청 한도를 초과했습니다. 전화로 문의해 주세요.' };
  }

  const turnstile = await verifyTurnstile(input.turnstileToken, env.TURNSTILE_SECRET, ip);
  if (!turnstile.success) {
    return { ok: false, message: '자동가입방지 검증에 실패했습니다. 다시 시도해 주세요.' };
  }

  const phoneEnc = await encryptPII(input.phone, env.PII_KEY);
  const emailEnc = await encryptPII('', env.PII_KEY);

  const title = buildQuickQuoteTitle({
    headcount: input.headcount,
    eventDate: input.eventDate,
    location: input.location,
  });
  const content = buildQuickQuoteContent({
    headcount: input.headcount,
    eventDate: input.eventDate,
    location: input.location,
    phone: input.phone,
  });

  const repo = new InquiryRepository(getDB());
  const id = await repo.createQuickQuote({ phoneEnc, emailEnc, title, content });

  try {
    await sendNewInquiryNotification(env, {
      id,
      authorName: '[빠른 견적]',
      title,
      content,
    });
  } catch (err) {
    console.error('quick-quote notification failed', err);
  }

  return { ok: true };
}
