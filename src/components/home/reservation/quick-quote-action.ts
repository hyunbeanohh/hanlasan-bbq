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
import { QUICK_QUOTE_AUTHOR } from '@/lib/quick-quote/constants';

export interface QuickQuoteFormState {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
  /** 실패 이유 (GA4 측정용 고정 코드) */
  errorReason?: 'field' | 'verify' | 'limit' | 'server';
  /** 실패했을 때 다시 채워 줄 입력값 (화면 표시용, 저장하지 않음) */
  values?: Record<string, string>;
}

const KEEP_FIELDS = [
  'headcount',
  'eventDate',
  'dateUndecided',
  'eventPeriod',
  'location',
  'phone',
  'email',
] as const;

function keepValues(formData: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  for (const key of KEEP_FIELDS) {
    const v = formData.get(key);
    if (typeof v === 'string') out[key] = v.slice(0, 120);
  }
  return out;
}

const QUICK_QUOTE_DAILY_LIMIT = 15;

export async function createQuickQuoteAction(
  _prev: QuickQuoteFormState,
  formData: FormData,
): Promise<QuickQuoteFormState> {
  const raw = { ...Object.fromEntries(formData), menus: formData.getAll('menus') };
  const parsed = quickQuoteSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const path = String(issue.path[0]);
      (fieldErrors[path] ??= []).push(issue.message);
    }
    return {
      ok: false,
      message: '입력값을 확인해주세요',
      fieldErrors,
      errorReason: 'field',
      values: keepValues(formData),
    };
  }
  const input = parsed.data;
  const env = getEnv();

  const ip = (await headers()).get('cf-connecting-ip') ?? 'unknown';

  const limiter = new RateLimiter(getDB());
  const allowed = await limiter.check(ip, 'quick-quote', QUICK_QUOTE_DAILY_LIMIT, 86_400);
  if (!allowed) {
    return {
      ok: false,
      message: '오늘 견적 요청 한도를 초과했습니다. 전화로 문의해 주세요.',
      errorReason: 'limit',
      values: keepValues(formData),
    };
  }

  const turnstile = await verifyTurnstile(input.turnstileToken, env.TURNSTILE_SECRET, ip);
  if (!turnstile.success) {
    return {
      ok: false,
      message: '자동가입방지 검증에 실패했습니다. 다시 시도해 주세요.',
      errorReason: 'verify',
      values: keepValues(formData),
    };
  }

  const phoneEnc = await encryptPII(input.phone, env.PII_KEY);
  const emailEnc = await encryptPII(input.email, env.PII_KEY);

  const title = buildQuickQuoteTitle({
    headcount: input.headcount,
    eventDate: input.eventDate,
    eventPeriod: input.eventPeriod,
    location: input.location,
  });
  const content = buildQuickQuoteContent({
    menus: input.menus,
    meal: input.meal,
    headcount: input.headcount,
    eventDate: input.eventDate,
    eventPeriod: input.eventPeriod,
    location: input.location,
    phone: input.phone,
    email: input.email,
  });

  const repo = new InquiryRepository(getDB());
  const id = await repo.createQuickQuote({ phoneEnc, emailEnc, title, content });

  try {
    await sendNewInquiryNotification(env, {
      id,
      authorName: QUICK_QUOTE_AUTHOR,
      title,
      content,
    });
  } catch (err) {
    console.error('quick-quote notification failed', err);
  }

  return { ok: true };
}
