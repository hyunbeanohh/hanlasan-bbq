'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { newInquirySchema } from '@/lib/inquiries/schema';
import { hashPassword } from '@/lib/inquiries/password';
import { encryptPII } from '@/lib/inquiries/crypto';
import { verifyTurnstile } from '@/lib/inquiries/turnstile';
import { RateLimiter } from '@/lib/inquiries/rate-limit';
import { InquiryRepository } from '@/lib/inquiries/repository';
import { sendNewInquiryNotification } from '@/lib/inquiries/notify';
import { getDB, getEnv } from '@/lib/inquiries/cf';

export interface FormState {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string[]>;
}

export async function createInquiryAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const env = getEnv();
  const raw = Object.fromEntries(formData);
  const parsed = newInquirySchema.safeParse(raw);
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
  const allowed = await limiter.check(ip, 'post', 10, 86_400);
  if (!allowed) return { ok: false, message: '하루 작성 횟수(10건)를 초과했습니다.' };

  const turnstile = await verifyTurnstile(input.turnstileToken, env.TURNSTILE_SECRET, ip);
  if (!turnstile.success) return { ok: false, message: '자동가입방지 검증에 실패했습니다. 다시 시도해주세요.' };

  const pwd = await hashPassword(input.password);
  const phoneEnc = await encryptPII(input.phone, env.PII_KEY);
  const emailEnc = await encryptPII(input.email, env.PII_KEY);

  const repo = new InquiryRepository(getDB());
  const id = await repo.create({
    authorName: input.authorName,
    passwordHash: pwd.hash,
    passwordSalt: pwd.salt,
    phoneEnc,
    emailEnc,
    title: input.title,
    content: input.content,
    isSecret: input.isSecret === 'on',
  });

  // 이메일 알림 — 실패해도 글 등록은 성공
  try {
    await sendNewInquiryNotification(env, {
      id,
      authorName: input.authorName,
      title: input.title,
      content: input.content,
    });
  } catch (err) {
    console.error('notification failed', err);
  }

  redirect(`/inquiry/${id}?created=1`);
}
